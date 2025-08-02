interface ProfileData {
  name: string
  bio: string
  topLanguages: { language: string; count: number }[]
  repos: {
    name: string
    description: string
    language: string
    stargazers_count: number
    forks: number
    updated_at: string
  }[]
  totalStars: number
  totalForks: number
  projectsWithDescription: number
  recentProjects: number
  totalCommits: number
  activeWeeks: number
}

interface AIProfile {
  linkedinSummary: string
  seniorityLevel: string
  badges: string[]
  kpiInterpretation: string
}

export async function generateAIProfileDescription(data: ProfileData): Promise<AIProfile> {
  const prompt = `
Analise o perfil técnico do desenvolvedor ${data.name} e gere:

DADOS DO PERFIL:
- Nome: ${data.name}
- Bio: ${data.bio || 'Não informado'}
- Linguagens predominantes: ${data.topLanguages.map(l => `${l.language} (${l.count} projetos)`).join(', ')}
- Total de repositórios: ${data.repos.length}
- Total de stars: ${data.totalStars}
- Total de forks: ${data.totalForks}
- Projetos com descrição: ${data.projectsWithDescription}
- Projetos recentes (90 dias): ${data.recentProjects}
- Commits estimados: ${data.totalCommits}
- Semanas ativas: ${data.activeWeeks}

REPOSITÓRIOS PRINCIPAIS:
${data.repos.slice(0, 5).map(repo => 
  `- ${repo.name}: ${repo.description || 'Sem descrição'} (${repo.language}, ${repo.stargazers_count} stars, ${repo.forks} forks)`
).join('\n')}

Retorne APENAS um JSON válido com:
{
  "linkedinSummary": "Resumo profissional estilo LinkedIn (2-3 frases)",
  "seniorityLevel": "Júnior/Pleno/Sênior/Staff com justificativa breve",
  "badges": ["badge1", "badge2", "badge3"] (máximo 5 badges técnicos),
  "kpiInterpretation": "Interpretação dos KPIs em 1-2 frases"
}
`

  try {
    // Simulação da resposta do Bedrock por enquanto
    // Em produção, substituir pela chamada real ao AWS Bedrock
    const mockResponse: AIProfile = {
      linkedinSummary: `Desenvolvedor ${data.topLanguages[0]?.language || 'Full Stack'} com experiência em ${data.repos.length} projetos públicos. Especialista em desenvolvimento de soluções com foco em qualidade e boas práticas.`,
      seniorityLevel: data.totalStars > 100 ? "Sênior - Alto engajamento da comunidade" : data.totalStars > 20 ? "Pleno - Projetos com boa visibilidade" : "Júnior - Perfil em desenvolvimento",
      badges: [
        ...data.topLanguages.slice(0, 3).map(l => l.language),
        ...(data.projectsWithDescription > data.repos.length * 0.7 ? ["Documentação"] : []),
        ...(data.recentProjects > 3 ? ["Ativo"] : []),
      ].filter(Boolean).slice(0, 5),
      kpiInterpretation: `Perfil ${data.recentProjects > 5 ? 'muito ativo' : 'moderadamente ativo'} com ${data.totalStars} stars acumuladas. ${data.projectsWithDescription > data.repos.length * 0.5 ? 'Boa prática de documentação.' : 'Pode melhorar a documentação dos projetos.'}`
    }

    return mockResponse
  } catch (error) {
    console.error('Erro ao gerar perfil AI:', error)
    return {
      linkedinSummary: "Desenvolvedor com experiência em múltiplas tecnologias e projetos open source.",
      seniorityLevel: "Análise indisponível",
      badges: ["Desenvolvedor"],
      kpiInterpretation: "Análise dos KPIs temporariamente indisponível."
    }
  }
}