'use client'

import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { ColoredRegion, Template, FilledRegion } from '@/types'

/**
 * IndexedDB 스키마 정의
 * 오프라인 저장 및 자동 저장을 위한 로컬 데이터베이스
 */
interface ColoringAppDB extends DBSchema {
  artworks: {
    key: string
    value: LocalArtwork
    indexes: {
      'by-updated': number
      'by-template': string
    }
  }
  drafts: {
    key: string
    value: ArtworkDraft
    indexes: {
      'by-updated': number
    }
  }
  settings: {
    key: string
    value: unknown
  }
}

export interface LocalArtwork {
  id: string
  templateId: string
  title: string
  thumbnailDataUrl?: string
  canvasDataUrl?: string
  coloredRegions: ColoredRegion[]
  progress: number
  createdAt: number
  updatedAt: number
  syncedAt?: number
  isSynced: boolean
}

export interface ArtworkDraft {
  id: string
  templateId: string
  coloredRegions: ColoredRegion[]
  canvasDataUrl?: string
  updatedAt: number
}

const DB_NAME = 'coloring-app-db'
const DB_VERSION = 1

let dbInstance: IDBPDatabase<ColoringAppDB> | null = null

/**
 * IndexedDB 연결
 */
export async function getDB(): Promise<IDBPDatabase<ColoringAppDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<ColoringAppDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // artworks 스토어
      if (!db.objectStoreNames.contains('artworks')) {
        const artworkStore = db.createObjectStore('artworks', { keyPath: 'id' })
        artworkStore.createIndex('by-updated', 'updatedAt')
        artworkStore.createIndex('by-template', 'templateId')
      }

      // drafts 스토어 (임시 저장)
      if (!db.objectStoreNames.contains('drafts')) {
        const draftStore = db.createObjectStore('drafts', { keyPath: 'id' })
        draftStore.createIndex('by-updated', 'updatedAt')
      }

      // settings 스토어
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
    },
  })

  return dbInstance
}

// ============== Artwork Operations ==============

/**
 * 작품 저장
 */
export async function saveArtwork(artwork: LocalArtwork): Promise<void> {
  const db = await getDB()
  await db.put('artworks', {
    ...artwork,
    updatedAt: Date.now(),
  })
}

/**
 * 작품 가져오기
 */
export async function getArtwork(id: string): Promise<LocalArtwork | undefined> {
  const db = await getDB()
  return db.get('artworks', id)
}

/**
 * 모든 작품 목록 가져오기
 */
export async function getAllArtworks(): Promise<LocalArtwork[]> {
  const db = await getDB()
  const artworks = await db.getAllFromIndex('artworks', 'by-updated')
  return artworks.reverse() // 최신순 정렬
}

/**
 * 템플릿별 작품 가져오기
 */
export async function getArtworksByTemplate(templateId: string): Promise<LocalArtwork[]> {
  const db = await getDB()
  return db.getAllFromIndex('artworks', 'by-template', templateId)
}

/**
 * 작품 삭제
 */
export async function deleteArtwork(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('artworks', id)
  // 관련 드래프트도 삭제
  await db.delete('drafts', id)
}

/**
 * 동기화되지 않은 작품 가져오기
 */
export async function getUnsyncedArtworks(): Promise<LocalArtwork[]> {
  const db = await getDB()
  const allArtworks = await db.getAll('artworks')
  return allArtworks.filter((artwork) => !artwork.isSynced)
}

/**
 * 작품 동기화 상태 업데이트
 */
export async function markArtworkSynced(id: string): Promise<void> {
  const db = await getDB()
  const artwork = await db.get('artworks', id)
  if (artwork) {
    await db.put('artworks', {
      ...artwork,
      isSynced: true,
      syncedAt: Date.now(),
    })
  }
}

// ============== Draft Operations ==============

/**
 * 드래프트 저장 (자동 저장용)
 */
export async function saveDraft(draft: ArtworkDraft): Promise<void> {
  const db = await getDB()
  await db.put('drafts', {
    ...draft,
    updatedAt: Date.now(),
  })
}

/**
 * 드래프트 가져오기
 */
export async function getDraft(id: string): Promise<ArtworkDraft | undefined> {
  const db = await getDB()
  return db.get('drafts', id)
}

/**
 * 드래프트 삭제
 */
