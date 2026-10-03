import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  TipoAtivoTokenizado,
  PadraoToken,
  NetworkChain,
  StatusPoolRwa,
  FaseEventoEscrow,
  StatusOracleEscrow,
  StatusTradeSecundario,
} from '@diskingressos/types';
import type {
  RwaTicketTokenPoolDto,
  SmartContractEscrowTriggerDto,
  SecondaryMarketTradeDto,
  RwaAccountingRegisterDto,
  SimularRevendaSecundariaRequestDto,
  SimularRevendaSecundariaResponseDto,
  RwaDrexDashboardKpisDto,
} from '@diskingressos/types';

@Injectable()
export class RwaDrexService {
  private readonly logger = new Logger(RwaDrexService.name);

  private inMemoryPools: RwaTicketTokenPoolDto[] = [];
  private inMemoryTriggers: SmartContractEscrowTriggerDto[] = [];
  private inMemoryTrades: SecondaryMarketTradeDto[] = [];
  private inMemoryRegisters: RwaAccountingRegisterDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando pools de ativos tokenizados RWA e liquidação DREX em memória...');

    // 1. Pools de Ativos Tokenizados (RWA / DREX Pilot)
    const p1: RwaTicketTokenPoolDto = {
      id: 'pool-001',
      codigoTokenPool: 'RWA-DREX-2026-001',
      nomePool: 'Festival Rock Curitiba Prime 2026 - Lote VIP RWA',
      eventoId: 'evt-001',
      eventoNome: 'Festival Rock Curitiba Prime 2026',
      produtorId: 'prod-001',
      produtorNome: 'Prime Eventos Culturais S.A.',
      tipoAtivoTokenizado: TipoAtivoTokenizado.LOTE_INGRESSOS,
      padraoToken: PadraoToken.ERC3643_PERMISSIONED,
      contractAddress: '0x71C8A336F158d6265B54e3dE55aF3A4b419409bE',
      networkChain: NetworkChain.BACEN_DREX_HYPERLEDGER,
      totalTokensEmitidos: 10000,
      tokensDisponiveis: 1200,
      tokensLiquidados: 8800,
      valorFaceUnitarioBrl: 250.0,
      valorCaptadoBrl: 2500000.0,
      taxaRetornoAnualPercent: 14.25,
      statusPool: StatusPoolRwa.ATIVO_LANCADO,
      dataEmissao: new Date('2026-02-10T10:00:00Z').toISOString(),
      dataMaturidade: new Date('2026-04-15T23:59:59Z').toISOString(),
    };

    const p2: RwaTicketTokenPoolDto = {
      id: 'pool-002',
      codigoTokenPool: 'RWA-DREX-2026-002',
      nomePool: 'Coldplay Eco Experience - Recebíveis Futuros A&B',
      eventoId: 'evt-002',
      eventoNome: 'Tour Coldplay Eco Music Experience 2026',
      produtorId: 'prod-002',
      produtorNome: 'Live Nation Brasil Entretenimento Ltda',
      tipoAtivoTokenizado: TipoAtivoTokenizado.RECEBIVEL_FUTURO,
      padraoToken: PadraoToken.DREX_PILOT,
      contractAddress: '0x3B88e40428B715C8aB15783A9250b730591295A2',
      networkChain: NetworkChain.BACEN_DREX_HYPERLEDGER,
      totalTokensEmitidos: 5000,
      tokensDisponiveis: 500,
      tokensLiquidados: 4500,
      valorFaceUnitarioBrl: 500.0,
      valorCaptadoBrl: 2500000.0,
      taxaRetornoAnualPercent: 13.8,
      statusPool: StatusPoolRwa.ATIVO_LANCADO,
      dataEmissao: new Date('2026-02-15T14:00:00Z').toISOString(),
      dataMaturidade: new Date('2026-05-30T23:59:59Z').toISOString(),
    };

