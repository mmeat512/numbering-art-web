'use client'

import { Check, Type, Eye, Palette, Clock, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettingsStore } from '@/store/useSettingsStore'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { UserSettings } from '@/types'

const FONT_SIZE_OPTIONS: { value: UserSettings['fontSize']; label: string; description: string }[] = [
  { value: 'normal', label: '보통', description: '기본 글자 크기' },
  { value: 'large', label: '크게', description: '글자를 크게 표시' },
  { value: 'extra-large', label: '아주 크게', description: '글자를 아주 크게 표시' },
]

const AUTO_SAVE_OPTIONS = [
  { value: 15000, label: '15초' },
  { value: 30000, label: '30초' },
  { value: 60000, label: '1분' },
  { value: 120000, label: '2분' },
]

export default function SettingsPage() {
  const {
    fontSize,
    highContrast,
    showColorNames,
    confirmBeforeColor,
    autoSaveInterval,
    setFontSize,
    setHighContrast,
    setShowColorNames,
    setConfirmBeforeColor,
    setAutoSaveInterval,
    resetSettings,
  } = useSettingsStore()

  const handleResetSettings = () => {
    resetSettings()
    toast.success('설정이 초기화되었습니다.')
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">설정</h1>

      <div className="space-y-6">
        {/* 글자 크기 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              글자 크기
            </CardTitle>
            <CardDescription>
              화면에 표시되는 글자의 크기를 조절합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {FONT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors',
                    fontSize === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {fontSize === option.value && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 화면 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              화면 설정
            </CardTitle>
            <CardDescription>
              화면 표시 방식을 조절합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ToggleSetting
                label="고대비 모드"
                description="색상 대비를 높여 글씨를 더 잘 보이게 합니다"
                checked={highContrast}
                onChange={setHighContrast}
              />
            </div>
          </CardContent>
        </Card>

        {/* 색칠 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              색칠 설정
            </CardTitle>
            <CardDescription>
              색칠할 때의 동작을 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ToggleSetting
                label="색상 이름 표시"
                description="팔레트에서 색상 이름을 함께 표시합니다"
                checked={showColorNames}
                onChange={setShowColorNames}
              />
              <ToggleSetting
                label="색칠 전 확인"
                description="영역을 터치할 때 색칠할지 확인합니다"
                checked={confirmBeforeColor}
                onChange={setConfirmBeforeColor}
              />
            </div>
          </CardContent>
        </Card>

        {/* 자동 저장 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              자동 저장
            </CardTitle>
            <CardDescription>
              작업 중인 내용을 자동으로 저장하는 간격을 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {AUTO_SAVE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAutoSaveInterval(option.value)}
                  className={cn(
                    'rounded-lg border-2 px-4 py-3 text-center transition-colors',
                    autoSaveInterval === option.value
                      ? 'border-primary bg-primary/5 font-medium'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 초기화 버튼 */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="w-full gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              설정 초기화
            </Button>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              모든 설정을 기본값으로 되돌립니다
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface ToggleSettingProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border-2 border-border p-4 text-left transition-colors hover:border-primary/50"
    >
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div
        className={cn(
          'flex h-7 w-12 items-center rounded-full p-1 transition-colors',
          checked ? 'bg-primary' : 'bg-muted'
        )}
      >
        <div
          className={cn(
            'h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </div>
    </button>
  )
}
