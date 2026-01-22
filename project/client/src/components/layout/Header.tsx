'use client'

import { HelpCircle, Settings } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title?: string
  showHelp?: boolean
  showSettings?: boolean
  rightAction?: React.ReactNode
}

export function Header({
  title = '컬러링',
  showHelp = true,
  showSettings = false,
  rightAction,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">{title}</span>
        </Link>

        <div className="flex items-center gap-2">
          {showHelp && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target-lg"
              aria-label="도움말"
              asChild
            >
              <Link href="/help">
                <HelpCircle className="h-6 w-6" />
              </Link>
            </Button>
          )}

          {showSettings && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target-lg"
              aria-label="설정"
              asChild
            >
              <Link href="/settings">
                <Settings className="h-6 w-6" />
              </Link>
            </Button>
          )}

          {rightAction}
        </div>
      </div>
    </header>
  )
}
