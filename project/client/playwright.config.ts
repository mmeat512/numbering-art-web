import { defineConfig, devices } from '@playwright/test'

/**
 * Paint by Numbers PWA - E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* 테스트 파일 패턴 */
  testMatch: '**/*.spec.ts',

  /* 병렬 실행 */
  fullyParallel: true,

  /* CI에서 재시도 없음, 로컬에서 1회 재시도 */
  retries: process.env.CI ? 0 : 1,

  /* CI에서 워커 수 제한 */
  workers: process.env.CI ? 1 : undefined,

  /* 리포터 설정 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  /* 공통 설정 */
  use: {
    /* 기본 URL */
    baseURL: 'http://localhost:3000',

    /* 실패 시 스크린샷 */
    screenshot: 'only-on-failure',

    /* 실패 시 비디오 */
    video: 'on-first-retry',

    /* 실패 시 트레이스 */
    trace: 'on-first-retry',

    /* 뷰포트 (모바일 우선) */
    viewport: { width: 390, height: 844 },

    /* 터치 지원 */
    hasTouch: true,

    /* 타임아웃 */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* 프로젝트별 설정 */
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 7'],
      },
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        hasTouch: false,
      },
    },
  ],

  /* 개발 서버 자동 시작 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  /* 아티팩트 저장 경로 */
  outputDir: 'test-results/',
})
