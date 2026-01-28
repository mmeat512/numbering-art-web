import { create } from 'zustand'
import {
  Template,
  FilledRegion,
  GameState,
  FeedbackState,
  UserProgress,
  NumberedColor
} from '@/types'
import {
  saveArtwork,
  getArtwork,
  getArtworksByTemplate,
  LocalArtwork,
  createThumbnailFromTemplate
} from '@/lib/db/indexedDB'

interface GameStore {
  // 현재 템플릿
  template: Template | null
  setTemplate: (template: Template | null) => void

  // 현재 작품 ID (저장된 작품 불러올 때 사용)
  currentArtworkId: string | null
  setCurrentArtworkId: (id: string | null) => void

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

  // 저장 관련
  isDirty: boolean // 저장되지 않은 변경사항 여부
  lastSavedAt: number | null
  setDirty: (dirty: boolean) => void

  // 계산된 값
  getProgress: () => number
  getRemainingCount: (colorNumber: number) => number
  isRegionFilled: (regionId: string) => boolean
  getCorrectColor: (regionId: string) => number | undefined

  // 게임 시작/종료
  startGame: (template: Template) => void
  completeGame: () => void

  // 저장/불러오기
  saveProgress: () => Promise<string | null>
  loadProgress: (artworkId: string) => Promise<boolean>
  loadProgressByTemplate: (templateId: string) => Promise<boolean>
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

  // 현재 작품 ID
  currentArtworkId: null,
  setCurrentArtworkId: (id) => set({ currentArtworkId: id }),

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
            isDirty: true, // 변경사항 표시
            feedback: {
              type: 'complete' as const,
              regionId: null,
              message: '축하합니다! 🎉',
            },
          }
        }
      }

      // 정답인 경우 피드백 없이 진행, 오답인 경우에만 피드백 표시
      return {
        filledRegions: newMap,
        mistakesCount: newMistakes,
        isDirty: true,
        feedback: isCorrect ? initialFeedback : {
          type: 'incorrect' as const,
          regionId,
          message: '다시 시도해보세요',
        },
      }
    })

    // 오답 피드백 자동 클리어
    if (!isCorrect) {
      setTimeout(() => {
        const state = get()
        if (state.feedback.regionId === regionId && state.feedback.type === 'incorrect') {
          set({ feedback: initialFeedback })
        }
      }, 1000)
    }
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

      return { filledRegions: newMap, isDirty: true }
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

  // 저장 관련
  isDirty: false,
  lastSavedAt: null,
  setDirty: (dirty) => set({ isDirty: dirty }),

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
      currentArtworkId: null, // 새 게임 시작 시 이전 artwork ID 리셋
      gameState: { ...initialGameState, selectedColorNumber: 1 },
      filledRegions: new Map(),
      mistakesCount: 0,
      startTime: Date.now(),
      isCompleted: false,
      isDirty: false, // 저장 상태도 리셋
      feedback: initialFeedback,
    })
  },
  completeGame: () => {
    set({ isCompleted: true })
  },

  // 저장하기
  saveProgress: async () => {
    const { template, filledRegions, mistakesCount, getProgress } = get()
    if (!template) return null

    const progress = getProgress()
    const now = Date.now()

    // 동일 템플릿의 기존 artwork 확인 (DB에서)
    // 기존 artwork가 있으면 그 ID 사용 (덮어쓰기), 없으면 새로 생성
    const existingArtworks = await getArtworksByTemplate(template.id)
    const artworkId = existingArtworks.length > 0
      ? existingArtworks.sort((a, b) => b.updatedAt - a.updatedAt)[0].id
      : `artwork_${template.id}_${now}`

    // FilledRegion Map을 배열로 변환하여 저장
    const filledRegionsArray = Array.from(filledRegions.values())

    // ColoredRegion 형식으로 변환 (IndexedDB 호환)
    const coloredRegions = filledRegionsArray.map(fr => ({
      x: 0, // 레거시 호환
      y: 0,
      color: fr.regionId, // regionId를 저장
      timestamp: fr.filledAt,
    }))

    // 썸네일 생성
    let thumbnailDataUrl: string | undefined
    try {
      thumbnailDataUrl = await createThumbnailFromTemplate(template, filledRegions, 200)
    } catch (error) {
      console.error('Failed to create thumbnail:', error)
    }

    const artwork: LocalArtwork = {
      id: artworkId,
      templateId: template.id,
      title: template.title,
      thumbnailDataUrl,
      coloredRegions,
      progress,
      createdAt: existingArtworks.length > 0 ? existingArtworks[0].createdAt : now,
      updatedAt: now,
      isSynced: false,
      // filledRegions 원본 데이터도 저장 (확장 필드로)
      ...({ _filledRegions: filledRegionsArray, _mistakesCount: mistakesCount } as Record<string, unknown>),
    }

    try {
      await saveArtwork(artwork)
      set({
        currentArtworkId: artworkId,
        isDirty: false,
        lastSavedAt: now,
      })
      return artworkId
    } catch (error) {
      console.error('Failed to save artwork:', error)
      return null
    }
  },

  // 특정 작품 불러오기
  loadProgress: async (artworkId: string) => {
    try {
      const artwork = await getArtwork(artworkId)
      if (!artwork) return false

      // 저장된 filledRegions 복원
      const savedFilledRegions = (artwork as unknown as { _filledRegions?: FilledRegion[] })._filledRegions
      const savedMistakesCount = (artwork as unknown as { _mistakesCount?: number })._mistakesCount

      if (savedFilledRegions) {
        const newMap = new Map<string, FilledRegion>()
        savedFilledRegions.forEach(fr => {
          newMap.set(fr.regionId, fr)
        })

        set({
          currentArtworkId: artworkId,
          filledRegions: newMap,
          mistakesCount: savedMistakesCount || 0,
          isCompleted: artwork.progress >= 100,
          isDirty: false,
          lastSavedAt: artwork.updatedAt,
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to load artwork:', error)
      return false
    }
  },

  // 템플릿 ID로 가장 최근 작품 불러오기
  loadProgressByTemplate: async (templateId: string) => {
    try {
      const artworks = await getArtworksByTemplate(templateId)
      if (artworks.length === 0) return false

      // 가장 최근 작품 선택
      const latestArtwork = artworks.sort((a, b) => b.updatedAt - a.updatedAt)[0]
      return get().loadProgress(latestArtwork.id)
    } catch (error) {
      console.error('Failed to load artwork by template:', error)
      return false
    }
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
