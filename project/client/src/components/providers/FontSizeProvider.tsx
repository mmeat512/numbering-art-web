'use client'

import { useEffect } from 'react'
import { useSettingsStore } from '@/store/useSettingsStore'

interface FontSizeProviderProps {
  children: React.ReactNode
}

export function FontSizeProvider({ children }: FontSizeProviderProps) {
  const { fontSize, highContrast } = useSettingsStore()

  useEffect(() => {
    const body = document.body

    // Remove existing font size classes
    body.classList.remove('font-size-normal', 'font-size-large', 'font-size-extra-large')

    // Add current font size class
    body.classList.add(`font-size-${fontSize}`)

    // Handle high contrast mode
    if (highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }
  }, [fontSize, highContrast])

  return <>{children}</>
}
