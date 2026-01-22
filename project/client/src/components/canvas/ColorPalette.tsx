'use client'

import { Check, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useColorStore } from '@/store/useColorStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { PaletteColor } from '@/types'

interface ColorPaletteProps {
  compact?: boolean
}

export function ColorPalette({ compact = false }: ColorPaletteProps) {
  const {
    palette,
    selectedColor,
    recentColors,
    favoriteColors,
    setSelectedColor,
    toggleFavorite,
  } = useColorStore()
  const { showColorNames } = useSettingsStore()

  const handleColorSelect = (color: PaletteColor) => {
    setSelectedColor(color)
  }

  const isFavorite = (color: PaletteColor) =>
    favoriteColors.some((c) => c.id === color.id)

  return (
    <div className="space-y-4">
      {/* 선택된 색상 표시 */}
      <div className="flex items-center gap-3">
        <div
          className="h-12 w-12 rounded-lg border-2 border-border shadow-sm"
          style={{ backgroundColor: selectedColor.hex }}
        />
        <div>
          <p className="font-medium">{selectedColor.nameKo}</p>
          <p className="text-sm text-muted-foreground">{selectedColor.hex}</p>
        </div>
      </div>

      {/* 최근 사용 색상 */}
      {recentColors.length > 0 && !compact && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            최근 사용
          </p>
          <div className="flex flex-wrap gap-2">
            {recentColors.map((color) => (
              <ColorButton
                key={`recent-${color.id}`}
                color={color}
                isSelected={selectedColor.id === color.id}
                showName={false}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 즐겨찾기 색상 */}
      {favoriteColors.length > 0 && !compact && (
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            즐겨찾기
          </p>
          <div className="flex flex-wrap gap-2">
            {favoriteColors.map((color) => (
              <ColorButton
                key={`fav-${color.id}`}
                color={color}
                isSelected={selectedColor.id === color.id}
                showName={showColorNames}
                onClick={() => handleColorSelect(color)}
                onLongPress={() => toggleFavorite(color)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 기본 팔레트 */}
      <div>
        {!compact && (
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            색상 팔레트
          </p>
        )}
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
          {palette.map((color) => (
            <ColorButton
              key={color.id}
              color={color}
              isSelected={selectedColor.id === color.id}
              isFavorite={isFavorite(color)}
              showName={showColorNames && !compact}
              onClick={() => handleColorSelect(color)}
              onLongPress={() => toggleFavorite(color)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ColorButtonProps {
  color: PaletteColor
  isSelected: boolean
  isFavorite?: boolean
  showName?: boolean
  onClick: () => void
  onLongPress?: () => void
}

function ColorButton({
  color,
  isSelected,
  isFavorite = false,
  showName = false,
  onClick,
  onLongPress,
}: ColorButtonProps) {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onLongPress?.()
  }

  const isLight = isLightColor(color.hex)

  return (
    <button
      onClick={onClick}
      onContextMenu={handleContextMenu}
      className={cn(
        'group relative flex flex-col items-center gap-1 touch-target-lg transition-transform active:scale-95',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
      title={`${color.nameKo} (${color.hex})`}
      aria-label={`${color.nameKo} 색상 선택`}
    >
      <div
        className={cn(
          'h-10 w-10 rounded-lg border shadow-sm transition-shadow hover:shadow-md',
          isLight ? 'border-border' : 'border-transparent'
        )}
        style={{ backgroundColor: color.hex }}
      >
        {isSelected && (
          <Check
            className={cn(
              'absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2',
              isLight ? 'text-foreground' : 'text-white'
            )}
          />
        )}
        {isFavorite && (
          <Heart
            className={cn(
              'absolute -right-1 -top-1 h-4 w-4 fill-red-500 text-red-500'
            )}
          />
        )}
      </div>
      {showName && (
        <span className="text-xs text-muted-foreground">{color.nameKo}</span>
      )}
    </button>
  )
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}
