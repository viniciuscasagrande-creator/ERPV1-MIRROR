import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  AntecipacaoDto,
  AmortizacaoAntecipacaoDto,
  TravaDomicilioBancarioDto,
  CalculoMargemConsignavelDto,
  SimulacaoAntecipacaoRequestDto,
  SimulacaoAntecipacaoResponseDto,
  CriarAntecipacaoRequestDto,
  AprovarAntecipacaoDto,
  RejeitarAntecipacaoDto,
  ExecutarAmortizacaoDto,
  AntecipacoesKpisDto,
  StatusAntecipacao,
  StatusTravaBancaria,
  OrigemAmortizacao,
  RegistradoraRecebiveis,
  AdquirenteTrava,
} from '@diskingressos/types';

@Injectable()
export class AntecipacoesService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback caso o DB não esteja instanciado)
  // ============================================================================
  private inMemoryAntecipacoes: AntecipacaoDto[] = [];
  private inMemoryAmortizacoes: AmortizacaoAntecipacaoDto[] = [];
  private inMemoryTravas: TravaDomicilioBancarioDto[] = [];

  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.antecipacaoRecebivel.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // Se der erro no prisma, usa in-memory
    }

    // Dados de seed padrão para demonstração Enterprise
    const seed1: AntecipacaoDto = {
      id: 'ant-uuid-001',
      codigoContrato: 'ANT-2026-000101',
      producerId: 'prod-001',
      producerNome: 'Opus Entretenimento Curitiba Ltda',
      eventId: 'evt-001',
      eventNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      valorSolicitado: 80000.0,
      taxaMensal: 2.35,
      prazoDias: 45,
      custoFinanceiro: 2820.0,
      taxaAdministrativa: 400.0,
      valorLiquidoLiberado: 76780.0,
      saldoDevedor: 35000.0,
      valorAmortizado: 45000.0,
      fundoReservaRetido: 48000.0,
      status: StatusAntecipacao.EM_AMORTIZACAO,
      dataSolicitacao: new Date(Date.now() - 20 * 86400000).toISOString(),
      dataAprovacao: new Date(Date.now() - 19 * 86400000).toISOString(),
      dataLiquidacao: new Date(Date.now() - 18 * 86400000).toISOString(),
      dataVencimento: new Date(Date.now() + 25 * 86400000).toISOString(),
      registradora: RegistradoraRecebiveis.CERC,
      protocoloRegistroUr: 'CERC-UR-2026-8891024-PR',
      statusTravaBancaria: StatusTravaBancaria.ATIVA,
      adquirentesTravadas: 'CIELO, STONE, REDE',
      aprovadoPor: 'Diretoria Financeira & CFO',
      documentoAssinaturaId: 'DOC-SIG-2026-000312',
      observacoes: 'Cessão de recebíveis vinculada à montagem do palco principal e infraestrutura de som.',
      createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    };

    const seed2: AntecipacaoDto = {
      id: 'ant-uuid-002',
      codigoContrato: 'ANT-2026-000102',
      producerId: 'prod-002',
      producerNome: 'Seven Live Entretenimento Brasil',
      eventId: 'evt-002',
      eventNome: 'Turnê Titãs Encontro Arena da Baixada',
      valorSolicitado: 150000.0,
      taxaMensal: 2.10,
      prazoDias: 60,
      custoFinanceiro: 6300.0,
      taxaAdministrativa: 750.0,
      valorLiquidoLiberado: 142950.0,
      saldoDevedor: 0.0,
      valorAmortizado: 150000.0,
      fundoReservaRetido: 62000.0,
      status: StatusAntecipacao.QUITADA,
      dataSolicitacao: new Date(Date.now() - 50 * 86400000).toISOString(),
      dataAprovacao: new Date(Date.now() - 48 * 86400000).toISOString(),
      dataLiquidacao: new Date(Date.now() - 47 * 86400000).toISOString(),
      dataVencimento: new Date(Date.now() - 5 * 86400000).toISOString(),
      registradora: RegistradoraRecebiveis.CIP,
      protocoloRegistroUr: 'CIP-SLC-2026-4432190-PR',
      statusTravaBancaria: StatusTravaBancaria.LIBERADA,
      adquirentesTravadas: 'CIELO, GETNET',
      aprovadoPor: 'Dupla Chave CFO + CEO (Faixa C)',
      documentoAssinaturaId: 'DOC-SIG-2026-000280',
      observacoes: 'Contrato integralmente amortizado por retenções automáticas de borderôs nos lotes 1 e 2.',
      createdAt: new Date(Date.now() - 50 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    };

    const seed3: AntecipacaoDto = {
      id: 'ant-uuid-003',
      codigoContrato: 'ANT-2026-000103',
      producerId: 'prod-003',
      producerNome: 'Curitiba Comedy Club Produções',
      eventId: 'evt-003',
      eventNome: 'Noite de Gala do Stand-up Paranaense Teatro Positivo',
      valorSolicitado: 18000.0,
      taxaMensal: 2.50,
      prazoDias: 25,
      custoFinanceiro: 375.0,
      taxaAdministrativa: 90.0,
      valorLiquidoLiberado: 17535.0,
      saldoDevedor: 18000.0,
      valorAmortizado: 0.0,
      fundoReservaRetido: 12500.0,
      status: StatusAntecipacao.SOLICITADA,
      dataSolicitacao: new Date().toISOString(),
      dataVencimento: new Date(Date.now() + 25 * 86400000).toISOString(),
      registradora: RegistradoraRecebiveis.CERC,
      statusTravaBancaria: StatusTravaBancaria.PENDENTE,
      observacoes: 'Aguardando validação da margem e aprovação da alçada Faixa A.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const seedTravas: TravaDomicilioBancarioDto[] = [
      {
        id: 'trv-001',
        antecipacaoId: 'ant-uuid-001',
        producerId: 'prod-001',
        adquirente: AdquirenteTrava.CIELO,
        banco: '341 - Itaú Unibanco S.A.',
        agencia: '0084',
        conta: '99210-4 (Conta Escrow Disk)',
        registradora: RegistradoraRecebiveis.CERC,
        protocoloContrato: 'CERC-TRV-9011-PR',
        status: StatusTravaBancaria.ATIVA,
        dataEfetivacao: new Date(Date.now() - 19 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
      },
      {
        id: 'trv-002',
        antecipacaoId: 'ant-uuid-001',
        producerId: 'prod-001',
        adquirente: AdquirenteTrava.STONE,
        banco: '341 - Itaú Unibanco S.A.',
        agencia: '0084',
        conta: '99210-4 (Conta Escrow Disk)',
        registradora: RegistradoraRecebiveis.CERC,
        protocoloContrato: 'CERC-TRV-9012-PR',
        status: StatusTravaBancaria.ATIVA,
        dataEfetivacao: new Date(Date.now() - 19 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 19 * 86400000).toISOString(),
      },
      {
        id: 'trv-003',
        antecipacaoId: 'ant-uuid-002',
        producerId: 'prod-002',
        adquirente: AdquirenteTrava.CIELO,
        banco: '237 - Banco Bradesco S.A.',
        agencia: '1240',
        conta: '44102-8 (Conta Escrow FIDC)',
        registradora: RegistradoraRecebiveis.CIP,
        protocoloContrato: 'CIP-TRV-3321-PR',
        status: StatusTravaBancaria.LIBERADA,
        dataEfetivacao: new Date(Date.now() - 48 * 86400000).toISOString(),
        dataLiberacao: new Date(Date.now() - 5 * 86400000).toISOString(),
        createdAt: new Date(Date.now() - 48 * 86400000).toISOString(),
      },
    ];

    const seedAmortizacoes: AmortizacaoAntecipacaoDto[] = [
      {
        id: 'amt-001',
        antecipacaoId: 'ant-uuid-001',
        repasseId: 'REP-2026-000115',
        valorAmortizado: 25000.0,
        saldoAnterior: 80000.0,
        saldoRestante: 55000.0,
        dataAmortizacao: new Date(Date.now() - 10 * 86400000).toISOString(),
        origemAmortizacao: OrigemAmortizacao.REPASSE_AUTOMATICO,
        observacao: 'Abatimento prioritário em fechamento do lote 1.',
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
      {
        id: 'amt-002',
        antecipacaoId: 'ant-uuid-001',
        repasseId: 'REP-2026-000118',
        valorAmortizado: 20000.0,
        saldoAnterior: 55000.0,
        saldoRestante: 35000.0,
        dataAmortizacao: new Date(Date.now() - 2 * 86400000).toISOString(),
        origemAmortizacao: OrigemAmortizacao.REPASSE_AUTOMATICO,
        observacao: 'Abatimento prioritário em fechamento do lote 2.',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'amt-003',
        antecipacaoId: 'ant-uuid-002',
        repasseId: 'REP-2026-000095',
        valorAmortizado: 150000.0,
        saldoAnterior: 150000.0,
        saldoRestante: 0.0,
        dataAmortizacao: new Date(Date.now() - 5 * 86400000).toISOString(),
        origemAmortizacao: OrigemAmortizacao.RETENCAO_BILHETERIA,
        observacao: 'Quitação total do saldo devedor.',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      },
    ];

    try {
      for (const item of [seed1, seed2, seed3]) {
        await this.prisma.antecipacaoRecebivel.create({
          data: {
            id: item.id,
            codigoContrato: item.codigoContrato,
            producerId: item.producerId,
            producerNome: item.producerNome,
            eventId: item.eventId,
            eventNome: item.eventNome,
            valorSolicitado: item.valorSolicitado,
            taxaMensal: item.taxaMensal,
            prazoDias: item.prazoDias,
            custoFinanceiro: item.custoFinanceiro,
            taxaAdministrativa: item.taxaAdministrativa,
            valorLiquidoLiberado: item.valorLiquidoLiberado,
            saldoDevedor: item.saldoDevedor,
            valorAmortizado: item.valorAmortizado,
            fundoReservaRetido: item.fundoReservaRetido,
            status: item.status,
            dataSolicitacao: new Date(item.dataSolicitacao),
            dataAprovacao: item.dataAprovacao ? new Date(item.dataAprovacao) : null,
            dataLiquidacao: item.dataLiquidacao ? new Date(item.dataLiquidacao) : null,
            dataVencimento: new Date(item.dataVencimento),
            registradora: item.registradora,
            protocoloRegistroUr: item.protocoloRegistroUr,
            statusTravaBancaria: item.statusTravaBancaria,
            adquirentesTravadas: item.adquirentesTravadas,
            aprovadoPor: item.aprovadoPor,
            documentoAssinaturaId: item.documentoAssinaturaId,
            observacoes: item.observacoes,
          },
        });
      }

      for (const trava of seedTravas) {
        await this.prisma.travaDomicilioBancario.create({
          data: {
            id: trava.id,
            antecipacaoId: trava.antecipacaoId,
            producerId: trava.producerId,
            adquirente: trava.adquirente,
            banco: trava.banco,
            agencia: trava.agencia,
            conta: trava.conta,
            registradora: trava.registradora,
            protocoloContrato: trava.protocoloContrato,
            status: trava.status,
            dataEfetivacao: new Date(trava.dataEfetivacao),
            dataLiberacao: trava.dataLiberacao ? new Date(trava.dataLiberacao) : null,
          },
        });
      }

      for (const amt of seedAmortizacoes) {
        await this.prisma.amortizacaoAntecipacao.create({
          data: {
            id: amt.id,
            antecipacaoId: amt.antecipacaoId,
            repasseId: amt.repasseId,
            valorAmortizado: amt.valorAmortizado,
            saldoAnterior: amt.saldoAnterior,
            saldoRestante: amt.saldoRestante,
            dataAmortizacao: new Date(amt.dataAmortizacao),
            origemAmortizacao: amt.origemAmortizacao,
            observacao: amt.observacao,
          },
        });
      }
    } catch {
      // Se der erro ao persistir no DB, preenche memória
      this.inMemoryAntecipacoes = [seed1, seed2, seed3];
      this.inMemoryTravas = seedTravas;
      this.inMemoryAmortizacoes = seedAmortizacoes;
    }

    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS GERAIS
  // ============================================================================
  async getKpis(): Promise<AntecipacoesKpisDto> {
    await this.ensureSeedData();

    try {
      const items = await this.prisma.antecipacaoRecebivel.findMany();
      if (items.length > 0) {
        let totalConcedido = 0;
        let saldoDevedorAtivo = 0;
        let totalAmortizado = 0;
        let escrowTotal = 0;
        let somaTaxas = 0;
        let ativas = 0;
        let quitadas = 0;

        for (const item of items) {
          const valSol = Number(item.valorSolicitado);
          const sldDev = Number(item.saldoDevedor);
          const valAmt = Number(item.valorAmortizado);
          const escrow = Number(item.fundoReservaRetido);
          const taxa = Number(item.taxaMensal);

          totalConcedido += valSol;
          saldoDevedorAtivo += sldDev;
          totalAmortizado += valAmt;
          escrowTotal += escrow;
          somaTaxas += taxa;

          if (item.status === StatusAntecipacao.QUITADA) {
            quitadas++;
          } else if (
            item.status === StatusAntecipacao.LIBERADA ||
            item.status === StatusAntecipacao.EM_AMORTIZACAO
          ) {
            ativas++;
          }
        }

        const travasAtivas = await this.prisma.travaDomicilioBancario.count({
          where: { status: StatusTravaBancaria.ATIVA },
        });

        return {
          totalConcedidoPeriodo: totalConcedido,
          saldoDevedorAtivo,
          totalAmortizado,
          fundoReservaEscrowTotal: escrowTotal,
          taxaMediaPonderada: items.length > 0 ? Number((somaTaxas / items.length).toFixed(2)) : 2.35,
          totalOperacoesAtivas: ativas,
          totalQuitadas: quitadas,
          travasBancariasAtivas: travasAtivas,
        };
      }
    } catch {
      // Fallback in-memory
    }

    const items = this.inMemoryAntecipacoes;
    let totalConcedido = 0;
    let saldoDevedorAtivo = 0;
    let totalAmortizado = 0;
    let escrowTotal = 0;
    let somaTaxas = 0;
    let ativas = 0;
    let quitadas = 0;

    for (const item of items) {
      totalConcedido += item.valorSolicitado;
      saldoDevedorAtivo += item.saldoDevedor;
      totalAmortizado += item.valorAmortizado;
      escrowTotal += item.fundoReservaRetido;
      somaTaxas += item.taxaMensal;

      if (item.status === StatusAntecipacao.QUITADA) quitadas++;
      if (
        item.status === StatusAntecipacao.LIBERADA ||
        item.status === StatusAntecipacao.EM_AMORTIZACAO
      )
        ativas++;
    }

    const travasAtivas = this.inMemoryTravas.filter(
      (t) => t.status === StatusTravaBancaria.ATIVA,
    ).length;

    return {
      totalConcedidoPeriodo: totalConcedido,
      saldoDevedorAtivo,
      totalAmortizado,
      fundoReservaEscrowTotal: escrowTotal,
      taxaMediaPonderada: items.length > 0 ? Number((somaTaxas / items.length).toFixed(2)) : 2.35,
      totalOperacoesAtivas: ativas,
      totalQuitadas: quitadas,
      travasBancariasAtivas: travasAtivas,
    };
  }

  // ============================================================================
  // CÁLCULO DA MARGEM CONSIGNÁVEL SEGURA (SAFE ADVANCE LIMIT & ESCROW)
  // ============================================================================
  async calcularMargemConsignavel(eventId: string): Promise<CalculoMargemConsignavelDto> {
    await this.ensureSeedData();

    let eventNome = 'Festival de Inverno Pedreira Paulo Leminski 2026';
    let producerId = 'prod-001';
    let producerNome = 'Opus Entretenimento Curitiba Ltda';
    let vendasBrutas = 450000.0;
    let taxasTicketeiraRetidas = 58500.0; // ~13% de taxas somadas

    try {
      const evt = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: {
          producer: true,
          financialSummary: true,
        },
      });

      if (evt) {
        eventNome = evt.nome;
        producerId = evt.producerId;
        producerNome = evt.producer.nomeFantasia || evt.producer.razaoSocial;
        if (evt.financialSummary) {
          vendasBrutas = Number(evt.financialSummary.vendasBrutas);
          taxasTicketeiraRetidas =
            Number(evt.financialSummary.comissaoDisk) +
            Number(evt.financialSummary.taxasServicoDisk) +
            Number(evt.financialSummary.retencoesTributarias);
        }
      }
    } catch {
      // Standalone mode: fallback com simulação realista
      if (eventId === 'evt-002') {
        eventNome = 'Turnê Titãs Encontro Arena da Baixada';
        producerId = 'prod-002';
        producerNome = 'Seven Live Entretenimento Brasil';
        vendasBrutas = 820000.0;
        taxasTicketeiraRetidas = 98400.0;
      } else if (eventId === 'evt-003') {
        eventNome = 'Noite de Gala do Stand-up Paranaense Teatro Positivo';
        producerId = 'prod-003';
        producerNome = 'Curitiba Comedy Club Produções';
        vendasBrutas = 95000.0;
        taxasTicketeiraRetidas = 12350.0;
      }
    }

    const vendasLiquidasDisponiveis = Math.max(0, vendasBrutas - taxasTicketeiraRetidas);
    const percentualMaximoConsignavel = 75; // 75% teto consignável máximo
    const tetoConsignavelBruto = (vendasLiquidasDisponiveis * percentualMaximoConsignavel) / 100;
    const fundoReservaEscrow = (vendasLiquidasDisponiveis * (100 - percentualMaximoConsignavel)) / 100; // 25% retido em escrow

    // Soma antecipações ativas em aberto para este evento
    let antecipacoesAtivasTotal = 0;
    try {
      const ativas = await this.prisma.antecipacaoRecebivel.findMany({
        where: {
          eventId,
          status: {
            in: [
              StatusAntecipacao.SOLICITADA,
              StatusAntecipacao.EM_ANALISE,
              StatusAntecipacao.APROVADA,
              StatusAntecipacao.LIBERADA,
              StatusAntecipacao.EM_AMORTIZACAO,
            ],
          },
        },
      });
      for (const item of ativas) {
        antecipacoesAtivasTotal += Number(item.saldoDevedor);
      }
    } catch {
      const ativas = this.inMemoryAntecipacoes.filter(
        (a) =>
          a.eventId === eventId &&
          [
            StatusAntecipacao.SOLICITADA,
            StatusAntecipacao.EM_ANALISE,
            StatusAntecipacao.APROVADA,
            StatusAntecipacao.LIBERADA,
            StatusAntecipacao.EM_AMORTIZACAO,
          ].includes(a.status),
      );
      for (const item of ativas) {
        antecipacoesAtivasTotal += item.saldoDevedor;
      }
    }

    const margemConsignavelDisponivel = Math.max(
      0,
      Number((tetoConsignavelBruto - antecipacoesAtivasTotal).toFixed(2)),
    );
    const podeAntecipar = margemConsignavelDisponivel >= 1000.0;

    let mensagemRestricao: string | undefined;
    if (!podeAntecipar) {
      mensagemRestricao =
        'Margem consignável insuficiente para novas antecipações. O limite de segurança do Fundo de Reserva (25%) e antecipações ativas cobrem a totalidade da receita líquida apurada.';
    }

    return {
      eventId,
      eventNome,
      producerId,
      producerNome,
      vendasBrutasTotal: Number(vendasBrutas.toFixed(2)),
      taxasTicketeiraRetidas: Number(taxasTicketeiraRetidas.toFixed(2)),
      vendasLiquidasDisponiveis: Number(vendasLiquidasDisponiveis.toFixed(2)),
      percentualMaximoConsignavel,
      tetoConsignavelBruto: Number(tetoConsignavelBruto.toFixed(2)),
      fundoReservaEscrow: Number(fundoReservaEscrow.toFixed(2)),
      antecipacoesAtivasTotal: Number(antecipacoesAtivasTotal.toFixed(2)),
      margemConsignavelDisponivel,
      podeAntecipar,
      mensagemRestricao,
    };
  }

  // ============================================================================
  // SIMULAÇÃO FINANCEIRA DE ANTECIPAÇÃO (JUROS, IOF, SPREAD)
  // ============================================================================
  async simularAntecipacao(
    dto: SimulacaoAntecipacaoRequestDto,
  ): Promise<SimulacaoAntecipacaoResponseDto> {
    const margem = await this.calcularMargemConsignavel(dto.eventId);

    const valorSolicitado = dto.valorSolicitado;
    const taxaMensal = dto.taxaMensal || 2.50;
    const prazoDias = dto.prazoDias || 30;

    // Cálculo pro-rata die com juros simples regulatórios de antecipação
    const custoFinanceiro = Number(
      ((valorSolicitado * (taxaMensal / 30) * prazoDias) / 100).toFixed(2),
    );
    // Taxa de cessão / registro em registradora CERC (0.50%)
    const taxaAdministrativa = Number((valorSolicitado * 0.005).toFixed(2));
    // Estimativa de IOF PJ (0.38% fixo + 0.0082% ao dia)
    const iofEstimado = Number(
      (valorSolicitado * (0.0038 + (0.0082 / 100) * prazoDias)).toFixed(2),
    );

    const valorLiquidoLiberado = Number(
      (valorSolicitado - custoFinanceiro - taxaAdministrativa - iofEstimado).toFixed(2),
    );
    const totalAPagar = valorSolicitado; // Cessão de recebíveis desconta na fonte

    const isDentroDaMargem = valorSolicitado <= margem.margemConsignavelDisponivel;

    let alçadaNecessaria = 'FAIXA_A (Coordenador Financeiro - até R$ 20k)';
    if (valorSolicitado > 100000) {
      alçadaNecessaria = 'FAIXA_C (Dupla Chave CFO + CEO - acima de R$ 100k)';
    } else if (valorSolicitado > 20000) {
      alçadaNecessaria = 'FAIXA_B (Gerente Financeiro + Diretor - R$ 20k a R$ 100k)';
    }

    return {
      valorSolicitado,
      taxaMensal,
      prazoDias,
      custoFinanceiro,
      taxaAdministrativa,
      iofEstimado,
      valorLiquidoLiberado,
      totalAPagar,
      margemConsignavelDisponivel: margem.margemConsignavelDisponivel,
      isDentroDaMargem,
      alçadaNecessaria,
    };
  }

  // ============================================================================
  // CRIAÇÃO DE NOVA SOLICITAÇÃO DE ANTECIPAÇÃO
  // ============================================================================
  async criarSolicitacao(dto: CriarAntecipacaoRequestDto): Promise<AntecipacaoDto> {
    const margem = await this.calcularMargemConsignavel(dto.eventId);

    if (dto.valorSolicitado > margem.margemConsignavelDisponivel) {
      throw new BadRequestException(
        `Valor solicitado (R$ ${dto.valorSolicitado.toFixed(2)}) ultrapassa a margem consignável disponível (R$ ${margem.margemConsignavelDisponivel.toFixed(2)}).`,
      );
    }

    const taxaMensal = dto.taxaMensal || 2.50;
    const prazoDias = dto.prazoDias || 30;
    const custoFinanceiro = Number(
      ((dto.valorSolicitado * (taxaMensal / 30) * prazoDias) / 100).toFixed(2),
    );
    const taxaAdministrativa = Number((dto.valorSolicitado * 0.005).toFixed(2));
    const valorLiquidoLiberado = Number(
      (dto.valorSolicitado - custoFinanceiro - taxaAdministrativa).toFixed(2),
    );

    const sequencial = Math.floor(100000 + Math.random() * 900000);
    const codigoContrato = `ANT-2026-${sequencial}`;
    const dataVencimento = new Date(Date.now() + prazoDias * 86400000);

    const adquirentesStr =
      dto.adquirentesParaTrava && dto.adquirentesParaTrava.length > 0
        ? dto.adquirentesParaTrava.join(', ')
        : 'CIELO, STONE';

    const nova: AntecipacaoDto = {
      id: `ant-${Date.now()}`,
      codigoContrato,
      producerId: dto.producerId,
      producerNome: dto.producerNome,
      eventId: dto.eventId,
      eventNome: dto.eventNome,
      valorSolicitado: dto.valorSolicitado,
      taxaMensal,
      prazoDias,
      custoFinanceiro,
      taxaAdministrativa,
      valorLiquidoLiberado,
      saldoDevedor: dto.valorSolicitado,
      valorAmortizado: 0,
      fundoReservaRetido: Number(margem.fundoReservaEscrow.toFixed(2)),
      status: StatusAntecipacao.SOLICITADA,
      dataSolicitacao: new Date().toISOString(),
      dataVencimento: dataVencimento.toISOString(),
      registradora: dto.registradora || RegistradoraRecebiveis.CERC,
      statusTravaBancaria: StatusTravaBancaria.PENDENTE,
      adquirentesTravadas: adquirentesStr,
      observacoes: dto.observacoes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await this.prisma.antecipacaoRecebivel.create({
        data: {
          id: nova.id,
          codigoContrato: nova.codigoContrato,
          producerId: nova.producerId,
          producerNome: nova.producerNome,
          eventId: nova.eventId,
          eventNome: nova.eventNome,
          valorSolicitado: nova.valorSolicitado,
          taxaMensal: nova.taxaMensal,
          prazoDias: nova.prazoDias,
          custoFinanceiro: nova.custoFinanceiro,
          taxaAdministrativa: nova.taxaAdministrativa,
          valorLiquidoLiberado: nova.valorLiquidoLiberado,
          saldoDevedor: nova.saldoDevedor,
          valorAmortizado: nova.valorAmortizado,
          fundoReservaRetido: nova.fundoReservaRetido,
          status: nova.status,
          dataSolicitacao: new Date(nova.dataSolicitacao),
          dataVencimento: new Date(nova.dataVencimento),
          registradora: nova.registradora,
          statusTravaBancaria: nova.statusTravaBancaria,
          adquirentesTravadas: nova.adquirentesTravadas,
          observacoes: nova.observacoes,
        },
      });
    } catch {
      this.inMemoryAntecipacoes.unshift(nova);
    }

    return nova;
  }

  // ============================================================================
  // APROVAÇÃO, TRAVA BANCÁRIA REGISTRADA & LIBERAÇÃO DE CRÉDITO
  // ============================================================================
  async aprovarSolicitacao(id: string, dto: AprovarAntecipacaoDto): Promise<AntecipacaoDto> {
    await this.ensureSeedData();

    let target: any = null;
    try {
      target = await this.prisma.antecipacaoRecebivel.findUnique({
        where: { id },
      });
    } catch {
      target = this.inMemoryAntecipacoes.find((a) => a.id === id);
    }

    if (!target) {
      throw new NotFoundException(`Antecipação de recebíveis com ID ${id} não encontrada.`);
    }

    if (
      target.status !== StatusAntecipacao.SOLICITADA &&
      target.status !== StatusAntecipacao.EM_ANALISE
    ) {
      throw new BadRequestException(
        `Apenas contratos nos status SOLICITADA ou EM_ANALISE podem ser aprovados. Status atual: ${target.status}`,
      );
    }

    const agora = new Date();
    const protocoloUr = `${target.registradora || 'CERC'}-UR-${agora.getFullYear()}-${Math.floor(1000000 + Math.random() * 9000000)}-PR`;
    const aprovadorInfo = `${dto.aprovadorNome} (${dto.cargo})`;

    // Efetiva travas bancárias de domicílio com adquirentes
    const adquirentes = dto.adquirentesParaTrava || ['CIELO', 'STONE'];
    const novasTravas: TravaDomicilioBancarioDto[] = adquirentes.map((adq, idx) => ({
      id: `trv-${Date.now()}-${idx}`,
      antecipacaoId: id,
      producerId: target.producerId,
      adquirente: adq as AdquirenteTrava,
      banco: '341 - Itaú Unibanco S.A.',
      agencia: '0084',
      conta: '99210-4 (Conta Escrow DiskIngressos)',
      registradora: (target.registradora as RegistradoraRecebiveis) || RegistradoraRecebiveis.CERC,
      protocoloContrato: `${target.registradora || 'CERC'}-TRV-${Math.floor(1000 + Math.random() * 9000)}-PR`,
      status: StatusTravaBancaria.ATIVA,
      dataEfetivacao: agora.toISOString(),
      createdAt: agora.toISOString(),
    }));

    try {
      await this.prisma.antecipacaoRecebivel.update({
        where: { id },
        data: {
          status: StatusAntecipacao.LIBERADA,
          statusTravaBancaria: StatusTravaBancaria.ATIVA,
          dataAprovacao: agora,
          dataLiquidacao: agora,
          aprovadoPor: aprovadorInfo,
          protocoloRegistroUr: protocoloUr,
        },
      });

      for (const trv of novasTravas) {
        await this.prisma.travaDomicilioBancario.create({
          data: {
            id: trv.id,
            antecipacaoId: trv.antecipacaoId,
            producerId: trv.producerId,
            adquirente: trv.adquirente,
            banco: trv.banco,
            agencia: trv.agencia,
            conta: trv.conta,
            registradora: trv.registradora,
            protocoloContrato: trv.protocoloContrato,
            status: trv.status,
            dataEfetivacao: new Date(trv.dataEfetivacao),
          },
        });
      }
    } catch {
      target.status = StatusAntecipacao.LIBERADA;
      target.statusTravaBancaria = StatusTravaBancaria.ATIVA;
      target.dataAprovacao = agora.toISOString();
      target.dataLiquidacao = agora.toISOString();
      target.aprovadoPor = aprovadorInfo;
      target.protocoloRegistroUr = protocoloUr;
      this.inMemoryTravas.push(...novasTravas);
    }

    return this.getAntecipacaoById(id);
  }

  // ============================================================================
  // REJEIÇÃO DE ANTECIPAÇÃO
  // ============================================================================
  async rejeitarSolicitacao(id: string, dto: RejeitarAntecipacaoDto): Promise<AntecipacaoDto> {
    await this.ensureSeedData();

    try {
      await this.prisma.antecipacaoRecebivel.update({
        where: { id },
        data: {
          status: StatusAntecipacao.REJEITADA,
          motivoRejeicao: `${dto.rejeitadoPor}: ${dto.motivoRejeicao}`,
        },
      });
    } catch {
      const target = this.inMemoryAntecipacoes.find((a) => a.id === id);
      if (target) {
        target.status = StatusAntecipacao.REJEITADA;
        target.motivoRejeicao = `${dto.rejeitadoPor}: ${dto.motivoRejeicao}`;
      }
    }

    return this.getAntecipacaoById(id);
  }

  // ============================================================================
  // AMORTIZAÇÃO EM CASCATA (REDUÇÃO DE SALDO DEVEDOR & QUITAÇÃO)
  // ============================================================================
  async amortizar(id: string, dto: ExecutarAmortizacaoDto): Promise<AntecipacaoDto> {
    await this.ensureSeedData();

    const target = await this.getAntecipacaoById(id);

    if (dto.valorAmortizado <= 0) {
      throw new BadRequestException('O valor de amortização deve ser estritamente maior que zero.');
    }

    if (dto.valorAmortizado > target.saldoDevedor) {
      throw new BadRequestException(
        `Valor de amortização (R$ ${dto.valorAmortizado.toFixed(2)}) não pode ser superior ao saldo devedor atual (R$ ${target.saldoDevedor.toFixed(2)}).`,
      );
    }

    const saldoAnterior = target.saldoDevedor;
    const novoSaldoDevedor = Number((target.saldoDevedor - dto.valorAmortizado).toFixed(2));
    const novoValorAmortizado = Number((target.valorAmortizado + dto.valorAmortizado).toFixed(2));
    const estaQuitada = novoSaldoDevedor === 0;

    const novoStatus = estaQuitada
      ? StatusAntecipacao.QUITADA
      : StatusAntecipacao.EM_AMORTIZACAO;

    const novaAmortizacao: AmortizacaoAntecipacaoDto = {
      id: `amt-${Date.now()}`,
      antecipacaoId: id,
      repasseId: dto.repasseId,
      valorAmortizado: dto.valorAmortizado,
      saldoAnterior,
      saldoRestante: novoSaldoDevedor,
      dataAmortizacao: new Date().toISOString(),
      origemAmortizacao: dto.origemAmortizacao || OrigemAmortizacao.REPASSE_AUTOMATICO,
      observacao: dto.observacao || 'Amortização de saldo devedor de antecipação.',
      createdAt: new Date().toISOString(),
    };

    try {
      await this.prisma.antecipacaoRecebivel.update({
        where: { id },
        data: {
          saldoDevedor: novoSaldoDevedor,
          valorAmortizado: novoValorAmortizado,
          status: novoStatus,
          statusTravaBancaria: estaQuitada ? StatusTravaBancaria.LIBERADA : target.statusTravaBancaria,
        },
      });

      await this.prisma.amortizacaoAntecipacao.create({
        data: {
          id: novaAmortizacao.id,
          antecipacaoId: novaAmortizacao.antecipacaoId,
          repasseId: novaAmortizacao.repasseId,
          valorAmortizado: novaAmortizacao.valorAmortizado,
          saldoAnterior: novaAmortizacao.saldoAnterior,
          saldoRestante: novaAmortizacao.saldoRestante,
          dataAmortizacao: new Date(novaAmortizacao.dataAmortizacao),
          origemAmortizacao: novaAmortizacao.origemAmortizacao,
          observacao: novaAmortizacao.observacao,
        },
      });

      if (estaQuitada) {
        // Libera as travas bancárias
        await this.prisma.travaDomicilioBancario.updateMany({
          where: { antecipacaoId: id },
          data: {
            status: StatusTravaBancaria.LIBERADA,
            dataLiberacao: new Date(),
          },
        });
      }
    } catch {
      target.saldoDevedor = novoSaldoDevedor;
      target.valorAmortizado = novoValorAmortizado;
      target.status = novoStatus;
      if (estaQuitada) {
        target.statusTravaBancaria = StatusTravaBancaria.LIBERADA;
        for (const t of this.inMemoryTravas) {
          if (t.antecipacaoId === id) {
            t.status = StatusTravaBancaria.LIBERADA;
            t.dataLiberacao = new Date().toISOString();
          }
        }
      }
      this.inMemoryAmortizacoes.unshift(novaAmortizacao);
    }

    return this.getAntecipacaoById(id);
  }

  // ============================================================================
  // CONSULTAS & DETALHES
  // ============================================================================
  async getAntecipacoes(
    status?: string,
    producerId?: string,
    search?: string,
  ): Promise<AntecipacaoDto[]> {
    await this.ensureSeedData();

    try {
      const where: any = {};
      if (status && status !== 'TODOS') where.status = status;
      if (producerId) where.producerId = producerId;
      if (search) {
        where.OR = [
          { codigoContrato: { contains: search, mode: 'insensitive' } },
          { producerNome: { contains: search, mode: 'insensitive' } },
          { eventNome: { contains: search, mode: 'insensitive' } },
        ];
      }

      const rows = await this.prisma.antecipacaoRecebivel.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          amortizacoes: { orderBy: { dataAmortizacao: 'desc' } },
          travas: true,
        },
      });

      if (rows.length > 0) {
        return rows.map((r) => this.mapToDto(r));
      }
    } catch {
      // Fallback in-memory
    }

    let list = [...this.inMemoryAntecipacoes];
    if (status && status !== 'TODOS') {
      list = list.filter((a) => a.status === status);
    }
    if (producerId) {
      list = list.filter((a) => a.producerId === producerId);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.codigoContrato.toLowerCase().includes(s) ||
          a.producerNome.toLowerCase().includes(s) ||
          a.eventNome.toLowerCase().includes(s),
      );
    }

    return list.map((a) => ({
      ...a,
      amortizacoes: this.inMemoryAmortizacoes.filter((m) => m.antecipacaoId === a.id),
      travas: this.inMemoryTravas.filter((t) => t.antecipacaoId === a.id),
    }));
  }

  async getAntecipacaoById(id: string): Promise<AntecipacaoDto> {
    await this.ensureSeedData();

    try {
      const row = await this.prisma.antecipacaoRecebivel.findUnique({
        where: { id },
        include: {
          amortizacoes: { orderBy: { dataAmortizacao: 'desc' } },
          travas: true,
        },
      });
      if (row) return this.mapToDto(row);
    } catch {
      // Fallback
    }

    const found = this.inMemoryAntecipacoes.find((a) => a.id === id);
    if (!found) {
      throw new NotFoundException(`Antecipação com ID ${id} não encontrada.`);
    }

    return {
      ...found,
      amortizacoes: this.inMemoryAmortizacoes.filter((m) => m.antecipacaoId === found.id),
      travas: this.inMemoryTravas.filter((t) => t.antecipacaoId === found.id),
    };
  }

  async getTravasBancarias(
    status?: string,
    producerId?: string,
  ): Promise<TravaDomicilioBancarioDto[]> {
    await this.ensureSeedData();

    try {
      const where: any = {};
      if (status && status !== 'TODOS') where.status = status;
      if (producerId) where.producerId = producerId;

      const travas = await this.prisma.travaDomicilioBancario.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (travas.length > 0) {
        return travas.map((t) => ({
          id: t.id,
          antecipacaoId: t.antecipacaoId,
          producerId: t.producerId,
          adquirente: t.adquirente as AdquirenteTrava,
          contaBancariaId: t.contaBancariaId,
          banco: t.banco,
          agencia: t.agencia,
          conta: t.conta,
          registradora: t.registradora as RegistradoraRecebiveis,
          protocoloContrato: t.protocoloContrato,
          status: t.status as StatusTravaBancaria,
          dataEfetivacao: t.dataEfetivacao.toISOString(),
          dataLiberacao: t.dataLiberacao ? t.dataLiberacao.toISOString() : null,
          createdAt: t.createdAt.toISOString(),
        }));
      }
    } catch {
      // Fallback
    }

    let list = [...this.inMemoryTravas];
    if (status && status !== 'TODOS') {
      list = list.filter((t) => t.status === status);
    }
    if (producerId) {
      list = list.filter((t) => t.producerId === producerId);
    }
    return list;
  }

  private mapToDto(r: any): AntecipacaoDto {
    return {
      id: r.id,
      codigoContrato: r.codigoContrato,
      producerId: r.producerId,
      producerNome: r.producerNome,
      eventId: r.eventId,
      eventNome: r.eventNome,
      valorSolicitado: Number(r.valorSolicitado),
      taxaMensal: Number(r.taxaMensal),
      prazoDias: r.prazoDias,
      custoFinanceiro: Number(r.custoFinanceiro),
      taxaAdministrativa: Number(r.taxaAdministrativa),
      valorLiquidoLiberado: Number(r.valorLiquidoLiberado),
      saldoDevedor: Number(r.saldoDevedor),
      valorAmortizado: Number(r.valorAmortizado),
      fundoReservaRetido: Number(r.fundoReservaRetido),
      status: r.status as StatusAntecipacao,
      dataSolicitacao: r.dataSolicitacao.toISOString(),
      dataAprovacao: r.dataAprovacao ? r.dataAprovacao.toISOString() : null,
      dataLiquidacao: r.dataLiquidacao ? r.dataLiquidacao.toISOString() : null,
      dataVencimento: r.dataVencimento.toISOString(),
      registradora: r.registradora as RegistradoraRecebiveis,
      protocoloRegistroUr: r.protocoloRegistroUr,
      statusTravaBancaria: r.statusTravaBancaria as StatusTravaBancaria,
      adquirentesTravadas: r.adquirentesTravadas,
      aprovadoPor: r.aprovadoPor,
      motivoRejeicao: r.motivoRejeicao,
      documentoAssinaturaId: r.documentoAssinaturaId,
      observacoes: r.observacoes,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      amortizacoes: r.amortizacoes
        ? r.amortizacoes.map((a: any) => ({
            id: a.id,
            antecipacaoId: a.antecipacaoId,
            repasseId: a.repasseId,
            valorAmortizado: Number(a.valorAmortizado),
            saldoAnterior: Number(a.saldoAnterior),
            saldoRestante: Number(a.saldoRestante),
            dataAmortizacao: a.dataAmortizacao.toISOString(),
            origemAmortizacao: a.origemAmortizacao as OrigemAmortizacao,
            observacao: a.observacao,
            createdAt: a.createdAt.toISOString(),
          }))
        : [],
      travas: r.travas
        ? r.travas.map((t: any) => ({
            id: t.id,
            antecipacaoId: t.antecipacaoId,
            producerId: t.producerId,
            adquirente: t.adquirente as AdquirenteTrava,
            contaBancariaId: t.contaBancariaId,
            banco: t.banco,
            agencia: t.agencia,
            conta: t.conta,
            registradora: t.registradora as RegistradoraRecebiveis,
            protocoloContrato: t.protocoloContrato,
            status: t.status as StatusTravaBancaria,
            dataEfetivacao: t.dataEfetivacao.toISOString(),
            dataLiberacao: t.dataLiberacao ? t.dataLiberacao.toISOString() : null,
            createdAt: t.createdAt.toISOString(),
          }))
        : [],
    };
  }
}
