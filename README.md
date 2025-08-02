# GitIn Web App

Aplicação web moderna construída com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI reutilizáveis
- **Tema Escuro** - Design com tons de azul royal e cinza carvão

## 🎨 Design System

- **Cor Primária**: Azul Royal (#3B82F6)
- **Fundo**: Cinza Carvão (#0F172A)
- **Fontes**: Inter (sans-serif), JetBrains Mono (monospace)

## 📦 Instalação

```bash
npm install
# ou
yarn install
```

## 🔧 Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Build

```bash
npm run build
npm start
```

## 🚀 Deploy na Vercel

O projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push na branch main

## 📁 Estrutura do Projeto

```
gitin-web-app/
├── app/                 # App Router (Next.js 15)
│   ├── globals.css     # Estilos globais
│   ├── layout.tsx      # Layout raiz
│   └── page.tsx        # Página inicial
├── components/         # Componentes reutilizáveis
│   └── ui/            # Componentes shadcn/ui
├── lib/               # Utilitários
└── public/            # Arquivos estáticos
```