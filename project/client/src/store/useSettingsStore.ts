import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserSettings } from '@/types'

interface SettingsState extends UserSettings {
  setFontSize: (size: UserSettings['fontSize']) => void
  setHighContrast: (enabled: boolean) => void
  setShowColorNames: (enabled: boolean) => void
  setAutoHideNumbers: (enabled: boolean) => void
  setSoundEnabled: (enabled: boolean) => void
  setAutoSaveInterval: (interval: number) => void
  resetSettings: () => void
}

const defaultSettings: UserSettings = {
  fontSize: 'normal',
  highContrast: false,
  showColorNames: true,
  autoHideNumbers: true,
  autoSaveInterval: 30000, // 30 seconds
  soundEnabled: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setFontSize: (fontSize) => set({ fontSize }),
      setHighContrast: (highContrast) => set({ highContrast }),
      setShowColorNames: (showColorNames) => set({ showColorNames }),
      setAutoHideNumbers: (autoHideNumbers) => set({ autoHideNumbers }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setAutoSaveInterval: (autoSaveInterval) => set({ autoSaveInterval }),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
    }
  )
)
