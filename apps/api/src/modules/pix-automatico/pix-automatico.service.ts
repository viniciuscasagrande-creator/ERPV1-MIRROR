import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  StatusMandatoPix,
  PeriodicidadeMandato,
  StatusCobrancaPix,
  CanalAutorizacaoPix,
} from '@diskingressos/types';
import type {
  PixAutomaticoMandatoDto,
  PixAutomaticoCobrancaDto,
  PixAutomaticoDashboardKpisDto,
  CriarMandatoPixRequestDto,
  ExecutarCobrancaPixRequestDto,
  SimularSmartRetryResponseDto,
} from '@diskingressos/types';

@Injectable()
export class PixAutomaticoService {
  private readonly logger = new Logger(PixAutomaticoService.name);

  private inMemoryMandatos: PixAutomaticoMandatoDto[] = [];
  private inMemoryCobrancas: PixAutomaticoCobrancaDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Pix Automático & Débito Recorrente (Bacen 430/431)...');

    // 1. Mandatos Ativos de Bilheteria / Passaportes
    const m1: PixAutomaticoMandatoDto = {
      id: 'man-001',
      codigoMandato: 'MAN-PIX-2026-0001',
      clienteNome: 'Mariana Duarte Souza',
      clienteCpfCnpj: '028.912.349-01',
      chavePix: 'mariana.souza@email.com',
      ispbBancoParticipante: '60701190',
      bancoNome: 'Banco Itaú Unibanco S.A.',
      planoAssinaturaNome: 'Passaporte Curitiba Sunset VIP 2026 (12x)',
      valorLimitePorTransacaoBrl: 350.0,
      periodicidade: PeriodicidadeMandato.MENSAL,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: 10,
      canalAutorizacao: CanalAutorizacaoPix.APP_BANCARIO_QR,
      autorizadoEm: new Date('2026-01-10T14:30:00Z').toISOString(),
      criadoEm: new Date('2026-01-10T14:25:00Z').toISOString(),
    };

    const m2: PixAutomaticoMandatoDto = {
      id: 'man-002',
      codigoMandato: 'MAN-PIX-2026-0002',
      clienteNome: 'Rodrigo Albuquerque Lima',
      clienteCpfCnpj: '419.823.765-20',
      chavePix: '+5541988887766',
      ispbBancoParticipante: '00000000',
      bancoNome: 'Banco do Brasil S.A.',
      planoAssinaturaNome: 'Clube Fidelidade Prime Rock Tour (Mensal)',
      valorLimitePorTransacaoBrl: 180.0,
      periodicidade: PeriodicidadeMandato.MENSAL,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: 15,
      canalAutorizacao: CanalAutorizacaoPix.APP_BANCARIO_QR,
      autorizadoEm: new Date('2026-02-15T09:10:00Z').toISOString(),
      criadoEm: new Date('2026-02-15T09:00:00Z').toISOString(),
    };

    const m3: PixAutomaticoMandatoDto = {
      id: 'man-003',
      codigoMandato: 'MAN-PIX-2026-0003',
      clienteNome: 'Juliana Mendes Carvalho',
      clienteCpfCnpj: '712.345.890-44',
      chavePix: 'juliana.mendes@empresa.com.br',
      ispbBancoParticipante: '00360305',
      bancoNome: 'Caixa Econômica Federal',
      planoAssinaturaNome: 'Camarote Corporativo Anual - Pedreira Paulo Leminski',
      valorLimitePorTransacaoBrl: 1200.0,
      periodicidade: PeriodicidadeMandato.MENSAL,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: 5,
      canalAutorizacao: CanalAutorizacaoPix.OPEN_FINANCE_REDIRECT,
      autorizadoEm: new Date('2026-01-05T11:20:00Z').toISOString(),
      criadoEm: new Date('2026-01-05T11:10:00Z').toISOString(),
    };

    this.inMemoryMandatos = [m1, m2, m3];

