# 🎟️ DiskIngressos ERP — Monorepo Corporativo (Fase 1: Fundação)

Sistema integrado de **Gestão Contábil, Financeira, Governança e Central de Fechamento por Evento** para a DiskIngressos.

---

## 🏛️ Topologia da Arquitetura

O projeto adota a arquitetura **Monorepo** orquestrada por **Turborepo** e **npm workspaces**:

```text
diskingressos-erp/
│
├── apps/
│   ├── api/                  # Backend NestJS 10 + TypeScript + Prisma ORM
│   ├── web/                  # Frontend React 18 + Vite + Tailwind CSS (Equipe Interna)
│   └── producer-portal/      # Portal do Produtor (Isolado por Tenant)
│
├── packages/
│   ├── types/                # Contratos TypeScript compartilhados (Auth, RBAC, DTOs)
│   ├── utils/                # Formatadores BRL, máscaras e helpers
│   ├── config/               # Configurações TypeScript base
│   └── ui/                   # Design system e componentes atômicos
│
├── database/
│   ├── prisma/schema.prisma  # Modelagem PostgreSQL relacional com tipos Decimal estritos
│   └── seeds/seed.ts         # Semente de dados com perfis, permissões e operadores demo
│
├── docker-compose.yml        # PostgreSQL 16 Alpine + pgAdmin 4
├── turbo.json                # Pipeline de builds com cache incremental
└── package.json              # Raiz dos workspaces
```

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js:** Versão 20.x ou superior (testado na v24.x)
- **npm:** Versão 10.x ou superior
- **Docker & Docker Compose** (ou instância PostgreSQL local)

### 2. Instalação das Dependências
Na raiz do projeto (`diskingressos-erp` ou `ERP V1 MIRROR`):
```bash
npm install
```

### 3. Subir o Banco de Dados (PostgreSQL 16)
```bash
docker compose up -d
```
> O PostgreSQL ficará ativo na porta `5432` com usuário `diskingressos` e senha `disk2026erp`.  
> O **pgAdmin 4** estará disponível em `http://localhost:5050` (login: `admin@diskingressos.com.br`, senha: `disk2026pg`).

### 4. Configurar as Variáveis de Ambiente
Copie o arquivo de exemplo para a raiz:
```bash
cp .env.example .env
```

### 5. Executar as Migrações e o Seed do Banco
```bash
# Gera o cliente Prisma com os tipos TypeScript
npm run db:generate

# Cria as tabelas no PostgreSQL
npm run db:migrate

# Popula os perfis, permissões e usuários de demonstração
npm run db:seed
```

### 6. Iniciar as Aplicações em Modo de Desenvolvimento
```bash
npm run dev
```

- **Frontend ERP Web:** [http://localhost:3000](http://localhost:3000)
- **Backend NestJS API:** [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
- **Documentação Interativa (Swagger):** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)
- **Health Check:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)

---

## 👥 Credenciais de Demonstração (Seed)

| Perfil | E-mail | Senha Padrão | Escopo de Acesso |
| :--- | :--- | :---: | :--- |
| **ADMIN** | `admin@diskingressos.com.br` | `demo123` | Acesso global total, auditoria e usuários |
| **DIRETORIA** | `diretoria@diskingressos.com.br` | `demo123` | Visão executiva, BI e relatórios gerenciais |
| **FINANCEIRO** | `karine@diskingressos.com.br` | `demo123` | Contas a pagar/receber, conciliação e repasses |
| **CONTABILIDADE** | `contabilidade@diskingressos.com.br` | `demo123` | Plano de contas, balancetes, DRE e diário |
| **OPERACIONAL** | `operador@diskingressos.com.br` | `demo123` | Bilheteria, conferência de lotes e vendas |
| **PRODUTOR** | `produtor@demo.disk` | `demo123` | **Isolado:** visualiza apenas a Produtora Curitiba Shows |

---

## 🔐 Matriz de Segurança e Autenticação (Fase 1)

1. **Dual-Token com Rotação Estrita:**
   - **Access Token:** JWT de 15 minutos contendo `sub`, `roles` e `producerId`.
   - **Refresh Token:** Token criptográfico opaco de 7 dias armazenado no banco com hash SHA-256 e rotação atômica no endpoint `/api/v1/auth/refresh`.
2. **Guards NestJS:**
   - `JwtAuthGuard`: Protege todas as rotas por padrão (rotas públicas decoradas com `@Public()`).
   - `RolesGuard`: Valida a matriz RBAC em tempo de execução.
   - `TenantGuard`: Bloqueia tentativas de operadores de um produtor acessarem dados de outros produtores.
3. **Auditoria Imutável:**
   - Toda operação de escrita (`POST`, `PUT`, `PATCH`, `DELETE`) é interceptada e registrada em `audit_logs` com IP, usuário, data e payload.

---

## 📈 Roadmap das Próximas Fases

- [x] **FASE 1 — Fundação:** Monorepo, React, NestJS, PostgreSQL, Prisma, Docker, Autenticação JWT com rotação, RBAC, Auditoria e Layout Base.
- [ ] **FASE 2 — Operações Core:** Módulos de Produtores, Eventos, Vendas Multi-Canal e Dashboard Executivo em tempo real.
- [ ] **FASE 3 — Financeiro:** Contas a Receber, Contas a Pagar, Pagamentos e Motor de Repasses.
- [ ] **FASE 4 — Gateways & Conciliação:** Integração Cielo, Stone, Rede, PagBank, extratos OFX/CSV, estornos e chargebacks.
- [ ] **FASE 5 — Contabilidade Oficial:** Plano de Contas, Lançamentos em partidas dobradas, Diário, Razão, Balancete e DRE Gerencial.
- [ ] **FASE 6 — Fiscal & Documentos:** Módulo Fiscal, apuração de ISS/PIS/COFINS e GED por evento.
- [ ] **FASE 7 — BI & Notificações:** Indicadores executivos avançados, inteligência e fila de notificações.
- [ ] **FASE 8 — Portal do Produtor:** Aplicação React independente para o produtor credenciado.
- [ ] **FASE 9 — Integrações DiskIngressos:** Conexão com PDVs, totens e sistemas legado.
- [ ] **FASE 10 — Testes, Segurança & Deploy:** Testes ponta a ponta e preparação de infraestrutura produtiva.
