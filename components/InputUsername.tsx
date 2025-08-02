'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function InputUsername() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      router.push(`/user/${username.trim()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-charcoal-200">
          Nome de usuário do GitHub
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Digite o username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-charcoal-800 border-charcoal-600 text-white placeholder:text-charcoal-400"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary-600"
        disabled={!username.trim()}
      >
        Gerar Perfil
      </Button>
    </form>
  )
}