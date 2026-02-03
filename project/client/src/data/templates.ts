import { Template, Category } from '@/types'

// 카테고리 목록
export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', nameKo: '전체', icon: '🎨', sortOrder: 0 },
  { id: 'animals', name: 'Animals', nameKo: '동물', icon: '🐱', sortOrder: 1 },
  { id: 'flowers', name: 'Flowers', nameKo: '꽃', icon: '🌸', sortOrder: 2 },
  { id: 'landscape', name: 'Landscape', nameKo: '풍경', icon: '🏔️', sortOrder: 3 },
  { id: 'pattern', name: 'Pattern', nameKo: '패턴', icon: '🔷', sortOrder: 4 },
  { id: 'food', name: 'Food', nameKo: '음식', icon: '🍎', sortOrder: 5 },
]

// 샘플 템플릿 1: 간단한 꽃 (쉬움)
export const TEMPLATE_FLOWER: Template = {
  id: 'flower-simple',
  title: '귀여운 꽃',
  categoryId: 'flowers',
  difficulty: 'easy',
  colorCount: 5,
  regionCount: 13,
  estimatedTime: 5,
  thumbnailUrl: '',
  usageCount: 150,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#E53935', name: '빨강', totalRegions: 5 },
    { number: 2, hex: '#FFEB3B', name: '노랑', totalRegions: 1 },
    { number: 3, hex: '#4CAF50', name: '초록', totalRegions: 3 },
    { number: 4, hex: '#8D6E63', name: '갈색', totalRegions: 1 },
    { number: 5, hex: '#81D4FA', name: '하늘', totalRegions: 3 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 꽃잎 5개 (빨강)
      { id: 'petal-1', colorNumber: 1, path: 'M150,80 Q180,50 150,20 Q120,50 150,80 Z', labelX: 150, labelY: 50 },
      { id: 'petal-2', colorNumber: 1, path: 'M180,110 Q220,90 210,50 Q180,70 180,110 Z', labelX: 195, labelY: 80 },
      { id: 'petal-3', colorNumber: 1, path: 'M170,150 Q210,160 220,120 Q185,115 170,150 Z', labelX: 195, labelY: 135 },
      { id: 'petal-4', colorNumber: 1, path: 'M130,150 Q90,160 80,120 Q115,115 130,150 Z', labelX: 105, labelY: 135 },
      { id: 'petal-5', colorNumber: 1, path: 'M120,110 Q80,90 90,50 Q120,70 120,110 Z', labelX: 105, labelY: 80 },
      // 꽃 중심 (노랑)
      { id: 'center', colorNumber: 2, path: 'M150,130 m-25,0 a25,25 0 1,0 50,0 a25,25 0 1,0 -50,0', labelX: 150, labelY: 130 },
      // 줄기 (초록)
      { id: 'stem', colorNumber: 3, path: 'M145,155 L145,250 L155,250 L155,155 Z', labelX: 150, labelY: 200 },
      // 잎 2개 (초록)
      { id: 'leaf-1', colorNumber: 3, path: 'M145,200 Q100,180 90,210 Q120,220 145,200 Z', labelX: 115, labelY: 205 },
      { id: 'leaf-2', colorNumber: 3, path: 'M155,220 Q200,200 210,230 Q180,240 155,220 Z', labelX: 185, labelY: 220 },
      // 화분 (갈색)
      { id: 'pot', colorNumber: 4, path: 'M110,250 L190,250 L180,290 L120,290 Z', labelX: 150, labelY: 270 },
      // 배경 구름 3개 (하늘)
      { id: 'cloud-1', colorNumber: 5, path: 'M40,40 Q30,20 50,20 Q70,10 80,30 Q90,20 100,35 Q90,50 70,50 Q50,55 40,40 Z', labelX: 65, labelY: 35 },
      { id: 'cloud-2', colorNumber: 5, path: 'M200,30 Q190,15 210,15 Q225,5 235,20 Q250,10 255,30 Q245,45 225,45 Q205,50 200,30 Z', labelX: 225, labelY: 30 },
      { id: 'cloud-3', colorNumber: 5, path: 'M230,80 Q220,65 240,65 Q255,55 265,70 Q275,60 280,75 Q270,90 250,90 Q230,95 230,80 Z', labelX: 250, labelY: 77 },
    ],
  },
}

// 샘플 템플릿 2: 귀여운 고양이 (보통)
export const TEMPLATE_CAT: Template = {
  id: 'cat-simple',
  title: '졸린 고양이',
  categoryId: 'animals',
  difficulty: 'medium',
  colorCount: 6,
  regionCount: 15,
  estimatedTime: 10,
  thumbnailUrl: '',
  usageCount: 230,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#FF9800', name: '주황', totalRegions: 4 },
    { number: 2, hex: '#FFCC80', name: '살구', totalRegions: 3 },
    { number: 3, hex: '#F48FB1', name: '분홍', totalRegions: 3 },
    { number: 4, hex: '#000000', name: '검정', totalRegions: 3 },
    { number: 5, hex: '#FFFFFF', name: '흰색', totalRegions: 1 },
    { number: 6, hex: '#81D4FA', name: '하늘', totalRegions: 1 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 얼굴 (주황)
      { id: 'face', colorNumber: 1, path: 'M150,200 Q80,200 80,140 Q80,80 150,80 Q220,80 220,140 Q220,200 150,200 Z', labelX: 150, labelY: 140 },
      // 왼쪽 귀 (주황)
      { id: 'ear-left', colorNumber: 1, path: 'M90,90 L70,40 L110,70 Z', labelX: 90, labelY: 65 },
      // 오른쪽 귀 (주황)
      { id: 'ear-right', colorNumber: 1, path: 'M210,90 L230,40 L190,70 Z', labelX: 210, labelY: 65 },
      // 몸통 (주황)
      { id: 'body', colorNumber: 1, path: 'M100,200 Q80,250 100,280 L200,280 Q220,250 200,200 Z', labelX: 150, labelY: 245 },
      // 배 (살구)
      { id: 'belly', colorNumber: 2, path: 'M130,210 Q120,250 140,270 L160,270 Q180,250 170,210 Z', labelX: 150, labelY: 240 },
      // 왼쪽 볼 (살구)
      { id: 'cheek-left', colorNumber: 2, path: 'M100,150 Q85,145 85,160 Q85,175 100,170 Q110,165 100,150 Z', labelX: 95, labelY: 160 },
      // 오른쪽 볼 (살구)
      { id: 'cheek-right', colorNumber: 2, path: 'M200,150 Q215,145 215,160 Q215,175 200,170 Q190,165 200,150 Z', labelX: 205, labelY: 160 },
      // 코 (분홍)
      { id: 'nose', colorNumber: 3, path: 'M150,155 L143,168 L157,168 Z', labelX: 150, labelY: 162 },
      // 왼쪽 귀 안쪽 (분홍)
      { id: 'ear-inner-left', colorNumber: 3, path: 'M88,82 L78,52 L102,72 Z', labelX: 88, labelY: 68 },
      // 오른쪽 귀 안쪽 (분홍)
      { id: 'ear-inner-right', colorNumber: 3, path: 'M212,82 L222,52 L198,72 Z', labelX: 212, labelY: 68 },
      // 왼쪽 눈 (검정)
      { id: 'eye-left', colorNumber: 4, path: 'M120,130 Q115,120 125,120 Q135,120 130,130 Q125,135 120,130 Z', labelX: 125, labelY: 127 },
      // 오른쪽 눈 (검정)
      { id: 'eye-right', colorNumber: 4, path: 'M170,130 Q175,120 185,120 Q180,125 180,130 Q175,135 170,130 Z', labelX: 175, labelY: 127 },
      // 수염 자리 (검정)
      { id: 'whiskers', colorNumber: 4, path: 'M130,175 L70,165 M130,180 L75,185 M170,175 L230,165 M170,180 L225,185', labelX: 150, labelY: 178 },
      // 꼬리 (흰색)
      { id: 'tail', colorNumber: 5, path: 'M220,260 Q260,240 250,200 Q245,210 230,230 Q220,245 220,260 Z', labelX: 240, labelY: 230 },
      // 배경 (하늘)
      { id: 'background', colorNumber: 6, path: 'M10,10 L290,10 L290,290 L10,290 Z M150,200 Q80,200 80,140 Q80,80 150,80 Q220,80 220,140 Q220,200 150,200 M70,40 L110,70 L90,90 Z M230,40 L190,70 L210,90 Z M100,200 Q80,250 100,280 L200,280 Q220,250 200,200 Z', labelX: 40, labelY: 40 },
    ],
  },
}

