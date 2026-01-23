import { Page, Locator } from '@playwright/test'

/**
 * 기본 페이지 객체 - 공통 기능 정의
 */
export class BasePage {
  readonly page: Page

  // 공통 네비게이션 요소
  readonly navHome: Locator
  readonly navTemplates: Locator
  readonly navGallery: Locator
  readonly navSettings: Locator

  constructor(page: Page) {
    this.page = page

    // 하단 네비게이션 바
    this.navHome = page.locator('nav a[href="/"]')
    this.navTemplates = page.locator('nav a[href="/templates"]')
    this.navGallery = page.locator('nav a[href="/gallery"]')
    this.navSettings = page.locator('nav a[href="/settings"]')
  }

  /**
   * 페이지 이동 후 로드 대기
   */
  async goto(path: string) {
    await this.page.goto(path)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * 홈으로 이동
   */
  async goToHome() {
    await this.navHome.click()
    await this.page.waitForURL('/')
  }

  /**
   * 템플릿 페이지로 이동
   */
  async goToTemplates() {
    await this.navTemplates.click()
    await this.page.waitForURL('/templates')
  }

  /**
   * 갤러리로 이동
   */
  async goToGallery() {
    await this.navGallery.click()
    await this.page.waitForURL('/gallery')
  }

  /**
   * 설정으로 이동
   */
  async goToSettings() {
    await this.navSettings.click()
    await this.page.waitForURL('/settings')
  }

  /**
   * 토스트 메시지 대기
   */
  async waitForToast(text?: string) {
    const toast = this.page.locator('[data-sonner-toast]')
    await toast.waitFor({ state: 'visible' })
    if (text) {
      await this.page.locator(`[data-sonner-toast]:has-text("${text}")`).waitFor()
    }
    return toast
  }

  /**
   * 스크린샷 촬영
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` })
  }
}
