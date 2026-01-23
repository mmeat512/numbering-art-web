'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ImageIcon, Clock, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getAllArtworks, deleteArtwork, LocalArtwork } from '@/lib/db/indexedDB'

export default function GalleryPage() {
  const router = useRouter()
  const [artworks, setArtworks] = useState<LocalArtwork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<LocalArtwork | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 작품 목록 로드
  const loadArtworks = useCallback(async () => {
    try {
      const data = await getAllArtworks()
      setArtworks(data)
    } catch (error) {
      console.error('Failed to load artworks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadArtworks()
  }, [loadArtworks])

  // 작품 삭제
  const handleDelete = async () => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await deleteArtwork(deleteTarget.id)
      setArtworks((prev) => prev.filter((a) => a.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (error) {
      console.error('Failed to delete artwork:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  // 작품 클릭 - 색칠 페이지로 이동
  const handleArtworkClick = (artwork: LocalArtwork) => {
    router.push(`/coloring/${artwork.templateId}?artworkId=${artwork.id}`)
  }

  // 날짜 포맷
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="container flex min-h-[50vh] items-center justify-center px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">작품을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 빈 상태
  if (artworks.length === 0) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center gap-6 px-4 py-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Palette className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">아직 작품이 없어요</h2>
          <p className="text-muted-foreground">
            템플릿을 선택해서 첫 작품을 만들어보세요!
          </p>
        </div>
        <Button
          size="lg"
          className="touch-target text-lg"
          onClick={() => router.push('/templates')}
        >
          템플릿 둘러보기
        </Button>
      </div>
    )
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 작품</h1>
        <p className="text-muted-foreground">{artworks.length}개</p>
      </div>

      {/* 작품 그리드 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
          >
            {/* 썸네일 */}
            <button
              onClick={() => handleArtworkClick(artwork)}
              className="aspect-square w-full overflow-hidden bg-muted"
            >
              {artwork.thumbnailDataUrl ? (
                <img
                  src={artwork.thumbnailDataUrl}
                  alt={artwork.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
              )}
            </button>

            {/* 진행률 표시 */}
            {artwork.progress > 0 && (
              <div className="absolute left-2 top-2">
                <div
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    artwork.progress >= 100
                      ? 'bg-green-500/90 text-white'
                      : 'bg-black/60 text-white'
                  )}
                >
                  {artwork.progress >= 100 ? '완성!' : `${Math.round(artwork.progress)}%`}
                </div>
              </div>
            )}

            {/* 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setDeleteTarget(artwork)
              }}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
              aria-label="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {/* 정보 */}
            <div className="p-3">
              <h3 className="truncate font-medium">{artwork.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(artwork.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>작품 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.title}&quot; 작품을 삭제하시겠어요?
              <br />
              삭제된 작품은 복구할 수 없어요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 touch-target"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1 touch-target"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