export async function deleteDraft(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('drafts', id)
}

/**
 * 모든 드래프트 가져오기
 */
export async function getAllDrafts(): Promise<ArtworkDraft[]> {
  const db = await getDB()
  const drafts = await db.getAllFromIndex('drafts', 'by-updated')
  return drafts.reverse()
}

// ============== Settings Operations ==============

/**
 * 설정 저장
 */
export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB()
  await db.put('settings', value, key)
}

/**
 * 설정 가져오기
 */
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  return db.get('settings', key) as Promise<T | undefined>
}

/**
 * 설정 삭제
 */
export async function deleteSetting(key: string): Promise<void> {
  const db = await getDB()
  await db.delete('settings', key)
}

// ============== Utility Functions ==============

/**
 * Canvas를 Data URL로 변환
 */
export function canvasToDataUrl(canvas: HTMLCanvasElement, quality = 0.8): string {
  return canvas.toDataURL('image/webp', quality)
}

/**
 * Data URL을 Blob으로 변환
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new Blob([u8arr], { type: mime })
}

/**
 * 썸네일 생성
 */
export function createThumbnail(
  canvas: HTMLCanvasElement,
  maxSize = 200
): string {
  const thumbnailCanvas = document.createElement('canvas')
  const ctx = thumbnailCanvas.getContext('2d')
  if (!ctx) return ''

  const scale = Math.min(maxSize / canvas.width, maxSize / canvas.height)
  thumbnailCanvas.width = canvas.width * scale
  thumbnailCanvas.height = canvas.height * scale

  ctx.drawImage(canvas, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height)
  return thumbnailCanvas.toDataURL('image/webp', 0.7)
}

/**
 * SVG 템플릿에서 썸네일 생성
 */
export async function createThumbnailFromTemplate(
  template: Template,
  filledRegions: Map<string, FilledRegion>,
  size = 200
): Promise<string> {
  return new Promise((resolve) => {
    // SVG 문자열 생성
    const viewBoxParts = template.templateData.viewBox.split(' ').map(Number)
    const svgWidth = viewBoxParts[2] || 400
    const svgHeight = viewBoxParts[3] || 400

    const paths = template.templateData.regions.map((region) => {
      const filled = filledRegions.get(region.id)
      let fillColor = '#FFFFFF'

      if (filled?.isCorrect) {
        const color = template.colorPalette.find(c => c.number === region.colorNumber)
        fillColor = color?.hex || '#FFFFFF'
      }

      return `<path d="${region.path}" fill="${fillColor}" stroke="#CBD5E1" stroke-width="1"/>`
    }).join('')

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${template.templateData.viewBox}" width="${size}" height="${size}">
        <rect width="100%" height="100%" fill="white"/>
        ${paths}
      </svg>
    `

    // SVG를 이미지로 변환
    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, size, size)
        ctx.drawImage(img, 0, 0, size, size)
        resolve(canvas.toDataURL('image/webp', 0.8))
      } else {
        resolve('')
      }

      URL.revokeObjectURL(url)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve('')
    }

    img.src = url
  })
}

/**
 * 완료된 템플릿 ID 목록 가져오기
 */
export async function getCompletedTemplateIds(): Promise<Set<string>> {
  const db = await getDB()
  const allArtworks = await db.getAll('artworks')
  const completedIds = new Set<string>()

  allArtworks.forEach((artwork) => {
    if (artwork.progress >= 100) {
      completedIds.add(artwork.templateId)
    }
  })

  return completedIds
}

/**
 * 특정 템플릿의 완료된 작품 가져오기
 */
export async function getCompletedArtwork(templateId: string): Promise<LocalArtwork | undefined> {
  const artworks = await getArtworksByTemplate(templateId)
  return artworks.find((a) => a.progress >= 100)
}

/**
 * 데이터베이스 초기화 (개발용)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB()
  await db.clear('artworks')
  await db.clear('drafts')
  await db.clear('settings')
}

/**
 * 저장 공간 사용량 확인
 */
export async function getStorageUsage(): Promise<{
  used: number
  quota: number
  percentage: number
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const used = estimate.usage || 0
    const quota = estimate.quota || 0
    return {
      used,
      quota,
      percentage: quota > 0 ? (used / quota) * 100 : 0,
    }
  }
  return { used: 0, quota: 0, percentage: 0 }
}
