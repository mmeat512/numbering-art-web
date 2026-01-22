import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_PALETTE, PaletteColor } from '@/types'

interface ColorState {
  selectedColor: PaletteColor
  recentColors: PaletteColor[]
  favoriteColors: PaletteColor[]
  palette: PaletteColor[]
  setSelectedColor: (color: PaletteColor) => void
  addToRecent: (color: PaletteColor) => void
  addRecentColor: (color: PaletteColor) => void // alias
  toggleFavorite: (color: PaletteColor) => void
}

export const useColorStore = create<ColorState>()(
  persist(
    (set, get) => ({
      selectedColor: DEFAULT_PALETTE[0],
      recentColors: [],
      favoriteColors: [],
      palette: DEFAULT_PALETTE,

      setSelectedColor: (color) => {
        set({ selectedColor: color })
        get().addToRecent(color)
      },

      addToRecent: (color) => {
        set((state) => {
          const filtered = state.recentColors.filter((c) => c.id !== color.id)
          return {
            recentColors: [color, ...filtered].slice(0, 8),
          }
        })
      },

      // alias for addToRecent
      addRecentColor: (color) => {
        get().addToRecent(color)
      },

      toggleFavorite: (color) => {
        set((state) => {
          const isFavorite = state.favoriteColors.some((c) => c.id === color.id)
          if (isFavorite) {
            return {
              favoriteColors: state.favoriteColors.filter((c) => c.id !== color.id),
            }
          }
          return {
            favoriteColors: [...state.favoriteColors, color].slice(0, 12),
          }
        })
      },
    }),
    {
      name: 'color-storage',
      partialize: (state) => ({
        recentColors: state.recentColors,
        favoriteColors: state.favoriteColors,
      }),
    }
  )
)
