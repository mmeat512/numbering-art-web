import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 컬러링 (Paint by Numbers) 페이지 객체
 */
export class ColoringPage extends BasePage {
  // 헤더 요소
  readonly backButton: Locator
  readonly progressBar: Locator
  readonly progressText: Locator
  readonly helpButton: Locator
  readonly templateTitle: Locator

  // 툴바 요소
  readonly hintButton: Locator
  readonly undoButton: Locator
  readonly zoomResetButton: Locator
  readonly saveButton: Locator

  // 캔버스 요소
  readonly canvas: Locator
  readonly svgRegions: Locator
  readonly regionNumbers: Locator
  readonly zoomIndicator: Locator
  readonly selectedColorIndicator: Locator

  // 팔레트 요소
  readonly colorPalette: Locator
  readonly colorButtons: Locator

  // 피드백 요소
  readonly feedbackMessage: Locator
  readonly mistakesCounter: Locator

  // 완성 모달
  readonly completionModal: Locator
  readonly restartButton: Locator
  readonly otherTemplateButton: Locator

  constructor(page: Page) {
    super(page)

    // 헤더
    this.backButton = page.locator('button[aria-label="뒤로 가기"]')
    this.progressBar = page.locator('[class*="bg-primary"], [class*="bg-green-500"]').first()
    // 진행률 텍스트: "0%" ~ "100%" 형식의 span
    this.progressText = page.locator('header span.text-sm.font-bold')
    this.helpButton = page.locator('button[aria-label="도움말"]')
    this.templateTitle = page.locator('header p')

    // 툴바
    this.hintButton = page.locator('button:has-text("힌트")')
    this.undoButton = page.locator('button:has-text("되돌리기")')
    this.zoomResetButton = page.locator('button:has-text("줌 초기화")')
    this.saveButton = page.locator('button:has-text("저장")')

    // 캔버스
    this.canvas = page.locator('svg').first()
    this.svgRegions = page.locator('svg path')
    this.regionNumbers = page.locator('svg text')
    this.zoomIndicator = page.locator('[class*="bg-black/60"]:has-text("%")')
    this.selectedColorIndicator = page.locator('[class*="bg-white/90"]')

    // 팔레트
    this.colorPalette = page.locator('[class*="bg-card"]').last()
    this.colorButtons = page.locator('button[class*="min-w-"]')

    // 피드백
    this.feedbackMessage = page.locator('[class*="animate-bounce-in"]')
    this.mistakesCounter = page.locator('[class*="bg-red-100"]:has-text("실수")')

    // 완성 모달
    this.completionModal = page.locator('[class*="fixed inset-0"]:has-text("축하합니다")')
    this.restartButton = page.locator('button:has-text("다시 하기")')
    this.otherTemplateButton = page.locator('button:has-text("다른 도안")')
  }

  /**
   * 특정 템플릿의 컬러링 페이지로 이동
   */
  async goto(templateId: string = 'apple-simple') {
    await super.goto(`/coloring/${templateId}`)
    // 캔버스 로드 대기
    await this.canvas.waitFor({ state: 'visible', timeout: 10000 })
  }

  /**
   * 페이지 로드 확인
   */
  async verifyPageLoaded() {
    await expect(this.canvas).toBeVisible()
    await expect(this.colorPalette).toBeVisible()
    await expect(this.hintButton).toBeVisible()
  }

  /**
   * 색상 선택
   */
  async selectColor(colorNumber: number) {
    const colorButton = this.colorButtons.filter({ hasText: String(colorNumber) }).first()
    await colorButton.click()
    // 선택 확인
    await expect(colorButton).toHaveClass(/ring-4|scale-105/)
  }

  /**
   * 영역 클릭 (SVG path 클릭)
   */
  async clickRegion(regionId: string) {
    const region = this.page.locator(`svg path`).nth(0)
    await region.click()
  }

  /**
   * 첫 번째 영역 클릭
   */
  async clickFirstRegion() {
    const firstPath = this.svgRegions.first()
    await firstPath.click({ force: true })
  }

  /**
   * 힌트 버튼 클릭
   */
  async toggleHint() {
    await this.hintButton.click()
  }

  /**
   * 되돌리기 클릭
   */
  async undo() {
    await this.undoButton.click()
  }

  /**
   * 저장 클릭
   */
  async save() {
    await this.saveButton.click()
    await this.waitForToast('저장')
  }

  /**
   * 도움말 표시
   */
  async showHelp() {
    await this.helpButton.click()
    await this.waitForToast()
  }

  /**
   * 뒤로 가기
   */
  async goBack() {
    await this.backButton.click()
  }

  /**
   * 진행률 가져오기
   */
  async getProgress(): Promise<number> {
    try {
      // 요소가 보일 때까지 대기 (최대 3초)
      const isVisible = await this.progressText.isVisible().catch(() => false)
      if (!isVisible) {
        return 0
      }
      const text = await this.progressText.textContent({ timeout: 3000 })
      return parseInt(text?.replace('%', '') || '0')
    } catch {
      return 0
    }
  }

  /**
   * 실수 횟수 가져오기
   */
  async getMistakesCount(): Promise<number> {
    const isVisible = await this.mistakesCounter.isVisible()
    if (!isVisible) return 0
    const text = await this.mistakesCounter.textContent()
    const match = text?.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

  /**
   * 피드백 메시지 확인
   */
  async waitForFeedback(type: 'correct' | 'incorrect' | 'complete') {
    const messages = {
      correct: '정답',
      incorrect: '다시',
      complete: '축하',
    }
    await this.page.locator(`[class*="animate-bounce-in"]:has-text("${messages[type]}")`).waitFor({
      state: 'visible',
      timeout: 5000,
    })
  }

  /**
   * 완성 확인
   */
  async verifyCompleted() {
    await expect(this.completionModal).toBeVisible()
  }

  /**
   * 완성 후 다시 시작
   */
  async restartFromCompletion() {
    await this.restartButton.click()
    await expect(this.completionModal).not.toBeVisible()
  }

  /**
   * 색상 버튼 개수 가져오기
   */
  async getColorCount(): Promise<number> {
    return await this.colorButtons.count()
  }

  /**
   * 특정 색상의 남은 영역 수 가져오기
   */
  async getRemainingCount(colorNumber: number): Promise<number> {
    const button = this.colorButtons.filter({ hasText: String(colorNumber) }).first()
    const badge = button.locator('[class*="absolute"][class*="-top-1"]')
    const isVisible = await badge.isVisible()
    if (!isVisible) return 0
    const text = await badge.textContent()
    return parseInt(text || '0')
  }

  /**
   * 색상이 완료되었는지 확인
   */
  async isColorCompleted(colorNumber: number): Promise<boolean> {
    const button = this.colorButtons.filter({ hasText: String(colorNumber) }).first()
    const checkmark = button.locator('svg[class*="Check"]')
    return await checkmark.isVisible()
  }
}
