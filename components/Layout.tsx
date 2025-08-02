import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-charcoal-900">
      <header className="fixed top-0 w-full bg-[#0F172A] border-b border-charcoal-800 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-white">GitIn</h1>
        </div>
      </header>
      
      <main className="pt-20">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}