// 샘플 템플릿 3: 무지개 하트 (쉬움)
export const TEMPLATE_HEART: Template = {
  id: 'rainbow-heart',
  title: '무지개 하트',
  categoryId: 'pattern',
  difficulty: 'easy',
  colorCount: 7,
  regionCount: 7,
  estimatedTime: 3,
  thumbnailUrl: '',
  usageCount: 320,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#E53935', name: '빨강', totalRegions: 1 },
    { number: 2, hex: '#FF9800', name: '주황', totalRegions: 1 },
    { number: 3, hex: '#FFEB3B', name: '노랑', totalRegions: 1 },
    { number: 4, hex: '#4CAF50', name: '초록', totalRegions: 1 },
    { number: 5, hex: '#2196F3', name: '파랑', totalRegions: 1 },
    { number: 6, hex: '#3F51B5', name: '남색', totalRegions: 1 },
    { number: 7, hex: '#9C27B0', name: '보라', totalRegions: 1 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 가장 바깥 하트 (빨강)
      { id: 'heart-1', colorNumber: 1, path: 'M150,270 C50,180 20,100 80,60 C120,35 150,60 150,80 C150,60 180,35 220,60 C280,100 250,180 150,270 Z M150,240 C70,165 50,105 95,75 C125,55 150,75 150,90 C150,75 175,55 205,75 C250,105 230,165 150,240 Z', labelX: 60, labelY: 90 },
      // 하트 2 (주황)
      { id: 'heart-2', colorNumber: 2, path: 'M150,240 C70,165 50,105 95,75 C125,55 150,75 150,90 C150,75 175,55 205,75 C250,105 230,165 150,240 Z M150,210 C85,150 70,105 105,85 C130,70 150,85 150,95 C150,85 170,70 195,85 C230,105 215,150 150,210 Z', labelX: 80, labelY: 105 },
      // 하트 3 (노랑)
      { id: 'heart-3', colorNumber: 3, path: 'M150,210 C85,150 70,105 105,85 C130,70 150,85 150,95 C150,85 170,70 195,85 C230,105 215,150 150,210 Z M150,180 C100,135 90,105 115,90 C135,80 150,90 150,100 C150,90 165,80 185,90 C210,105 200,135 150,180 Z', labelX: 100, labelY: 115 },
      // 하트 4 (초록)
      { id: 'heart-4', colorNumber: 4, path: 'M150,180 C100,135 90,105 115,90 C135,80 150,90 150,100 C150,90 165,80 185,90 C210,105 200,135 150,180 Z M150,155 C115,125 105,105 125,95 C140,88 150,95 150,102 C150,95 160,88 175,95 C195,105 185,125 150,155 Z', labelX: 115, labelY: 120 },
      // 하트 5 (파랑)
      { id: 'heart-5', colorNumber: 5, path: 'M150,155 C115,125 105,105 125,95 C140,88 150,95 150,102 C150,95 160,88 175,95 C195,105 185,125 150,155 Z M150,135 C125,115 120,102 135,95 C143,91 150,96 150,100 C150,96 157,91 165,95 C180,102 175,115 150,135 Z', labelX: 130, labelY: 115 },
      // 하트 6 (남색)
      { id: 'heart-6', colorNumber: 6, path: 'M150,135 C125,115 120,102 135,95 C143,91 150,96 150,100 C150,96 157,91 165,95 C180,102 175,115 150,135 Z M150,118 C135,108 132,100 142,96 C147,94 150,97 150,99 C150,97 153,94 158,96 C168,100 165,108 150,118 Z', labelX: 140, labelY: 108 },
      // 가장 안쪽 하트 (보라)
      { id: 'heart-7', colorNumber: 7, path: 'M150,118 C135,108 132,100 142,96 C147,94 150,97 150,99 C150,97 153,94 158,96 C168,100 165,108 150,118 Z', labelX: 150, labelY: 105 },
    ],
  },
}

