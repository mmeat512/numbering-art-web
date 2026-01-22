import { create } from 'zustand'
import { ColoredRegion, HistoryEntry } from '@/types'

interface HistoryState {
  past: HistoryEntry[]
  future: HistoryEntry[]
  currentData: ColoredRegion[]
  maxHistoryLength: number
  pushHistory: (data: ColoredRegion[]) => void
  undo: () => ColoredRegion[] | null
  redo: () => ColoredRegion[] | null
  canUndo: () => boolean
  canRedo: () => boolean
  clearHistory: () => void
  setCurrentData: (data: ColoredRegion[]) => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  currentData: [],
  maxHistoryLength: 50,

  pushHistory: (data) => {
    set((state) => {
      const newPast = [
        ...state.past,
        { coloredData: state.currentData, timestamp: Date.now() },
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
        { coloredData: state.currentData, timestamp: Date.now() },
        ...state.future,
      ],
      currentData: previous.coloredData,
    })

    return previous.coloredData
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return null

    const next = state.future[0]
    const newFuture = state.future.slice(1)

    set({
      past: [
        ...state.past,
        { coloredData: state.currentData, timestamp: Date.now() },
      ],
      future: newFuture,
      currentData: next.coloredData,
    })

    return next.coloredData
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  clearHistory: () => {
    set({
      past: [],
      future: [],
      currentData: [],
    })
  },

  setCurrentData: (data) => {
    set({ currentData: data })
  },
}))