    const p3: RwaTicketTokenPoolDto = {
      id: 'pool-003',
      codigoTokenPool: 'RWA-POLY-2026-003',
      nomePool: 'Pedreira Sunset Sessions - Lote Pista Tokenizada',
      eventoId: 'evt-003',
      eventoNome: 'Eletrônica Sunset Pedreira Paulo Leminski',
      produtorId: 'prod-003',
      produtorNome: 'Pedreira Live Entertainment Ltda',
      tipoAtivoTokenizado: TipoAtivoTokenizado.LOTE_INGRESSOS,
      padraoToken: PadraoToken.ERC1155_HYBRID,
      contractAddress: '0x992B104F5E6D8A3A95E4A786c6F523412a8321F5',
      networkChain: NetworkChain.POLYGON_POS,
      totalTokensEmitidos: 15000,
      tokensDisponiveis: 3000,
      tokensLiquidados: 12000,
      valorFaceUnitarioBrl: 120.0,
      valorCaptadoBrl: 1800000.0,
      taxaRetornoAnualPercent: 12.0,
      statusPool: StatusPoolRwa.ATIVO_LANCADO,
      dataEmissao: new Date('2026-02-20T11:00:00Z').toISOString(),
      dataMaturidade: new Date('2026-04-30T23:59:59Z').toISOString(),
    };

    this.inMemoryPools = [p1, p2, p3];

    // 2. Triggers de Escrow Programável (Smart Contracts por Oráculo)
    const t1: SmartContractEscrowTriggerDto = {
      id: 'trg-001',
      tokenPoolId: 'pool-001',
      eventoId: 'evt-001',
      faseEvento: FaseEventoEscrow.SOUNDCHECK_HOMOLOGADO,
      percentualLiberacao: 20.0,
      valorLiberadoBrl: 500000.0,
      oracleStatus: StatusOracleEscrow.LIQUIDADO_DREX,
      txHashBlockchain: '0x8823fba93c129e9240bf3812fa48194b29019284201824059128301294819203',
      dataLiberacao: new Date('2026-03-01T15:30:00Z').toISOString(),
      criadoEm: new Date('2026-02-10T10:30:00Z').toISOString(),
    };

    const t2: SmartContractEscrowTriggerDto = {
      id: 'trg-002',
      tokenPoolId: 'pool-001',
      eventoId: 'evt-001',
      faseEvento: FaseEventoEscrow.ABERTURA_PORTOES,
      percentualLiberacao: 40.0,
      valorLiberadoBrl: 1000000.0,
      oracleStatus: StatusOracleEscrow.LIQUIDADO_DREX,
      txHashBlockchain: '0x4491029410940192830192481029480192834019283019284019283049182304',
      dataLiberacao: new Date('2026-03-01T17:00:00Z').toISOString(),
      criadoEm: new Date('2026-02-10T10:30:00Z').toISOString(),
    };

    const t3: SmartContractEscrowTriggerDto = {
      id: 'trg-003',
      tokenPoolId: 'pool-001',
      eventoId: 'evt-001',
      faseEvento: FaseEventoEscrow.ENCERRAMENTO_VALIDADO,
      percentualLiberacao: 40.0,
      valorLiberadoBrl: 1000000.0,
      oracleStatus: StatusOracleEscrow.VERIFICADO_ORACULO,
      txHashBlockchain: '0x1203948102934810293481029348102934810293481029348102934810293481',
      criadoEm: new Date('2026-02-10T10:30:00Z').toISOString(),
    };

    this.inMemoryTriggers = [t1, t2, t3];

    // 3. Mercado Secundário Regulado com Trava Anti-Cambismo
    const m1: SecondaryMarketTradeDto = {
      id: 'trade-001',
      codigoOperacao: 'SEC-TRADE-2026-9812',
      tokenPoolId: 'pool-001',
      ticketId: 'tkt-rwa-8812',
      compradorWallet: '0x1a89F6...4D22',
      vendedorWallet: '0x88cB91...21F4',
      precoFaceOriginalBrl: 250.0,
      precoRevendaBrl: 290.0,
      agioPercentual: 16.0, // Abaixo do limite de 20%
      taxaRoyaltyProdutorBrl: 14.5, // 5% do valor da revenda
      taxaPlataformaDiskBrl: 7.25, // 2.5% do valor da revenda
      txHashDrex: '0x5501928301928401928301924801928340192830192840192830192840192830',
      statusTrade: StatusTradeSecundario.LIQUIDADO,
      executadoEm: new Date('2026-03-02T14:20:00Z').toISOString(),
    };

