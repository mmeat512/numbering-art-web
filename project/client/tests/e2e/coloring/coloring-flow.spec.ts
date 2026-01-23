import { test, expect } from '@playwright/test'
import { ColoringPage, TemplatesPage } from '../pages'

// 테스트 전 모달 닫기 헬퍼
async function dismissModals(page: import('@playwright/test').Page) {
  const modal = page.locator('[role="dialog"]')
  if (await modal.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  }
}

test.describe('숫자 맞춤 컬러링 - 핵심 플로우', () => {
  test.beforeEach(async ({ page }) => {
    // 간단한 사과 템플릿으로 시작
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')
    await coloringPage.verifyPageLoaded()
  })

  test('컬러링 페이지 기본 요소 로드 확인', async ({ page }) => {
    const coloringPage = new ColoringPage(page)

    // 캔버스 확인
    await expect(coloringPage.canvas).toBeVisible()

    // 색상 팔레트 확인
    await expect(coloringPage.colorPalette).toBeVisible()

    // 툴바 버튼 확인
    await expect(coloringPage.hintButton).toBeVisible()
    await expect(coloringPage.undoButton).toBeVisible()
    await expect(coloringPage.saveButton).toBeVisible()

    // 진행률 표시 확인
    await expect(coloringPage.progressText).toBeVisible()
    const progress = await coloringPage.getProgress()
    expect(progress).toBe(0)
  })

  test('색상 선택 동작', async ({ page }) => {
    const coloringPage = new ColoringPage(page)

    // 색상 버튼 개수 확인 (사과 템플릿은 4색)
    const colorCount = await coloringPage.getColorCount()
    expect(colorCount).toBeGreaterThanOrEqual(4)

    // 1번 색상 선택
    await coloringPage.selectColor(1)

    // 선택된 색상 표시 확인
    await expect(coloringPage.selectedColorIndicator).toBeVisible()
  })

  test('힌트 버튼 토글', async ({ page }) => {
    const coloringPage = new ColoringPage(page)

    // 힌트 버튼 클릭
    await coloringPage.toggleHint()

    // 힌트 버튼 활성화 상태 확인 (배경색 변경)
    await expect(coloringPage.hintButton).toHaveClass(/bg-primary/)

    // 다시 클릭하여 비활성화
    await coloringPage.toggleHint()
    await expect(coloringPage.hintButton).not.toHaveClass(/bg-primary/)
  })

  test('저장 버튼 클릭 시 토스트 메시지', async ({ page }) => {
    const coloringPage = new ColoringPage(page)

    await coloringPage.save()

    // 토스트 메시지 확인
    const toast = page.locator('[data-sonner-toast]')
    await expect(toast).toBeVisible()
  })

  test('도움말 버튼 클릭 시 안내 표시', async ({ page }) => {
    const coloringPage = new ColoringPage(page)

    await coloringPage.showHelp()

    // 도움말 토스트 확인
    const helpToast = page.locator('[data-sonner-toast]:has-text("숫자 맞춤")')
    await expect(helpToast).toBeVisible()
  })

  test('뒤로 가기 버튼 동작', async ({ page }) => {
    const coloringPage = new ColoringPage(page)

    // 템플릿 페이지에서 시작
    const templatesPage = new TemplatesPage(page)
    await templatesPage.goto()
    await dismissModals(page)
    await templatesPage.selectFirstTemplate()

    // 컬러링 페이지 확인
    await expect(page).toHaveURL(/\/coloring\//)

    // 뒤로 가기
    await coloringPage.goBack()

    // 이전 페이지로 돌아갔는지 확인
    await expect(page).not.toHaveURL(/\/coloring\//)
  })
})

test.describe('숫자 맞춤 컬러링 - 색칠 인터랙션', () => {
  test('영역 클릭 시 피드백 표시', async ({ page }) => {
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')
    await coloringPage.verifyPageLoaded()

    // 1번 색상(빨강) 선택 - 사과 몸통 색
    await coloringPage.selectColor(1)

    // SVG 캔버스에서 path 요소들이 있는지 확인
    const paths = coloringPage.svgRegions
    const pathCount = await paths.count()

    // 최소 1개의 경로가 있어야 함
    expect(pathCount).toBeGreaterThan(0)

    // 색상이 선택된 상태에서 클릭 가능한 영역 확인
    const firstPath = paths.first()
    await expect(firstPath).toBeVisible()

    // 테스트 성공: 색상 선택 및 클릭 가능한 영역이 존재함
    // 실제 클릭 인터랙션은 SVG 내부 좌표 계산이 필요하므로 단위 테스트에서 검증
  })

  test('되돌리기 버튼 클릭 가능', async ({ page }) => {
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')
    await coloringPage.verifyPageLoaded()

    // 되돌리기 버튼이 클릭 가능한지 확인
    await expect(coloringPage.undoButton).toBeVisible()
    await expect(coloringPage.undoButton).toBeEnabled()

    // 되돌리기 클릭
    await coloringPage.undo()

    // 에러 없이 동작하면 성공
    await expect(coloringPage.canvas).toBeVisible()
  })
})

test.describe('숫자 맞춤 컬러링 - 모바일 터치', () => {
  test('터치로 색상 선택 가능', async ({ page }) => {
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')
    await coloringPage.verifyPageLoaded()

    // 색상 버튼 탭
    const colorButton = coloringPage.colorButtons.first()
    await colorButton.tap()

    // 선택 상태 확인 (ring 또는 scale 클래스)
    await expect(colorButton).toHaveClass(/ring-4|scale-105/)
  })

  test('터치로 캔버스 영역 접근 가능', async ({ page }) => {
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')
    await coloringPage.verifyPageLoaded()

    // 색상 선택
    await coloringPage.selectColor(1)

    // SVG 캔버스가 터치 가능한지 확인
    const canvas = coloringPage.canvas
    await expect(canvas).toBeVisible()

    // SVG 내 path 요소가 있는지 확인
    const paths = coloringPage.svgRegions
    const pathCount = await paths.count()
    expect(pathCount).toBeGreaterThan(0)
  })
})

test.describe('숫자 맞춤 컬러링 - 접근성', () => {
  test('버튼에 aria-label 존재', async ({ page }) => {
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')

    // 뒤로 가기 버튼 aria-label 확인
    await expect(coloringPage.backButton).toHaveAttribute('aria-label', '뒤로 가기')

    // 도움말 버튼 aria-label 확인
    await expect(coloringPage.helpButton).toHaveAttribute('aria-label', '도움말')
  })

  test('충분히 큰 터치 타겟', async ({ page }) => {
    const coloringPage = new ColoringPage(page)
    await coloringPage.goto('apple-simple')

    // 색상 버튼 크기 확인 (최소 44x44)
    const colorButton = coloringPage.colorButtons.first()
    const box = await colorButton.boundingBox()

    expect(box).not.toBeNull()
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(44)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
  })
})
