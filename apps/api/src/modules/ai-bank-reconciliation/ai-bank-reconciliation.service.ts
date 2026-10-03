import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  StatusConciliacaoIa,
  CategoriaTarifaBancariaIa,
  StatusTravaEscrowD0,
} from '@diskingressos/types';
import type {
  AiBankReconciliationRunDto,
  BankFeeClassificationDto,
  EscrowSafetyThresholdDto,
  ExecutarCicloConciliacaoIaRequestDto,
  ExecutarCicloConciliacaoIaResponseDto,
  ReconciliationDashboardKpisDto,
} from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class AiBankReconciliationService {
  private readonly logger = new Logger(AiBankReconciliationService.name);

  private inMemoryCiclos: AiBankReconciliationRunDto[] = [];
  private inMemoryTarifas: BankFeeClassificationDto[] = [];
  private inMemoryEscrows: EscrowSafetyThresholdDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Conciliação Bancária Autônoma IA e Liquidação D+0 (Fase 34)...');

    // 1. Ciclos Autônomos de Conciliação
    const c1: AiBankReconciliationRunDto = {
      id: 'rec-001',
      codigoCiclo: 'REC-IA-2026-0941',
      bancoIspb: '60701190',
      bancoNome: 'Banco Itaú Unibanco S.A.',
      contaBancariaId: 'cta-itau-principal',
      totalTransacoesProcessadas: 1420,
      transacoesConciliadasAutomaticas: 1418,
      taxaAcuraciaPercent: 99.86,
      volumeTotalConciliadoBrl: 3850000.0,
      divergenciasDetectadas: 2,
      statusExecucao: 'CONCLUIDO_COM_SUCESSO',
      tempoProcessamentoMs: 412,
      hashIntegridadeAuditoria: crypto
        .createHash('sha256')
        .update('REC-IA-2026-0941|3850000|99.86')
        .digest('hex'),
      executadoEm: '2026-04-01T10:00:00Z',
    };

    const c2: AiBankReconciliationRunDto = {
      id: 'rec-002',
      codigoCiclo: 'REC-IA-2026-0942',
      bancoIspb: '00360305',
      bancoNome: 'Banco Bradesco S.A.',
      contaBancariaId: 'cta-bradesco-repasse',
      totalTransacoesProcessadas: 850,
      transacoesConciliadasAutomaticas: 850,
      taxaAcuraciaPercent: 100.0,
      volumeTotalConciliadoBrl: 2120000.0,
      divergenciasDetectadas: 0,
      statusExecucao: 'CONCLUIDO_COM_SUCESSO',
      tempoProcessamentoMs: 290,
      hashIntegridadeAuditoria: crypto
        .createHash('sha256')
        .update('REC-IA-2026-0942|2120000|100.0')
        .digest('hex'),
      executadoEm: '2026-04-01T11:00:00Z',
    };

    this.inMemoryCiclos = [c1, c2];

    // 2. Classificação Automática de Tarifas Ocultas
    const t1: BankFeeClassificationDto = {
      id: 'tar-001',
      codigoTarifa: 'TAR-IA-2026-1182',
      bancoIspb: '60701190',
      descricaoExtratoOriginal: 'TAR LIQ COB PIX D0',
      categoriaIdentificadaIa: CategoriaTarifaBancariaIa.TARIFA_PIX,
      valorTarifaBrl: 0.85,
      confiancaClassificacaoPercent: 99.4,
      contaContabilDebito: '3.1.2.04 - Despesas Bancárias PIX',
      contaContabilCredito: '1.1.1.02 - Itaú Conta Movimento',
      statusEscrituracao: 'ESCRITURADO_AUTOMATICO',
      dataLancamento: '2026-04-01T10:02:15Z',
    };

    const t2: BankFeeClassificationDto = {
      id: 'tar-002',
      codigoTarifa: 'TAR-IA-2026-1183',
      bancoIspb: '60701190',
      descricaoExtratoOriginal: 'TAXA MANUT CONTA EMPRESARIAL',
      categoriaIdentificadaIa: CategoriaTarifaBancariaIa.MANUTENCAO_CONTA,
      valorTarifaBrl: 89.9,
      confiancaClassificacaoPercent: 98.7,
      contaContabilDebito: '3.1.2.01 - Manutenção de Contas',
      contaContabilCredito: '1.1.1.02 - Itaú Conta Movimento',
      statusEscrituracao: 'ESCRITURADO_AUTOMATICO',
      dataLancamento: '2026-04-01T10:02:30Z',
    };

    const t3: BankFeeClassificationDto = {
      id: 'tar-003',
      codigoTarifa: 'TAR-IA-2026-1184',
      bancoIspb: '00360305',
      descricaoExtratoOriginal: 'RETENCAO CUSTODIA CIP RECEBIVEL',
      categoriaIdentificadaIa: CategoriaTarifaBancariaIa.CUSTODIA_RECEBIVEIS,
      valorTarifaBrl: 142.5,
      confiancaClassificacaoPercent: 97.9,
      contaContabilDebito: '3.1.2.08 - Custódia e Registradoras CERC/CIP',
      contaContabilCredito: '1.1.1.03 - Bradesco Conta Repasse',
      statusEscrituracao: 'ESCRITURADO_AUTOMATICO',
      dataLancamento: '2026-04-01T11:05:00Z',
    };

    this.inMemoryTarifas = [t1, t2, t3];

    // 3. Travas de Segurança Escrow D+0 por Evento
    const e1: EscrowSafetyThresholdDto = {
      id: 'esc-001',
      eventoId: 'evt-rock-arena',
      produtorId: 'prod-prime-tour',
      percentualRetencaoEscrow: 15.0, // 15% reserva de contingência
      saldoEscrowBloqueadoBrl: 727500.0,
      saldoDisponivelLiquidacaoD0Brl: 4122500.0,
      statusLiquidacaoD0: StatusTravaEscrowD0.LIBERADO_SEGURO,
      ultimaAtualizacao: '2026-04-01T12:00:00Z',
    };

    const e2: EscrowSafetyThresholdDto = {
      id: 'esc-002',
      eventoId: 'evt-symphonic',
      produtorId: 'prod-curitiba-shows',
      percentualRetencaoEscrow: 15.0,
      saldoEscrowBloqueadoBrl: 480000.0,
      saldoDisponivelLiquidacaoD0Brl: 2720000.0,
      statusLiquidacaoD0: StatusTravaEscrowD0.LIBERADO_SEGURO,
      ultimaAtualizacao: '2026-04-01T12:00:00Z',
    };

    this.inMemoryEscrows = [e1, e2];
    this.isInitialized = true;
  }

  // ============================================================================
  // 1. KPIS DO DASHBOARD DE CONCILIAÇÃO IA
  // ============================================================================
  async getDashboardKpis(): Promise<ReconciliationDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      taxaConciliacaoAutomaticaPercent: 99.88,
      volumeTotalConciliadoMesBrl: 18450000.0,
      tarifasBancariasEconomizadasBrl: 48200.0,
      saldoTotalEscrowProtegidoBrl: 2750000.0,
      totalRepassesD0LiquidadosBrl: 15700000.0,
      tempoMedioProcessamentoCicloMs: 340,
    };
  }

  // ============================================================================
  // 2. LISTAR CICLOS DE CONCILIAÇÃO
  // ============================================================================
  async listarCiclos(): Promise<AiBankReconciliationRunDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCiclos;
  }

  // ============================================================================
  // 3. LISTAR TARIFAS IDENTIFICADAS POR IA
  // ============================================================================
  async listarTarifasIdentificadas(): Promise<BankFeeClassificationDto[]> {
    await this.ensureSeedData();
    return this.inMemoryTarifas;
  }

  // ============================================================================
  // 4. LISTAR TRAVAS ESCROW D+0
  // ============================================================================
  async listarTravasEscrow(): Promise<EscrowSafetyThresholdDto[]> {
    await this.ensureSeedData();
    return this.inMemoryEscrows;
  }

  // ============================================================================
  // 5. EXECUTAR CICLO AUTÔNOMO DE CONCILIAÇÃO IA
  // ============================================================================
  async executarCicloConciliacaoIa(
    dto: ExecutarCicloConciliacaoIaRequestDto,
  ): Promise<ExecutarCicloConciliacaoIaResponseDto> {
    await this.ensureSeedData();

    const totalProcessado = 450;
    const totalConciliado = 449;
    const taxaSucessoPercent = 99.78;
    const volumeConciliadoBrl = 1250000.0;
    const tarifasDetectadasQuantidade = 12;
    const valorTotalTarifasBrl = 184.2;
    const tempoMs = 315;

    const codigoCiclo = `REC-IA-2026-${(this.inMemoryCiclos.length + 1).toString().padStart(4, '0')}`;
    const hashAuditoria = crypto
      .createHash('sha256')
      .update(`${codigoCiclo}|${volumeConciliadoBrl}|${Date.now()}`)
      .digest('hex');

    const novoCiclo: AiBankReconciliationRunDto = {
      id: `rec-${Date.now()}`,
      codigoCiclo,
      bancoIspb: dto.bancoIspb,
      bancoNome: dto.bancoIspb === '60701190' ? 'Banco Itaú Unibanco S.A.' : 'Banco Bradesco S.A.',
      contaBancariaId: dto.contaBancariaId,
      totalTransacoesProcessadas: totalProcessado,
      transacoesConciliadasAutomaticas: totalConciliado,
      taxaAcuraciaPercent: taxaSucessoPercent,
      volumeTotalConciliadoBrl: volumeConciliadoBrl,
      divergenciasDetectadas: 1,
      statusExecucao: 'CONCLUIDO_COM_SUCESSO',
      tempoProcessamentoMs: tempoMs,
      hashIntegridadeAuditoria: hashAuditoria,
      executadoEm: new Date().toISOString(),
    };

    this.inMemoryCiclos.unshift(novoCiclo);

    return {
      codigoCiclo,
      totalProcessado,
      totalConciliado,
      taxaSucessoPercent,
      volumeConciliadoBrl,
      tarifasDetectadasQuantidade,
      valorTotalTarifasBrl,
      tempoMs,
      hashAuditoria,
    };
  }

  // ============================================================================
  // 6. ATUALIZAR TRAVA ESCROW
  // ============================================================================
  async atualizarTravaEscrow(
    eventoId: string,
    percentual: number,
  ): Promise<EscrowSafetyThresholdDto> {
    await this.ensureSeedData();
    const item = this.inMemoryEscrows.find((e) => e.eventoId === eventoId);
    if (item) {
      item.percentualRetencaoEscrow = percentual;
      item.ultimaAtualizacao = new Date().toISOString();
      return item;
    }

    const novo: EscrowSafetyThresholdDto = {
      id: `esc-${Date.now()}`,
      eventoId,
      produtorId: 'prod-generico',
      percentualRetencaoEscrow: percentual,
      saldoEscrowBloqueadoBrl: 150000.0,
      saldoDisponivelLiquidacaoD0Brl: 850000.0,
      statusLiquidacaoD0: StatusTravaEscrowD0.LIBERADO_SEGURO,
      ultimaAtualizacao: new Date().toISOString(),
    };
    this.inMemoryEscrows.push(novo);
    return novo;
  }
}