    // 2. Histórico de Cobranças Liquidadas no SPI com Split Quádruplo
    const c1: PixAutomaticoCobrancaDto = {
      id: 'cob-001',
      codigoCobranca: 'COB-PIX-2026-0042',
      mandatoId: 'man-001',
      clienteNome: 'Mariana Duarte Souza',
      valorCobradoBrl: 350.0,
      competenciaMesAno: '2026-03',
      dataAgendada: new Date('2026-03-10T08:00:00Z').toISOString(),
      dataLiquidacaoSpi: new Date('2026-03-10T08:00:00.640Z').toISOString(),
      endToEndIdBacen: 'E60701190202603100800a94b81c201',
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 640,
      tentativasRealizadas: 1,
      // Split Quádruplo Instantâneo no SPI
      splitReceitaPropriaBrl: 42.0,    // 12% Comissão DiskIngressos (Receita própria)
      splitRepasseProdutorBrl: 262.5,  // 75% Produtor do Festival
      splitRetencaoFidcBrl: 42.0,      // 12% Lastro FIDC Cotas Seniores
      splitCompensacaoEsgBrl: 3.5,     // 1% Borderô Verde Crédito de Carbono
      lancamentoContabilRef: 'LAN-CTB-PIX-2026-0984',
      criadoEm: new Date('2026-03-10T08:00:00Z').toISOString(),
    };

    const c2: PixAutomaticoCobrancaDto = {
      id: 'cob-002',
      codigoCobranca: 'COB-PIX-2026-0043',
      mandatoId: 'man-002',
      clienteNome: 'Rodrigo Albuquerque Lima',
      valorCobradoBrl: 180.0,
      competenciaMesAno: '2026-03',
      dataAgendada: new Date('2026-03-15T08:00:00Z').toISOString(),
      dataLiquidacaoSpi: new Date('2026-03-15T08:00:00.580Z').toISOString(),
      endToEndIdBacen: 'E00000000202603150800b73c91d402',
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 580,
      tentativasRealizadas: 1,
      splitReceitaPropriaBrl: 21.6,
      splitRepasseProdutorBrl: 135.0,
      splitRetencaoFidcBrl: 21.6,
      splitCompensacaoEsgBrl: 1.8,
      lancamentoContabilRef: 'LAN-CTB-PIX-2026-0985',
      criadoEm: new Date('2026-03-15T08:00:00Z').toISOString(),
    };

    const c3: PixAutomaticoCobrancaDto = {
      id: 'cob-003',
      codigoCobranca: 'COB-PIX-2026-0044',
      mandatoId: 'man-003',
      clienteNome: 'Juliana Mendes Carvalho',
      valorCobradoBrl: 1200.0,
      competenciaMesAno: '2026-04',
      dataAgendada: new Date('2026-04-05T07:00:00Z').toISOString(),
      dataLiquidacaoSpi: new Date('2026-04-05T07:00:00.612Z').toISOString(),
      endToEndIdBacen: 'E00360305202604050700c82d02e503',
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 612,
      tentativasRealizadas: 1,
      splitReceitaPropriaBrl: 144.0,
      splitRepasseProdutorBrl: 900.0,
      splitRetencaoFidcBrl: 144.0,
      splitCompensacaoEsgBrl: 12.0,
      lancamentoContabilRef: 'LAN-CTB-PIX-2026-0986',
      criadoEm: new Date('2026-04-05T07:00:00Z').toISOString(),
    };

