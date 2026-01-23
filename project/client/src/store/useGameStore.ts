import { create } from 'zustand'
import {
  Template,
  FilledRegion,
  GameState,
  FeedbackState,
  UserProgress,
  NumberedColor
} from '@/types'

interface GameStore {
  // 현재 템플릿
  template: Template | null
  setTemplate: (template: Template | null) => void

  // 게임 상태
  gameState: GameState
  setSelectedColor: (colorNumber: number | null) => void
  toggleHint: () => void
  setHintRegion: (regionId: string | null) => void
  setZoom: (zoom: number) => void
  setPan: (x: number, y: number) => void
  resetGameState: () => void

  // 진행 상황
  progress: UserProgress | null
  filledRegions: Map<string, FilledRegion>
  fillRegion: (regionId: string, colorNumber: number, isCorrect: boolean) => void
  undoLastFill: () => void
  resetProgress: () => void

  // 피드백
  feedback: FeedbackState
  setFeedback: (feedback: FeedbackState) => void
  clearFeedback: () => void

  // 통계
  mistakesCount: number
  startTime: number | null
  isCompleted: boolean

  // 계산된 값
  getProgress: () => number
  getRemainingCount: (colorNumber: number) => number
  isRegionFilled: (regionId: string) => boolean
  getCorrectColor: (regionId: string) => number | undefined

  // 게임 시작/종료
  startGame: (template: Template) => void
  completeGame: () => void
}

const initialGameState: GameState = {
  selectedColorNumber: null,
  isHintActive: false,
  hintRegionId: null,
  showNumbers: true,
  zoomLevel: 1,
  panX: 0,
  panY: 0,
}

const initialFeedback: FeedbackState = {
  type: null,
  regionId: null,
  message: null,
}

export const useGameStore = create<GameStore>((set, get) => ({
  // 템플릿
  template: null,
  setTemplate: (template) => set({ template }),

  // 게임 상태
  gameState: initialGameState,
  setSelectedColor: (colorNumber) =>
    set((state) => ({
      gameState: { ...state.gameState, selectedColorNumber: colorNumber }
    })),
  toggleHint: () =>
    set((state) => ({
      gameState: {
        ...state.gameState,
        isHintActive: !state.gameState.isHintActive,
        hintRegionId: !state.gameState.isHintActive ? getNextUnfilledRegion() : null
      }
    })),
  setHintRegion: (regionId) =>
    set((state) => ({
      gameState: { ...state.gameState, hintRegionId: regionId }
    })),
  setZoom: (zoom) =>
    set((state) => ({
      gameState: { ...state.gameState, zoomLevel: Math.max(0.5, Math.min(4, zoom)) }
    })),
  setPan: (x, y) =>
    set((state) => ({
      gameState: { ...state.gameState, panX: x, panY: y }
    })),
  resetGameState: () => set({ gameState: initialGameState }),

  // 진행 상황
  progress: null,
  filledRegions: new Map(),
  fillRegion: (regionId, colorNumber, isCorrect) => {
    const newFilled: FilledRegion = {
      regionId,
      colorNumber,
      isCorrect,
      filledAt: Date.now(),
    }

    set((state) => {
      const newMap = new Map(state.filledRegions)
      newMap.set(regionId, newFilled)

      const newMistakes = isCorrect ? state.mistakesCount : state.mistakesCount + 1

      // 완성 체크
      const template = state.template
      if (template) {
        const correctCount = Array.from(newMap.values()).filter(r => r.isCorrect).length
        if (correctCount === template.regionCount) {
          // 게임 완료!
          return {
            filledRegions: newMap,
            mistakesCount: newMistakes,
            isCompleted: true,
            feedback: {
              type: 'complete' as const,
              regionId: null,
              message: '축하합니다! 🎉',
            },
          }
        }
      }

      return {
        filledRegions: newMap,
        mistakesCount: newMistakes,
        feedback: {
          type: isCorrect ? 'correct' : 'incorrect',
          regionId,
          message: isCorrect ? '정답!' : '다시 시도해보세요',
        },
      }
    })

    // 피드백 자동 클리어
    setTimeout(() => {
      const state = get()
      if (state.feedback.regionId === regionId && state.feedback.type !== 'complete') {
        set({ feedback: initialFeedback })
      }
    }, 1000)
  },
  undoLastFill: () => {
    set((state) => {
      if (state.filledRegions.size === 0) return state

      // 가장 최근에 칠한 영역 찾기
      const entries = Array.from(state.filledRegions.entries())
      const sorted = entries.sort((a, b) => b[1].filledAt - a[1].filledAt)

      if (sorted.length === 0) return state

      const [lastRegionId] = sorted[0]
      const newMap = new Map(state.filledRegions)
      newMap.delete(lastRegionId)

      return { filledRegions: newMap }
    })
  },
  resetProgress: () => set({
    filledRegions: new Map(),
    mistakesCount: 0,
    isCompleted: false,
    startTime: null,
  }),

  // 피드백
  feedback: initialFeedback,
  setFeedback: (feedback) => set({ feedback }),
  clearFeedback: () => set({ feedback: initialFeedback }),

  // 통계
  mistakesCount: 0,
  startTime: null,
  isCompleted: false,

  // 계산된 값
  getProgress: () => {
    const { template, filledRegions } = get()
    if (!template) return 0

    const correctCount = Array.from(filledRegions.values()).filter(r => r.isCorrect).length
    return Math.round((correctCount / template.regionCount) * 100)
  },
  getRemainingCount: (colorNumber) => {
    const { template, filledRegions } = get()
    if (!template) return 0

    const color = template.colorPalette.find(c => c.number === colorNumber)
    if (!color) return 0

    const filledCount = Array.from(filledRegions.values())
      .filter(r => r.isCorrect && r.colorNumber === colorNumber)
      .length

    return color.totalRegions - filledCount
  },
  isRegionFilled: (regionId) => {
    const { filledRegions } = get()
    const filled = filledRegions.get(regionId)
    return filled?.isCorrect ?? false
  },
  getCorrectColor: (regionId) => {
    const { template } = get()
    if (!template) return undefined

    const region = template.templateData.regions.find(r => r.id === regionId)
    return region?.colorNumber
  },

  // 게임 시작/종료
  startGame: (template) => {
    set({
      template,
      gameState: { ...initialGameState, selectedColorNumber: 1 },
      filledRegions: new Map(),
      mistakesCount: 0,
      startTime: Date.now(),
      isCompleted: false,
      feedback: initialFeedback,
    })
  },
  completeGame: () => {
    set({ isCompleted: true })
  },
}))

// 다음 칠해야 할 영역 찾기 (힌트용)
function getNextUnfilledRegion(): string | null {
  const { template, filledRegions, gameState } = useGameStore.getState()
  if (!template) return null

  const selectedColor = gameState.selectedColorNumber

  // 선택된 색상과 같은 색상의 미칠해진 영역 찾기
  const unfilledRegions = template.templateData.regions.filter(region => {
    if (selectedColor && region.colorNumber !== selectedColor) return false
    const filled = filledRegions.get(region.id)
    return !filled?.isCorrect
  })

  return unfilledRegions[0]?.id ?? null
}

// 편의 훅: 현재 선택된 색상 정보
export function useSelectedColorInfo(): NumberedColor | null {
  const template = useGameStore(state => state.template)
  const selectedNumber = useGameStore(state => state.gameState.selectedColorNumber)

  if (!template || !selectedNumber) return null
  return template.colorPalette.find(c => c.number === selectedNumber) ?? null
}
