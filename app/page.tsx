import Image from 'next/image'
import Layout from '@/components/Layout'
import InputUsername from '@/components/InputUsername'

export default function Home() {
  return (
    <Layout>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="GitIn" width={300} height={300} />
          </div>
          <p className="text-xl text-charcoal-300">
            Transforme seu histórico de código em um perfil profissional de verdade.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <InputUsername />
        </div>
      </div>
    </Layout>
  )
}