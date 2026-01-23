# Backlog

프로젝트 개선 사항 및 미완료 작업 목록입니다.

## 작업 형식

- [ ] **[우선순위]** 설명 - `파일경로:라인번호`
  - 상세 내용

우선순위: 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🟢 LOW

---

## 현재 백로그

### 🟠 HIGH

- [ ] **IndexedDB 저장 구현** - `src/app/coloring/[templateId]/page.tsx:73`
  - `handleSave` 함수에 실제 저장 로직 구현 필요
  - 현재 toast만 표시하고 실제 저장 안됨

### 🟡 MEDIUM

- [ ] **confirm → 커스텀 모달** - `src/app/coloring/[templateId]/page.tsx:78`
  - 브라우저 기본 confirm() 대신 시니어 친화적 모달 사용

- [ ] **매직 넘버 상수화** - `src/components/canvas/PaintByNumberCanvas.tsx:39`
  - `16`, `500` 값을 상수로 추출

- [ ] **hex 파싱 에러 핸들링** - `src/components/palette/NumberedColorPalette.tsx:119`
  - 잘못된 hex 입력 시 예외 처리 추가

- [ ] **접근성 개선** - `src/components/palette/NumberedColorPalette.tsx`
  - ColorButton에 aria-label 추가

### 🟢 LOW

- [ ] **타입 일관성** - `src/store/useHistoryStore.ts`
  - HistoryEntry 타입과 Map 사용 일치시키기

- [ ] **컴포넌트 분리** - `src/app/coloring/[templateId]/page.tsx`
  - CompletionModal 별도 컴포넌트로 분리

---

## 완료된 항목

- [x] ~~미사용 변수 삭제~~ - `handleZoomIn`, `handleZoomOut` 제거 (2026-01-23)
