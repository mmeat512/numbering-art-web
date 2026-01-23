import { test, expect } from '@playwright/test'
import { HomePage, TemplatesPage } from '../pages'

// 테스트 전 모달 닫기 헬퍼
async function dismissModals(page: import('@playwright/test').Page) {
  // 모달이 있으면 닫기
  const modal = page.locator('[role="dialog"]')
  if (await modal.isVisible({ timeout: 1000 }).catch(() => false)) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  }
}

test.describe('네비게이션 테스트', () => {
  test('홈페이지 로드 및 기본 요소 확인', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.goto()
    await dismissModals(page)
    await homePage.verifyPageLoaded()

    // 환영 메시지 확인
    await expect(homePage.welcomeMessage).toContainText('안녕하세요')

    // 시작하기 버튼 확인
    await expect(homePage.startButton).toBeVisible()

    // 추천 템플릿 섹션 확인
    await expect(homePage.recommendedSection).toBeVisible()

    // 템플릿 카드가 표시되는지 확인
    const templateCount = await homePage.getTemplateCount()
    expect(templateCount).toBeGreaterThan(0)
  })

  test('홈 → 템플릿 페이지 이동', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.goto()
    await dismissModals(page)
    await homePage.clickStartButton()

    // URL 확인
    await expect(page).toHaveURL('/templates')

    const templatesPage = new TemplatesPage(page)
    await templatesPage.verifyPageLoaded()
  })

  test('하단 네비게이션 바 동작 확인', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.goto()
    await dismissModals(page)

    // 템플릿 페이지로 이동
    await homePage.goToTemplates()
    await expect(page).toHaveURL('/templates')

    // 갤러리로 이동
    await homePage.goToGallery()
    await expect(page).toHaveURL('/gallery')

    // 설정으로 이동
    await homePage.goToSettings()
    await expect(page).toHaveURL('/settings')

    // 홈으로 돌아오기
    await homePage.goToHome()
    await expect(page).toHaveURL('/')
  })

  test('추천 템플릿 클릭 시 컬러링 페이지로 이동', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.goto()
    await dismissModals(page)
    await homePage.clickFirstTemplate()

    // 컬러링 페이지로 이동 확인
    await expect(page).toHaveURL(/\/coloring\//)
  })
})

test.describe('템플릿 선택 페이지', () => {
  test('템플릿 목록 표시', async ({ page }) => {
    const templatesPage = new TemplatesPage(page)

    await templatesPage.goto()
    await dismissModals(page)
    await templatesPage.verifyPageLoaded()

    // 템플릿이 표시되는지 확인
    const count = await templatesPage.getTemplateCount()
    expect(count).toBeGreaterThan(0)
  })

  test('카테고리 필터 동작', async ({ page }) => {
    const templatesPage = new TemplatesPage(page)

    await templatesPage.goto()
    await dismissModals(page)

    // 전체 카테고리 선택
    await templatesPage.selectCategory('전체')
    const totalCount = await templatesPage.getTemplateCount()

    // 동물 카테고리 선택
    await templatesPage.selectCategory('동물')
    const animalCount = await templatesPage.getTemplateCount()

    // 동물 카테고리 결과가 전체보다 적거나 같아야 함
    expect(animalCount).toBeLessThanOrEqual(totalCount)
  })

  test('템플릿 선택 시 컬러링 페이지로 이동', async ({ page }) => {
    const templatesPage = new TemplatesPage(page)

    await templatesPage.goto()
    await dismissModals(page)
    await templatesPage.selectFirstTemplate()

    // 컬러링 페이지로 이동 확인
    await expect(page).toHaveURL(/\/coloring\//)
  })

  test('난이도별 템플릿 표시 확인', async ({ page }) => {
    const templatesPage = new TemplatesPage(page)

    await templatesPage.goto()

    // 난이도 배지가 표시되는지 확인
    const badges = templatesPage.difficultyBadges
    await expect(badges.first()).toBeVisible()
  })
})