// 샘플 템플릿 4: 사과 (쉬움 - 시니어 추천)
export const TEMPLATE_APPLE: Template = {
  id: 'apple-simple',
  title: '맛있는 사과',
  categoryId: 'food',
  difficulty: 'easy',
  colorCount: 4,
  regionCount: 6,
  estimatedTime: 3,
  thumbnailUrl: '',
  usageCount: 450,
  createdAt: '2026-01-23',
  colorPalette: [
    { number: 1, hex: '#E53935', name: '빨강', totalRegions: 1 },
    { number: 2, hex: '#4CAF50', name: '초록', totalRegions: 2 },
    { number: 3, hex: '#8D6E63', name: '갈색', totalRegions: 1 },
    { number: 4, hex: '#FFEB3B', name: '노랑', totalRegions: 2 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 사과 몸통 (빨강)
      { id: 'apple-body', colorNumber: 1, path: 'M150,260 C80,260 40,200 50,140 C55,100 90,70 150,70 C210,70 245,100 250,140 C260,200 220,260 150,260 Z', labelX: 150, labelY: 170 },
      // 잎 (초록)
      { id: 'leaf', colorNumber: 2, path: 'M155,70 Q180,40 210,50 Q190,70 170,65 Q160,68 155,70 Z', labelX: 180, labelY: 55 },
      // 줄기 (갈색)
      { id: 'stem', colorNumber: 3, path: 'M145,70 L145,40 Q150,35 155,40 L155,70 Z', labelX: 150, labelY: 55 },
      // 하이라이트 1 (노랑 - 반짝임)
      { id: 'highlight-1', colorNumber: 4, path: 'M100,120 Q90,110 95,100 Q105,95 110,105 Q115,115 100,120 Z', labelX: 102, labelY: 110 },
      // 하이라이트 2 (노랑 - 반짝임)
      { id: 'highlight-2', colorNumber: 4, path: 'M85,145 Q80,140 82,135 Q88,132 92,138 Q95,145 85,145 Z', labelX: 87, labelY: 140 },
      // 또 다른 잎 (초록)
      { id: 'leaf-2', colorNumber: 2, path: 'M145,68 Q130,50 100,55 Q115,70 135,67 Q142,68 145,68 Z', labelX: 122, labelY: 60 },
    ],
  },
}

