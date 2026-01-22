import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header showHelp showSettings />
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  )
}
