'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { generateAIProfileDescription } from '@/lib/bedrock'

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
    homepage: string
  }[]
}

interface KPIs {
  topLanguages: { language: string; count: number }[]
  totalStars: number
  totalForks: number
  projectsWithDescription: number
  recentProjects: number
  projectsWithReadme: number
}

interface AIProfile {
  linkedinSummary: string
  seniorityLevel: string
  badges: string[]
  kpiInterpretation: string
}

function analyzeGitHubData(profile: UserData['profile'], repos: UserData['repos']): KPIs {
  const languageCount: Record<string, number> = {}
  let totalStars = 0
  let totalForks = 0
  let projectsWithDescription = 0
  let recentProjects = 0
  let projectsWithReadme = 0
  
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  
  repos.forEach(repo => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1
    }
    
    totalStars += repo.stargazers_count
    totalForks += repo.forks
    
    if (repo.description?.trim()) {
      projectsWithDescription++
    }
    
    if (new Date(repo.updated_at) > ninetyDaysAgo) {
      recentProjects++
    }
    
    if (repo.description?.trim() || repo.homepage?.trim()) {
      projectsWithReadme++
    }
  })
  
  const topLanguages = Object.entries(languageCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([language, count]) => ({ language, count }))
  
  return {
    topLanguages,
    totalStars,
    totalForks,
    projectsWithDescription,
    recentProjects,
    projectsWithReadme
  }
}

export default function UserProfile() {
  const params = useParams()
  const router = useRouter()
  const username = params.username as string
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [aiProfile, setAiProfile] = useState<AIProfile | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

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
        const userData = { profile, repos }
        const analyzedKpis = analyzeGitHubData(profile, repos)

        setUserData(userData)
        setKpis(analyzedKpis)
        
        // Gerar perfil AI
        setAiLoading(true)
        try {
          const aiProfileData = await generateAIProfileDescription({
            name: profile.name || profile.login,
            bio: profile.bio || '',
            topLanguages: analyzedKpis.topLanguages,
            repos: repos,
            totalStars: analyzedKpis.totalStars,
            totalForks: analyzedKpis.totalForks,
            projectsWithDescription: analyzedKpis.projectsWithDescription,
            recentProjects: analyzedKpis.recentProjects,
            totalCommits: Math.floor(Math.random() * 1000) + 100, // Simulado
            activeWeeks: Math.floor(Math.random() * 52) + 10 // Simulado
          })
          setAiProfile(aiProfileData)
        } catch (error) {
          console.error('Erro ao gerar perfil AI:', error)
        } finally {
          setAiLoading(false)
        }
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
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (!userData || !kpis) return null

  const topRepos = userData.repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)

  return (
    <Layout>
      <div className="space-y-8">
        <Button asChild variant="outline" className="mb-4">
          <Link href="/">← Voltar</Link>
        </Button>

        {/* Resumo do usuário */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.profile.avatar_url} alt={userData.profile.name} />
                <AvatarFallback>{userData.profile.name?.[0] || userData.profile.login[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {userData.profile.name || userData.profile.login}
                </h1>
                {userData.profile.bio && (
                  <p className="text-charcoal-300 mb-3">{userData.profile.bio}</p>
                )}
                {userData.profile.location && (
                  <p className="text-charcoal-400 mb-4">📍 {userData.profile.location}</p>
                )}
                <div className="flex justify-center md:justify-start gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{userData.profile.followers}</div>
                    <div className="text-sm text-charcoal-400">Seguidores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{userData.profile.public_repos}</div>
                    <div className="text-sm text-charcoal-400">Repositórios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{userData.profile.following}</div>
                    <div className="text-sm text-charcoal-400">Seguindo</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs técnicos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">KPIs Técnicos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{kpis.totalStars}</div>
                <div className="text-sm text-charcoal-400">Total Stars</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{kpis.totalForks}</div>
                <div className="text-sm text-charcoal-400">Total Forks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{kpis.recentProjects}</div>
                <div className="text-sm text-charcoal-400">Projetos Recentes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{kpis.projectsWithDescription}</div>
                <div className="text-sm text-charcoal-400">Com Descrição</div>
              </CardContent>
            </Card>
          </div>
          
          {kpis.topLanguages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white">Linguagens Dominantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {kpis.topLanguages.map((lang) => (
                    <Badge key={lang.language} variant="secondary">
                      {lang.language} ({lang.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Análise AI do Perfil */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Análise AI do Perfil</h2>
          {aiLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ) : aiProfile ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Resumo Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-charcoal-300">{aiProfile.linkedinSummary}</p>
                </CardContent>
              </Card>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">Nível de Senioridade</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-charcoal-300">{aiProfile.seniorityLevel}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-white">Badges Técnicos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {aiProfile.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary">{badge}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-white">Interpretação dos KPIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-charcoal-300">{aiProfile.kpiInterpretation}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-charcoal-400">Análise AI não disponível</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Projetos em destaque */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Projetos em Destaque</h2>
          <div className="grid gap-4">
            {topRepos.map((repo, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white">
                      <Link 
                        href={`https://github.com/${userData.profile.login}/${repo.name}`}
                        target="_blank"
                        className="hover:text-primary transition-colors"
                      >
                        {repo.name}
                      </Link>
                    </CardTitle>
                    {repo.language && (
                      <Badge variant="outline">{repo.language}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {repo.description && (
                    <p className="text-charcoal-300 mb-3">{repo.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-charcoal-400">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>🍴 {repo.forks}</span>
                    <span>Atualizado em {new Date(repo.updated_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}