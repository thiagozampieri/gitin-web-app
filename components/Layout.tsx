import { ReactNode } from 'react'
import Image from 'next/image'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-charcoal-900">
      <header className="fixed top-0 w-full bg-[#0F172A] border-b border-charcoal-800 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Image src="/logo.png" alt="GitIn" width={64} height={64} />
        </div>
      </header>
      
      <main className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
          {children}
        </div>
      </main>
      
      <footer className="bg-[#0F172A] border-t border-charcoal-800 py-6">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 text-charcoal-400 text-sm">
            <span>Desenvolvido por Thiago Zampieri utilizando</span>
            <Image src="/logo.png" alt="GitIn" width={20} height={20} />
            <span>e Amazon Q</span>
          </div>
        </div>
      </footer>
    </div>
  )
}