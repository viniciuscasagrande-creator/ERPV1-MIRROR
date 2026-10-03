import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { StatusGuiaEcad } from '@diskingressos/types';
import type {
  EcadTaxCalculationDto,
  EcadMusicalCueSheetDto,
  EcadSettlementVoucherDto,
  EcadDashboardKpisDto,
  CalcularEcadRequestDto,
} from '@diskingressos/types';

@Injectable()
export class EcadCopyrightService {
  private readonly logger = new Logger(EcadCopyrightService.name);

  private inMemoryCalculos: EcadTaxCalculationDto[] = [];
  private inMemoryCueSheets: EcadMusicalCueSheetDto[] = [];
  private inMemoryVouchers: EcadSettlementVoucherDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Apuração e Retenção ECAD / Direitos Autorais (Fase 37)...');

    const c1: EcadTaxCalculationDto = {
      id: 'ecad-001',
      codigoApuracao: 'ECAD-APUR-2026-0042',
      eventoId: 'evt-rock-arena',
      produtorId: 'prod-prime-tour',
      receitaBrutaBaseBrl: 4850000.0,
      aliquotaEcadPercent: 7.5, // 7.5% regulamentar para espetáculos ao vivo com cobrança
      valorEcadDevidoBrl: 363750.0,
      guiaEcadNumero: 'GUIA-ECAD-PR-99214',
      statusGuia: StatusGuiaEcad.RETIDO_FIDUCIARIO,
      contaPassivoEcad: '2.1.4.05 - Obrigações com Direitos Autorais ECAD',
      calculadoEm: '2026-04-01T15:00:00Z',
    };

    const c2: EcadTaxCalculationDto = {
      id: 'ecad-002',
      codigoApuracao: 'ECAD-APUR-2026-0043',
      eventoId: 'evt-symphonic',
      produtorId: 'prod-curitiba-shows',
      receitaBrutaBaseBrl: 3200000.0,
      aliquotaEcadPercent: 7.5,
      valorEcadDevidoBrl: 240000.0,
      guiaEcadNumero: 'GUIA-ECAD-PR-99215',
      statusGuia: StatusGuiaEcad.LIQUIDADO_CONFIRMADO,
      contaPassivoEcad: '2.1.4.05 - Obrigações com Direitos Autorais ECAD',
      calculadoEm: '2026-04-01T15:10:00Z',
    };

    this.inMemoryCalculos = [c1, c2];

    const cue1: EcadMusicalCueSheetDto = {
      id: 'cue-001',
      eventoId: 'evt-rock-arena',
      tituloObra: 'Tempo Perdido',
      autorCompositor: 'Renato Russo / Dado Villa-Lobos / Marcelo Bonfá',
      isrcCode: 'BR-RRO-86-00012',
      duracaoSegundos: 302,
    };

    const cue2: EcadMusicalCueSheetDto = {
      id: 'cue-002',
      eventoId: 'evt-rock-arena',
      tituloObra: 'Primeiros Erros (Chove)',
      autorCompositor: 'Kiko Zambianchi',
      isrcCode: 'BR-WAR-85-00431',
      duracaoSegundos: 245,
    };

    this.inMemoryCueSheets = [cue1, cue2];

    const v1: EcadSettlementVoucherDto = {
      id: 'vouch-001',
      codigoComprovante: 'VOUCH-ECAD-2026-0129',
      apuracaoId: 'ecad-002',
      valorLiquidadoBrl: 240000.0,
      autenticacaoBancaria: 'ITAU.AUT.9912.8471.2026.ECAD',
      dataLiquidacao: '2026-04-01T15:30:00Z',
    };

    this.inMemoryVouchers = [v1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<EcadDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      totalRetidoEcadMesBrl: 603750.0,
      guiasEcadLiquidadas: 18,
      guiasPendentesPagamento: 2,
      totalObrasCatalogadasCueSheet: 1420,
      passivoTotalAbertoEcadBrl: 363750.0,
    };
  }

  async listarApuracoes(): Promise<EcadTaxCalculationDto[]> {
    await this.ensureSeedData();
    return this.inMemoryCalculos;
  }

  async listarCueSheet(eventoId?: string): Promise<EcadMusicalCueSheetDto[]> {
    await this.ensureSeedData();
    if (eventoId) {
      return this.inMemoryCueSheets.filter((c) => c.eventoId === eventoId);
    }
    return this.inMemoryCueSheets;
  }

  async calcularEcad(dto: CalcularEcadRequestDto): Promise<EcadTaxCalculationDto> {
    await this.ensureSeedData();
    const aliquota = dto.tipoEspetaculoMusical === 'SHOW_AO_VIVO' ? 7.5 : 5.0;
    const valorEcadDevidoBrl = Number(((dto.receitaBrutaBaseBrl * aliquota) / 100).toFixed(2));
    const codigoApuracao = `ECAD-APUR-2026-${Date.now().toString().slice(-4)}`;
    const guiaEcadNumero = `GUIA-ECAD-${Date.now().toString().slice(-6)}`;

    const novoCalculo: EcadTaxCalculationDto = {
      id: `ecad-${Date.now()}`,
      codigoApuracao,
      eventoId: dto.eventoId,
      produtorId: dto.produtorId,
      receitaBrutaBaseBrl: dto.receitaBrutaBaseBrl,
      aliquotaEcadPercent: aliquota,
      valorEcadDevidoBrl,
      guiaEcadNumero,
      statusGuia: StatusGuiaEcad.RETIDO_FIDUCIARIO,
      contaPassivoEcad: '2.1.4.05 - Obrigações com Direitos Autorais ECAD',
      calculadoEm: new Date().toISOString(),
    };

    this.inMemoryCalculos.unshift(novoCalculo);
    return novoCalculo;
  }
}
