'use client'

import { createClient } from './client'
import { dataUrlToBlob } from '@/lib/db'

/**
 * Supabase Storage 유틸리티
 * 이미지 업로드, 다운로드, URL 생성
 */

const BUCKET_ARTWORKS = 'artworks'
const BUCKET_TEMPLATES = 'templates'
const BUCKET_THUMBNAILS = 'thumbnails'

export interface UploadResult {
  success: boolean
  path?: string
  url?: string
  error?: string
}

/**
 * 작품 이미지 업로드
 */
export async function uploadArtworkImage(
  userId: string,
  artworkId: string,
  canvasDataUrl: string
): Promise<UploadResult> {
  try {
    const supabase = createClient()
    const blob = dataUrlToBlob(canvasDataUrl)
    const fileName = `${userId}/${artworkId}.webp`

    const { data, error } = await supabase.storage
      .from(BUCKET_ARTWORKS)
      .upload(fileName, blob, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_ARTWORKS)
      .getPublicUrl(data.path)

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (err) {
    console.error('Upload exception:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Upload failed',
    }
  }
}

/**
 * 썸네일 업로드
 */
export async function uploadThumbnail(
  userId: string,
  artworkId: string,
  thumbnailDataUrl: string
): Promise<UploadResult> {
  try {
    const supabase = createClient()
    const blob = dataUrlToBlob(thumbnailDataUrl)
    const fileName = `${userId}/${artworkId}_thumb.webp`

    const { data, error } = await supabase.storage
      .from(BUCKET_THUMBNAILS)
      .upload(fileName, blob, {
        contentType: 'image/webp',
        upsert: true,
      })

    if (error) {
      console.error('Thumbnail upload error:', error)
      return { success: false, error: error.message }
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_THUMBNAILS)
      .getPublicUrl(data.path)

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (err) {
    console.error('Thumbnail upload exception:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Thumbnail upload failed',
    }
  }
}

/**
 * 작품 이미지 삭제
 */
export async function deleteArtworkImage(
  userId: string,
  artworkId: string
): Promise<boolean> {
  try {
    const supabase = createClient()
    const fileName = `${userId}/${artworkId}.webp`

    const { error } = await supabase.storage
      .from(BUCKET_ARTWORKS)
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Delete exception:', err)
    return false
  }
}

/**
 * 템플릿 이미지 URL 가져오기
 */
export function getTemplateImageUrl(templatePath: string): string {
  const supabase = createClient()
  const { data } = supabase.storage
    .from(BUCKET_TEMPLATES)
    .getPublicUrl(templatePath)

  return data.publicUrl
}

/**
 * 작품 이미지 URL 가져오기
 */
export function getArtworkImageUrl(userId: string, artworkId: string): string {
  const supabase = createClient()
  const fileName = `${userId}/${artworkId}.webp`
  const { data } = supabase.storage
    .from(BUCKET_ARTWORKS)
    .getPublicUrl(fileName)

  return data.publicUrl
}

/**
 * 썸네일 URL 가져오기
 */
export function getThumbnailUrl(userId: string, artworkId: string): string {
  const supabase = createClient()
  const fileName = `${userId}/${artworkId}_thumb.webp`
  const { data } = supabase.storage
    .from(BUCKET_THUMBNAILS)
    .getPublicUrl(fileName)

  return data.publicUrl
}

/**
 * Signed URL 생성 (임시 접근용)
 */
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string | null> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error) {
      console.error('Signed URL error:', error)
      return null
    }

    return data.signedUrl
  } catch (err) {
    console.error('Signed URL exception:', err)
    return null
  }
}

/**
 * 사용자 저장 공간 사용량 계산
 */
export async function getUserStorageUsage(userId: string): Promise<{
  artworksCount: number
  totalSize: number
}> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.storage
      .from(BUCKET_ARTWORKS)
      .list(userId)

    if (error || !data) {
      return { artworksCount: 0, totalSize: 0 }
    }

    const totalSize = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0)

    return {
      artworksCount: data.length,
      totalSize,
    }
  } catch (err) {
    console.error('Storage usage error:', err)
    return { artworksCount: 0, totalSize: 0 }
  }
}
