import 'dotenv/config';
import {
  PrismaClient,
  PerfilUsuario,
  StatusOperacao,
  StatusEvento,
  StatusFinanceiroEvento,
  StatusLote,
  CanalVenda,
  MetodoPagamento,
  StatusRecebivel,
  StatusContaPagar,
  StatusRepasse,
  CategoriaDespesa,
  TipoTransacao,
  TipoContaBancaria,
  TipoLancamentoExtrato,
  StatusConciliacao,
  StatusGateway,
  NaturezaConta,
  GrupoContabil,
  TipoPartida,
  StatusLancamento,
  TipoDocumentoFiscal,
  StatusDocumentoFiscal,
  RegimeTributario,
  TipoTributo,
  StatusGuiaRecolhimento,
  TipoSped,
  StatusPeriodoContabil,
} from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = 'disk_ingressos_salt_2026';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

async function main() {
  console.log('🚀 Iniciando Seed Operacional - DiskIngressos ERP (Fase 1 & Fase 2)...');

  // 1. Perfis Canônicos
  const rolesData = [
    { nome: PerfilUsuario.ADMIN, descricao: 'Administrador Geral com acesso irrestrito' },
    { nome: PerfilUsuario.DIRETORIA, descricao: 'Diretoria Executiva com visão de BI e relatórios' },
    { nome: PerfilUsuario.FINANCEIRO, descricao: 'Gestão Financeira, Contas a Pagar/Receber e Repasses' },
    { nome: PerfilUsuario.CONTABILIDADE, descricao: 'Contabilidade Oficial, DRE, Balancete e Fiscal' },
    { nome: PerfilUsuario.OPERACIONAL, descricao: 'Operações de Bilheteria, Eventos e Vendas' },
    { nome: PerfilUsuario.PRODUTOR, descricao: 'Produtor Externo limitado aos seus eventos' },
  ];

  const rolesMap = new Map<PerfilUsuario, string>();
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { nome: r.nome },
      update: { descricao: r.descricao },
      create: { nome: r.nome, descricao: r.descricao },
    });
    rolesMap.set(r.nome, role.id);
  }

  // 2. Permissões Padrão
  const permissionsData = [
    { recurso: 'users', acao: 'read', descricao: 'Visualizar usuários' },
    { recurso: 'users', acao: 'write', descricao: 'Criar e editar usuários' },
    { recurso: 'events', acao: 'read', descricao: 'Consultar eventos e lotes' },
    { recurso: 'events', acao: 'write', descricao: 'Criar eventos e configurar ingressos' },
    { recurso: 'sales', acao: 'read', descricao: 'Consultar extrato de vendas' },
    { recurso: 'sales', acao: 'write', descricao: 'Emitir ingressos e registrar vendas' },
    { recurso: 'producers', acao: 'read', descricao: 'Consultar produtores' },
    { recurso: 'producers', acao: 'write', descricao: 'Cadastrar e parametrizar produtores' },
    { recurso: 'closing', acao: 'approve', descricao: 'Aprovar portões na Central de Fechamento' },
  ];

  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { recurso_acao: { recurso: p.recurso, acao: p.acao } },
      update: { descricao: p.descricao },
      create: { recurso: p.recurso, acao: p.acao, descricao: p.descricao },
    });

    const adminRoleId = rolesMap.get(PerfilUsuario.ADMIN);
    if (adminRoleId) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: adminRoleId, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRoleId, permissionId: perm.id },
      });
    }
  }

  // 3. Cadastrar 3 Produtores Reais
  const p1 = await prisma.producer.upsert({
    where: { cnpj: '12345678000190' },
    update: {},
    create: {
      cnpj: '12345678000190',
      razaoSocial: 'Produtora Curitiba Shows e Entretenimento Ltda.',
      nomeFantasia: 'Curitiba Shows',
      email: 'financeiro@curitibashows.com.br',
      telefone: '(41) 3333-8888',
      cidade: 'Curitiba',
      estado: 'PR',
      taxaComissao: 10.0,
      taxaMdr: 2.89,
      bancoNome: 'Banco Itaú Unibanco',
      bancoCodigo: '341',
      agencia: '0432',
      contaCorrente: '29871-4',
      chavePix: 'financeiro@curitibashows.com.br',
    },
  });

  const p2 = await prisma.producer.upsert({
    where: { cnpj: '98765432000100' },
    update: {},
    create: {
      cnpj: '98765432000100',
      razaoSocial: 'Live Entretenimento e Grandes Eventos S.A.',
      nomeFantasia: 'Live Entretenimento',
      email: 'contato@liveentretenimento.com.br',
      telefone: '(41) 3222-7777',
      cidade: 'Curitiba',
      estado: 'PR',
      taxaComissao: 9.5,
      taxaMdr: 2.75,
      bancoNome: 'Banco Bradesco',
      bancoCodigo: '237',
      agencia: '1120',
      contaCorrente: '55432-1',
      chavePix: '98765432000100',
    },
  });

  const p3 = await prisma.producer.upsert({
    where: { cnpj: '45678910000122' },
    update: {},
    create: {
      cnpj: '45678910000122',
      razaoSocial: 'Opus Entretenimento Regional Sul Ltda.',
      nomeFantasia: 'Opus Sul',
      email: 'contabilidade@opussul.com.br',
      telefone: '(41) 3456-9000',
      cidade: 'Curitiba',
      estado: 'PR',
      taxaComissao: 11.0,
      taxaMdr: 3.1,
      bancoNome: 'Banco Santander',
      bancoCodigo: '033',
      agencia: '3045',
      contaCorrente: '13009283-9',
      chavePix: 'opus@pix.com.br',
    },
  });

  console.log('✅ 3 Produtores cadastrados.');

  // 4. Usuários com senhas padrão
  const usersToCreate = [
    {
      nome: 'Administrador Master Disk',
      email: 'admin@diskingressos.local',
      senha: hashPassword('Admin@123'),
      cargo: 'Arquiteto / Administrador Geral',
      role: PerfilUsuario.ADMIN,
      producerId: null,
    },
    {
      nome: 'Administrador Master Disk (Demo)',
      email: 'admin@diskingressos.com.br',
      senha: hashPassword('demo123'),
      cargo: 'Arquiteto / Administrador Geral',
      role: PerfilUsuario.ADMIN,
      producerId: null,
    },
    {
      nome: 'Karine Santos',
      email: 'karine@diskingressos.com.br',
      senha: hashPassword('demo123'),
      cargo: 'Gerente Financeira Disk',
      role: PerfilUsuario.FINANCEIRO,
      producerId: null,
    },
    {
      nome: 'Alberto Souza',
      email: 'contabilidade@diskingressos.com.br',
      senha: hashPassword('demo123'),
      cargo: 'Contador CRC/PR',
      role: PerfilUsuario.CONTABILIDADE,
      producerId: null,
    },
    {
      nome: 'João Silva (Curitiba Shows)',
      email: 'produtor@demo.disk',
      senha: hashPassword('demo123'),
      cargo: 'Diretor Geral da Produtora',
      role: PerfilUsuario.PRODUTOR,
      producerId: p1.id,
    },
  ];

  for (const u of usersToCreate) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { senhaHash: u.senha, producerId: u.producerId },
      create: {
        nome: u.nome,
        email: u.email,
        senhaHash: u.senha,
        cargo: u.cargo,
        producerId: u.producerId,
        ativo: true,
      },
    });

    const rId = rolesMap.get(u.role);
    if (rId) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: rId } },
        update: {},
        create: { userId: user.id, roleId: rId },
      });
    }
  }

  // 5. Cadastrar Evento 1: Festival Curitiba 2026 (Pedreira Paulo Leminski)
  const ev1 = await prisma.event.upsert({
    where: { id: 'evt-curitiba-2026' },
    update: {},
    create: {
      id: 'evt-curitiba-2026',
      nome: 'Festival Curitiba 2026',
      categoria: 'Festival / Grande Porte',
      dataEvento: new Date('2026-11-15T16:00:00Z'),
      local: 'Pedreira Paulo Leminski',
      cidade: 'Curitiba',
      estado: 'PR',
      capacidadeTotal: 25000,
      status: StatusEvento.REALIZADO,
      statusFinanceiro: StatusFinanceiroEvento.AGUARDANDO_CONCILIACAO,
      producerId: p1.id,
      closingChecklist: {
        create: {
          vendasConferidas: true,
          cancelamentosConferidos: true,
          estornosConferidos: true,
          gatewayConciliado: true,
          bancoConciliado: false, // Em aberto gerando atenção
          financeiroApurado: false,
          contabilidadeProcessada: false,
          repasseCalculado: false,
          repasseAprovado: false,
          eventoFechado: false,
          observacoes: 'Aguardando compensação final do extrato OFX da Cielo.',
        },
      },
    },
  });

  // Lotes e Tipos do Evento 1
  const b1 = await prisma.ticketBatch.create({
    data: {
      eventId: ev1.id,
      nome: '1º Lote Oficial',
      status: StatusLote.ENCERRADO,
      ticketTypes: {
        create: [
          {
            nome: 'Pista Inteira',
            precoUnitario: 180.0,
            taxaServico: 10.0,
            quantidadeTotal: 5000,
            quantidadeVendida: 5000,
          },
          {
            nome: 'Pista Meia-Entrada',
            precoUnitario: 90.0,
            taxaServico: 10.0,
            quantidadeTotal: 5000,
            quantidadeVendida: 4800,
          },
          {
            nome: 'Camarote VIP Premium',
            precoUnitario: 380.0,
            taxaServico: 10.0,
            quantidadeTotal: 1500,
            quantidadeVendida: 1500,
          },
        ],
      },
    },
    include: { ticketTypes: true },
  });

  // Evento 2: Show MPB no Teatro Positivo
  const ev2 = await prisma.event.upsert({
    where: { id: 'evt-mpb-teatro-positivo' },
    update: {},
    create: {
      id: 'evt-mpb-teatro-positivo',
      nome: 'Turnê MPB 40 Anos — Voz e Cordas',
      categoria: 'Show / Teatro',
      dataEvento: new Date('2026-10-25T20:00:00Z'),
      local: 'Teatro Positivo Grande Auditório',
      cidade: 'Curitiba',
      estado: 'PR',
      capacidadeTotal: 2400,
      status: StatusEvento.EM_ANDAMENTO,
      statusFinanceiro: StatusFinanceiroEvento.EM_ANDAMENTO,
      producerId: p2.id,
      closingChecklist: {
        create: {
          vendasConferidas: false,
          cancelamentosConferidos: false,
          estornosConferidos: false,
          gatewayConciliado: false,
          bancoConciliado: false,
          financeiroApurado: false,
          contabilidadeProcessada: false,
          repasseCalculado: false,
          repasseAprovado: false,
          eventoFechado: false,
        },
      },
      batches: {
        create: [
          {
            nome: 'Lote Único',
            status: StatusLote.ABERTO,
            ticketTypes: {
              create: [
                {
                  nome: 'Plateia Central',
                  precoUnitario: 220.0,
                  taxaServico: 10.0,
                  quantidadeTotal: 1400,
                  quantidadeVendida: 1120,
                },
                {
                  nome: 'Plateia Superior',
                  precoUnitario: 140.0,
                  taxaServico: 10.0,
                  quantidadeTotal: 1000,
                  quantidadeVendida: 890,
                },
              ],
            },
          },
        ],
      },
    },
    include: { batches: { include: { ticketTypes: true } } },
  });

  // Evento 3: Stand-Up Comedy no Live Curitiba
  const ev3 = await prisma.event.upsert({
    where: { id: 'evt-comedy-live' },
    update: {},
    create: {
      id: 'evt-comedy-live',
      nome: 'Noite de Comédia All Stars 2026',
      categoria: 'Stand-up / Humor',
      dataEvento: new Date('2026-12-05T21:00:00Z'),
      local: 'Live Curitiba',
      cidade: 'Curitiba',
      estado: 'PR',
      capacidadeTotal: 3500,
      status: StatusEvento.PUBLICADO,
      statusFinanceiro: StatusFinanceiroEvento.EM_ANDAMENTO,
      producerId: p3.id,
      closingChecklist: { create: {} },
      batches: {
        create: [
          {
            nome: '1º Lote',
            status: StatusLote.ABERTO,
            ticketTypes: {
              create: [
                {
                  nome: 'Mesa Setor A (4 Pessoas)',
                  precoUnitario: 320.0,
                  taxaServico: 10.0,
                  quantidadeTotal: 300,
                  quantidadeVendida: 180,
                },
                {
                  nome: 'Pista Geral Promocional',
                  precoUnitario: 60.0,
                  taxaServico: 10.0,
                  quantidadeTotal: 2300,
                  quantidadeVendida: 1450,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Evento 4: Rock Legends Arena (Evento 100% FECHADO para demonstrar histórico lacrado)
  const ev4 = await prisma.event.upsert({
    where: { id: 'evt-rock-arena' },
    update: {},
    create: {
      id: 'evt-rock-arena',
      nome: 'Rock Legends Curitiba Arena',
      categoria: 'Show Internacional / Estádio',
      dataEvento: new Date('2026-08-20T19:00:00Z'),
      local: 'Ligga Arena (Athletico)',
      cidade: 'Curitiba',
      estado: 'PR',
      capacidadeTotal: 42000,
      status: StatusEvento.ENCERRADO,
      statusFinanceiro: StatusFinanceiroEvento.FECHADO,
      producerId: p1.id,
      closingChecklist: {
        create: {
          vendasConferidas: true,
          cancelamentosConferidos: true,
          estornosConferidos: true,
          gatewayConciliado: true,
          bancoConciliado: true,
          financeiroApurado: true,
          contabilidadeProcessada: true,
          repasseCalculado: true,
          repasseAprovado: true,
          eventoFechado: true,
          observacoes: 'Evento 100% liquidado e arquivado com auditoria contábil.',
          fechadoPor: 'Karine Santos (Financeiro)',
          fechadoEm: new Date('2026-08-25T14:30:00Z'),
        },
      },
      financialSummary: {
        create: {
          vendasBrutas: 3850000.0,
          cancelamentos: 28000.0,
          estornos: 14500.0,
          taxasMdrGateway: 102500.0,
          comissaoDisk: 385000.0,
          taxasServicoDisk: 385000.0,
          retencoesTributarias: 19250.0,
          valorLiquidoProdutor: 2919750.0,
          ingressosVendidos: 39800,
          ingressosCancelados: 180,
        },
      },
    },
  });

  // 6. Gerar Vendas e Pagamentos Realistas para o Evento 1
  const pistaInteira = b1.ticketTypes.find((t) => t.nome === 'Pista Inteira')!;
  const pistaMeia = b1.ticketTypes.find((t) => t.nome === 'Pista Meia-Entrada')!;
  const camarote = b1.ticketTypes.find((t) => t.nome === 'Camarote VIP Premium')!;

  const sampleSales = [
    {
      nome: 'Mariana Duarte Costa',
      cpf: '38192019283',
      email: 'mariana.costa@gmail.com',
      canal: CanalVenda.ONLINE,
      type: camarote,
      qtd: 2,
      metodo: MetodoPagamento.CARTAO_CREDITO,
      parcelas: 3,
      gateway: 'Cielo',
    },
    {
      nome: 'Rodrigo Alencar Lima',
      cpf: '58291039482',
      email: 'rodrigo.alencar@uol.com.br',
      canal: CanalVenda.ONLINE,
      type: pistaInteira,
      qtd: 2,
      metodo: MetodoPagamento.PIX,
      parcelas: 1,
      gateway: 'Stone',
    },
    {
      nome: 'Camila Fernandes Viana',
      cpf: '91827364510',
      email: 'camila.viana@outlook.com',
      canal: CanalVenda.PDV,
      type: pistaMeia,
      qtd: 1,
      metodo: MetodoPagamento.CARTAO_DEBITO,
      parcelas: 1,
      gateway: 'Rede',
    },
    {
      nome: 'Felipe Augusto Pinheiro',
      cpf: '29384756102',
      email: 'felipe.pinheiro@empresa.com.br',
      canal: CanalVenda.TOTEM,
      type: pistaInteira,
      qtd: 4,
      metodo: MetodoPagamento.PIX,
      parcelas: 1,
      gateway: 'Stone',
    },
    {
      nome: 'Beatriz Martins Ramos',
      cpf: '49382019482',
      email: 'beatriz.ramos@yahoo.com.br',
      canal: CanalVenda.POS,
      type: camarote,
      qtd: 1,
      metodo: MetodoPagamento.CARTAO_CREDITO,
      parcelas: 2,
      gateway: 'Cielo',
    },
  ];

  let ev1Bruto = 1902000.0; // Vendas acumuladas apuradas
  let ev1Cancelamentos = 12500.0;
  let ev1Estornos = 4200.0;
  let ev1Mdr = 54820.0;
  let ev1Comissao = 190200.0;
  let ev1Servico = 190200.0;
  let ev1Liquido = ev1Bruto - ev1Cancelamentos - ev1Estornos - ev1Mdr - ev1Comissao;

  for (let i = 0; i < sampleSales.length; i++) {
    const s = sampleSales[i];
    const subtotal = Number(s.type.precoUnitario) * s.qtd;
    const taxa = subtotal * 0.1;
    const total = subtotal + taxa;

    const sale = await prisma.sale.create({
      data: {
        codigoPedido: `PED-2026-${10490 + i}`,
        eventId: ev1.id,
        canal: s.canal,
        compradorNome: s.nome,
        compradorCpf: s.cpf,
        compradorEmail: s.email,
        totalBruto: subtotal,
        totalTaxas: taxa,
        totalDescontos: 0,
        totalLiquido: total,
        status: 'APROVADO',
        items: {
          create: {
            ticketTypeId: s.type.id,
            quantidade: s.qtd,
            precoUnitario: s.type.precoUnitario,
            subtotal,
            taxaCalculada: taxa,
          },
        },
        payments: {
          create: {
            metodo: s.metodo,
            parcelas: s.parcelas,
            gateway: s.gateway,
            transacaoId: `TX-CIELO-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
            codigoAutorizacao: `${Math.floor(100000 + Math.random() * 900000)}`,
            valorPago: total,
            taxaMdrPercent: s.metodo === MetodoPagamento.PIX ? 0.99 : 2.89,
            taxaMdrValor: (total * (s.metodo === MetodoPagamento.PIX ? 0.99 : 2.89)) / 100,
            valorLiquidoGateway: total - (total * 2.89) / 100,
            status: 'APROVADO',
          },
        },
      },
    });
  }

  // Cria Apuração Financeira Consolidada do Evento 1
  await prisma.eventFinancialSummary.upsert({
    where: { eventId: ev1.id },
    update: {
      vendasBrutas: ev1Bruto,
      cancelamentos: ev1Cancelamentos,
      estornos: ev1Estornos,
      taxasMdrGateway: ev1Mdr,
      comissaoDisk: ev1Comissao,
      taxasServicoDisk: ev1Servico,
      retencoesTributarias: 9510.0,
      valorLiquidoProdutor: ev1Liquido,
      ingressosVendidos: 11300,
      ingressosCancelados: 75,
    },
    create: {
      eventId: ev1.id,
      vendasBrutas: ev1Bruto,
      cancelamentos: ev1Cancelamentos,
      estornos: ev1Estornos,
      taxasMdrGateway: ev1Mdr,
      comissaoDisk: ev1Comissao,
      taxasServicoDisk: ev1Servico,
      retencoesTributarias: 9510.0,
      valorLiquidoProdutor: ev1Liquido,
      ingressosVendidos: 11300,
      ingressosCancelados: 75,
    },
  });

  // Apuração do Evento 2
  await prisma.eventFinancialSummary.upsert({
    where: { eventId: ev2.id },
    update: {},
    create: {
      eventId: ev2.id,
      vendasBrutas: 371000.0,
      cancelamentos: 2800.0,
      estornos: 1400.0,
      taxasMdrGateway: 10450.0,
      comissaoDisk: 35245.0,
      taxasServicoDisk: 37100.0,
      retencoesTributarias: 1855.0,
      valorLiquidoProdutor: 321105.0,
      ingressosVendidos: 2010,
      ingressosCancelados: 16,
    },
  });

  // ==============================================================================
  // FASE 3: SEED FINANCEIRO & TESOURARIA
  // ==============================================================================
  console.log('💳 Semeando Contas a Receber, Contas a Pagar, Repasses e Fluxo de Caixa...');

  // 1. Contas a Receber (Adquirentes: Cielo, Stone, Rede)
  const receivablesData = [
    {
      eventId: ev1.id,
      adquirente: 'Cielo Soluções',
      metodo: MetodoPagamento.CARTAO_CREDITO,
      transacaoRef: 'CIELO-LOTE-202610-01',
      valorBruto: 450000.0,
      taxaMdr: 13005.0, // 2.89%
      valorLiquido: 436995.0,
      dataVencimento: new Date(Date.now() + 15 * 86400000), // Em 15 dias
      status: StatusRecebivel.A_VENCER,
      antecipado: false,
    },
    {
      eventId: ev1.id,
      adquirente: 'Stone Pagamentos',
      metodo: MetodoPagamento.PIX,
      transacaoRef: 'STONE-PIX-202610-02',
      valorBruto: 320000.0,
      taxaMdr: 3168.0, // 0.99%
      valorLiquido: 316832.0,
      dataVencimento: new Date(Date.now() - 1 * 86400000), // D+1 Liquidado ontem
      dataRecebimento: new Date(Date.now() - 1 * 86400000),
      status: StatusRecebivel.RECEBIDO,
      antecipado: false,
    },
    {
      eventId: ev1.id,
      adquirente: 'Rede Itaú',
      metodo: MetodoPagamento.CARTAO_CREDITO,
      transacaoRef: 'REDE-ANTECIP-202610-03',
      valorBruto: 280000.0,
      taxaMdr: 8092.0,
      valorLiquido: 266858.0, // Já deduzida taxa de antecipação
      dataVencimento: new Date(Date.now() + 28 * 86400000),
      dataRecebimento: new Date(),
      status: StatusRecebivel.ANTECIPADO,
      antecipado: true,
    },
    {
      eventId: ev2.id,
      adquirente: 'PagBank',
      metodo: MetodoPagamento.CARTAO_CREDITO,
      transacaoRef: 'PAGBANK-202610-04',
      valorBruto: 185000.0,
      taxaMdr: 5346.5,
      valorLiquido: 179653.5,
      dataVencimento: new Date(Date.now() + 8 * 86400000),
      status: StatusRecebivel.A_VENCER,
      antecipado: false,
    },
  ];

  for (const r of receivablesData) {
    await prisma.accountReceivable.create({
      data: r,
    });
  }

  // 2. Contas a Pagar (Fornecedores e Obrigações)
  const payablesData = [
    {
      descricao: 'Serviço de Segurança e Brigadistas (120 profissionais)',
      categoria: CategoriaDespesa.FORNECEDOR,
      fornecedorNome: 'Curitiba Segurança Privada Ltda',
      fornecedorCpfCnpj: '22.333.444/0001-55',
      valor: 48500.0,
      dataVencimento: new Date(Date.now() + 5 * 86400000),
      status: StatusContaPagar.AGENDADO,
      formaPagamento: 'PIX',
      eventId: ev1.id,
    },
    {
      descricao: 'Arrecadação Direitos Autorais e Execução Musical (ECAD)',
      categoria: CategoriaDespesa.TAXA,
      fornecedorNome: 'ECAD - Escritório Central de Arrecadação',
      fornecedorCpfCnpj: '00.474.973/0001-90',
      valor: 76080.0,
      dataVencimento: new Date(Date.now() + 12 * 86400000),
      status: StatusContaPagar.EM_ABERTO,
      formaPagamento: 'BOLETO',
      eventId: ev1.id,
    },
    {
      descricao: 'Locação de 4 Geradores a Diesel 500kVA e Combustível',
      categoria: CategoriaDespesa.INFRAESTRUTURA,
      fornecedorNome: 'Geradores Paraná & Energia Ltda',
      fornecedorCpfCnpj: '11.888.777/0001-22',
      valor: 32000.0,
      dataVencimento: new Date(Date.now() - 3 * 86400000),
      dataPagamento: new Date(Date.now() - 3 * 86400000),
      status: StatusContaPagar.PAGO,
      formaPagamento: 'TED',
      comprovanteRef: 'COMP-TED-88912344',
      aprovadoPor: 'admin@diskingressos.local',
      eventId: ev1.id,
    },
    {
      descricao: 'Imposto Sobre Serviços (ISSQN) - Competência Outubro/2026',
      categoria: CategoriaDespesa.IMPOSTO,
      fornecedorNome: 'Prefeitura Municipal de Curitiba',
      fornecedorCpfCnpj: '76.417.005/0001-86',
      valor: 19020.0,
      dataVencimento: new Date(Date.now() + 20 * 86400000),
      status: StatusContaPagar.EM_ABERTO,
      formaPagamento: 'DAM',
      eventId: ev1.id,
    },
    {
      descricao: 'Infraestrutura Cloud AWS e Cluster Kubernetes de Bilheteria',
      categoria: CategoriaDespesa.INFRAESTRUTURA,
      fornecedorNome: 'Amazon Web Services Inc.',
      fornecedorCpfCnpj: '23.412.333/0001-01',
      valor: 8450.0,
      dataVencimento: new Date(Date.now() + 10 * 86400000),
      status: StatusContaPagar.EM_ABERTO,
      formaPagamento: 'CARTAO_CREDITO',
    },
  ];

  for (const p of payablesData) {
    await prisma.accountPayable.create({
      data: p,
    });
  }

  // 3. Repasses a Produtores (Borderôs)
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@diskingressos.local' } });

  const settlementsData = [
    {
      codigo: 'REP-2026-000101',
      producerId: p1.id,
      eventId: ev1.id,
      valorBrutoApurado: 1475765.0,
      retencaoSeguranca: 25000.0,
      valorSolicitado: 400000.0,
      valorLiquido: 375000.0,
      status: StatusRepasse.PAGO,
      solicitadoPorId: adminUser!.id,
      aprovadoPorId: adminUser!.id,
      aprovadoEm: new Date(Date.now() - 4 * 86400000),
      pagoEm: new Date(Date.now() - 3 * 86400000),
      autenticacaoBancaria: 'PIX-E34109887720261002-AUT-BRL',
      bancoDestino: 'Banco Itaú Ag: 0432 CC: 29871-4',
      chavePix: 'financeiro@curitibashows.com.br',
      observacoes: '1º Adiantamento Contratual (30 dias antes do festival)',
    },
    {
      codigo: 'REP-2026-000102',
      producerId: p1.id,
      eventId: ev1.id,
      valorBrutoApurado: 1475765.0,
      retencaoSeguranca: 50000.0,
      valorSolicitado: 500000.0,
      valorLiquido: 450000.0,
      status: StatusRepasse.APROVADO,
      solicitadoPorId: adminUser!.id,
      aprovadoPorId: adminUser!.id,
      aprovadoEm: new Date(),
      bancoDestino: 'Banco Itaú Ag: 0432 CC: 29871-4',
      chavePix: 'financeiro@curitibashows.com.br',
      observacoes: '2º Repasse Aprovado - Aguardando liberação de lote bancário da tesouraria',
    },
    {
      codigo: 'REP-2026-000103',
      producerId: p2.id,
      eventId: ev2.id,
      valorBrutoApurado: 321105.0,
      retencaoSeguranca: 15000.0,
      valorSolicitado: 120000.0,
      valorLiquido: 105000.0,
      status: StatusRepasse.SOLICITADO,
      solicitadoPorId: adminUser!.id,
      bancoDestino: 'Banco Bradesco Ag: 1289 CC: 88721-0',
      chavePix: 'financeiro@liveentretenimento.com.br',
      observacoes: 'Solicitação de repasse parcial do stand-up',
    },
  ];

  for (const s of settlementsData) {
    await prisma.producerSettlement.create({
      data: s,
    });
  }

  // 4. Extrato de Fluxo de Caixa (Tesouraria Conta Itaú)
  const transactionsData = [
    {
      tipo: TipoTransacao.ENTRADA,
      descricao: 'Saldo Inicial de Tesouraria - Outubro 2026',
      valor: 200000.0,
      categoria: 'SALDO_INICIAL',
      contaBancaria: 'Conta Movimento Itaú',
      saldoApos: 200000.0,
      dataLancamento: new Date(Date.now() - 5 * 86400000),
    },
    {
      tipo: TipoTransacao.ENTRADA,
      descricao: 'Liquidação D+1 Stone Pagamentos PIX',
      valor: 316832.0,
      categoria: 'RECEBIMENTO_GATEWAY',
      referenciaTipo: 'RECEBIVEL',
      contaBancaria: 'Conta Movimento Itaú',
      saldoApos: 516832.0,
      dataLancamento: new Date(Date.now() - 4 * 86400000),
    },
    {
      tipo: TipoTransacao.SAIDA,
      descricao: 'Locação Geradores - Geradores Paraná & Energia Ltda',
      valor: 32000.0,
      categoria: 'INFRAESTRUTURA',
      referenciaTipo: 'CONTA_PAGAR',
      contaBancaria: 'Conta Movimento Itaú',
      saldoApos: 484832.0,
      dataLancamento: new Date(Date.now() - 3 * 86400000),
    },
    {
      tipo: TipoTransacao.SAIDA,
      descricao: 'Repasse 1º Adiantamento Curitiba Shows (REP-2026-000101)',
      valor: 375000.0,
      categoria: 'REPASSE_PRODUTOR',
      referenciaTipo: 'REPASSE',
      contaBancaria: 'Conta Movimento Itaú',
      saldoApos: 109832.0,
      dataLancamento: new Date(Date.now() - 3 * 86400000),
    },
    {
      tipo: TipoTransacao.ENTRADA,
      descricao: 'Antecipação Rede Itaú Lote Cartão',
      valor: 266858.0,
      categoria: 'ANTECIPACAO_CARTAO',
      referenciaTipo: 'RECEBIVEL',
      contaBancaria: 'Conta Movimento Itaú',
      saldoApos: 376690.0,
      dataLancamento: new Date(Date.now() - 1 * 86400000),
    },
  ];

  for (const t of transactionsData) {
    await prisma.financialTransaction.create({
      data: t,
    });
  }

  console.log('✅ Dados da FASE 3 (Contas a Receber, Contas a Pagar, Repasses, Fluxo de Caixa) semeados com sucesso!');

  // ==============================================================================
  // FASE 4: SEED BANCOS, CONCILIAÇÃO & GATEWAYS
  // ==============================================================================
  console.log('🏦 Semeando Contas Bancárias, Gateways de Pagamento e Extratos OFX...');

  // 1. Contas Bancárias Corporativas
  const contaItau = await prisma.bankAccount.create({
    data: {
      bancoNome: 'Banco Itaú Unibanco S.A.',
      bancoCodigo: '341',
      agencia: '0432',
      conta: '29871',
      digito: '4',
      tipo: TipoContaBancaria.CORRENTE,
      saldoAtual: 376690.0,
      saldoDisponivel: 376690.0,
      saldoBloqueado: 0.0,
      limiteCredito: 250000.0,
      chavePix: 'financeiro@diskingressos.com.br',
      ativo: true,
    },
  });

  const contaBradesco = await prisma.bankAccount.create({
    data: {
      bancoNome: 'Banco Bradesco S.A.',
      bancoCodigo: '237',
      agencia: '1289',
      conta: '88721',
      digito: '0',
      tipo: TipoContaBancaria.CORRENTE,
      saldoAtual: 85400.0,
      saldoDisponivel: 85400.0,
      saldoBloqueado: 0.0,
      limiteCredito: 100000.0,
      chavePix: 'arrecadacao@diskingressos.com.br',
      ativo: true,
    },
  });

  // 2. Integrações de Gateways e Adquirentes
  const gatewaysData = [
    {
      nome: 'Cielo 3.0 E-commerce (Crédito & Débito)',
      codigo: 'CIELO',
      status: StatusGateway.ATIVO,
      taxaMdrPadrao: 2.89,
      webhookUrl: 'https://api.diskingressos.com.br/api/v1/webhooks/cielo',
      totalTransacoesHoje: 148,
      volumeHoje: 45890.0,
      taxaPraticadaMedia: 2.89,
      desvioMdr: 0.0,
      ultimaSincronizacao: new Date(),
    },
    {
      nome: 'Stone Conectada (PDV, POS & PIX)',
      codigo: 'STONE',
      status: StatusGateway.ATIVO,
      taxaMdrPadrao: 0.99,
      webhookUrl: 'https://api.diskingressos.com.br/api/v1/webhooks/stone',
      totalTransacoesHoje: 320,
      volumeHoje: 68400.0,
      taxaPraticadaMedia: 0.99,
      desvioMdr: 0.0,
      ultimaSincronizacao: new Date(),
    },
    {
      nome: 'Rede Itaú Maquininhas POS',
      codigo: 'REDE',
      status: StatusGateway.ATIVO,
      taxaMdrPadrao: 2.89,
      webhookUrl: 'https://api.diskingressos.com.br/api/v1/webhooks/rede',
      totalTransacoesHoje: 95,
      volumeHoje: 22100.0,
      taxaPraticadaMedia: 2.94, // Alerta leve de 0.05% de sobrepreço detectado pela auditoria!
      desvioMdr: 0.05,
      ultimaSincronizacao: new Date(),
    },
    {
      nome: 'PagBank Mobile & Totens de Autoatendimento',
      codigo: 'PAGBANK',
      status: StatusGateway.ATIVO,
      taxaMdrPadrao: 2.89,
      webhookUrl: 'https://api.diskingressos.com.br/api/v1/webhooks/pagbank',
      totalTransacoesHoje: 42,
      volumeHoje: 12450.0,
      taxaPraticadaMedia: 2.89,
      desvioMdr: 0.0,
      ultimaSincronizacao: new Date(),
    },
  ];

  for (const g of gatewaysData) {
    await prisma.gatewayIntegration.create({ data: g });
  }

  // 3. Importação de Arquivo OFX
  const ofxImport = await prisma.ofxImport.create({
    data: {
      bankAccountId: contaItau.id,
      nomeArquivo: 'EXTRATO-ITAU-OUTUBRO-2026.ofx',
      dataInicio: new Date(Date.now() - 5 * 86400000),
      dataFim: new Date(),
      totalTransacoes: 7,
      totalCreditos: 633690.0,
      totalDebitos: 407189.9,
      status: 'PROCESSADO',
    },
  });

  // 4. Lançamentos do Extrato Bancário
  const statementItemsData = [
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-001',
      dataLancamento: new Date(Date.now() - 4 * 86400000),
      documento: 'PIX-STONE-991',
      descricao: 'PIX RECEBIDO STONE PAGAMENTOS D+1',
      valor: 316832.0,
      tipo: TipoLancamentoExtrato.CREDITO,
      statusConciliacao: StatusConciliacao.CONCILIADO,
      conciliadoComTipo: 'RECEBIVEL',
      conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
      dataConciliacao: new Date(Date.now() - 4 * 86400000),
      scoreConfianca: 100.0,
    },
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-002',
      dataLancamento: new Date(Date.now() - 3 * 86400000),
      documento: 'TED-88912344',
      descricao: 'TED TRANSF GERADORES PARANA ENERGIA LTDA',
      valor: 32000.0,
      tipo: TipoLancamentoExtrato.DEBITO,
      statusConciliacao: StatusConciliacao.CONCILIADO,
      conciliadoComTipo: 'CONTA_PAGAR',
      conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
      dataConciliacao: new Date(Date.now() - 3 * 86400000),
      scoreConfianca: 96.0,
    },
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-003',
      dataLancamento: new Date(Date.now() - 3 * 86400000),
      documento: 'PIX-E341098877202610',
      descricao: 'PIX ENVIADO CURITIBA SHOWS REP-2026-000101',
      valor: 375000.0,
      tipo: TipoLancamentoExtrato.DEBITO,
      statusConciliacao: StatusConciliacao.CONCILIADO,
      conciliadoComTipo: 'REPASSE',
      conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
      dataConciliacao: new Date(Date.now() - 3 * 86400000),
      scoreConfianca: 100.0,
    },
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-004',
      dataLancamento: new Date(Date.now() - 1 * 86400000),
      documento: 'ANTECIP-REDE-03',
      descricao: 'ANTECIPACAO CARTAO REDE ITAU SOLUCOES',
      valor: 266858.0,
      tipo: TipoLancamentoExtrato.CREDITO,
      statusConciliacao: StatusConciliacao.CONCILIADO,
      conciliadoComTipo: 'RECEBIVEL',
      conciliadoPor: 'MOTOR_AUTO_MATCH_V1',
      dataConciliacao: new Date(Date.now() - 1 * 86400000),
      scoreConfianca: 100.0,
    },
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-005',
      dataLancamento: new Date(Date.now() - 1 * 86400000),
      documento: 'TAR-ITAU-PJ',
      descricao: 'DEB TARIFA MANUTENCAO CONTA PJ ITAU',
      valor: 189.9,
      tipo: TipoLancamentoExtrato.DEBITO,
      statusConciliacao: StatusConciliacao.PENDENTE,
    },
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-006',
      dataLancamento: new Date(),
      documento: 'CIELO-LOTE-01',
      descricao: 'CRED LIQUIDACAO CIELO LOTE 01 FESTIVAL',
      valor: 436995.0,
      tipo: TipoLancamentoExtrato.CREDITO,
      statusConciliacao: StatusConciliacao.PENDENTE,
    },
    {
      bankAccountId: contaItau.id,
      ofxImportId: ofxImport.id,
      fitId: 'ITAU-202610-007',
      dataLancamento: new Date(),
      documento: 'TED-HEINEKEN-01',
      descricao: 'TED RECEBIDA PATROCINIO HEINEKEN BRASIL',
      valor: 50000.0,
      tipo: TipoLancamentoExtrato.CREDITO,
      statusConciliacao: StatusConciliacao.PENDENTE,
    },
  ];

  for (const s of statementItemsData) {
    await prisma.bankStatementItem.create({ data: s });
  }

  console.log('✅ Dados da FASE 4 (Contas Bancárias, Gateways, OFX e Conciliação) semeados com sucesso!');

  // ==============================================================================
  // FASE 5: SEED CONTABILIDADE OFICIAL (PLANO DE CONTAS & PARTIDAS DOBRADAS)
  // ==============================================================================
  console.log('📊 Semeando Plano de Contas Canônico e Lançamentos com Partidas Dobradas...');

  // 1. Plano de Contas Estruturado Oficial da DiskIngressos
  const chartData = [
    // 1. ATIVO
    { codigo: '1', nome: 'ATIVO TOTAL', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 1, analitica: false },
    { codigo: '1.1', nome: 'ATIVO CIRCULANTE', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 2, analitica: false, codigoPai: '1' },
    { codigo: '1.1.01', nome: 'DISPONIBILIDADES', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 3, analitica: false, codigoPai: '1.1' },
    { codigo: '1.1.01.01', nome: 'Banco Itaú Unibanco - Conta Movimento', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 4, analitica: true, codigoPai: '1.1.01', saldoAtual: 376690.0 },
    { codigo: '1.1.01.02', nome: 'Banco Bradesco - Conta Arrecadação PDV', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 4, analitica: true, codigoPai: '1.1.01', saldoAtual: 85400.0 },
    
    { codigo: '1.1.02', nome: 'ADQUIRENTES E GATEWAYS A RECEBER', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 3, analitica: false, codigoPai: '1.1' },
    { codigo: '1.1.02.01', nome: 'Cielo Soluções - Cartões a Liquidar', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 4, analitica: true, codigoPai: '1.1.02', saldoAtual: 436995.0 },
    { codigo: '1.1.02.02', nome: 'Stone Pagamentos - PIX e POS', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 4, analitica: true, codigoPai: '1.1.02', saldoAtual: 0.0 },
    { codigo: '1.1.02.03', nome: 'Rede Itaú - Cartões e Maquininhas', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 4, analitica: true, codigoPai: '1.1.02', saldoAtual: 0.0 },
    { codigo: '1.1.02.04', nome: 'PagBank - Totens e Mobile', grupo: GrupoContabil.ATIVO_CIRCULANTE, natureza: NaturezaConta.DEVEDORA, nivel: 4, analitica: true, codigoPai: '1.1.02', saldoAtual: 179653.5 },

    // 2. PASSIVO
    { codigo: '2', nome: 'PASSIVO TOTAL', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 1, analitica: false },
    { codigo: '2.1', nome: 'PASSIVO CIRCULANTE', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 2, analitica: false, codigoPai: '2' },
    { codigo: '2.1.01', nome: 'REPASSES A PAGAR A PRODUTORES', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 3, analitica: false, codigoPai: '2.1' },
    { codigo: '2.1.01.01', nome: 'Curitiba Shows - Repasses Contratuais', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 4, analitica: true, codigoPai: '2.1.01', saldoAtual: 450000.0 },
    { codigo: '2.1.01.02', nome: 'Live Entretenimento - Repasses', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 4, analitica: true, codigoPai: '2.1.01', saldoAtual: 105000.0 },

    { codigo: '2.1.02', nome: 'FORNECEDORES E PRESTADORES DE SERVIÇOS', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 3, analitica: false, codigoPai: '2.1' },
    { codigo: '2.1.02.01', nome: 'Fornecedores de Segurança e Brigadistas', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 4, analitica: true, codigoPai: '2.1.02', saldoAtual: 48500.0 },
    { codigo: '2.1.02.02', nome: 'ECAD - Escritório Central de Arrecadação', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 4, analitica: true, codigoPai: '2.1.02', saldoAtual: 76080.0 },

    { codigo: '2.1.03', nome: 'OBRIGAÇÕES FISCAIS E TRIBUTÁRIAS', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 3, analitica: false, codigoPai: '2.1' },
    { codigo: '2.1.03.01', nome: 'ISSQN a Recolher - Prefeitura Curitiba', grupo: GrupoContabil.PASSIVO_CIRCULANTE, natureza: NaturezaConta.CREDORA, nivel: 4, analitica: true, codigoPai: '2.1.03', saldoAtual: 19020.0 },

    // 3. PATRIMÔNIO LÍQUIDO
    { codigo: '3', nome: 'PATRIMÔNIO LÍQUIDO', grupo: GrupoContabil.PATRIMONIO_LIQUIDO, natureza: NaturezaConta.CREDORA, nivel: 1, analitica: false },
    { codigo: '3.1', nome: 'Capital Social Subscrito e Integralizado', grupo: GrupoContabil.PATRIMONIO_LIQUIDO, natureza: NaturezaConta.CREDORA, nivel: 2, analitica: true, codigoPai: '3', saldoAtual: 300000.0 },
    { codigo: '3.2', nome: 'Lucros e Reservas Acumuladas', grupo: GrupoContabil.PATRIMONIO_LIQUIDO, natureza: NaturezaConta.CREDORA, nivel: 2, analitica: true, codigoPai: '3', saldoAtual: 80138.5 },

    // 4. RECEITAS
    { codigo: '4', nome: 'RECEITAS OPERACIONAIS', grupo: GrupoContabil.RECEITAS, natureza: NaturezaConta.CREDORA, nivel: 1, analitica: false },
    { codigo: '4.1', nome: 'Receita Bruta com Comissões DiskIngressos', grupo: GrupoContabil.RECEITAS, natureza: NaturezaConta.CREDORA, nivel: 2, analitica: true, codigoPai: '4', saldoAtual: 182785.0 },
    { codigo: '4.2', nome: 'Receita de Taxa de Conveniência e Serviço', grupo: GrupoContabil.RECEITAS, natureza: NaturezaConta.CREDORA, nivel: 2, analitica: true, codigoPai: '4', saldoAtual: 227300.0 },
    { codigo: '4.3', nome: '(-) Deduções e Estornos de Ingressos', grupo: GrupoContabil.RECEITAS, natureza: NaturezaConta.DEVEDORA, nivel: 2, analitica: true, codigoPai: '4', saldoAtual: 1995.0 },

    // 5. CUSTOS E DESPESAS
    { codigo: '5', nome: 'CUSTOS E DESPESAS OPERACIONAIS', grupo: GrupoContabil.DESPESAS, natureza: NaturezaConta.DEVEDORA, nivel: 1, analitica: false },
    { codigo: '5.1', nome: 'Custos de Adquirência e Taxas MDR Gateway', grupo: GrupoContabil.CUSTOS, natureza: NaturezaConta.DEVEDORA, nivel: 2, analitica: true, codigoPai: '5', saldoAtual: 29611.5 },
    { codigo: '5.2', nome: 'Despesas com Infraestrutura Cloud e Servidores AWS', grupo: GrupoContabil.DESPESAS, natureza: NaturezaConta.DEVEDORA, nivel: 2, analitica: true, codigoPai: '5', saldoAtual: 8450.0 },
    { codigo: '5.3', nome: 'Despesas Gerais e Administrativas', grupo: GrupoContabil.DESPESAS, natureza: NaturezaConta.DEVEDORA, nivel: 2, analitica: true, codigoPai: '5', saldoAtual: 42000.0 },
    { codigo: '5.4', nome: 'Tributos Municipais e Taxas Fiscais', grupo: GrupoContabil.DESPESAS, natureza: NaturezaConta.DEVEDORA, nivel: 2, analitica: true, codigoPai: '5', saldoAtual: 19020.0 },
  ];

  const accountMap = new Map<string, string>();
  for (const c of chartData) {
    const acc = await prisma.chartOfAccounts.create({
      data: c,
    });
    accountMap.set(c.codigo, acc.id);
  }

  // 2. Lançamentos Contábeis do Livro Diário com Partidas Dobradas
  // Lançamento 1: Integralização de Capital Social
  await prisma.journalEntry.create({
    data: {
      numeroLancamento: 'LAN-2026-000001',
      data: new Date(Date.now() - 30 * 86400000),
      historico: 'Integralização de Capital Social dos Sócios DiskIngressos',
      origem: 'MANUAL',
      totalDebito: 300000.0,
      totalCredito: 300000.0,
      equilibrado: true,
      status: StatusLancamento.CONFIRMADO,
      criadoPor: 'admin@diskingressos.local',
      items: {
        create: [
          { accountId: accountMap.get('1.1.01.01')!, tipo: TipoPartida.DEBITO, valor: 300000.0, historicoComplementar: 'Entrada Banco Itaú' },
          { accountId: accountMap.get('3.1')!, tipo: TipoPartida.CREDITO, valor: 300000.0, historicoComplementar: 'Capital Social Integralizado' },
        ],
      },
    },
  });

  // Lançamento 2: Apuração e Reconhecimento de Receita do Festival Pedreira
  await prisma.journalEntry.create({
    data: {
      numeroLancamento: 'LAN-2026-000002',
      data: new Date(Date.now() - 5 * 86400000),
      historico: 'Apuração Contábil Festival Pedreira Paulo Leminski (Ingressos + Comissões)',
      origem: 'BILHETERIA',
      totalDebito: 1902000.0,
      totalCredito: 1902000.0,
      equilibrado: true,
      status: StatusLancamento.CONFIRMADO,
      criadoPor: 'sistema_bilheteria',
      items: {
        create: [
          { accountId: accountMap.get('1.1.02.01')!, tipo: TipoPartida.DEBITO, valor: 1902000.0, historicoComplementar: 'Direito a Receber Adquirente Cielo' },
          { accountId: accountMap.get('2.1.01.01')!, tipo: TipoPartida.CREDITO, valor: 1564235.0, historicoComplementar: 'Repasse Líquido Produtor Curitiba Shows' },
          { accountId: accountMap.get('4.1')!, tipo: TipoPartida.CREDITO, valor: 147565.0, historicoComplementar: 'Comissão DiskIngressos 10%' },
          { accountId: accountMap.get('4.2')!, tipo: TipoPartida.CREDITO, valor: 190200.0, historicoComplementar: 'Taxa de Serviço e Conveniência' },
        ],
      },
    },
  });

  // Lançamento 3: Reconhecimento do Custo MDR da Adquirência
  await prisma.journalEntry.create({
    data: {
      numeroLancamento: 'LAN-2026-000003',
      data: new Date(Date.now() - 4 * 86400000),
      historico: 'Apropriação da Taxa MDR Cielo sobre Lote Festival Pedreira',
      origem: 'OFX',
      totalDebito: 13005.0,
      totalCredito: 13005.0,
      equilibrado: true,
      status: StatusLancamento.CONFIRMADO,
      criadoPor: 'sistema_conciliacao',
      items: {
        create: [
          { accountId: accountMap.get('5.1')!, tipo: TipoPartida.DEBITO, valor: 13005.0, historicoComplementar: 'Custo de Adquirência MDR' },
          { accountId: accountMap.get('1.1.02.01')!, tipo: TipoPartida.CREDITO, valor: 13005.0, historicoComplementar: 'Dedução do Saldo a Receber Cielo' },
        ],
      },
    },
  });

  // Lançamento 4: Liquidação do 1º Repasse Borderô Curitiba Shows REP-2026-000101
  await prisma.journalEntry.create({
    data: {
      numeroLancamento: 'LAN-2026-000004',
      data: new Date(Date.now() - 3 * 86400000),
      historico: 'Pagamento 1º Repasse Produtor Curitiba Shows (Borderô REP-2026-000101)',
      origem: 'REPASSE',
      totalDebito: 375000.0,
      totalCredito: 375000.0,
      equilibrado: true,
      status: StatusLancamento.CONFIRMADO,
      criadoPor: 'tesouraria@diskingressos.local',
      items: {
        create: [
          { accountId: accountMap.get('2.1.01.01')!, tipo: TipoPartida.DEBITO, valor: 375000.0, historicoComplementar: 'Baixa de Repasse a Pagar' },
          { accountId: accountMap.get('1.1.01.01')!, tipo: TipoPartida.CREDITO, valor: 375000.0, historicoComplementar: 'Saída PIX Banco Itaú' },
        ],
      },
    },
  });

  // Lançamento 5: Liquidação Fornecedor Geradores Paraná
  await prisma.journalEntry.create({
    data: {
      numeroLancamento: 'LAN-2026-000005',
      data: new Date(Date.now() - 3 * 86400000),
      historico: 'Liquidação Duplicata Geradores Paraná & Energia Ltda',
      origem: 'PAGAMENTO',
      totalDebito: 32000.0,
      totalCredito: 32000.0,
      equilibrado: true,
      status: StatusLancamento.CONFIRMADO,
      criadoPor: 'contas_pagar@diskingressos.local',
      items: {
        create: [
          { accountId: accountMap.get('2.1.02.01')!, tipo: TipoPartida.DEBITO, valor: 32000.0, historicoComplementar: 'Quitação Fornecedor Infraestrutura' },
          { accountId: accountMap.get('1.1.01.01')!, tipo: TipoPartida.CREDITO, valor: 32000.0, historicoComplementar: 'Saída TED Banco Itaú' },
        ],
      },
    },
  });

  console.log('✅ Dados da FASE 5 (Plano de Contas Oficial, Livro Diário com Partidas Dobradas) semeados com sucesso!');

  // ============================================================================
  // FASE 6: FISCAL, TRIBUTÁRIO, NOTAS FISCAIS (NFS-e/NF-e) & SPED
  // ============================================================================
  console.log('🏛️ Semeando FASE 6: Fiscal, NFS-e, Apuração Tributária e Obrigações Acessórias...');

  // Limpeza de tabelas fiscais prévias
  await prisma.taxGuide.deleteMany();
  await prisma.spedExport.deleteMany();
  await prisma.taxRetention.deleteMany();
  await prisma.taxSummary.deleteMany();
  await prisma.fiscalInvoice.deleteMany();

  // 1. Notas Fiscais de Serviços (NFS-e)
  // NFS-e 1: Comissão DiskIngressos sobre Evento Rock Legends (Produtor Curitiba Shows)
  await prisma.fiscalInvoice.create({
    data: {
      numeroNota: 'NFS-2026-000001',
      serie: '1',
      tipo: TipoDocumentoFiscal.NFSE,
      status: StatusDocumentoFiscal.AUTORIZADO,
      dataEmissao: new Date('2026-08-25T15:00:00Z'),
      competencia: '2026-08',
      codigoVerificacao: '7A9B3F1C',
      chaveAcesso: '20260841069020812345600019900000100000000198',
      tomadorTipo: 'PRODUTOR',
      tomadorNome: 'Curitiba Shows e Eventos Ltda.',
      tomadorDoc: '12.345.678/0001-90',
      tomadorEmail: 'financeiro@curitibashows.com.br',
      tomadorCidade: 'Curitiba',
      tomadorUf: 'PR',
      prestadorCnpj: '08.123.456/0001-99',
      prestadorIm: '123456-7',
      codigoServico: '12.07',
      discriminacao: 'Comissão contratual de 10% s/ bilheteria do evento Rock Legends Curitiba Arena. Borderô REP-2026-000101.',
      valorServicos: 385000.0,
      valorDeducoes: 0,
      baseCalculo: 385000.0,
      aliquotaIss: 5.0,
      valorIss: 19250.0,
      issRetido: false,
      aliquotaPis: 0.65,
      valorPis: 2502.5,
      aliquotaCofins: 3.0,
      valorCofins: 11550.0,
      valorLiquido: 385000.0,
      eventId: 'evt-rock-arena',
    },
  });

  // NFS-e 2: Consolidação Taxas de Conveniência cobradas dos clientes (Rock Legends)
  await prisma.fiscalInvoice.create({
    data: {
      numeroNota: 'NFS-2026-000002',
      serie: '1',
      tipo: TipoDocumentoFiscal.NFSE,
      status: StatusDocumentoFiscal.AUTORIZADO,
      dataEmissao: new Date('2026-08-25T15:10:00Z'),
      competencia: '2026-08',
      codigoVerificacao: '8F2D1A4E',
      chaveAcesso: '20260841069020812345600019900000100000000287',
      tomadorTipo: 'CLIENTE',
      tomadorNome: 'CONSUMIDORES FINAIS CONSOLIDADOS (CURITIBA/PR)',
      tomadorDoc: '00.000.000/0000-00',
      tomadorEmail: 'contato@diskingressos.com.br',
      tomadorCidade: 'Curitiba',
      tomadorUf: 'PR',
      prestadorCnpj: '08.123.456/0001-99',
      prestadorIm: '123456-7',
      codigoServico: '12.07',
      discriminacao: 'Consolidação das taxas de conveniência emitidas na bilheteria online relativas ao evento Rock Legends Curitiba Arena.',
      valorServicos: 385000.0,
      valorDeducoes: 0,
      baseCalculo: 385000.0,
      aliquotaIss: 5.0,
      valorIss: 19250.0,
      issRetido: false,
      aliquotaPis: 0.65,
      valorPis: 2502.5,
      aliquotaCofins: 3.0,
      valorCofins: 11550.0,
      valorLiquido: 385000.0,
      eventId: 'evt-rock-arena',
    },
  });

  // NFS-e 3: Comissão s/ Evento Turnê Especial Marisa Monte (Produtor Live Entretenimento)
  await prisma.fiscalInvoice.create({
    data: {
      numeroNota: 'NFS-2026-000003',
      serie: '1',
      tipo: TipoDocumentoFiscal.NFSE,
      status: StatusDocumentoFiscal.AUTORIZADO,
      dataEmissao: new Date('2026-09-10T11:20:00Z'),
      competencia: '2026-09',
      codigoVerificacao: '9C4E7B2D',
      chaveAcesso: '20260941069020812345600019900000100000000376',
      tomadorTipo: 'PRODUTOR',
      tomadorNome: 'Live Entretenimento e Grandes Eventos S.A.',
      tomadorDoc: '98.765.432/0001-00',
      tomadorEmail: 'contato@liveentretenimento.com.br',
      tomadorCidade: 'Curitiba',
      tomadorUf: 'PR',
      prestadorCnpj: '08.123.456/0001-99',
      prestadorIm: '123456-7',
      codigoServico: '12.07',
      discriminacao: 'Serviços de bilheteria e comissão de venda de ingressos do evento Turnê Especial Marisa Monte.',
      valorServicos: 48000.0,
      valorDeducoes: 0,
      baseCalculo: 48000.0,
      aliquotaIss: 5.0,
      valorIss: 2400.0,
      issRetido: false,
      aliquotaPis: 0.65,
      valorPis: 312.0,
      aliquotaCofins: 3.0,
      valorCofins: 1440.0,
      valorLiquido: 48000.0,
      eventId: 'evt-marisa-monte',
    },
  });

  // NFS-e 4: Nota Cancelada
  await prisma.fiscalInvoice.create({
    data: {
      numeroNota: 'NFS-2026-000004',
      serie: '1',
      tipo: TipoDocumentoFiscal.NFSE,
      status: StatusDocumentoFiscal.CANCELADO,
      dataEmissao: new Date('2026-09-12T14:00:00Z'),
      competencia: '2026-09',
      codigoVerificacao: '1A2B3C4D',
      chaveAcesso: '20260941069020812345600019900000100000000465',
      tomadorTipo: 'PRODUTOR',
      tomadorNome: 'Opus Entretenimento Regional Sul Ltda.',
      tomadorDoc: '45.678.910/0001-22',
      prestadorCnpj: '08.123.456/0001-99',
      prestadorIm: '123456-7',
      codigoServico: '12.07',
      discriminacao: 'Agenciamento e emissão de ingressos cancelada por reagendamento de espetáculo.',
      valorServicos: 18500.0,
      valorDeducoes: 0,
      baseCalculo: 18500.0,
      aliquotaIss: 5.0,
      valorIss: 925.0,
      issRetido: false,
      aliquotaPis: 0.65,
      valorPis: 120.25,
      aliquotaCofins: 3.0,
      valorCofins: 555.0,
      valorLiquido: 18500.0,
      motivoCancelamento: 'Espetáculo reagendado pelo produtor. Estorno das comissões acordado em aditivo contratual.',
      canceladoEm: new Date('2026-09-14T09:30:00Z'),
    },
  });

  // 2. Retenções Tributárias na Fonte
  await prisma.taxRetention.createMany({
    data: [
      {
        origemTipo: 'REPASSE',
        origemId: 'REP-2026-000101',
        favorecidoNome: 'Curitiba Shows e Eventos Ltda.',
        favorecidoDoc: '12.345.678/0001-90',
        tributo: TipoTributo.IRRF,
        baseCalculo: 385000.0,
        aliquota: 1.5,
        valorRetido: 5775.0,
        dataFatoGerador: new Date('2026-08-25T14:00:00Z'),
        dataVencimentoGuia: new Date('2026-09-20T23:59:59Z'),
        competencia: '2026-08',
        status: 'RECOLHIDO',
      },
      {
        origemTipo: 'CONTA_PAGAR',
        origemId: 'CP-2026-000005',
        favorecidoNome: 'Geradores Paraná & Energia Ltda.',
        favorecidoDoc: '03.882.119/0001-44',
        tributo: TipoTributo.PIS,
        baseCalculo: 32000.0,
        aliquota: 4.65,
        valorRetido: 1488.0,
        dataFatoGerador: new Date('2026-09-28T10:00:00Z'),
        dataVencimentoGuia: new Date('2026-10-20T23:59:59Z'),
        competencia: '2026-09',
        status: 'APURADO',
      },
    ],
  });

  // 3. Apurações Mensais (Lucro Presumido)
  // Agosto 2026 (Fechada)
  await prisma.taxSummary.create({
    data: {
      competencia: '2026-08',
      regime: RegimeTributario.LUCRO_PRESUMIDO,
      receitaBrutaIngressos: 3850000.0, // Terceiros
      receitaPropriaTaxasComissoes: 770000.0, // Própria tributável
      baseCalculoISS: 770000.0,
      valorIssTotal: 38500.0,
      baseCalculoFederal: 770000.0,
      valorPisTotal: 5005.0,
      valorCofinsTotal: 23100.0,
      valorIrpjTotal: 36960.0,
      valorCsllTotal: 22176.0,
      totalImpostos: 125741.0,
      fechado: true,
      dataFechamento: new Date('2026-09-05T18:00:00Z'),
    },
  });

  // Setembro 2026 (Em apuração corrente)
  await prisma.taxSummary.create({
    data: {
      competencia: '2026-09',
      regime: RegimeTributario.LUCRO_PRESUMIDO,
      receitaBrutaIngressos: 820000.0,
      receitaPropriaTaxasComissoes: 48000.0,
      baseCalculoISS: 48000.0,
      valorIssTotal: 2400.0,
      baseCalculoFederal: 48000.0,
      valorPisTotal: 312.0,
      valorCofinsTotal: 1440.0,
      valorIrpjTotal: 2304.0,
      valorCsllTotal: 1382.4,
      totalImpostos: 7838.4,
      fechado: false,
    },
  });

  // 4. Guias de Recolhimento Tributário (DARF e DAM)
  await prisma.taxGuide.createMany({
    data: [
      {
        codigoReceita: 'DAM-ISS-01',
        descricao: 'DAM ISSQN Prefeitura Curitiba (Ref. 2026-08)',
        tipoTributo: TipoTributo.ISS,
        competencia: '2026-08',
        vencimento: new Date('2026-09-20T23:59:59Z'),
        valorPrincipal: 38500.0,
        jurosMulta: 0,
        valorTotal: 38500.0,
        codigoBarras: '858300000038500000410690200812345600019901',
        linhaDigitavel: '85830.00000 03850.00004 10690.20081 23456.000199',
        status: StatusGuiaRecolhimento.PAGA,
        pagaEm: new Date('2026-09-18T10:15:00Z'),
      },
      {
        codigoReceita: 'DARF-8109',
        descricao: 'DARF PIS Faturamento 0,65% (Ref. 2026-08)',
        tipoTributo: TipoTributo.PIS,
        competencia: '2026-08',
        vencimento: new Date('2026-09-25T23:59:59Z'),
        valorPrincipal: 5005.0,
        jurosMulta: 0,
        valorTotal: 5005.0,
        codigoBarras: '856900000005005008109000812345600019900001',
        linhaDigitavel: '85690.00000 05005.00810 90008.12345 60001.990000',
        status: StatusGuiaRecolhimento.PAGA,
        pagaEm: new Date('2026-09-22T14:40:00Z'),
      },
      {
        codigoReceita: 'DARF-2172',
        descricao: 'DARF COFINS Faturamento 3,00% (Ref. 2026-08)',
        tipoTributo: TipoTributo.COFINS,
        competencia: '2026-08',
        vencimento: new Date('2026-09-25T23:59:59Z'),
        valorPrincipal: 23100.0,
        jurosMulta: 0,
        valorTotal: 23100.0,
        codigoBarras: '856900000023100002172000812345600019900002',
        linhaDigitavel: '85690.00000 23100.00217 20008.12345 60001.990002',
        status: StatusGuiaRecolhimento.PAGA,
        pagaEm: new Date('2026-09-22T14:40:00Z'),
      },
      {
        codigoReceita: 'DAM-ISS-02',
        descricao: 'DAM ISSQN Prefeitura Curitiba (Ref. 2026-09)',
        tipoTributo: TipoTributo.ISS,
        competencia: '2026-09',
        vencimento: new Date('2026-10-20T23:59:59Z'),
        valorPrincipal: 2400.0,
        jurosMulta: 0,
        valorTotal: 2400.0,
        codigoBarras: '858300000002400000410690200812345600019902',
        linhaDigitavel: '85830.00000 00240.00004 10690.20081 23456.000192',
        status: StatusGuiaRecolhimento.A_RECOLHER,
      },
      {
        codigoReceita: 'DARF-8109-02',
        descricao: 'DARF PIS Faturamento 0,65% (Ref. 2026-09)',
        tipoTributo: TipoTributo.PIS,
        competencia: '2026-09',
        vencimento: new Date('2026-10-25T23:59:59Z'),
        valorPrincipal: 312.0,
        jurosMulta: 0,
        valorTotal: 312.0,
        codigoBarras: '856900000000312008109000812345600019900003',
        linhaDigitavel: '85690.00000 00312.00810 90008.12345 60001.990003',
        status: StatusGuiaRecolhimento.A_RECOLHER,
      },
    ],
  });

  console.log('✅ Dados da FASE 6 (NFS-e, Retenções, Apurações de Tributos e Guias DARF/DAM) semeados com sucesso!');

  // 17. FASE 9: Governança Contábil, Travas de Período & Fechamento Mensal
  console.log('⏳ Semeando Períodos Contábeis e Travas de Competência (Fase 9)...');
  const mesesFechamento = [
    { mes: 1, comp: '2026-01', status: StatusPeriodoContabil.ENCERRADO, rec: 3100000, desp: 2790000, res: 310000 },
    { mes: 2, comp: '2026-02', status: StatusPeriodoContabil.ENCERRADO, rec: 2850000, desp: 2565000, res: 285000 },
    { mes: 3, comp: '2026-03', status: StatusPeriodoContabil.ENCERRADO, rec: 4500000, desp: 4050000, res: 450000 },
    { mes: 4, comp: '2026-04', status: StatusPeriodoContabil.ENCERRADO, rec: 3900000, desp: 3510000, res: 390000 },
    { mes: 5, comp: '2026-05', status: StatusPeriodoContabil.ENCERRADO, rec: 5200000, desp: 4680000, res: 520000 },
    { mes: 6, comp: '2026-06', status: StatusPeriodoContabil.ENCERRADO, rec: 4800000, desp: 4320000, res: 480000 },
    { mes: 7, comp: '2026-07', status: StatusPeriodoContabil.ENCERRADO, rec: 4100000, desp: 3690000, res: 410000 },
    { mes: 8, comp: '2026-08', status: StatusPeriodoContabil.ABERTO, rec: 3850000, desp: 3465000, res: 385000 },
    { mes: 9, comp: '2026-09', status: StatusPeriodoContabil.ABERTO, rec: 1488000, desp: 1339200, res: 148800 },
    { mes: 10, comp: '2026-10', status: StatusPeriodoContabil.ABERTO, rec: 0, desp: 0, res: 0 },
    { mes: 11, comp: '2026-11', status: StatusPeriodoContabil.ABERTO, rec: 0, desp: 0, res: 0 },
    { mes: 12, comp: '2026-12', status: StatusPeriodoContabil.ABERTO, rec: 0, desp: 0, res: 0 },
  ];

  for (const m of mesesFechamento) {
    const isEncerrado = m.status === StatusPeriodoContabil.ENCERRADO;
    await prisma.accountingPeriod.upsert({
      where: { competencia: m.comp },
      update: {
        status: m.status,
        totalReceitas: m.rec,
        totalDespesas: m.desp,
        resultadoPeriodo: m.res,
      },
      create: {
        competencia: m.comp,
        ano: 2026,
        mes: m.mes,
        dataInicio: new Date(`2026-${String(m.mes).padStart(2, '0')}-01T00:00:00Z`),
        dataFim: new Date(`2026-${String(m.mes).padStart(2, '0')}-28T23:59:59Z`),
        status: m.status,
        conciliacaoBancariaOk: isEncerrado || m.mes === 8,
        conciliacaoMdrOk: isEncerrado || m.mes === 8,
        partidasDobradasOk: isEncerrado || m.mes === 8,
        apuracaoFiscalOk: isEncerrado || m.mes === 8,
        fechamentoEventosOk: isEncerrado || m.mes === 8,
        fechadoPorNome: isEncerrado ? 'Carlos Contador (CRC 12345/PR)' : null,
        fechadoEm: isEncerrado ? new Date(`2026-${String(m.mes + 1).padStart(2, '0')}-05T18:00:00Z`) : null,
        justificativaFechamento: isEncerrado ? 'Fechamento contábil e fiscal homologado sem ressalvas.' : null,
        totalReceitas: m.rec,
        totalDespesas: m.desp,
        resultadoPeriodo: m.res,
      },
    });
  }

  console.log('✅ Períodos contábeis e travas de competência semeados com sucesso!');

  // 18. MÓDULO CORPORATIVO DE RECURSOS HUMANOS (RH DISKINGRESSOS)
  console.log('⏳ Semeando Colaboradores, Ponto REP-P e Estrutura de RH...');
  
  await prisma.employeeHr.upsert({
    where: { matricula: 'DSK-00101' },
    update: {},
    create: {
      matricula: 'DSK-00101',
      nomeCompleto: 'Ana Carolina Meirelles',
      cpf: '123.456.789-01',
      rg: '9.876.543-2 SSP/PR',
      pisPasep: '120.45892.11-9',
      ctpsNumero: '4829102/0010-PR',
      emailCorporativo: 'ana.meirelles@diskingressos.com.br',
      emailPessoal: 'aninha.meirelles@gmail.com',
      telefone: '(41) 99876-5432',
      cargo: 'Supervisora de Bilheteria & Operações de Campo',
      departamento: 'BILHETERIA_PDV',
      regimeContratacao: 'CLT',
      salarioBase: 4850.0,
      dataAdmissao: new Date('2023-03-15T00:00:00Z'),
      status: 'ATIVO',
      bancoNome: 'Banco Itaú S.A.',
      agenciaBancaria: '3829',
      contaCorrente: '29102-4',
      chavePix: '12345678901',
      jornadaSemanalHoras: 44,
      saldoBancoHorasMinutos: 360,
    },
  });

  await prisma.employeeHr.upsert({
    where: { matricula: 'DSK-00102' },
    update: {},
    create: {
      matricula: 'DSK-00102',
      nomeCompleto: 'Lucas Gabriel Pinheiro',
      cpf: '234.567.890-12',
      rg: '10.234.567-8 SSP/PR',
      pisPasep: '131.98234.22-4',
      ctpsNumero: '5910293/0020-PR',
      emailCorporativo: 'lucas.pinheiro@diskingressos.com.br',
      telefone: '(41) 99123-4567',
      cargo: 'Desenvolvedor Full Stack Sênior',
      departamento: 'TECNOLOGIA',
      regimeContratacao: 'CLT',
      salarioBase: 9200.0,
      dataAdmissao: new Date('2022-08-01T00:00:00Z'),
      status: 'ATIVO',
      bancoNome: 'Banco Santander (Brasil) S.A.',
      agenciaBancaria: '0912',
      contaCorrente: '130982-1',
      chavePix: 'lucas.pinheiro@diskingressos.com.br',
      jornadaSemanalHoras: 40,
      saldoBancoHorasMinutos: 180,
    },
  });

  await prisma.hrNotice.createMany({
    data: [
      {
        titulo: 'Aviso Obrigatório: Atualização Cadastral eSocial 2026',
        conteudo: 'Todos os colaboradores devem revisar dependentes e endereço até 15/10.',
        departamentoAlvo: 'TODOS',
        prioridade: 'ALTA',
        requerConfirmacaoLeitura: true,
      },
      {
        titulo: 'Escala Especial Festival Curitiba Pop Rock 2026',
        conteudo: 'Operadores de bilheteria e fiscais de portão confirmados na escala da Pedreira.',
        departamentoAlvo: 'BILHETERIA_PDV',
        prioridade: 'NORMAL',
        requerConfirmacaoLeitura: false,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.hrGeofence.createMany({
    data: [
      {
        nome: 'Sede Administrativa DiskIngressos',
        latitude: -25.4284,
        longitude: -49.2733,
        raioMetros: 100,
        tipoLocal: 'SEDE_ADMINISTRATIVA',
        cidade: 'Curitiba - PR',
        status: 'ATIVA',
      },
      {
        nome: 'Pedreira Paulo Leminski (Festival Pop Rock)',
        latitude: -25.3855,
        longitude: -49.2764,
        raioMetros: 250,
        tipoLocal: 'ARENA_SHOW',
        cidade: 'Curitiba - PR',
        status: 'ATIVA',
      },
    ],
    skipDuplicates: true,
  });

  await prisma.eventStaffCost.upsert({
    where: { eventoId: 'evt-poprock-01' },
    update: {},
    create: {
      eventoId: 'evt-poprock-01',
      eventoNome: 'Festival Curitiba Pop Rock 2026',
      dataEvento: '14/11/2026',
      centroCustoEvento: 'CC-EVT-POPROCK-2026',
      equipeOperacionalBRL: 8400.0,
      horasExtrasBRL: 2150.0,
      alimentacaoBRL: 1300.0,
      transporteBRL: 900.0,
      freelancersBRL: 4500.0,
      custoTotalPessoalBRL: 17250.0,
      integradoAoDreEvento: true,
    },
  });

  console.log('✅ Dados de Recursos Humanos, Ponto REP-P e Custos por Evento semeados com sucesso!');
  console.log('🏁 Seed completo do ecossistema DiskIngressos ERP concluído.');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