    this.inMemoryCobrancas = [c1, c2, c3];
    this.isInitialized = true;
  }

  // ============================================================================
  // 1. KPIS EXECUTIVOS DO DASHBOARD
  // ============================================================================
  async getDashboardKpis(): Promise<PixAutomaticoDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      volumeMensalLiquidadoBrl: 8450000.0,
      totalMandatosAtivos: 24890,
      taxaSucessoPrimeiraTentativaPercent: 94.2,
      taxaRecuperacaoSmartRetryPercent: 96.8,
      tempoMedioLiquidacaoSpiMs: 640,
    };
  }

  // ============================================================================
  // 2. GESTÃO DE MANDATOS (AUTORIZAÇÕES DE DÉBITO BCB 430/431)
  // ============================================================================
  async listarMandatos(): Promise<PixAutomaticoMandatoDto[]> {
    await this.ensureSeedData();
    return this.inMemoryMandatos;
  }

  async obterMandatoPorId(id: string): Promise<PixAutomaticoMandatoDto | null> {
    await this.ensureSeedData();
    return this.inMemoryMandatos.find((m) => m.id === id) || null;
  }

  async criarMandato(dto: CriarMandatoPixRequestDto): Promise<PixAutomaticoMandatoDto> {
    await this.ensureSeedData();

    const novoMandato: PixAutomaticoMandatoDto = {
      id: `man-${Date.now()}`,
      codigoMandato: `MAN-PIX-2026-${(this.inMemoryMandatos.length + 1).toString().padStart(4, '0')}`,
      clienteNome: dto.clienteNome,
      clienteCpfCnpj: dto.clienteCpfCnpj,
      chavePix: dto.chavePix,
      ispbBancoParticipante: dto.ispbBancoParticipante,
      bancoNome: dto.bancoNome,
      planoAssinaturaNome: dto.planoAssinaturaNome,
      valorLimitePorTransacaoBrl: dto.valorLimitePorTransacaoBrl,
      periodicidade: dto.periodicidade,
      statusMandato: StatusMandatoPix.ATIVO,
      diaVencimento: dto.diaVencimento,
      canalAutorizacao: CanalAutorizacaoPix.APP_BANCARIO_QR,
      autorizadoEm: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
    };

    this.inMemoryMandatos.unshift(novoMandato);
    return novoMandato;
  }

  async cancelarMandato(id: string, motivo: string): Promise<PixAutomaticoMandatoDto | null> {
    await this.ensureSeedData();
    const mandato = this.inMemoryMandatos.find((m) => m.id === id);
    if (!mandato) return null;

    mandato.statusMandato = StatusMandatoPix.CANCELADO_USUARIO;
    mandato.canceladoEm = new Date().toISOString();
    mandato.motivoCancelamento = motivo;
    return mandato;
  }

  // ============================================================================
  // 3. EXECUÇÃO DE COBRANÇA RECORRENTE & SPLIT NO SPI
  // ============================================================================
  async listarCobrancas(): Promise<PixAutomaticoCobrancaDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCobrancas;
  }

  async executarCobranca(dto: ExecutarCobrancaPixRequestDto): Promise<PixAutomaticoCobrancaDto> {
    await this.ensureSeedData();
    const mandato = this.inMemoryMandatos.find((m) => m.id === dto.mandatoId);
    const clienteNome = mandato?.clienteNome || 'Cliente Assinante';

    const v = dto.valorCobradoBrl;
    // Cálculo do Split Quádruplo: 12% Disk, 75% Produtor, 12% FIDC, 1% ESG
    const splitReceitaPropriaBrl = Number((v * 0.12).toFixed(2));
    const splitRepasseProdutorBrl = Number((v * 0.75).toFixed(2));
    const splitRetencaoFidcBrl = Number((v * 0.12).toFixed(2));
    const splitCompensacaoEsgBrl = Number((v * 0.01).toFixed(2));

    const endToEndIdBacen = `E${mandato?.ispbBancoParticipante || '60701190'}${new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, '')
      .substring(0, 14)}pixauto${Math.floor(Math.random() * 1000)}`;

    const novaCobranca: PixAutomaticoCobrancaDto = {
      id: `cob-${Date.now()}`,
      codigoCobranca: `COB-PIX-2026-${(this.inMemoryCobrancas.length + 1).toString().padStart(4, '0')}`,
      mandatoId: dto.mandatoId,
      clienteNome,
      valorCobradoBrl: v,
      competenciaMesAno: dto.competenciaMesAno,
      dataAgendada: new Date().toISOString(),
      dataLiquidacaoSpi: new Date().toISOString(),
      endToEndIdBacen,
      statusCobranca: StatusCobrancaPix.LIQUIDADA_SUCESSO,
      tempoLiquidacaoMs: 625,
      tentativasRealizadas: 1,
      splitReceitaPropriaBrl,
      splitRepasseProdutorBrl,
      splitRetencaoFidcBrl,
      splitCompensacaoEsgBrl,
      lancamentoContabilRef: `LAN-CTB-PIX-2026-${Date.now().toString().slice(-4)}`,
      criadoEm: new Date().toISOString(),
    };

    this.inMemoryCobrancas.unshift(novaCobranca);
    return novaCobranca;
  }

  // ============================================================================
  // 4. MOTOR SMART RETRIES POR IA
  // ============================================================================
  async simularSmartRetry(cobrancaId: string): Promise<SimularSmartRetryResponseDto> {
    await this.ensureSeedData();

    return {
      cobrancaId,
      horarioRecomendadoIa: '07:15:00 (Janela de Compensação Salarial Bacen)',
      probabilidadeSaldoSuficientePercent: 96.8,
      motivoOtimizacao:
        'Análise preditiva de liquidez Open Finance detectou pico de saldo disponível nas primeiras horas da manhã do 5º dia útil.',
    };
  }
}
