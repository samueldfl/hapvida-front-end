# Teste Frontend React - Integração CEP e Clima

Aplicação React completa que integra APIs públicas de CEP e clima, desenvolvida com Vite e React Router seguindo as melhores práticas de desenvolvimento frontend.

## 🚀 Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18.x | Biblioteca de UI |
| **Vite** | 6.x | Build tool rápido |
| **React Router** | 6.x | Navegação SPA |
| **TypeScript** | 5.x | Tipagem estática |
| **React Hook Form** | 7.x | Gerenciamento de formulários |
| **Zod** | 3.x | Validação de schemas |
| **TanStack Query** | 5.x | Gerenciamento de estado servidor |
| **Vitest** | 2.x | Framework de testes |
| **Testing Library** | - | Testes de componentes |
| **Tailwind CSS** | 4.x | Estilização utilitária |
| **shadcn/ui** | - | Componentes acessíveis |

## 🌐 APIs Integradas

- **CEP Primária**: [BrasilAPI CEP v2](https://brasilapi.com.br/api/cep/v2/{cep})
- **CEP Fallback**: [ViaCEP](https://viacep.com.br/ws/{cep}/json/)
- **Clima**: [Open-Meteo Forecast](https://api.open-meteo.com/v1/forecast)
- **Geocodificação**: [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com/v1/search)

## ✅ Funcionalidades Implementadas

### US01 - Consulta de CEP com Interface Amigável
- ✅ Formulário com validação em tempo real usando React Hook Form + Zod
- ✅ Máscara automática de CEP (XXXXX-XXX)
- ✅ Debounce na digitação para evitar consultas excessivas
- ✅ Fallback automático entre BrasilAPI e ViaCEP
- ✅ Exibição completa: CEP, logradouro, bairro, cidade, UF, código IBGE, coordenadas
- ✅ Indicação do provedor utilizado (BrasilAPI/ViaCEP)
- ✅ Tratamento de erros com mensagens amigáveis por tipo
- ✅ Retry automático com backoff exponencial
- ✅ Timeout configurável (5 segundos)

### US02 - Consulta de Clima Integrada ao CEP
- ✅ Integração automática com dados do CEP
- ✅ Seletor de dias de previsão (1-7 dias)
- ✅ Geocodificação automática quando CEP não tem coordenadas
- ✅ Exibição de temperatura atual, sensação térmica e umidade
- ✅ Previsão diária com temperaturas mín/máx
- ✅ Indicação de localização e coordenadas
- ✅ Cache de 10 minutos por (lat, lon, days)

### US03 - Interface Responsiva e Acessível
- ✅ Layout responsivo (320px a 1920px+)
- ✅ Design moderno com gradientes e animações
- ✅ Estados visuais claros (hover, focus, disabled, loading)
- ✅ Tipografia distintiva (Plus Jakarta Sans + JetBrains Mono)
- ✅ Paleta de cores vibrante com suporte a dark mode
- ✅ Animações suaves de entrada e transições

### US04 - Tratamento de Erros e Estados de Loading
- ✅ Estados de loading com spinners animados
- ✅ Mensagens de erro específicas por tipo
- ✅ Botão de "Tentar novamente" em caso de erro
- ✅ Classe CepError com tipos de erro tipados

### US05 - Histórico de Consultas
- ✅ Lista das últimas 10 consultas
- ✅ Persistência no localStorage
- ✅ Hook customizado useHistory para gerenciamento reativo
- ✅ Clique para recarregar dados do histórico
- ✅ Opção de limpar todo o histórico
- ✅ Exibição de CEP, cidade/UF e timestamp relativo

### US06 - Testes Automatizados
- ✅ Testes unitários para validação, formatação, hooks
- ✅ Testes de integração para APIs
- ✅ Testes de componentes com interações
- ✅ Cobertura de cenários de sucesso, erro e loading

### US07 - Estrutura e Organização do Código
- ✅ Estrutura de pastas organizada com Vite
- ✅ Componentes com responsabilidade única
- ✅ Hooks customizados (useDebounce, useHistory)
- ✅ Types TypeScript bem definidos
- ✅ Separação clara entre componentes, services, utils e types

### US08 - Dockerização da Aplicação
- ✅ Dockerfile multi-stage otimizado com pnpm
- ✅ Nginx para servir a aplicação estática
- ✅ Build production-ready

### US09 - Documentação do Projeto
- ✅ README.md completo e detalhado
- ✅ Instruções claras de instalação e execução
- ✅ Documentação das tecnologias e decisões técnicas

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 20+ ou Docker
- pnpm (recomendado) ou npm

### Opção 1: Execução Local

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build de produção
pnpm preview
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Opção 2: Execução com Docker

```bash
# Build da imagem
docker build -t cep-clima-app .

# Executar container
docker run -p 3000:3000 cep-clima-app
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Comandos Docker Úteis

```bash
# Build e executar em segundo plano
docker run -d -p 3000:3000 --name cep-clima cep-clima-app

# Ver logs
docker logs cep-clima

# Parar container
docker stop cep-clima

# Remover container
docker rm cep-clima
```

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Executar com interface visual
pnpm test:ui

# Executar com cobertura
pnpm test:coverage
```

## 📁 Estrutura do Projeto

```
├── src/
│   ├── main.tsx                # Entry point da aplicação
│   ├── App.tsx                 # Componente raiz com rotas
│   ├── pages/
│   │   ├── HomePage.tsx        # Página principal
│   │   └── NotFoundPage.tsx    # Página 404
│   ├── components/
│   │   ├── cep-search.tsx      # Componente de busca CEP
│   │   ├── weather-display.tsx # Exibição do clima
│   │   ├── search-history.tsx  # Histórico de consultas
│   │   └── ui/                 # Componentes shadcn/ui
│   ├── hooks/
│   │   ├── use-debounce.ts     # Hook para debounce
│   │   ├── use-history.ts      # Hook para gerenciar histórico
│   │   └── use-toast.ts        # Hook para notificações
│   ├── lib/
│   │   ├── api/
│   │   │   ├── cep.ts         # Cliente API CEP com fallback
│   │   │   └── weather.ts     # Cliente API Clima
│   │   ├── history.ts         # Utilitários de histórico
│   │   └── utils.ts           # Utilitários gerais
│   ├── types/
│   │   ├── address.ts         # Types de endereço e APIs
│   │   └── weather.ts         # Types de clima
│   └── styles/
│       └── globals.css        # Estilos globais
├── tests/
│   ├── setup.ts               # Configuração global de testes
│   ├── hooks/                 # Testes de hooks
│   ├── lib/                   # Testes de lógica
│   └── components/            # Testes de componentes
├── public/                    # Assets estáticos
├── index.html                 # HTML entry point
├── vite.config.ts            # Configuração Vite
├── vitest.config.ts          # Configuração Vitest
├── Dockerfile                # Configuração Docker
├── nginx.conf                # Configuração Nginx
└── package.json              # Dependências
```

## 🔧 Decisões Técnicas

### Arquitetura e Padrões

| Decisão | Justificativa |
|---------|---------------|
| **Vite** | Build rápido, HMR instantâneo, melhor DX |
| **React Router** | Navegação SPA declarativa |
| **TanStack Query** | Cache inteligente, retry automático |
| **React Hook Form** | Performance otimizada, validação eficiente |
| **Zod** | Validação runtime e compile-time |

### Resiliência e Performance

| Feature | Implementação |
|---------|---------------|
| **Fallback CEP** | BrasilAPI → ViaCEP automático |
| **Retry** | Até 2 tentativas com backoff exponencial |
| **Timeout** | 5 segundos por requisição |
| **Debounce** | 300ms na digitação do CEP |
| **Cache** | 10 minutos para dados climáticos |

### UI/UX

- **Tipografia**: Plus Jakarta Sans (corpo) + JetBrains Mono (código)
- **Cores**: Paleta indigo/violet vibrante com suporte a dark mode
- **Animações**: Fade-in, slide-up, transições suaves
- **Responsividade**: Mobile-first, breakpoints em 640px, 768px, 1024px

## 📄 Licença

Este projeto foi desenvolvido como teste técnico e está disponível para avaliação.

---

**Stack**: React 18 • Vite • React Router • TypeScript • TanStack Query • Vitest • Tailwind CSS • Docker
