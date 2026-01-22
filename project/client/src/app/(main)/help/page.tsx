'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Palette,
  MousePointer2,
  ZoomIn,
  Save,
  Undo2,
  HelpCircle,
  Home,
  Settings,
  Smartphone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface HelpSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'start',
    title: '시작하기',
    icon: <Home className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p>디지털 컬러링 앱에 오신 것을 환영합니다!</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>하단의 <strong>템플릿</strong> 탭을 눌러 그림을 선택하세요</li>
          <li>마음에 드는 그림을 터치하면 색칠 화면이 열립니다</li>
          <li>색상을 선택하고 그림의 원하는 부분을 터치하세요</li>
          <li>완성된 작품은 자동으로 저장됩니다</li>
        </ol>
      </div>
    ),
  },
  {
    id: 'coloring',
    title: '색칠하기',
    icon: <Palette className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <h4 className="font-medium">색상 선택</h4>
        <p>화면 아래의 색상 팔레트에서 원하는 색상을 터치하세요. 선택된 색상은 크게 표시됩니다.</p>

        <h4 className="font-medium">영역 색칠</h4>
        <p>색상을 선택한 후, 그림에서 색칠하고 싶은 부분을 터치하면 해당 영역이 선택한 색으로 채워집니다.</p>

        <h4 className="font-medium">팔레트 버튼</h4>
        <p>오른쪽 아래의 🎨 버튼을 눌러 팔레트를 숨기거나 보이게 할 수 있습니다.</p>
      </div>
    ),
  },
  {
    id: 'gesture',
    title: '화면 조작',
    icon: <MousePointer2 className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <h4 className="font-medium">확대/축소</h4>
        <p>두 손가락을 벌리면 확대, 오므리면 축소됩니다. 세밀한 부분을 색칠할 때 유용합니다.</p>

        <h4 className="font-medium">이동</h4>
        <p>한 손가락으로 드래그하면 그림을 이동할 수 있습니다.</p>

        <h4 className="font-medium">원래 크기로</h4>
        <p>상단의 ↺ 버튼을 누르면 원래 크기와 위치로 돌아갑니다.</p>
      </div>
    ),
  },
  {
    id: 'zoom',
    title: '확대/축소 버튼',
    icon: <ZoomIn className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p>화면 아래의 도구 모음에서 확대/축소 버튼을 사용할 수 있습니다:</p>
        <ul className="list-inside list-disc space-y-2">
          <li><strong>+ 버튼</strong>: 그림을 확대합니다</li>
          <li><strong>- 버튼</strong>: 그림을 축소합니다</li>
        </ul>
        <p className="text-muted-foreground">
          💡 팁: 세밀한 부분을 색칠할 때는 확대해서 작업하세요!
        </p>
      </div>
    ),
  },
  {
    id: 'undo',
    title: '되돌리기',
    icon: <Undo2 className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p>실수로 잘못 색칠했다면 걱정하지 마세요!</p>
        <p>화면 왼쪽 위의 <strong>← 버튼</strong>을 누르면 이전 화면으로 돌아갑니다.</p>
        <p className="text-muted-foreground">
          💡 팁: 자주 저장하면 실수해도 걱정없어요!
        </p>
      </div>
    ),
  },
  {
    id: 'save',
    title: '저장하기',
    icon: <Save className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <h4 className="font-medium">자동 저장</h4>
        <p>작업 중인 내용은 30초마다 자동으로 저장됩니다. 앱을 닫아도 다음에 이어서 작업할 수 있어요.</p>

        <h4 className="font-medium">수동 저장</h4>
        <p>도구 모음의 <strong>💾 저장</strong> 버튼을 눌러 직접 저장할 수도 있습니다.</p>

        <h4 className="font-medium">저장된 작품 보기</h4>
        <p>하단의 <strong>갤러리</strong> 탭에서 저장된 작품들을 확인할 수 있습니다.</p>
      </div>
    ),
  },
  {
    id: 'settings',
    title: '설정 변경',
    icon: <Settings className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p>하단의 <strong>설정</strong> 탭에서 다양한 설정을 변경할 수 있습니다:</p>
        <ul className="list-inside list-disc space-y-2">
          <li><strong>글자 크기</strong>: 화면의 글자 크기를 조절합니다</li>
          <li><strong>고대비 모드</strong>: 글씨를 더 선명하게 보이게 합니다</li>
          <li><strong>색상 이름 표시</strong>: 팔레트에 색상 이름을 표시합니다</li>
          <li><strong>자동 저장 간격</strong>: 자동 저장 주기를 변경합니다</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'install',
    title: '홈 화면에 추가',
    icon: <Smartphone className="h-5 w-5" />,
    content: (
      <div className="space-y-4">
        <p>이 앱을 휴대폰 홈 화면에 추가하면 더 편리하게 사용할 수 있습니다!</p>

        <h4 className="font-medium">아이폰 (Safari)</h4>
        <ol className="list-inside list-decimal space-y-1">
          <li>화면 아래의 공유 버튼(📤)을 누르세요</li>
          <li>&quot;홈 화면에 추가&quot;를 선택하세요</li>
          <li>&quot;추가&quot;를 누르면 완료!</li>
        </ol>

        <h4 className="font-medium">안드로이드 (Chrome)</h4>
        <ol className="list-inside list-decimal space-y-1">
          <li>화면 위의 메뉴(⋮)를 누르세요</li>
          <li>&quot;홈 화면에 추가&quot; 또는 &quot;앱 설치&quot;를 선택하세요</li>
          <li>&quot;설치&quot;를 누르면 완료!</li>
        </ol>
      </div>
    ),
  },
]

export default function HelpPage() {
  const [openSections, setOpenSections] = useState<string[]>(['start'])

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">도움말</h1>
        <p className="mt-2 text-muted-foreground">
          궁금한 항목을 터치하면 자세한 설명을 볼 수 있어요
        </p>
      </div>

      <div className="space-y-3">
        {HELP_SECTIONS.map((section) => (
          <Card key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full text-left"
            >
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {section.icon}
                  </span>
                  {section.title}
                </CardTitle>
                {openSections.includes(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </CardHeader>
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-200',
                openSections.includes(section.id) ? 'max-h-[1000px]' : 'max-h-0'
              )}
            >
              <CardContent className="pt-0 pb-4">
                {section.content}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 bg-primary/5">
        <CardContent className="py-4 text-center">
          <p className="text-muted-foreground">
            더 궁금한 점이 있으신가요?
          </p>
          <p className="mt-1 font-medium">
            문의: help@digitalcoloring.app
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
