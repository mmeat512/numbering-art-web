import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 홈 페이지 객체
 */
export class HomePage extends BasePage {
  // 페이지 요소
  readonly welcomeMessage: Locator
  readonly startButton: Locator
  readonly recommendedSection: Locator
  readonly templateCards: Locator
  readonly recentWorkSection: Locator

  constructor(page: Page) {
    super(page)

    this.welcomeMessage = page.locator('h1:has-text("안녕하세요")')
    this.startButton = page.locator('a:has-text("시작하기")')
    this.recommendedSection = page.locator('h2:has-text("인기 템플릿")')
    this.templateCards = page.locator('[class*="TemplateCard"], a[href^="/coloring/"]')
    this.recentWorkSection = page.locator('h2:has-text("최근 작업"), [class*="CardTitle"]:has-text("최근 작업")')
  }

  /**
   * 홈 페이지로 이동
   */
  async goto() {
    await super.goto('/')
  }

  /**
   * 시작하기 버튼 클릭
   */
  async clickStartButton() {
    await this.startButton.click()
    await this.page.waitForURL('/templates')
  }

  /**
   * 첫 번째 추천 템플릿 클릭
   */
  async clickFirstTemplate() {
    const firstCard = this.templateCards.first()
    await firstCard.click()
    await this.page.waitForURL(/\/coloring\//)
  }

  /**
   * 홈 페이지 로드 확인
   */
  async verifyPageLoaded() {
    await expect(this.welcomeMessage).toBeVisible()
    await expect(this.startButton).toBeVisible()
    await expect(this.recommendedSection).toBeVisible()
  }

  /**
   * 추천 템플릿 개수 확인
   */
  async getTemplateCount(): Promise<number> {
    return await this.templateCards.count()
  }
}
