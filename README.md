# 🎟️ DiskIngressos ERP Enterprise — Release v1.0 Final

> **Link Oficial de Produção (Vercel):** [**https://erpv1mirror.vercel.app/**](https://erpv1mirror.vercel.app/)
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
| **17** | **Antecipações & Travas BCB** | Cessão Fiduciária de Recebíveis (Res. BCB 4.734 / Circ. 3.952), Margem Consignável (Fundo Escrow 25%), Travas em Adquirentes (Cielo/Stone/Rede na CERC/CIP) e Amortização Cascata. |
| **18** | **Split de Pagamento & Subadquirência** | Divisão primária em checkout na adquirente (Cielo, Stone, Rede, PagBank), Subcontas KYC, mitigação de bitributação (LC 116/03 & IN RFB 2.179) e estorno pro-rata. |
| **19** | **Sociedades em Conta de Participação (SCP)** | Aportes de Risco, Hurdle Waterfall (Payback 100% + taxa preferencial + upside), Gestão de Sócios Participantes (CC arts. 991-996), Isenção Tributária (Lei 9.249/95 Art. 10) e Liquidação Pix. |
| **20** | **Reforma Tributária 2026 (IVA Dual & Split)** | IVA Dual (CBS 3,52% + IBS 7,08% c/ 60% redução p/ eventos - Art. 138 PLP 68/24), Split Tributário Instantâneo no Checkout (Art. 49), Não-Cumulatividade Plena (Créditos de Rider/Palco) e DFe. |
| **21** | **Open Finance (ITP) & Pix SPI Real-Time** | Iniciação de Pagamentos (Res. BCB 109/21), Pix Cobrança Dinâmico com Split SPI, Conciliação Preditiva Sub-segundo (Bacen mTLS) e Escrituração Contábil Automática. |
| **22** | **IA Tesouraria, Yield Management & Credit Scoring** | Modelagem Estocástica de Fluxo de Caixa a 90 Dias com Alerta de Gaps, Precificação Dinâmica de Ingressos por Elasticidade de Demanda, Credit Scoring Soberano de Produtores (AAA a C) e Cash Sweep Automático em 100% CDI. |
| **23** | **Auditoria Contínua com IA, Antifraude Sentinel & LGPD** | Detecção Comportamental de Bots Cambistas em Milissegundos, Quarentena Preventiva de Ingressos, Reconciliação Contínua de Divergências Gateway vs Borderô, Gestão de Direitos dos Titulares (LGPD Art. 18) e Anonimização Segura com Preservação de Guarda Fiscal de 5 Anos (Art. 16, I). |
| **24** | **Gateway Global Multi-Moeda & Câmbio FX** | Venda Internacional em USD, EUR e GBP com Conversão Spot PTAX/Bacen, Tributação Automatizada de IOF Câmbio (Decreto 6.306/07), Contratos de Trava Cambial (FX Lock / Hedge) para Atrações Internacionais e Escrituração Contábil NBC TG 02 / IAS 21. |
| **25** | **Consolidação IFRS, Equivalência Patrimonial & Balanço Global** | Consolidação Integral de Múltiplos CNPJs e SPEs de Eventos (CPC 36 / IFRS 10), Eliminações Intercompany Recíprocas em Partidas Dobradas, Apuração do Método da Equivalência Patrimonial (MEP - CPC 18 / IAS 28), Conversão Cambial de Balanços com Taxa Spot e Média (CPC 02 / IAS 21) e Segregação de Ajuste de Avaliação Patrimonial (AAP/ORA) no PL. |
| **26** | **Governança ESG, Pegada de Carbono & Borderô Verde** | Inventário GHG Protocol por Evento (Escopos 1, 2 e 3), Cálculo Paramétrico de Emissões de Deslocamento de Público (CEP) e Resíduos, Retenção Automática de Sustentabilidade no Borderô (Ingresso Neutro), Custódia e Aposentadoria de Créditos de Carbono Certificados (Verra VCS / B3 CBIOMOB) e Demonstrações CVM Res. 193/2023 / IFRS S1 e S2. |
| **27** | **Tokenização RWA, Recebíveis em DREX & Smart Contracts** | Emissão de Pools de Tokens RWA no Piloto DREX (Bacen / Hyperledger Besu) e ERC-3643, Liquidação Escrow Condicional por Oráculos de Eventos (Soundcheck/Portões), Mercado Secundário Regulado com Trava Anti-Cambismo (+20% máx), Split Automático de Royalties Contínuos e Escrituração OCPC 10 / CVM. |
| **28** | **FIDC de Bilheteria & Entretenimento (Resolução CVM 175)** | Estruturação de Cotas Seniores, Mezanino e Subordinadas (First-loss piece 25%), Monitoramento de Índice de Subordinação Mínimo com Trava Regulatória, Cessão Fiduciária de Recebíveis com Registro CERC/B3, Marcação a Mercado Diária (MtM) e Escrituração Contábil Fiduciária. |
| **29** | **Inteligência Regulamentar de IA Contábil & Copilot CFO** | Swarm de 5 Agentes Especialistas em Paralelo (Fiscal EC 132, DREX/SPI, IFRS/MEP, FIDC/RWA e Governança SoD), Fechamento Contábil Autônomo "Zero-Touch", Reconciliação Sub-Segundo de Centavos e Truncamento com Chain of Thought, AI Copilot CFO Interativo com Métricas Consolidadas e Radar Preditivo de Balanços. |
| **30** | **Central de Observabilidade Executiva, Digital Boardroom & DFP CVM / Big Four** | Cockpit Soberano C-Level & Conselho de Administração com Streaming de Telemetria Contábil, Geração Automatizada de Pacotes DFP / ITR com Hash SHA-256 para CVM EmpresasNet, Cobertura Integral das 5 Demonstrações (Balanço, DRE, DFC, DMPL e DVA) com Notas Explicativas Padronizadas (CPC 26, CVM 175, CVM 193) e Matriz de Riscos Corporativos (GRC / COSO ERM). |
| **31** | **Pix Automático, Débito Recorrente BCB 430/431 & Smart Retries SPI** | Gestão de Mandatos Digitais Pré-Autorizados de Débito, Liquidação Instantânea Sub-Segundo no SPI (<1000ms), Split Quádruplo Automático no Banco Central (Disk 12%, Produtor 75%, FIDC 12%, ESG 1%), Motor de Smart Retries por IA em Janelas de Maior Liquidez e Conciliação Instantânea sem Gateway. |
| **32** | **Split Payment Tributário Inteligente no Checkout (PLP 68/2024 & Comitê Gestor IBS/CBS)** | Retenção e Segregação Atômica do IVA Dual (CBS Federal + IBS Subnacional) no Momento da Liquidação Bancária no SPI, Isolamento Estrito de Base Própria (Comissões) vs Fiduciária de Repasse dos Produtores (Art. 52 PLP 68/2024), Alíquotas de Transição 2026 (0,9% CBS / 0,1% IBS) e Regime Reduzido de Eventos (3,52% CBS / 7,08% IBS), Acumulador de Créditos de Insumos da Não-Cumulatividade (Art. 28) e Emissão Automática de Protocolos Homologados pelo Comitê Gestor IBS. |
| **33** | **DRE & Balancete por Centro de Custo de Evento com Custeio ABC** | Apuração Gerencial Vertical e Horizontal por Evento/Espetáculo (Art. 187 Lei 6.404/76 e NBC TG 26 / CPC 26), Segregação Matricial de Custos Diretos e Indiretos, Alocação Automatizada via Custeio Baseado em Atividades (ABC) com Direcionadores Operacionais (SAC, Cloud K8s, Gateway) e Imutabilidade Criptográfica SHA-256 para Big Four. |
| **34** | **Conciliação Bancária Autônoma Contínua via IA & Liquidação D+0 com Escrow** | Agente Autônomo de Conciliação Bancária com IA em Tempo Real (Acurácia > 99,8%), Detecção e Escrituração Contábil Automática de Tarifas Bancárias Ocultas (PIX, TED, Float e Registradora CIP/CERC), Trava Paramétrica de Saldo Mínimo Escrow de Segurança (15%) para Risco de Chargeback e Liquidação Instantânea de Repasses D+0. |
| **35** | **Gestão Orçamentária Corporativa, Budget vs. Actual & Forecast Preditivo por IA** | Planejamento Orçamentário Anual e Plurianual (CAPEX/OPEX), Comparativo em Tempo Real de Orçado vs. Realizado (*Budget vs Actual*), Matriz de Variância Contábil, Projeção Rolling Forecast a 12 Meses e Simulador de Sensibilidade/Estresse. |
| **36** | **Auditoria de Borderô Físico-Digital com Assinatura ICP-Brasil & ITI** | Homologação Jurídica Irrevogável (MP 2.200-2/2001 e Lei 14.063/2020), Carimbo do Tempo Oficial (ACT Observatório Nacional), Padrão Criptográfico PAdES-LTV (Long Term Validation) e Validador ITI. |
| **37** | **Central de Gestão & Apuração ECAD / Direitos Autorais Automatizada** | Apuração Paramétrica de Direitos Autorais (7,5% a 10,0% da Receita Bruta segundo Art. 68 da Lei 9.610/98), Retenção Fiduciária no Borderô, Segregação em Conta de Terceiros (Passivo 2.1.4.05) e Catalogação de Cue-Sheets ISRC. |
| **38** | **Prevenção à Lavagem de Dinheiro (PLD-FT), COAF & Monitoramento Bacen** | Conformidade Circular BCB 3.978/2020 e Lei 9.613/98, Radar Comportamental Anti-Smurfing e Compras Fracionadas, Triagem Automatizada de Pessoas Politicamente Expostas (PEP), Quarentena Preventiva e Comunicação SISCOAF. |
| **39** | **Liquidação Interbancária Contínua SPI / STR & Mensageria ISO 20022** | Conectividade Nativa com a Rede RSFN via Mensageria Padronizada ISO 20022 (pacs.008, pacs.004, camt.053), Liquidação Bruta em Tempo Real (LBTR) Sub-segundo no SPI e Conciliação Atômica Interbancária sem Risco de Fila. |
| **40** | **Suíte Soberana de Auditoria Contínua & War Room da Diretoria / CFO** | War Room Supremo C-Level com *Zero-Trust Financial Kernel*, Validação Contínua de 480 Regras Contábeis em Todas as 40 Fases, Árvore Criptográfica Merkle Patricia Tree (MPT), *Kill-Switch Patrimonial* e Dossiê ISAE 3402 / SOC 1 Type II para Big Four. |
| **41** | **Motor de Precificação Dinâmica & Yield Management com IA** | Algoritmos Preditivos de Elasticidade de Demanda (Prophet-LSTM), Surge Pricing por Lote, Travas Tarifárias Anti-Abusividade e Trilha Imutável de Auditoria. |
| **42** | **Gestão de Royalties & Direitos de Artistas Internacionais** | Retenção Tributária Withholding Tax (IRRF 15%/25% + CIDE 10%), Tratados de Bitributação (DTA), DARFs 0422/8741 e Liquidação Cambial SWIFT / Bacen. |
| **43** | **Hub de Fidelidade, Cashback & Passivo Circulante CPC 47 / IFRS 15** | Alocação do Preço da Transação para Obrigações de Desempenho Não Cumpridas, Taxa Estimada de Expiração (Breakage Rate Atuarial) e Reconhecimento Diferido. |
| **44** | **Gestão Contábil de PDVs Físicos, Totens & Sangria com Custódia** | Fechamento Auditado de Turnos de Caixas, Conciliação Multimeios (Espécie, TEF, Pix), Sangrias Lacradas com GTV e Custódia por Transportadora de Valores (Brinks/Prosegur). |
| **45** | **Central de Seguros de Ingressos & Sinistros (SUSEP Circular 621/2021)** | Ticket Refund Insurance, Emissão Automática de Apólices SUSEP, Regulação de Sinistros por Força Maior/Médico, Repartição de Comissões de Corretagem (DiskSeg 20%) e Monitoramento de Loss Ratio. |

---

## 🛠️ Como Executar e Testar

### 1. Executar Bateria de Testes de Auditoria e Hardening (Fases 32 a 45)
```bash
npx tsx scripts/verify-fase32.ts
npx tsx scripts/verify-fase33.ts
npx tsx scripts/verify-fase34.ts
npx tsx scripts/verify-fase35.ts
npx tsx scripts/verify-fase36.ts
npx tsx scripts/verify-fase37.ts
npx tsx scripts/verify-fase38.ts
npx tsx scripts/verify-fase39.ts
npx tsx scripts/verify-fase40.ts
npx tsx scripts/verify-fase41.ts
npx tsx scripts/verify-fase42.ts
npx tsx scripts/verify-fase43.ts
npx tsx scripts/verify-fase44.ts
npx tsx scripts/verify-fase45.ts
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