// 샘플 템플릿 5: 꽃 정원 패턴 (어려움)
export const TEMPLATE_FLORAL_GARDEN: Template = {
  id: 'floral-garden',
  title: '꽃 정원',
  categoryId: 'flowers',
  difficulty: 'hard',
  colorCount: 10,
  regionCount: 45,
  estimatedTime: 30,
  thumbnailUrl: '/templates/floral-garden.png',
  usageCount: 0,
  createdAt: '2026-01-28',
  colorPalette: [
    { number: 1, hex: '#E57373', name: '연한 빨강', totalRegions: 6 }, // 양귀비 꽃잎
    { number: 2, hex: '#C62828', name: '진한 빨강', totalRegions: 3 }, // 양귀비 중심
    { number: 3, hex: '#FFFFFF', name: '흰색', totalRegions: 8 }, // 데이지 꽃잎
    { number: 4, hex: '#FDD835', name: '노랑', totalRegions: 4 }, // 데이지 중심
    { number: 5, hex: '#9575CD', name: '연보라', totalRegions: 4 }, // 엉겅퀴 꽃
    { number: 6, hex: '#4A148C', name: '진보라', totalRegions: 2 }, // 엉겅퀴 받침
    { number: 7, hex: '#66BB6A', name: '연두', totalRegions: 8 }, // 잎사귀
    { number: 8, hex: '#2E7D32', name: '진초록', totalRegions: 6 }, // 줄기/덩굴
    { number: 9, hex: '#A5D6A7', name: '민트', totalRegions: 2 }, // 고사리
    { number: 10, hex: '#FFECB3', name: '크림', totalRegions: 2 }, // 배경 장식
  ],
  templateData: {
    viewBox: '0 0 400 500',
    regions: [
      // 양귀비 꽃 1 (왼쪽 상단)
      { id: 'poppy1-petal1', colorNumber: 1, path: 'M80,120 Q60,80 80,50 Q100,80 80,120 Z', labelX: 80, labelY: 85 },
      { id: 'poppy1-petal2', colorNumber: 1, path: 'M80,120 Q40,100 30,70 Q60,90 80,120 Z', labelX: 55, labelY: 95 },
      { id: 'poppy1-petal3', colorNumber: 1, path: 'M80,120 Q120,100 130,70 Q100,90 80,120 Z', labelX: 105, labelY: 95 },
      { id: 'poppy1-center', colorNumber: 2, path: 'M80,120 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0', labelX: 80, labelY: 120 },

      // 양귀비 꽃 2 (중앙)
      { id: 'poppy2-petal1', colorNumber: 1, path: 'M200,200 Q175,150 200,110 Q225,150 200,200 Z', labelX: 200, labelY: 155 },
      { id: 'poppy2-petal2', colorNumber: 1, path: 'M200,200 Q150,175 140,140 Q170,165 200,200 Z', labelX: 165, labelY: 170 },
      { id: 'poppy2-petal3', colorNumber: 1, path: 'M200,200 Q250,175 260,140 Q230,165 200,200 Z', labelX: 235, labelY: 170 },
      { id: 'poppy2-center', colorNumber: 2, path: 'M200,200 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', labelX: 200, labelY: 200 },

      // 양귀비 꽃 3 (오른쪽 하단)
      { id: 'poppy3-petal1', colorNumber: 1, path: 'M320,380 Q295,335 320,300 Q345,335 320,380 Z', labelX: 320, labelY: 340 },
      { id: 'poppy3-center', colorNumber: 2, path: 'M320,380 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0', labelX: 320, labelY: 380 },

      // 데이지 꽃 1 (오른쪽 상단)
      { id: 'daisy1-petal1', colorNumber: 3, path: 'M320,80 Q330,50 320,30 Q310,50 320,80 Z', labelX: 320, labelY: 55 },
      { id: 'daisy1-petal2', colorNumber: 3, path: 'M320,80 Q350,70 360,50 Q340,65 320,80 Z', labelX: 340, labelY: 65 },
      { id: 'daisy1-petal3', colorNumber: 3, path: 'M320,80 Q290,70 280,50 Q300,65 320,80 Z', labelX: 300, labelY: 65 },
      { id: 'daisy1-petal4', colorNumber: 3, path: 'M320,80 Q350,90 370,80 Q350,85 320,80 Z', labelX: 345, labelY: 82 },
      { id: 'daisy1-petal5', colorNumber: 3, path: 'M320,80 Q290,90 270,80 Q290,85 320,80 Z', labelX: 295, labelY: 82 },
      { id: 'daisy1-center', colorNumber: 4, path: 'M320,80 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', labelX: 320, labelY: 80 },

      // 데이지 꽃 2 (왼쪽 중앙)
      { id: 'daisy2-petal1', colorNumber: 3, path: 'M70,280 Q80,250 70,230 Q60,250 70,280 Z', labelX: 70, labelY: 255 },
      { id: 'daisy2-petal2', colorNumber: 3, path: 'M70,280 Q100,270 110,250 Q90,265 70,280 Z', labelX: 90, labelY: 265 },
      { id: 'daisy2-petal3', colorNumber: 3, path: 'M70,280 Q40,270 30,250 Q50,265 70,280 Z', labelX: 50, labelY: 265 },
      { id: 'daisy2-center', colorNumber: 4, path: 'M70,280 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', labelX: 70, labelY: 280 },

      // 데이지 꽃 3 (하단 중앙)
      { id: 'daisy3-petal1', colorNumber: 3, path: 'M180,430 Q190,400 180,380 Q170,400 180,430 Z', labelX: 180, labelY: 405 },
      { id: 'daisy3-petal2', colorNumber: 3, path: 'M180,430 Q210,420 220,400 Q200,415 180,430 Z', labelX: 200, labelY: 415 },
      { id: 'daisy3-petal3', colorNumber: 3, path: 'M180,430 Q150,420 140,400 Q160,415 180,430 Z', labelX: 160, labelY: 415 },
      { id: 'daisy3-center', colorNumber: 4, path: 'M180,430 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', labelX: 180, labelY: 430 },

      // 작은 데이지 (오른쪽 중앙)
      { id: 'daisy4-center', colorNumber: 4, path: 'M350,250 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 350, labelY: 250 },

      // 엉겅퀴 꽃 1 (상단 중앙)
      { id: 'thistle1-flower', colorNumber: 5, path: 'M160,60 Q145,30 160,10 Q175,30 160,60 Q180,40 170,20 Q150,40 160,60 Z', labelX: 160, labelY: 35 },
      { id: 'thistle1-base', colorNumber: 6, path: 'M160,60 Q150,70 155,80 Q165,80 170,70 Q160,60 160,60 Z', labelX: 160, labelY: 70 },

      // 엉겅퀴 꽃 2 (오른쪽)
      { id: 'thistle2-flower', colorNumber: 5, path: 'M370,150 Q355,120 370,100 Q385,120 370,150 Q390,130 380,110 Q360,130 370,150 Z', labelX: 370, labelY: 125 },
      { id: 'thistle2-base', colorNumber: 6, path: 'M370,150 Q360,160 365,170 Q375,170 380,160 Q370,150 370,150 Z', labelX: 370, labelY: 160 },

      // 엉겅퀴 꽃 3 (왼쪽 하단)
      { id: 'thistle3-flower', colorNumber: 5, path: 'M50,400 Q35,370 50,350 Q65,370 50,400 Z', labelX: 50, labelY: 375 },

      // 엉겅퀴 꽃 4 (상단 오른쪽)
      { id: 'thistle4-flower', colorNumber: 5, path: 'M280,30 Q270,15 280,5 Q290,15 280,30 Z', labelX: 280, labelY: 17 },

      // 잎사귀들
      { id: 'leaf1', colorNumber: 7, path: 'M100,180 Q70,160 60,200 Q80,190 100,180 Z', labelX: 80, labelY: 180 },
      { id: 'leaf2', colorNumber: 7, path: 'M150,280 Q130,260 110,290 Q130,285 150,280 Z', labelX: 130, labelY: 275 },
      { id: 'leaf3', colorNumber: 7, path: 'M250,300 Q280,280 290,320 Q270,310 250,300 Z', labelX: 270, labelY: 300 },
      { id: 'leaf4', colorNumber: 7, path: 'M300,200 Q330,180 340,220 Q320,210 300,200 Z', labelX: 320, labelY: 200 },
      { id: 'leaf5', colorNumber: 7, path: 'M120,380 Q90,360 80,400 Q100,390 120,380 Z', labelX: 100, labelY: 380 },
      { id: 'leaf6', colorNumber: 7, path: 'M240,100 Q260,80 280,110 Q260,105 240,100 Z', labelX: 260, labelY: 95 },
      { id: 'leaf7', colorNumber: 7, path: 'M30,150 Q10,130 20,170 Q25,160 30,150 Z', labelX: 20, labelY: 150 },
      { id: 'leaf8', colorNumber: 7, path: 'M380,320 Q360,300 350,340 Q365,330 380,320 Z', labelX: 365, labelY: 320 },

      // 줄기/덩굴
      { id: 'stem1', colorNumber: 8, path: 'M80,130 Q90,180 70,230 Q65,180 80,130 Z', labelX: 78, labelY: 180 },
      { id: 'stem2', colorNumber: 8, path: 'M200,220 Q180,280 150,320 Q175,280 200,220 Z', labelX: 175, labelY: 270 },
      { id: 'stem3', colorNumber: 8, path: 'M320,100 Q340,160 350,220 Q335,160 320,100 Z', labelX: 335, labelY: 160 },
      { id: 'vine1', colorNumber: 8, path: 'M50,450 Q100,430 150,450 Q200,470 250,450 Q200,465 150,445 Q100,425 50,450 Z', labelX: 150, labelY: 450 },
      { id: 'vine2', colorNumber: 8, path: 'M250,450 Q300,430 350,450 Q300,445 250,450 Z', labelX: 300, labelY: 445 },
      { id: 'stem4', colorNumber: 8, path: 'M160,80 Q155,120 160,160 Q165,120 160,80 Z', labelX: 160, labelY: 120 },

      // 고사리 잎
      { id: 'fern1', colorNumber: 9, path: 'M30,350 Q20,320 40,300 Q35,325 30,350 Q50,330 60,310 Q45,335 30,350 Z', labelX: 40, labelY: 325 },
      { id: 'fern2', colorNumber: 9, path: 'M370,420 Q380,390 360,370 Q365,395 370,420 Q350,400 340,380 Q355,405 370,420 Z', labelX: 360, labelY: 395 },

      // 배경 장식 소용돌이
      { id: 'swirl1', colorNumber: 10, path: 'M20,50 Q40,30 60,50 Q40,60 20,50 Z', labelX: 40, labelY: 47 },
      { id: 'swirl2', colorNumber: 10, path: 'M380,480 Q360,460 380,440 Q390,460 380,480 Z', labelX: 380, labelY: 460 },
    ],
  },
}

// 샘플 템플릿 6: 초고난이도 기하학적 만다라 (성인용)
export const TEMPLATE_GEOMETRIC_MANDALA: Template = {
  id: 'geometric-mandala-extreme',
  title: '기하학적 만다라',
  categoryId: 'pattern',
  difficulty: 'hard',
  colorCount: 16,
  regionCount: 120,
  estimatedTime: 90,
  thumbnailUrl: '',
  usageCount: 0,
  createdAt: '2026-02-03',
  colorPalette: [
    { number: 1, hex: '#1A237E', name: '진남색', totalRegions: 8 },
    { number: 2, hex: '#311B92', name: '딥퍼플', totalRegions: 8 },
    { number: 3, hex: '#4A148C', name: '딥바이올렛', totalRegions: 8 },
    { number: 4, hex: '#880E4F', name: '버건디', totalRegions: 8 },
    { number: 5, hex: '#B71C1C', name: '딥레드', totalRegions: 8 },
    { number: 6, hex: '#E65100', name: '딥오렌지', totalRegions: 8 },
    { number: 7, hex: '#FF6F00', name: '앰버', totalRegions: 8 },
    { number: 8, hex: '#F9A825', name: '골드', totalRegions: 8 },
    { number: 9, hex: '#9E9D24', name: '올리브', totalRegions: 8 },
    { number: 10, hex: '#33691E', name: '딥그린', totalRegions: 8 },
    { number: 11, hex: '#1B5E20', name: '포레스트', totalRegions: 8 },
    { number: 12, hex: '#004D40', name: '틸', totalRegions: 8 },
    { number: 13, hex: '#006064', name: '다크시안', totalRegions: 8 },
    { number: 14, hex: '#01579B', name: '딥블루', totalRegions: 8 },
    { number: 15, hex: '#263238', name: '차콜', totalRegions: 8 },
    { number: 16, hex: '#ECEFF1', name: '실버', totalRegions: 8 },
  ],
  templateData: {
    viewBox: '0 0 500 500',
    regions: [
      // 중심 핵심 (Center Core) - 16각형 구조
      { id: 'core-1', colorNumber: 16, path: 'M250,230 L260,240 L250,250 L240,240 Z', labelX: 250, labelY: 240 },

      // 내부 첫 번째 레이어 (Inner Layer 1) - 16개 삼각형
      { id: 'inner1-1', colorNumber: 8, path: 'M250,230 L270,210 L260,240 Z', labelX: 260, labelY: 227 },
      { id: 'inner1-2', colorNumber: 7, path: 'M260,240 L270,210 L290,230 Z', labelX: 273, labelY: 227 },
      { id: 'inner1-3', colorNumber: 8, path: 'M260,240 L290,230 L270,250 Z', labelX: 273, labelY: 240 },
      { id: 'inner1-4', colorNumber: 7, path: 'M270,250 L290,230 L290,270 Z', labelX: 283, labelY: 250 },
      { id: 'inner1-5', colorNumber: 8, path: 'M260,260 L270,250 L290,270 Z', labelX: 273, labelY: 260 },
      { id: 'inner1-6', colorNumber: 7, path: 'M250,270 L260,260 L270,290 Z', labelX: 260, labelY: 273 },
      { id: 'inner1-7', colorNumber: 8, path: 'M250,270 L270,290 L250,290 Z', labelX: 257, labelY: 283 },
      { id: 'inner1-8', colorNumber: 7, path: 'M240,260 L250,270 L230,290 Z', labelX: 240, labelY: 273 },
      { id: 'inner1-9', colorNumber: 8, path: 'M240,260 L230,290 L210,270 Z', labelX: 227, labelY: 273 },
      { id: 'inner1-10', colorNumber: 7, path: 'M230,250 L240,260 L210,270 Z', labelX: 227, labelY: 260 },
      { id: 'inner1-11', colorNumber: 8, path: 'M230,250 L210,270 L210,230 Z', labelX: 217, labelY: 250 },
      { id: 'inner1-12', colorNumber: 7, path: 'M240,240 L230,250 L210,230 Z', labelX: 227, labelY: 240 },
      { id: 'inner1-13', colorNumber: 8, path: 'M240,240 L210,230 L230,210 Z', labelX: 227, labelY: 227 },
      { id: 'inner1-14', colorNumber: 7, path: 'M250,230 L240,240 L230,210 Z', labelX: 240, labelY: 227 },
      { id: 'inner1-15', colorNumber: 8, path: 'M250,230 L230,210 L250,210 Z', labelX: 243, labelY: 217 },
      { id: 'inner1-16', colorNumber: 7, path: 'M250,230 L250,210 L270,210 Z', labelX: 257, labelY: 217 },

      // 내부 두 번째 레이어 (Inner Layer 2) - 12개 사다리꼴
      { id: 'inner2-1', colorNumber: 6, path: 'M270,210 L300,180 L310,200 L290,230 Z', labelX: 293, labelY: 205 },
      { id: 'inner2-2', colorNumber: 5, path: 'M290,230 L310,200 L330,230 L310,260 Z', labelX: 310, labelY: 230 },
      { id: 'inner2-3', colorNumber: 6, path: 'M290,270 L310,260 L330,270 L310,300 Z', labelX: 310, labelY: 275 },
      { id: 'inner2-4', colorNumber: 5, path: 'M270,290 L290,270 L310,300 L290,320 Z', labelX: 290, labelY: 295 },
      { id: 'inner2-5', colorNumber: 6, path: 'M250,290 L270,290 L290,320 L250,320 Z', labelX: 265, labelY: 305 },
      { id: 'inner2-6', colorNumber: 5, path: 'M230,290 L250,290 L250,320 L210,320 Z', labelX: 235, labelY: 305 },
      { id: 'inner2-7', colorNumber: 6, path: 'M210,270 L230,290 L210,320 L190,300 Z', labelX: 210, labelY: 295 },
      { id: 'inner2-8', colorNumber: 5, path: 'M210,230 L210,270 L190,300 L170,270 Z', labelX: 195, labelY: 268 },
      { id: 'inner2-9', colorNumber: 6, path: 'M210,230 L170,270 L170,230 L190,200 Z', labelX: 185, labelY: 233 },
      { id: 'inner2-10', colorNumber: 5, path: 'M230,210 L210,230 L190,200 L210,180 Z', labelX: 210, labelY: 205 },
      { id: 'inner2-11', colorNumber: 6, path: 'M250,210 L230,210 L210,180 L250,180 Z', labelX: 235, labelY: 195 },
      { id: 'inner2-12', colorNumber: 5, path: 'M270,210 L250,210 L250,180 L290,180 Z', labelX: 265, labelY: 195 },

      // 중간 레이어 (Middle Layer) - 별 모양 패턴 20개
      { id: 'mid1-1', colorNumber: 4, path: 'M300,180 L320,150 L340,180 L310,200 Z', labelX: 318, labelY: 178 },
      { id: 'mid1-2', colorNumber: 3, path: 'M340,180 L370,170 L360,210 L330,230 Z', labelX: 350, labelY: 198 },
      { id: 'mid1-3', colorNumber: 4, path: 'M330,230 L360,210 L380,240 L350,270 Z', labelX: 355, labelY: 238 },
      { id: 'mid1-4', colorNumber: 3, path: 'M330,270 L350,270 L380,240 L380,280 Z', labelX: 360, labelY: 265 },
      { id: 'mid1-5', colorNumber: 4, path: 'M310,300 L330,270 L380,280 L360,320 Z', labelX: 345, labelY: 293 },
      { id: 'mid1-6', colorNumber: 3, path: 'M290,320 L310,300 L360,320 L340,350 Z', labelX: 325, labelY: 323 },
      { id: 'mid1-7', colorNumber: 4, path: 'M250,320 L290,320 L340,350 L300,370 Z', labelX: 295, labelY: 340 },
      { id: 'mid1-8', colorNumber: 3, path: 'M210,320 L250,320 L300,370 L250,380 Z', labelX: 253, labelY: 348 },
      { id: 'mid1-9', colorNumber: 4, path: 'M210,320 L250,380 L200,370 L160,350 Z', labelX: 205, labelY: 355 },
      { id: 'mid1-10', colorNumber: 3, path: 'M190,300 L210,320 L160,350 L140,320 Z', labelX: 175, labelY: 323 },
      { id: 'mid1-11', colorNumber: 4, path: 'M170,270 L190,300 L140,320 L120,280 Z', labelX: 155, labelY: 293 },
      { id: 'mid1-12', colorNumber: 3, path: 'M170,230 L170,270 L120,280 L120,240 Z', labelX: 145, labelY: 255 },
      { id: 'mid1-13', colorNumber: 4, path: 'M170,230 L120,240 L120,200 L150,180 Z', labelX: 140, labelY: 213 },
      { id: 'mid1-14', colorNumber: 3, path: 'M190,200 L170,230 L150,180 L160,150 Z', labelX: 168, labelY: 190 },
      { id: 'mid1-15', colorNumber: 4, path: 'M210,180 L190,200 L160,150 L180,130 Z', labelX: 185, labelY: 165 },
      { id: 'mid1-16', colorNumber: 3, path: 'M250,180 L210,180 L180,130 L220,120 Z', labelX: 215, labelY: 153 },
      { id: 'mid1-17', colorNumber: 4, path: 'M290,180 L250,180 L220,120 L260,110 Z', labelX: 255, labelY: 147 },
      { id: 'mid1-18', colorNumber: 3, path: 'M300,180 L290,180 L260,110 L300,120 Z', labelX: 287, labelY: 147 },
      { id: 'mid1-19', colorNumber: 4, path: 'M320,150 L300,180 L300,120 L330,130 Z', labelX: 313, labelY: 145 },
      { id: 'mid1-20', colorNumber: 3, path: 'M340,180 L320,150 L330,130 L370,170 Z', labelX: 340, labelY: 158 },

      // 외부 레이어 (Outer Layer) - 큰 삼각형/사다리꼴 22개
      { id: 'outer1-1', colorNumber: 2, path: 'M320,150 L340,100 L370,120 L370,170 Z', labelX: 350, labelY: 135 },
      { id: 'outer1-2', colorNumber: 1, path: 'M370,170 L370,120 L410,140 L400,190 Z', labelX: 388, labelY: 155 },
      { id: 'outer1-3', colorNumber: 2, path: 'M380,240 L400,190 L430,210 L420,260 Z', labelX: 408, labelY: 225 },
      { id: 'outer1-4', colorNumber: 1, path: 'M380,280 L420,260 L440,300 L410,330 Z', labelX: 413, labelY: 293 },
      { id: 'outer1-5', colorNumber: 2, path: 'M360,320 L410,330 L400,370 L360,370 Z', labelX: 383, labelY: 348 },
      { id: 'outer1-6', colorNumber: 1, path: 'M340,350 L360,370 L360,410 L320,400 Z', labelX: 345, labelY: 383 },
      { id: 'outer1-7', colorNumber: 2, path: 'M300,370 L360,410 L340,440 L290,420 Z', labelX: 323, labelY: 410 },
      { id: 'outer1-8', colorNumber: 1, path: 'M250,380 L300,370 L290,420 L250,430 Z', labelX: 273, labelY: 400 },
      { id: 'outer1-9', colorNumber: 2, path: 'M200,370 L250,380 L250,430 L210,420 Z', labelX: 228, labelY: 400 },
      { id: 'outer1-10', colorNumber: 1, path: 'M160,350 L200,370 L210,420 L160,410 Z', labelX: 183, labelY: 388 },
      { id: 'outer1-11', colorNumber: 2, path: 'M140,320 L160,350 L160,410 L120,390 Z', labelX: 145, labelY: 368 },
      { id: 'outer1-12', colorNumber: 1, path: 'M120,280 L140,320 L120,390 L80,350 Z', labelX: 115, labelY: 335 },
      { id: 'outer1-13', colorNumber: 2, path: 'M120,240 L120,280 L80,350 L60,300 Z', labelX: 95, labelY: 293 },
      { id: 'outer1-14', colorNumber: 1, path: 'M120,200 L120,240 L60,300 L60,240 Z', labelX: 90, labelY: 245 },
      { id: 'outer1-15', colorNumber: 2, path: 'M150,180 L120,200 L60,240 L80,180 Z', labelX: 103, labelY: 200 },
      { id: 'outer1-16', colorNumber: 1, path: 'M160,150 L150,180 L80,180 L100,130 Z', labelX: 123, labelY: 160 },
      { id: 'outer1-17', colorNumber: 2, path: 'M180,130 L160,150 L100,130 L120,90 Z', labelX: 140, labelY: 125 },
      { id: 'outer1-18', colorNumber: 1, path: 'M220,120 L180,130 L120,90 L160,60 Z', labelX: 170, labelY: 100 },
      { id: 'outer1-19', colorNumber: 2, path: 'M260,110 L220,120 L160,60 L210,50 Z', labelX: 213, labelY: 85 },
      { id: 'outer1-20', colorNumber: 1, path: 'M300,120 L260,110 L210,50 L260,40 Z', labelX: 258, labelY: 80 },
      { id: 'outer1-21', colorNumber: 2, path: 'M330,130 L300,120 L260,40 L310,50 Z', labelX: 300, labelY: 85 },
      { id: 'outer1-22', colorNumber: 1, path: 'M340,100 L330,130 L310,50 L350,60 Z', labelX: 333, labelY: 85 },

      // 최외곽 레이어 (Outermost Layer) - 24개
      { id: 'edge1-1', colorNumber: 14, path: 'M340,100 L350,60 L390,70 L370,120 Z', labelX: 363, labelY: 88 },
      { id: 'edge1-2', colorNumber: 13, path: 'M410,140 L370,120 L390,70 L430,100 Z', labelX: 400, labelY: 108 },
      { id: 'edge1-3', colorNumber: 14, path: 'M430,210 L410,140 L450,150 L460,200 Z', labelX: 438, labelY: 175 },
      { id: 'edge1-4', colorNumber: 13, path: 'M440,300 L430,210 L470,240 L470,290 Z', labelX: 453, labelY: 260 },
      { id: 'edge1-5', colorNumber: 14, path: 'M400,370 L440,300 L470,340 L450,400 Z', labelX: 440, labelY: 353 },
      { id: 'edge1-6', colorNumber: 13, path: 'M360,410 L400,370 L450,400 L420,450 Z', labelX: 408, labelY: 408 },
      { id: 'edge1-7', colorNumber: 14, path: 'M340,440 L360,410 L420,450 L380,480 Z', labelX: 375, labelY: 445 },
      { id: 'edge1-8', colorNumber: 13, path: 'M290,420 L340,440 L380,480 L320,480 Z', labelX: 333, labelY: 455 },
      { id: 'edge1-9', colorNumber: 14, path: 'M250,430 L290,420 L320,480 L250,490 Z', labelX: 278, labelY: 455 },
      { id: 'edge1-10', colorNumber: 13, path: 'M210,420 L250,430 L250,490 L180,480 Z', labelX: 223, labelY: 455 },
      { id: 'edge1-11', colorNumber: 14, path: 'M160,410 L210,420 L180,480 L120,450 Z', labelX: 168, labelY: 440 },
      { id: 'edge1-12', colorNumber: 13, path: 'M120,390 L160,410 L120,450 L80,410 Z', labelX: 120, labelY: 415 },
      { id: 'edge1-13', colorNumber: 14, path: 'M80,350 L120,390 L80,410 L40,370 Z', labelX: 80, labelY: 380 },
      { id: 'edge1-14', colorNumber: 13, path: 'M60,300 L80,350 L40,370 L20,320 Z', labelX: 50, labelY: 335 },
      { id: 'edge1-15', colorNumber: 14, path: 'M60,240 L60,300 L20,320 L20,260 Z', labelX: 40, labelY: 280 },
      { id: 'edge1-16', colorNumber: 13, path: 'M80,180 L60,240 L20,260 L30,200 Z', labelX: 48, labelY: 220 },
      { id: 'edge1-17', colorNumber: 14, path: 'M100,130 L80,180 L30,200 L50,140 Z', labelX: 65, labelY: 163 },
      { id: 'edge1-18', colorNumber: 13, path: 'M120,90 L100,130 L50,140 L70,90 Z', labelX: 85, labelY: 113 },
      { id: 'edge1-19', colorNumber: 14, path: 'M160,60 L120,90 L70,90 L100,50 Z', labelX: 113, labelY: 73 },
      { id: 'edge1-20', colorNumber: 13, path: 'M210,50 L160,60 L100,50 L140,20 Z', labelX: 153, labelY: 45 },
      { id: 'edge1-21', colorNumber: 14, path: 'M260,40 L210,50 L140,20 L200,10 Z', labelX: 203, labelY: 30 },
      { id: 'edge1-22', colorNumber: 13, path: 'M310,50 L260,40 L200,10 L270,10 Z', labelX: 260, labelY: 28 },
      { id: 'edge1-23', colorNumber: 14, path: 'M350,60 L310,50 L270,10 L340,20 Z', labelX: 318, labelY: 35 },
      { id: 'edge1-24', colorNumber: 13, path: 'M390,70 L350,60 L340,20 L400,40 Z', labelX: 370, labelY: 48 },

      // 모서리 장식 (Corner Decorations) - 4개
      { id: 'corner1', colorNumber: 15, path: 'M20,20 L60,20 L60,60 L20,60 Z', labelX: 40, labelY: 40 },
      { id: 'corner2', colorNumber: 16, path: 'M440,20 L480,20 L480,60 L440,60 Z', labelX: 460, labelY: 40 },
      { id: 'corner3', colorNumber: 15, path: 'M440,440 L480,440 L480,480 L440,480 Z', labelX: 460, labelY: 460 },
      { id: 'corner4', colorNumber: 16, path: 'M20,440 L60,440 L60,480 L20,480 Z', labelX: 40, labelY: 460 },

      // 추가 디테일 - 별 모양 포인트 (4개)
      { id: 'star1', colorNumber: 9, path: 'M250,50 L255,30 L260,50 L280,45 L265,55 L275,70 L255,60 L245,70 L235,55 L220,45 L240,50 Z', labelX: 250, labelY: 50 },
      { id: 'star2', colorNumber: 10, path: 'M450,250 L470,245 L450,240 L455,220 L445,235 L430,225 L440,245 L430,255 L445,265 L455,280 L450,260 Z', labelX: 448, labelY: 250 },
      { id: 'star3', colorNumber: 9, path: 'M250,450 L255,470 L260,450 L280,455 L265,445 L275,430 L255,440 L245,430 L235,445 L220,455 L240,450 Z', labelX: 250, labelY: 450 },
      { id: 'star4', colorNumber: 10, path: 'M50,250 L30,245 L50,240 L45,220 L55,235 L70,225 L60,245 L70,255 L55,265 L45,280 L50,260 Z', labelX: 50, labelY: 250 },

      // 대각선 장식 (8개)
      { id: 'diag1', colorNumber: 11, path: 'M100,100 L120,80 L140,100 L120,120 Z', labelX: 120, labelY: 100 },
      { id: 'diag2', colorNumber: 12, path: 'M380,100 L400,80 L420,100 L400,120 Z', labelX: 400, labelY: 100 },
      { id: 'diag3', colorNumber: 11, path: 'M380,400 L400,380 L420,400 L400,420 Z', labelX: 400, labelY: 400 },
      { id: 'diag4', colorNumber: 12, path: 'M100,400 L120,380 L140,400 L120,420 Z', labelX: 120, labelY: 400 },
      { id: 'diag5', colorNumber: 11, path: 'M150,150 L165,135 L180,150 L165,165 Z', labelX: 165, labelY: 150 },
      { id: 'diag6', colorNumber: 12, path: 'M335,150 L350,135 L365,150 L350,165 Z', labelX: 350, labelY: 150 },
      { id: 'diag7', colorNumber: 11, path: 'M335,350 L350,335 L365,350 L350,365 Z', labelX: 350, labelY: 350 },
      { id: 'diag8', colorNumber: 12, path: 'M150,350 L165,335 L180,350 L165,365 Z', labelX: 165, labelY: 350 },
    ],
  },
}

// 샘플 템플릿 7: 만다라 패턴 (어려움)
export const TEMPLATE_MANDALA: Template = {
  id: 'mandala-flower',
  title: '연꽃 만다라',
  categoryId: 'pattern',
  difficulty: 'hard',
  colorCount: 8,
  regionCount: 33,
  estimatedTime: 25,
  thumbnailUrl: '',
  usageCount: 180,
  createdAt: '2026-01-27',
  colorPalette: [
    { number: 1, hex: '#9C27B0', name: '보라', totalRegions: 8 },
    { number: 2, hex: '#E91E63', name: '분홍', totalRegions: 8 },
    { number: 3, hex: '#FF9800', name: '주황', totalRegions: 4 },
    { number: 4, hex: '#FFEB3B', name: '노랑', totalRegions: 4 },
    { number: 5, hex: '#4CAF50', name: '초록', totalRegions: 4 },
    { number: 6, hex: '#2196F3', name: '파랑', totalRegions: 2 },
    { number: 7, hex: '#F44336', name: '빨강', totalRegions: 1 },
    { number: 8, hex: '#FFFFFF', name: '흰색', totalRegions: 2 },
  ],
  templateData: {
    viewBox: '0 0 300 300',
    regions: [
      // 중심 원 (빨강)
      { id: 'center', colorNumber: 7, path: 'M150,150 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0', labelX: 150, labelY: 150 },
      // 내부 꽃잎 8개 (노랑)
      { id: 'inner-petal-1', colorNumber: 4, path: 'M150,135 Q160,115 150,95 Q140,115 150,135 Z', labelX: 150, labelY: 115 },
      { id: 'inner-petal-2', colorNumber: 4, path: 'M165,150 Q185,140 205,150 Q185,160 165,150 Z', labelX: 185, labelY: 150 },
      { id: 'inner-petal-3', colorNumber: 4, path: 'M150,165 Q160,185 150,205 Q140,185 150,165 Z', labelX: 150, labelY: 185 },
      { id: 'inner-petal-4', colorNumber: 4, path: 'M135,150 Q115,140 95,150 Q115,160 135,150 Z', labelX: 115, labelY: 150 },
      // 중간 꽃잎 8개 (분홍)
      { id: 'mid-petal-1', colorNumber: 2, path: 'M150,90 Q170,70 150,50 Q130,70 150,90 Z', labelX: 150, labelY: 70 },
      { id: 'mid-petal-2', colorNumber: 2, path: 'M192,108 Q222,98 232,68 Q202,78 192,108 Z', labelX: 212, labelY: 88 },
      { id: 'mid-petal-3', colorNumber: 2, path: 'M210,150 Q230,130 250,150 Q230,170 210,150 Z', labelX: 230, labelY: 150 },
      { id: 'mid-petal-4', colorNumber: 2, path: 'M192,192 Q222,202 232,232 Q202,222 192,192 Z', labelX: 212, labelY: 212 },
      { id: 'mid-petal-5', colorNumber: 2, path: 'M150,210 Q170,230 150,250 Q130,230 150,210 Z', labelX: 150, labelY: 230 },
      { id: 'mid-petal-6', colorNumber: 2, path: 'M108,192 Q78,202 68,232 Q98,222 108,192 Z', labelX: 88, labelY: 212 },
      { id: 'mid-petal-7', colorNumber: 2, path: 'M90,150 Q70,130 50,150 Q70,170 90,150 Z', labelX: 70, labelY: 150 },
      { id: 'mid-petal-8', colorNumber: 2, path: 'M108,108 Q78,98 68,68 Q98,78 108,108 Z', labelX: 88, labelY: 88 },
      // 외부 꽃잎 8개 (보라)
      { id: 'outer-petal-1', colorNumber: 1, path: 'M150,45 Q175,25 150,5 Q125,25 150,45 Z', labelX: 150, labelY: 25 },
      { id: 'outer-petal-2', colorNumber: 1, path: 'M224,76 Q259,56 274,26 Q239,46 224,76 Z', labelX: 249, labelY: 51 },
      { id: 'outer-petal-3', colorNumber: 1, path: 'M255,150 Q275,125 295,150 Q275,175 255,150 Z', labelX: 275, labelY: 150 },
      { id: 'outer-petal-4', colorNumber: 1, path: 'M224,224 Q259,244 274,274 Q239,254 224,224 Z', labelX: 249, labelY: 249 },
      { id: 'outer-petal-5', colorNumber: 1, path: 'M150,255 Q175,275 150,295 Q125,275 150,255 Z', labelX: 150, labelY: 275 },
      { id: 'outer-petal-6', colorNumber: 1, path: 'M76,224 Q41,244 26,274 Q61,254 76,224 Z', labelX: 51, labelY: 249 },
      { id: 'outer-petal-7', colorNumber: 1, path: 'M45,150 Q25,125 5,150 Q25,175 45,150 Z', labelX: 25, labelY: 150 },
      { id: 'outer-petal-8', colorNumber: 1, path: 'M76,76 Q41,56 26,26 Q61,46 76,76 Z', labelX: 51, labelY: 51 },
      // 장식 원 4개 (주황)
      { id: 'deco-circle-1', colorNumber: 3, path: 'M150,65 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 150, labelY: 65 },
      { id: 'deco-circle-2', colorNumber: 3, path: 'M235,150 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 235, labelY: 150 },
      { id: 'deco-circle-3', colorNumber: 3, path: 'M150,235 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 150, labelY: 235 },
      { id: 'deco-circle-4', colorNumber: 3, path: 'M65,150 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0', labelX: 65, labelY: 150 },
      // 대각선 장식 4개 (초록)
      { id: 'deco-leaf-1', colorNumber: 5, path: 'M200,100 Q210,90 205,80 Q195,85 200,100 Z', labelX: 202, labelY: 90 },
      { id: 'deco-leaf-2', colorNumber: 5, path: 'M200,200 Q210,210 205,220 Q195,215 200,200 Z', labelX: 202, labelY: 210 },
      { id: 'deco-leaf-3', colorNumber: 5, path: 'M100,200 Q90,210 95,220 Q105,215 100,200 Z', labelX: 98, labelY: 210 },
      { id: 'deco-leaf-4', colorNumber: 5, path: 'M100,100 Q90,90 95,80 Q105,85 100,100 Z', labelX: 98, labelY: 90 },
      // 외곽 링 (파랑)
      { id: 'outer-ring-top', colorNumber: 6, path: 'M150,20 Q80,20 40,60 Q80,50 150,50 Q220,50 260,60 Q220,20 150,20 Z', labelX: 150, labelY: 35 },
      { id: 'outer-ring-bottom', colorNumber: 6, path: 'M150,280 Q80,280 40,240 Q80,250 150,250 Q220,250 260,240 Q220,280 150,280 Z', labelX: 150, labelY: 265 },
      // 모서리 장식 (흰색)
      { id: 'corner-1', colorNumber: 8, path: 'M30,30 Q45,20 60,30 Q45,40 30,30 Z', labelX: 45, labelY: 30 },
      { id: 'corner-2', colorNumber: 8, path: 'M270,270 Q255,280 240,270 Q255,260 270,270 Z', labelX: 255, labelY: 270 },
    ],
  },
}

// 전체 템플릿 목록
export const SAMPLE_TEMPLATES: Template[] = [
  TEMPLATE_APPLE,
  TEMPLATE_FLOWER,
  TEMPLATE_HEART,
  TEMPLATE_CAT,
  // TEMPLATE_FLORAL_GARDEN,
  // TEMPLATE_MANDALA,
  // TEMPLATE_GEOMETRIC_MANDALA,
]

// ID로 템플릿 찾기
export function getTemplateById(id: string): Template | undefined {
  return SAMPLE_TEMPLATES.find(t => t.id === id)
}

// 카테고리로 템플릿 필터링
export function getTemplatesByCategory(categoryId: string): Template[] {
  if (categoryId === 'all') return SAMPLE_TEMPLATES
  return SAMPLE_TEMPLATES.filter(t => t.categoryId === categoryId)
}

// 난이도로 템플릿 필터링
export function getTemplatesByDifficulty(difficulty: Template['difficulty']): Template[] {
  return SAMPLE_TEMPLATES.filter(t => t.difficulty === difficulty)
}
