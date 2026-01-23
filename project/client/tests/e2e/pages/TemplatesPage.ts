import { Page, Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * 템플릿 선택 페이지 객체
 */
export class TemplatesPage extends BasePage {
  // 페이지 요소
  readonly pageTitle: Locator
  readonly searchInput: Locator
  readonly categoryButtons: Locator
  readonly templateCards: Locator
  readonly difficultyBadges: Locator

  constructor(page: Page) {
    super(page)

    // 템플릿 페이지에는 h1이 없으므로 검색창이나 카테고리 버튼으로 확인
    this.pageTitle = page.locator('input[placeholder*="검색"]')
    this.searchInput = page.locator('input[placeholder*="검색"], input[type="search"]')
    this.categoryButtons = page.locator('.flex.gap-2 button')
    this.templateCards = page.locator('a[href^="/coloring/"]')
    this.difficultyBadges = page.locator('[class*="bg-green-100"], [class*="bg-yellow-100"], [class*="bg-red-100"]')
  }

  /**
   * 템플릿 페이지로 이동
   */
  async goto() {
    await super.goto('/templates')
  }

  /**
   * 페이지 로드 확인
   */
  async verifyPageLoaded() {
    await expect(this.searchInput).toBeVisible()
    await expect(this.templateCards.first()).toBeVisible({ timeout: 10000 })
  }

  /**
   * 카테고리 필터 선택
   */
  async selectCategory(category: '전체' | '동물' | '꽃' | '풍경' | '패턴' | '음식') {
    // 정확히 일치하는 버튼만 선택 (첫 번째 "전체" 버튼 또는 아이콘 포함 버튼)
    let categoryButton
    if (category === '전체') {
      // 정확히 "전체"만 있는 첫 번째 버튼
      categoryButton = this.page.getByRole('button', { name: '전체', exact: true })
    } else {
      // 다른 카테고리는 아이콘과 함께 표시되므로 부분 일치
      categoryButton = this.categoryButtons.filter({ hasText: category }).first()
    }
    await categoryButton.click()
    // 필터링 대기
    await this.page.waitForTimeout(300)
  }

  /**
   * 검색 수행
   */
  async searchTemplates(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForTimeout(300)
  }

  /**
   * 검색 초기화
   */
  async clearSearch() {
    await this.searchInput.clear()
    await this.page.waitForTimeout(300)
  }

  /**
   * 난이도별 템플릿 선택
   */
  async selectTemplateByDifficulty(difficulty: '쉬움' | '보통' | '어려움') {
    const card = this.page.locator(`a[href^="/coloring/"]:has-text("${difficulty}")`).first()
    await card.click()
    await this.page.waitForURL(/\/coloring\//)
  }

  /**
   * 첫 번째 템플릿 선택
   */
  async selectFirstTemplate() {
    await this.templateCards.first().click()
    await this.page.waitForURL(/\/coloring\//)
  }

  /**
   * 특정 템플릿 선택
   */
  async selectTemplateByTitle(title: string) {
    const card = this.page.locator(`a[href^="/coloring/"]:has-text("${title}")`)
    await card.click()
    await this.page.waitForURL(/\/coloring\//)
  }

  /**
   * 템플릿 개수 확인
   */
  async getTemplateCount(): Promise<number> {
    return await this.templateCards.count()
  }

  /**
   * 표시된 템플릿 제목 목록 가져오기
   */
  async getTemplateTitles(): Promise<string[]> {
    const titles: string[] = []
    const count = await this.templateCards.count()
    for (let i = 0; i < count; i++) {
      const title = await this.templateCards.nth(i).locator('h3').textContent()
      if (title) titles.push(title)
    }
    return titles
  }
}
