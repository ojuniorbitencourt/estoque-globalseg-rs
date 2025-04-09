# Documentação do Sistema ERP - Global Seg

## Visão Geral do Projeto

O Sistema ERP Global Seg é uma aplicação web desenvolvida com Next.js para gerenciamento de operações de uma empresa de segurança, incluindo controle de técnicos, estoque, atendimentos e clientes.

## Tecnologias Utilizadas

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: JWT com cookies

## Estrutura do Projeto

```
app/
├── api/                    # API Routes
│   ├── atendimentos/       # Endpoints para atendimentos
│   ├── clientes/           # Endpoints para clientes
│   ├── estoque/            # Endpoints para estoque
│   ├── produtos/           # Endpoints para produtos
│   ├── tecnicos/           # Endpoints para técnicos
│   └── ...
├── dashboard/              # Páginas do dashboard
│   ├── atendimentos/       # Gestão de atendimentos
│   ├── clientes/           # Gestão de clientes
│   ├── configuracoes/      # Configurações do sistema
│   ├── estoque/            # Gestão de estoque
│   ├── produtos/           # Gestão de produtos
│   ├── relatorios/         # Relatórios
│   ├── tecnicos/           # Gestão de técnicos
│   └── vendas/             # Gestão de vendas
├── login/                  # Página de login
└── ...
components/
├── dashboard/              # Componentes específicos do dashboard
│   ├── atendimentos/       # Componentes de atendimentos
│   ├── clientes/           # Componentes de clientes
│   ├── estoque/            # Componentes de estoque
│   ├── tecnicos/           # Componentes de técnicos
│   └── ...
├── ui/                     # Componentes de UI reutilizáveis (shadcn)
└── ...
lib/
├── prisma.ts               # Cliente Prisma
├── auth.ts                 # Configuração de autenticação
└── utils.ts                # Funções utilitárias
prisma/
├── schema.prisma           # Esquema do banco de dados
└── migrations/             # Migrações do banco de dados
```

## Modelo de Dados

### Principais Entidades

1. **User**: Usuários do sistema (admin, técnicos)
2. **Cliente**: Clientes da empresa
3. **Tecnico**: Técnicos que realizam atendimentos
4. **Produto**: Produtos utilizados nos atendimentos
5. **EstoqueTecnico**: Estoque de produtos por técnico
6. **MovimentacaoEstoque**: Registro de movimentações de estoque
7. **Atendimento**: Registro de atendimentos realizados
8. **ItemAtendimento**: Produtos utilizados em cada atendimento
9. **Documento**: Documentos armazenados no sistema

## Funcionalidades Implementadas

### Módulo de Técnicos
- Listagem de técnicos
- Cadastro de novos técnicos
- Visualização detalhada de técnico
- Registro de atendimentos por técnico
- Controle de estoque por técnico
- Transferência de itens entre técnicos

### Módulo de Estoque
- Controle de estoque central
- Movimentação de estoque (entrada, saída, transferência)
- Visualização de histórico de movimentações
- Atribuição de produtos a técnicos

### Módulo de Atendimentos
- Registro de atendimentos
- Associação de produtos utilizados
- Baixa automática no estoque do técnico
- Visualização de histórico de atendimentos

### Módulo de Clientes
- Cadastro e gestão de clientes
- Visualização de atendimentos por cliente

## Problemas Resolvidos Recentemente

1. **Correção na Exibição de Dados do Técnico**:
   - Corrigido o problema onde o nome e email do técnico não eram exibidos corretamente na página de detalhes
   - Ajustado o mapeamento de dados para acessar corretamente os campos aninhados do objeto `user`

2. **Correção no Acesso a Parâmetros de Rota**:
   - Implementado o uso do hook `React.use()` para acessar os parâmetros de rota de forma segura
   - Resolvido o aviso sobre acesso direto a propriedades de `params`

3. **Correção de Erros de Hidratação**:
   - Resolvidos problemas de incompatibilidade entre o HTML renderizado no servidor e no cliente
   - Ajustados estilos inline e tratamento de valores nulos

4. **Correção no Registro de Atendimentos**:
   - Ajustado o tratamento do campo `local` na API de atendimentos
   - Implementadas validações mais robustas para os dados de atendimento

## Estado Atual e Próximos Passos

O sistema está funcional com os módulos principais implementados. Os problemas recentes de renderização e acesso a parâmetros foram corrigidos.

### Próximos Passos Sugeridos:
1. Implementar funcionalidade de edição de técnicos
2. Melhorar a página de detalhes de atendimentos
3. Implementar relatórios mais detalhados
4. Adicionar funcionalidades de exportação de dados

## Notas Técnicas Importantes

1. **Acesso a Parâmetros de Rota**:
   - Sempre use `React.use(params)` para acessar parâmetros de rota em componentes cliente
   - Exemplo: `const { id } = use(params)` em vez de `params.id`

2. **Tratamento de Dados da API**:
   - Sempre verifique a existência de objetos aninhados antes de acessá-los
   - Use valores padrão para campos que podem ser nulos ou indefinidos

3. **Componentes de Diálogo**:
   - Os diálogos de cadastro e edição seguem um padrão consistente
   - Sempre implemente validação de dados antes do envio para a API

4. **Estilo e UI**:
   - O sistema utiliza componentes do shadcn/ui
   - A estilização é feita principalmente com Tailwind CSS

