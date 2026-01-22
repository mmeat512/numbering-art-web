import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserSettings } from '@/types'

interface SettingsState extends UserSettings {
  setFontSize: (size: UserSettings['fontSize']) => void
  setHighContrast: (enabled: boolean) => void
  setShowColorNames: (enabled: boolean) => void
  setConfirmBeforeColor: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  resetSettings: () => void
}

const defaultSettings: UserSettings = {
  fontSize: 'normal',
  highContrast: false,
  showColorNames: true,
  confirmBeforeColor: false,
  autoSaveInterval: 30000, // 30 seconds
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setFontSize: (fontSize) => set({ fontSize }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setShowColorNames: (showColorNames) => set({ showColorNames }),
      setConfirmBeforeColor: (confirmBeforeColor) => set({ confirmBeforeColor }),
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
    }
  )
)
