# Arquitetura da Aplicação

## Visão Geral

Esta aplicação segue os princípios de Clean Architecture e separation of concerns, com camadas bem definidas.

## Camadas da Aplicação

### 1. Apresentação (app/ e components/)
- **Responsabilidade**: Interface do usuário e interações
- **Tecnologias**: React 19, Next.js 16 App Router
- **Componentes principais**:
  - `page.tsx`: Orquestração dos componentes
  - `cep-search.tsx`: Formulário e validação
  - `weather-display.tsx`: Visualização dados climáticos
  - `search-history.tsx`: Listagem do histórico

### 2. Lógica de Negócio (lib/)
- **Responsabilidade**: Regras de negócio e transformações
- **Módulos**:
  - `api/cep.ts`: Lógica de consulta CEP com fallback
  - `api/weather.ts`: Lógica de consulta clima e geocoding
  - `history.ts`: Gerenciamento do histórico
  - `utils.ts`: Funções utilitárias

### 3. Tipos (types/)
- **Responsabilidade**: Definições de tipos TypeScript
- **Arquivos**:
  - `address.ts`: Interfaces de endereço e CEP
  - `weather.ts`: Interfaces de clima e forecast

### 4. Testes (tests/)
- **Responsabilidade**: Garantia de qualidade
- **Estrutura espelhada do código fonte**
- **Tipos de testes**:
  - Unitários: Funções e utilitários
  - Integração: APIs e fluxos
  - Componentes: Rendering e interações

## Fluxo de Dados

\`\`\`
Usuário
  ↓
Componente (presentation)
  ↓
React Hook Form (validação)
  ↓
TanStack Query (cache + estado)
  ↓
API Client (lib/api)
  ↓
API Externa
  ↓
Normalização de dados
  ↓
Estado da aplicação
  ↓
Renderização
\`\`\`

## Padrões de Design

### 1. Repository Pattern (lib/api)
- Abstração das APIs externas
- Normalização de respostas
- Tratamento centralizado de erros

### 2. Custom Hooks
- Encapsulamento de lógica reutilizável
- Separação de concerns
- Exemplo: histórico, validações

### 3. Composition Pattern
- Componentes pequenos e focados
- Reutilização através de props
- Melhor testabilidade

### 4. Error Boundaries
- Tratamento gracioso de erros
- Feedback visual consistente
- Recovery automático quando possível

## Gerenciamento de Estado

### Estado Servidor (TanStack Query)
- Cache de requisições
- Invalidação automática
- Background refetch
- Optimistic updates

### Estado Cliente (React State)
- Form state (React Hook Form)
- UI state (loading, modals)
- Local storage (histórico)

## Segurança

### Validação
- Client-side: Zod + React Hook Form
- Sanitização de inputs
- Prevenção de XSS

### APIs
- Timeout em todas as requisições
- Retry com backoff
- Tratamento de rate limiting

## Performance

### Otimizações
- Server Components por padrão
- Client Components apenas quando necessário
- Code splitting automático (Next.js)
- Image optimization (quando aplicável)

### Caching Strategy
- Clima: 10 minutos (dados mudam pouco)
- CEP: Infinity (dados estáticos)
- Histórico: localStorage (persistente)

## Escalabilidade

### Preparado para crescimento
- Feature folders (se necessário)
- Lazy loading de componentes pesados
- API routes para backend (se necessário)
- Separação clara de concerns

### Possíveis expansões
- Backend próprio para cache distribuído
- Autenticação de usuários
- Sincronização entre dispositivos
- Analytics e monitoramento
