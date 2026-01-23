import { create } from 'zustand'
import { FilledRegion } from '@/types'

// History Entry for Paint by Numbers system
interface PaintHistoryEntry {
  filledRegions: Map<string, FilledRegion>
  timestamp: number
}

interface HistoryState {
  past: PaintHistoryEntry[]
  future: PaintHistoryEntry[]
  currentData: Map<string, FilledRegion>
  maxHistoryLength: number
  pushHistory: (data: Map<string, FilledRegion>) => void
  undo: () => Map<string, FilledRegion> | null
  redo: () => Map<string, FilledRegion> | null
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  setCurrentData: (data: Map<string, FilledRegion>) => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  currentData: new Map(),
  maxHistoryLength: 50,

  pushHistory: (data) => {
    set((state) => {
      const newPast = [
        ...state.past,
        { filledRegions: new Map(state.currentData), timestamp: Date.now() },
      ].slice(-state.maxHistoryLength)

      return {
        past: newPast,
        future: [],
        currentData: data,
      }
    })
  },

  undo: () => {
    const state = get()
    if (state.past.length === 0) return null

    const previous = state.past[state.past.length - 1]
    const newPast = state.past.slice(0, -1)

    set({
      past: newPast,
      future: [
        { filledRegions: new Map(state.currentData), timestamp: Date.now() },
        ...state.future,
      ],
      currentData: previous.filledRegions,
    })

    return previous.filledRegions
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return null

    const next = state.future[0]
    const newFuture = state.future.slice(1)

    set({
      past: [
        ...state.past,
        { filledRegions: new Map(state.currentData), timestamp: Date.now() },
      ],
      future: newFuture,
      currentData: next.filledRegions,
    })

    return next.filledRegions
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clearHistory: () => {
    set({
      past: [],
      future: [],
      currentData: new Map(),
    })
  },

  setCurrentData: (data) => {
    set({ currentData: data })
  },
}))