    const m2: SecondaryMarketTradeDto = {
      id: 'trade-002',
      codigoOperacao: 'SEC-TRADE-2026-9813',
      tokenPoolId: 'pool-001',
      ticketId: 'tkt-rwa-8813',
      compradorWallet: '0x44bB01...7A99',
      vendedorWallet: '0x992C88...33E1',
      precoFaceOriginalBrl: 250.0,
      precoRevendaBrl: 275.0,
      agioPercentual: 10.0,
      taxaRoyaltyProdutorBrl: 13.75, // 5%
      taxaPlataformaDiskBrl: 6.88, // 2.5%
      txHashDrex: '0x7701928301928401928301924801928340192830192840192830192840192831',
      statusTrade: StatusTradeSecundario.LIQUIDADO,
      executadoEm: new Date('2026-03-02T16:45:00Z').toISOString(),
    };

    this.inMemoryTrades = [m1, m2];

    // 4. Escrituração Contábil OCPC 10 / CVM
    const r1: RwaAccountingRegisterDto = {
      id: 'reg-001',
      codigoLancamento: 'OCPC10-2026-001',
      tokenPoolId: 'pool-001',
      tipoLancamento: 'CAPTACAO_INICIAL',
      valorBrl: 2500000.0,
      contaDebito: '1.1.2.04 - Ativos Digitais Sob Custódia DREX',
      contaCredito: '2.1.9.01 - Obrigações por Tokens RWA Emitidos',
      historicoOcpc10:
        'Registro da captação de recursos via tokenização RWA de ingressos VIP sob regulação CVM Res. 88/22 e custódia DREX.',
      dataRegistro: new Date('2026-02-10T11:00:00Z').toISOString(),
    };

    const r2: RwaAccountingRegisterDto = {
      id: 'reg-002',
      codigoLancamento: 'OCPC10-2026-002',
      tokenPoolId: 'pool-001',
      tipoLancamento: 'LIBERACAO_ESCROW',
      valorBrl: 1500000.0,
      contaDebito: '2.1.9.01 - Obrigações por Tokens RWA Emitidos',
      contaCredito: '1.1.1.02 - Conta Reservas Bancárias DREX / Liquidada',
      historicoOcpc10:
        'Liquidação programável em DREX liberada por Smart Contract após marcos de Soundcheck e Abertura de Portões.',
      dataRegistro: new Date('2026-03-01T17:30:00Z').toISOString(),
    };

    this.inMemoryRegisters = [r1, r2];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DO DASHBOARD RWA / DREX
  // ============================================================================
  async getDashboardKpis(): Promise<RwaDrexDashboardKpisDto> {
    await this.ensureSeedData();

    const totalValueLockedDrexBrl = Number(
      this.inMemoryPools
        .reduce((acc, p) => acc + p.valorCaptadoBrl, 0)
        .toFixed(2),
    );

    const tokensRwaCirculacaoCount = this.inMemoryPools.reduce(
      (acc, p) => acc + p.totalTokensEmitidos,
      0,
    );

    const volumeMercadoSecundarioBrl = Number(
      this.inMemoryTrades
        .reduce((acc, t) => acc + t.precoRevendaBrl, 0)
        .toFixed(2),
    );

    const royaltiesAntiCambismoBrl = Number(
      this.inMemoryTrades
        .reduce((acc, t) => acc + t.taxaRoyaltyProdutorBrl + t.taxaPlataformaDiskBrl, 0)
        .toFixed(2),
    );

    return {
      totalValueLockedDrexBrl,
      tokensRwaCirculacaoCount,
      volumeMercadoSecundarioBrl,
      royaltiesAntiCambismoBrl,
      poolsAtivasCount: this.inMemoryPools.length,
      liquidacaoSmartContractsPercent: 100.0,
    };
  }

