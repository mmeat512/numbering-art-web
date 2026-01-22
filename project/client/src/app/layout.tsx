import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { FontSizeProvider } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: '디지털 컬러링',
    template: '%s | 디지털 컬러링',
  },
  description: '시니어 친화적인 디지털 컬러링 앱. 다양한 템플릿으로 색칠하며 여가를 즐겨보세요.',
  keywords: ['컬러링', '색칠하기', '시니어', '취미', '두뇌건강', 'PWA'],
  authors: [{ name: 'Digital Coloring App' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '디지털 컬러링',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: '디지털 컬러링',
    description: '시니어 친화적인 디지털 컬러링 앱',
    siteName: '디지털 컬러링',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased font-size-normal`}
      >
        <FontSizeProvider>
          {children}
        </FontSizeProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
