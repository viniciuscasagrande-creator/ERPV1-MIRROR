import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CategoriaEspetaculoCostCenter,
  TipoAtividadeAbc,
  StatusCentroCusto,
} from '@diskingressos/types';
import type {
  EventCostCenterDto,
  CostDriverAllocationDto,
  EventDreStatementDto,
  SimularRateioAbcRequestDto,
  SimularRateioAbcResponseDto,
  CostCenterDashboardKpisDto,
} from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class EventCostCenterDreService {
  private readonly logger = new Logger(EventCostCenterDreService.name);

  private inMemoryCentros: EventCostCenterDto[] = [];
  private inMemoryAlocacoes: CostDriverAllocationDto[] = [];
  private inMemoryDres: EventDreStatementDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de DRE por Centro de Custo e Custeio ABC (Fase 33)...');

    // 1. Centros de Custo de Eventos
    const cc1: EventCostCenterDto = {
      id: 'cc-001',
      codigoCentroCusto: 'CC-EVT-2026-0042',
      nomeCentroCusto: 'Festival Rock Curitiba Arena 2026',
      eventoId: 'evt-rock-arena',
      produtorId: 'prod-prime-tour',
      categoriaEspetaculo: CategoriaEspetaculoCostCenter.FESTIVAL,
      statusCentroCusto: StatusCentroCusto.ATIVO,
      saldoAtualContabilBrl: 4850000.0,
      criadoEm: '2026-03-01T10:00:00Z',
      atualizadoEm: '2026-04-01T12:00:00Z',
    };

    const cc2: EventCostCenterDto = {
      id: 'cc-002',
      codigoCentroCusto: 'CC-EVT-2026-0043',
      nomeCentroCusto: 'Turnê Internacional Sunset Symphonic',
      eventoId: 'evt-symphonic',
      produtorId: 'prod-curitiba-shows',
      categoriaEspetaculo: CategoriaEspetaculoCostCenter.SHOW_INTERNACIONAL,
      statusCentroCusto: StatusCentroCusto.ATIVO,
      saldoAtualContabilBrl: 3200000.0,
      criadoEm: '2026-03-05T14:30:00Z',
      atualizadoEm: '2026-04-01T12:00:00Z',
    };

    const cc3: EventCostCenterDto = {
      id: 'cc-003',
      codigoCentroCusto: 'CC-EVT-2026-0044',
      nomeCentroCusto: 'Musical Broadway Clássicos no Teatro Guaíra',
      eventoId: 'evt-broadway-guaira',
      produtorId: 'prod-teatro-guaira',
      categoriaEspetaculo: CategoriaEspetaculoCostCenter.TEATRO_MUSICAL,
      statusCentroCusto: StatusCentroCusto.ENCERRADO_CONCILIADO,
      saldoAtualContabilBrl: 950000.0,
      criadoEm: '2026-02-10T09:00:00Z',
      atualizadoEm: '2026-03-31T18:00:00Z',
    };

    this.inMemoryCentros = [cc1, cc2, cc3];

    // 2. Alocações de Rateio ABC (Activity-Based Costing)
    const a1: CostDriverAllocationDto = {
      id: 'rat-001',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0081',
      nomeAtividade: TipoAtividadeAbc.PROCESSAMENTO_NUVEM_TRANSACIONAL,
      direcionadorCustoNome: 'TRANSACOES_PROCESSADAS_GATEWAY',
      quantidadeConsumida: 32400,
      custoUnitarioBrl: 0.42,
      custoTotalAlocadoBrl: 13608.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:00:00Z',
    };

    const a2: CostDriverAllocationDto = {
      id: 'rat-002',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0082',
      nomeAtividade: TipoAtividadeAbc.SUPORTE_ATENDIMENTO_SAC,
      direcionadorCustoNome: 'HORAS_HOMEM_ATENDIMENTO_VIP',
      quantidadeConsumida: 120,
      custoUnitarioBrl: 75.0,
      custoTotalAlocadoBrl: 9000.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:05:00Z',
    };

    const a3: CostDriverAllocationDto = {
      id: 'rat-003',
      centroCustoId: 'cc-001',
      codigoRateio: 'RAT-ABC-2026-0083',
      nomeAtividade: TipoAtividadeAbc.SEGURANCA_ANTIFRAUDE,
      direcionadorCustoNome: 'VERIFICACOES_BIOMETRICAS_SENTINEL',
      quantidadeConsumida: 24800,
      custoUnitarioBrl: 0.18,
      custoTotalAlocadoBrl: 4464.0,
      mesCompetencia: '2026-04',
      criadoEm: '2026-04-01T11:10:00Z',
    };

    this.inMemoryAlocacoes = [a1, a2, a3];

    // 3. Demonstrativo DRE Gerencial por Evento (Art. 187 Lei 6.404/76)
    const dre1: EventDreStatementDto = {
      id: 'dre-001',
      centroCustoId: 'cc-001',
      codigoDre: 'DRE-EVT-2026-0042',
      periodoCompetencia: '2026-04',
      receitaBrutaBilheteriaBrl: 4850000.0,
      impostosDeducoesBrl: 514100.0, // IVA Dual CBS + IBS (10.6%)
      receitaLiquidaBilheteriaBrl: 4335900.0,
      custosDiretosEspetaculoBrl: 2150000.0, // Rider, Arena, Geradores, Limpeza
      margemContribuicaoBrl: 2185900.0,
      custosIndiretosAbcBrl: 27072.0, // Soma dos direcionadores ABC (a1+a2+a3)
      resultadoOperacionalEbitdaBrl: 2158828.0,
      repasseLiquidoProdutorBrl: 1650000.0,
      lucroLiquidoPlataformaBrl: 508828.0,
      margemLiquidaPercent: 10.49,
      auditHashSha256: crypto
        .createHash('sha256')
        .update('DRE-EVT-2026-0042|4850000|508828|2026-04')
        .digest('hex'),
      geradoEm: '2026-04-01T11:30:00Z',
    };

    const dre2: EventDreStatementDto = {
      id: 'dre-002',
      centroCustoId: 'cc-002',
      codigoDre: 'DRE-EVT-2026-0043',
      periodoCompetencia: '2026-04',
      receitaBrutaBilheteriaBrl: 3200000.0,
      impostosDeducoesBrl: 339200.0,
      receitaLiquidaBilheteriaBrl: 2860800.0,
      custosDiretosEspetaculoBrl: 1420000.0,
      margemContribuicaoBrl: 1440800.0,
      custosIndiretosAbcBrl: 18450.0,
      resultadoOperacionalEbitdaBrl: 1422350.0,
      repasseLiquidoProdutorBrl: 1100000.0,
      lucroLiquidoPlataformaBrl: 322350.0,
      margemLiquidaPercent: 10.07,
      auditHashSha256: crypto
        .createHash('sha256')
        .update('DRE-EVT-2026-0043|3200000|322350|2026-04')
        .digest('hex'),
      geradoEm: '2026-04-01T11:45:00Z',
    };

    this.inMemoryDres = [dre1, dre2];
    this.isInitialized = true;
  }

  // ============================================================================
  // 1. KPIS DO DASHBOARD DE CENTROS DE CUSTO
  // ============================================================================
  async getDashboardKpis(): Promise<CostCenterDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      totalCentrosCustoAtivos: 18,
      volumeReceitaTotalCentrosBrl: 14250000.0,
      custosDiretosTotaisBrl: 6420000.0,
      custosIndiretosRateadosAbcBrl: 245000.0,
      margemContribuicaoMediaPercent: 53.2,
      lucroLiquidoConsolidadoCentrosBrl: 1542000.0,
    };
  }

  // ============================================================================
  // 2. LISTAR CENTROS DE CUSTO
  // ============================================================================
  async listarCentrosCusto(): Promise<EventCostCenterDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCentros;
  }

  // ============================================================================
  // 3. OBTER DRE POR CENTRO DE CUSTO DO EVENTO
  // ============================================================================
  async obterDrePorCentroCusto(centroCustoId: string): Promise<EventDreStatementDto> {
    await this.ensureSeedData();
    const dre = this.inMemoryDres.find((d) => d.centroCustoId === centroCustoId);
    if (dre) return dre;

    // Retorna DRE padrão do primeiro evento se não encontrar id específico
    return this.inMemoryDres[0];
  }

  // ============================================================================
  // 4. LISTAR ALOCAÇÕES DE RATEIO ABC
  // ============================================================================
  async listarAlocacoesAbc(centroCustoId?: string): Promise<CostDriverAllocationDto[]> {
    await this.ensureSeedData();
    if (centroCustoId) {
      return this.inMemoryAlocacoes.filter((a) => a.centroCustoId === centroCustoId);
    }
    return this.inMemoryAlocacoes;
  }

  // ============================================================================
  // 5. SIMULAÇÃO DE RATEIO ABC EM TEMPO REAL
  // ============================================================================
  async simularRateioAbc(dto: SimularRateioAbcRequestDto): Promise<SimularRateioAbcResponseDto> {
    await this.ensureSeedData();

    // Custos Unitários por Atividade ABC
    const custoHoraSuporte = 75.0; // R$ 75,00 por hora de atendimento SAC
    const custoPorTransacao = 0.42; // R$ 0,42 por transação em nuvem
    const custoHoraCpu = 1.85; // R$ 1,85 por hora de CPU/RAM em cluster Kubernetes

    const totalSuporte = Number((dto.horasSuporteSac * custoHoraSuporte).toFixed(2));
    const totalTransacoes = Number((dto.transacoesProcessadas * custoPorTransacao).toFixed(2));
    const totalCloud = Number((dto.consumoCloudCpuHoras * custoHoraCpu).toFixed(2));

    const custoTotalRateadoBrl = Number((totalSuporte + totalTransacoes + totalCloud).toFixed(2));

    const dreAtual = await this.obterDrePorCentroCusto(dto.centroCustoId);
    const novaMargemContribuicaoBrl = Number(
      (dreAtual.receitaLiquidaBilheteriaBrl - dreAtual.custosDiretosEspetaculoBrl).toFixed(2),
    );
    const novoLucroLiquidoBrl = Number(
      (novaMargemContribuicaoBrl - custoTotalRateadoBrl - (dreAtual.repasseLiquidoProdutorBrl || 0)).toFixed(2),
    );
    const novaMargemLiquidaPercent = Number(
      ((novoLucroLiquidoBrl / dreAtual.receitaLiquidaBilheteriaBrl) * 100).toFixed(2),
    );

    const codigoRateio = `RAT-ABC-SIM-${Date.now().toString().slice(-4)}`;

    return {
      centroCustoId: dto.centroCustoId,
      codigoRateio,
      custoTotalRateadoBrl,
      detalhesAtividades: [
        {
          atividade: TipoAtividadeAbc.SUPORTE_ATENDIMENTO_SAC,
          direcionador: 'HORAS_HOMEM_SAC',
          quantidade: dto.horasSuporteSac,
          custoUnitarioBrl: custoHoraSuporte,
          totalAlocadoBrl: totalSuporte,
        },
        {
          atividade: TipoAtividadeAbc.PROCESSAMENTO_NUVEM_TRANSACIONAL,
          direcionador: 'TRANSACOES_GATEWAY',
          quantidade: dto.transacoesProcessadas,
          custoUnitarioBrl: custoPorTransacao,
          totalAlocadoBrl: totalTransacoes,
        },
        {
          atividade: TipoAtividadeAbc.INFRAESTRUTURA_PLATAFORMA,
          direcionador: 'HORAS_CPU_RAM_K8S',
          quantidade: dto.consumoCloudCpuHoras,
          custoUnitarioBrl: custoHoraCpu,
          totalAlocadoBrl: totalCloud,
        },
      ],
      dreImpactada: {
        receitaLiquidaBrl: dreAtual.receitaLiquidaBilheteriaBrl,
        novaMargemContribuicaoBrl,
        novoLucroLiquidoBrl,
        novaMargemLiquidaPercent,
      },
    };
  }
}