  // ============================================================================
  // POOLS DE TOKENS
  // ============================================================================
  async listarPools(): Promise<RwaTicketTokenPoolDto[]> {
    await this.ensureSeedData();
    return this.inMemoryPools;
  }

  async obterPoolPorId(id: string): Promise<RwaTicketTokenPoolDto | null> {
    await this.ensureSeedData();
    return this.inMemoryPools.find((p) => p.id === id) || null;
  }

  // ============================================================================
  // ESCROW TRIGGERS POR SMART CONTRACT & ORÁCULO
  // ============================================================================
  async listarTriggersEscrow(): Promise<SmartContractEscrowTriggerDto[]> {
    await this.ensureSeedData();
    return this.inMemoryTriggers;
  }

  async executarTriggerEscrow(id: string): Promise<SmartContractEscrowTriggerDto> {
    await this.ensureSeedData();
    const trigger = this.inMemoryTriggers.find((t) => t.id === id);
    if (!trigger) {
      throw new Error(`Trigger com ID ${id} não localizado.`);
    }

    trigger.oracleStatus = StatusOracleEscrow.LIQUIDADO_DREX;
    trigger.dataLiberacao = new Date().toISOString();
    trigger.txHashBlockchain = '0x' + Math.random().toString(16).substring(2).padEnd(64, '0');
    return trigger;
  }

  // ============================================================================
  // MERCADO SECUNDÁRIO REGULADO & TRAVA ANTI-CAMBISMO
  // ============================================================================
  async listarTradesSecundarios(): Promise<SecondaryMarketTradeDto[]> {
    await this.ensureSeedData();
    return this.inMemoryTrades;
  }

  simularRevendaSecundaria(
    dto: SimularRevendaSecundariaRequestDto,
  ): SimularRevendaSecundariaResponseDto {
    const agioMaximoPermitidoPercentual = 20.0; // Teto estrito anti-cambismo: max +20% sobre o preço de face
    const agioPercentual = Number(
      (
        ((dto.precoRevendaPretendidoBrl - dto.precoFaceOriginalBrl) /
          dto.precoFaceOriginalBrl) *
        100
      ).toFixed(2),
    );

    if (agioPercentual > agioMaximoPermitidoPercentual) {
      return {
        permitido: false,
        agioPercentual,
        agioMaximoPermitidoPercentual,
        motivoBloqueio: `Ágio de +${agioPercentual}% excede o limite regulatório anti-cambismo da CVM Res. 88 (máximo +${agioMaximoPermitidoPercentual}%). Operação barrada pelo Smart Contract.`,
        taxaRoyaltyProdutorBrl: 0,
        taxaPlataformaDiskBrl: 0,
        valorLiquidoVendedorBrl: 0,
        regrasAntiCambismoCvm88: 'BLOQUEADO_POR_TRAVA_CAMBISMO',
      };
    }

    // Split automático de royalties secundários
    const taxaRoyaltyProdutorBrl = Number(
      (dto.precoRevendaPretendidoBrl * 0.05).toFixed(2), // 5% Produtor
    );
    const taxaPlataformaDiskBrl = Number(
      (dto.precoRevendaPretendidoBrl * 0.025).toFixed(2), // 2.5% DiskIngressos
    );
    const valorLiquidoVendedorBrl = Number(
      (
        dto.precoRevendaPretendidoBrl -
        taxaRoyaltyProdutorBrl -
        taxaPlataformaDiskBrl
      ).toFixed(2),
    );

    return {
      permitido: true,
      agioPercentual,
      agioMaximoPermitidoPercentual,
      taxaRoyaltyProdutorBrl,
      taxaPlataformaDiskBrl,
      valorLiquidoVendedorBrl,
      regrasAntiCambismoCvm88: 'CONFORME_CVM_88_TRAVA_ATIVA',
    };
  }

  // ============================================================================
  // ESCRITURAÇÃO CONTÁBIL OCPC 10
  // ============================================================================
  async listarRegistrosContabeis(): Promise<RwaAccountingRegisterDto[]> {
    await this.ensureSeedData();
    return this.inMemoryRegisters;
  }
}
