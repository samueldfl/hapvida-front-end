# Testes Automatizados

Este projeto utiliza **Vitest** e **Testing Library** para testes automatizados.

## Estrutura de Testes

\`\`\`
tests/
├── setup.ts                      # Configuração global dos testes
├── lib/
│   ├── utils.test.ts            # Testes de utilitários
│   ├── history.test.ts          # Testes de histórico
│   └── api/
│       ├── cep.test.ts          # Testes da API de CEP
│       └── weather.test.ts      # Testes da API de clima
└── components/
    ├── cep-search.test.tsx      # Testes do componente de busca
    └── search-history.test.tsx  # Testes do histórico
\`\`\`

## Executar Testes

\`\`\`bash
# Executar todos os testes
npm test

# Executar com interface visual
npm run test:ui

# Executar com cobertura
npm run test:coverage

# Executar em modo watch
npm test -- --watch
\`\`\`

## Cobertura de Testes

Os testes cobrem:

- ✅ Validação e formatação de CEP
- ✅ Formatação de datas
- ✅ Integração com APIs (BrasilAPI, ViaCEP, Open-Meteo)
- ✅ Fallback entre provedores de CEP
- ✅ Gerenciamento de histórico no localStorage
- ✅ Componentes de interface
- ✅ Interações do usuário
- ✅ Estados de loading e erro

## Tecnologias

- **Vitest**: Framework de testes rápido e moderno
- **Testing Library**: Testes focados em comportamento do usuário
- **jsdom**: Ambiente de navegador simulado
