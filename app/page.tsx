import Layout from '@/components/Layout'
import InputUsername from '@/components/InputUsername'

export default function Home() {
  return (
    <Layout>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white font-sans">
            GitIn
          </h1>
          <p className="text-xl text-charcoal-300">
            Veja seu perfil técnico profissional com base no GitHub
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <InputUsername />
        </div>
      </div>
    </Layout>
  )
}