'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Palette, MousePointer2, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const ONBOARDING_KEY = 'onboarding-completed'

interface OnboardingStep {
  icon: React.ReactNode
  title: string
  description: string
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    icon: <Palette className="h-12 w-12" />,
    title: '템플릿 선택',
    description: '다양한 그림 중에서 마음에 드는 것을 골라보세요. 쉬운 그림부터 시작하는 것을 추천드려요!',
  },
  {
    icon: <MousePointer2 className="h-12 w-12" />,
    title: '색칠하기',
    description: '아래 팔레트에서 색상을 선택하고, 그림의 원하는 부분을 터치하면 색이 채워져요.',
  },
  {
    icon: <Save className="h-12 w-12" />,
    title: '자동 저장',
    description: '작업 중인 내용은 자동으로 저장되어요. 언제든 이어서 색칠할 수 있어요!',
  },
]

export function OnboardingModal() {
  // Check localStorage on initial render to set initial state
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return !localStorage.getItem(ONBOARDING_KEY)
  })
  const [currentStep, setCurrentStep] = useState(0)

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsOpen(false)
  }

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const step = ONBOARDING_STEPS[currentStep]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">사용 방법</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Step Indicator */}
          <div className="mb-8 flex justify-center gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors',
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              {step.icon}
            </div>
            <h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            건너뛰기
          </Button>

          <Button onClick={handleNext} className="gap-1">
            {currentStep === ONBOARDING_STEPS.length - 1 ? '시작하기' : '다음'}
            {currentStep < ONBOARDING_STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
