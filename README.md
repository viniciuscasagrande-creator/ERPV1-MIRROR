# 🎟️ DiskIngressos ERP Enterprise — Release v1.0 Final (10 Fases Concluídas)

> **Sistema Integrado de Gestão Contábil, Financeira, Governança, Central de Fechamento por Evento e Portal Multi-Tenant do Produtor.**

---

## 🌐 Acesso Local para Visualização

O frontend está compilado e ativo para acesso imediato no seu navegador:

- **🔗 URL de Acesso Local:** [**http://localhost:5173**](http://localhost:5173)
- **⚙️ Backend API NestJS:** [**http://localhost:3001/api/v1**](http://localhost:3001/api/v1)
- **📚 Documentação Swagger / OpenAPI:** [**http://localhost:3001/api/docs**](http://localhost:3001/api/docs)
- **⚡ Gateway WebSocket Real-Time:** `ws://localhost:3001/realtime`

### 🔑 Credenciais Pré-configuradas (Clique Rápido na Tela de Login)

| Perfil | E-mail | Senha Padrão | Escopo de Acesso | Ambiente de Destino |
| :--- | :--- | :---: | :--- | :--- |
| **ADMIN MASTER** | `admin@diskingressos.com.br` | `demo123` | Acesso global total, auditoria e usuários | ERP Interno (`/dashboard`) |
| **FINANCEIRO** | `karine@diskingressos.com.br` | `demo123` | Tesouraria, Contas a Pagar/Receber, Repasses | ERP Interno (`/dashboard`) |
| **CONTABILIDADE** | `carlos@diskingressos.com.br` | `demo123` | Plano de Contas, Balancete, DRE e Fechamento Mensal | ERP Interno (`/dashboard`) |
| **PRODUTOR EXTERNO** | `produtor@demo.disk` | `demo123` | **Isolamento Multi-Tenant:** Curitiba Shows | Portal do Produtor (`/portal-produtor/dashboard`) |

> **Nota de Usabilidade Local:** O sistema possui um motor de tolerância a falhas e dados demonstrativos automáticos integrados. Você pode clicar diretamente nos botões de demonstração na tela de login para navegar em todos os 15 módulos sem necessidade de subir banco de dados externo.

---

## 🏛️ Topologia da Arquitetura Monorepo

O projeto é estruturado em **Monorepo** orquestrado por **Turborepo** e **npm workspaces**:

```text
diskingressos-erp/
│
├── apps/
│   ├── api/                      # Backend NestJS 10 + TypeScript + Prisma ORM + Socket.IO
│   │   └── src/modules/
│   │       ├── auth/             # JWT, RBAC & Autenticação
│   │       ├── users/            # Gestão de Usuários e Permissões
│   │       ├── producers/        # Cadastro e Contratos de Produtoras
│   │       ├── eventos/          # Eventos, Lotes, Ingressos e Central de Fechamento
│   │       ├── vendas/           # Bilheteria Multicanal (Online, PDV, POS, Totem)
│   │       ├── contas-receber/   # Contas a Receber & Conciliação de Vendas
│   │       ├── contas-pagar/     # Contas a Pagar & Despesas
│   │       ├── repasses/         # Repasses a Produtores (REP-YYYY-XXXXXX)
│   │       ├── fluxo-caixa/      # Fluxo de Caixa Diário e Projetado
│   │       ├── bancos/           # Contas Bancárias (Itaú, Bradesco)
│   │       ├── conciliacao/      # Conciliação de Extratos OFX 1-Click
│   │       ├── gateways/         # Auditoria de Taxas MDR (Cielo, Stone, Rede)
│   │       ├── contabilidade/    # Plano de Contas, Diário, Balancete e DRE
│   │       ├── fiscal/           # NFS-e ABRASF Curitiba, Lucro Presumido, SPED & Guias
│   │       ├── bi/               # BI Contábil & Métricas de Performance
│   │       ├── relatorios/       # Exportador Executivo Multi-formato
│   │       ├── producer-portal/  # Portal Multi-Tenant Restrito ao Produtor
│   │       └── accounting-period/# Travas de Competência Contábil & Fechamento Mensal
│   │
│   └── web/                      # Frontend React 18 + Vite 5 + Tailwind CSS
│       └── src/
│           ├── app/              # Layouts, Header, Sidebar e Router
│           ├── modules/          # Telas completas de todos os 15 módulos
│           ├── services/         # Cliente Axios com interceptors e refresh token
│           └── stores/           # Zustand Stores (Auth, UI, Filtros)
│
├── packages/
│   ├── types/                    # Tipos e DTOs TypeScript compartilhados
│   ├── utils/                    # Formatadores BRL, máscaras e cálculos
│   └── config/                   # Configurações TypeScript base
│
├── database/
│   ├── prisma/schema.prisma      # Modelagem relacional PostgreSQL com tipos Decimal
│   └── seeds/seed.ts             # Semente oficial com dados reais das 10 Fases
│
├── scripts/
│   └── verify-fase10.ts          # Script de testes automatizados e hardening
│
├── docker-compose.yml            # PostgreSQL 16 Alpine + pgAdmin 4
├── turbo.json                    # Pipeline de compilação em cache
└── README.md
```

---

## 📋 Resumo das Fases Implementadas (Release Enterprise)

| Fase | Título | Entregas Principais |
| :---: | :--- | :--- |
| **1** | **Fundação & RBAC** | Monorepo Turborepo, NestJS 10, React 18, Vite, PostgreSQL, Prisma, JWT e RBAC (6 perfis). |
| **2** | **Núcleo de Bilheteria** | Produtores, Eventos, Lotes, Vendas Multi-canal e **Central de Fechamento por Evento** (9 portões). |
| **WebSocket** | **Real-Time Gateway** | Comunicação bi-direcional via Socket.IO em `/realtime` com canais específicos de eventos e repasses. |
| **3** | **Financeiro & Tesouraria** | Contas a Receber, Contas a Pagar, Repasses a Produtores (`REP-YYYY-XXXXXX`) e Fluxo de Caixa. |
| **4** | **Bancos & Gateways** | Contas Bancárias (Itaú/Bradesco), Conciliação OFX 1-Click e Auditoria de Desvios MDR. |
| **5** | **Contabilidade Oficial** | Plano de Contas de 5 níveis, Livro Diário com partidas dobradas ($\sum D = \sum C$), Balancete e DRE Oficial. |
| **6** | **Fiscal & Tributário** | Segregação de receita (Terceiros x Própria), NFS-e Curitiba ABRASF, DARF/DAM e SPED Contribuições/EFD-Reinf. |
| **7** | **BI & Auditoria** | Dashboard Executivo de BI, Relatórios Contábeis e Trilha de Auditoria Forense com diff visual. |
| **8** | **Portal do Produtor** | Acesso externo restrito multi-tenant (`User.producerId`), borderôs analíticos, comprovantes bancários e NFS-e. |
| **9** | **Governança & Travas** | Controle de períodos contábeis, trava de competência (`checkCompetenciaAberta`) e checklist 5/5 de fechamento. |
| **10** | **Hardening & Release** | Testes de integração E2E (100% aprovados), build monorepo em 15s e visualização local ativada. |
| **11** | **GED & CNAB 240** | Repositório digital GED, remessa/retorno bancário CNAB 240 FEBRABAN e configurações do sistema. |
| **12** | **Notificações & Webhooks** | Mensageria real-time WebSocket, disparo de webhooks autenticados HMAC-SHA256 e trilha de eventos. |
| **13** | **Exportadores Contábeis** | Layouts oficiais Domínio Sistemas, Fortes Contábil, Questor e planilhas estruturadas. |
| **14** | **Disaster Recovery & 5 Anos** | Retenção Contábil Legal (Lei 10.406/02 Art. 1.194 & LC 123/06 Art. 26), snapshots WORM, SHA-256 e testes de DR. |
| **15** | **Governança & Alçadas (SoD)** | Matriz de alçadas multinível (Faixas A, B, C dupla chave CFO), segregação de funções e quarentena de dados bancários (48h). |
| **16** | **Assinaturas & Conta Azul** | Assinaturas Digitais Jurídicas (Autentique/Clicksign/ICP-Brasil), Borderôs Eletrônicos Sequenciais (Produtor 1º, Disk 2º) e Integração Conta Azul. |

---

## 🛠️ Como Executar e Testar

### 1. Executar Testes de Hardening (Fase 10)
```bash
npx ts-node scripts/verify-fase10.ts
```

### 2. Compilar Todos os Workspaces (Turborepo)
```bash
npm run build
```

### 3. Rodar o Ambiente Completo em Desenvolvimento
```bash
npm run dev
```

---

## 🔒 Regras de Negócio e Compliance

1. **Segregação de Receita (Lei Complementar 116/03 & Solução de Consulta COSIT nº 23/2014):**
   - O valor bruto do ingresso pertence por lei ao Produtor (Terceiro).
   - Apenas a **Comissão** e a **Taxa de Conveniência** compõem a receita própria tributável da DiskIngressos.
2. **Partidas Dobradas no Centavo:**
   - Todo lançamento contábil exige $\sum \text{Débito} = \sum \text{Crédito}$ com precisão de duas casas decimais.
3. **Trava de Período Contábil:**
   - Períodos com status `ENCERRADO` bloqueiam imediatamente qualquer tentativa de lançamento, edição ou estorno retroativo.
4. **Isolamento Multi-Tenant:**
   - Produtores externos possuem acesso restrito aos dados da sua própria razão social, sem visibilidade de outros produtores ou da contabilidade interna da DiskIngressos.

---

DiskIngressos Serviços de Bilheteria Ltda. &copy; 2026 — Plataforma Financeira e Contábil Enterprise.
