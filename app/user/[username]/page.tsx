'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/Layout'

interface UserData {
  profile: {
    name: string
    bio: string
    avatar_url: string
    location: string
    followers: number
    public_repos: number
    login: string
    following: number
  }
  repos: {
    name: string
    description: string
    language: string
    stargazers_count: number
    forks: number
    updated_at: string
  }[]
}

export default function UserProfile() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        ])

        if (!profileResponse.ok || !reposResponse.ok) {
          router.push('/')
          return
        }

        const profile = await profileResponse.json()
        const repos = await reposResponse.json()

        setUserData({ profile, repos })
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [username, router])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-charcoal-300">Carregando perfil...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!userData) return null

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <img 
            src={userData.profile.avatar_url} 
            alt={userData.profile.name}
            className="w-24 h-24 rounded-full mx-auto"
          />
          <h1 className="text-3xl font-bold text-white">
            {userData.profile.name || userData.profile.login}
          </h1>
          {userData.profile.bio && (
            <p className="text-charcoal-300 max-w-2xl mx-auto">
              {userData.profile.bio}
            </p>
          )}
        </div>

        {userData.profile.location && (
          <p className="text-center text-charcoal-400">
            📍 {userData.profile.location}
          </p>
        )}

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.profile.public_repos}
            </div>
            <div className="text-sm text-charcoal-400">Repositórios</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.profile.followers}
            </div>
            <div className="text-sm text-charcoal-400">Seguidores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {userData.profile.following}
            </div>
            <div className="text-sm text-charcoal-400">Seguindo</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Repositórios</h2>
          <div className="grid gap-4">
            {userData.repos.slice(0, 6).map((repo) => (
              <div key={repo.id} className="bg-charcoal-800 p-4 rounded-lg">
                <h3 className="font-semibold text-white">{repo.name}</h3>
                {repo.description && (
                  <p className="text-sm text-charcoal-300 mt-1">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-charcoal-400">
                  {repo.language && <span>{repo.language}</span>}
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks}</span>
                  <span>{new Date(repo.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}