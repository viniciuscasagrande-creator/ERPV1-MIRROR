import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  TipoInfracaoPld,
  StatusAlertaPld,
} from '@diskingressos/types';
import type {
  PldTransactionAlertDto,
  PepScreeningRecordDto,
  CoafCommunicationReportDto,
  PldDashboardKpisDto,
  TriagemPldRequestDto,
  TriagemPldResponseDto,
} from '@diskingressos/types';

@Injectable()
export class PldCoafComplianceService {
  private readonly logger = new Logger(PldCoafComplianceService.name);

  private inMemoryAlertas: PldTransactionAlertDto[] = [];
  private inMemoryPeps: PepScreeningRecordDto[] = [];
  private inMemoryCoafs: CoafCommunicationReportDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Prevenção à Lavagem de Dinheiro (PLD-FT) e SISCOAF (Fase 38)...');

    const a1: PldTransactionAlertDto = {
      id: 'alr-001',
      codigoAlerta: 'ALR-PLD-2026-0041',
      transacaoId: 'TX-PIX-98124',
      clienteCpfCnpj: '081.294.119-02',
      clienteNome: 'Ricardo Oliveira Santos',
      tipoInfracaoDetectada: TipoInfracaoPld.SMURFING_FRACIONAMENTO,
      scoreRiscoPld: 94.5,
      valorOperacaoBrl: 49500.0,
      statusAnalise: StatusAlertaPld.EM_ANALISE_COMPLIANCE,
      dataDeteccao: '2026-04-01T16:00:00Z',
    };

    const a2: PldTransactionAlertDto = {
      id: 'alr-002',
      codigoAlerta: 'ALR-PLD-2026-0042',
      transacaoId: 'TX-CART-99412',
      clienteCpfCnpj: '11.849.201/0001-90',
      clienteNome: 'Eventos Prime Curitiba Participações Ltda',
      tipoInfracaoDetectada: TipoInfracaoPld.ALTO_VALOR_ESPECIE,
      scoreRiscoPld: 98.2,
      valorOperacaoBrl: 120000.0,
      statusAnalise: StatusAlertaPld.COMUNICADO_SISCOAF,
      dataDeteccao: '2026-04-01T16:15:00Z',
    };

    this.inMemoryAlertas = [a1, a2];

    const p1: PepScreeningRecordDto = {
      id: 'pep-001',
      cpfConsultado: '081.294.119-02',
      nomeCompleto: 'Ricardo Oliveira Santos',
      isPepAtivo: true,
      cargoFuncaoPublica: 'Secretário Executivo Municipal',
      orgaoPublico: 'Prefeitura Municipal de Curitiba',
      dataConsulta: '2026-04-01T16:01:00Z',
    };

    this.inMemoryPeps = [p1];

    const c1: CoafCommunicationReportDto = {
      id: 'coaf-001',
      numeroProtocoloSiscoaf: 'SISCOAF-2026-PR-009182',
      alertaId: 'alr-002',
      justificativaLegal: 'Operação atípica em espécie acima do limite regulatório sem compatibilidade econômico-financeira (Art. 11 Lei 9.613/98)',
      enviadoAoCoafEm: '2026-04-01T16:30:00Z',
      statusComunicacao: 'HOMOLOGADO_SISCOAF',
    };

    this.inMemoryCoafs = [c1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<PldDashboardKpisDto> {
    await this.ensureSeedData();
    return {
      alertasPldAtivosMes: 7,
      scoreRiscoMedioBase: 24.2,
      consultasPepRealizadas: 842,
      comunicacoesSiscoafHomologadas: 3,
      volumeFinanceiroSobQuarentenaBrl: 169500.0,
    };
  }

  async listarAlertas(): Promise<PldTransactionAlertDto[]> {
    await this.ensureSeedData();
    return this.inMemoryAlertas;
  }

  async consultarPep(cpf: string): Promise<PepScreeningRecordDto | null> {
    await this.ensureSeedData();
    const cleanCpf = cpf.replace(/\D/g, '');
    const encontrado = this.inMemoryPeps.find((p) => p.cpfConsultado.replace(/\D/g, '') === cleanCpf);
    return encontrado || null;
  }

  async triagemTransacao(dto: TriagemPldRequestDto): Promise<TriagemPldResponseDto> {
    await this.ensureSeedData();
    let scoreRisco = 10;
    let tipoInfracao: TipoInfracaoPld | undefined;
    let gerouAlerta = false;

    if (dto.valorTransacaoBrl >= 50000) {
      scoreRisco += 75;
      tipoInfracao = TipoInfracaoPld.ALTO_VALOR_ESPECIE;
      gerouAlerta = true;
    } else if (dto.quantidadeIngressos >= 20) {
      scoreRisco += 60;
      tipoInfracao = TipoInfracaoPld.SMURFING_FRACIONAMENTO;
      gerouAlerta = true;
    }

    if (gerouAlerta && tipoInfracao) {
      const novoAlerta: PldTransactionAlertDto = {
        id: `alr-${Date.now()}`,
        codigoAlerta: `ALR-PLD-2026-${Date.now().toString().slice(-4)}`,
        transacaoId: `TX-TRIAGEM-${Date.now().toString().slice(-6)}`,
        clienteCpfCnpj: dto.cpfCnpj,
        clienteNome: dto.nome,
        tipoInfracaoDetectada: tipoInfracao,
        scoreRiscoPld: scoreRisco,
        valorOperacaoBrl: dto.valorTransacaoBrl,
        statusAnalise: StatusAlertaPld.EM_ANALISE_COMPLIANCE,
        dataDeteccao: new Date().toISOString(),
      };
      this.inMemoryAlertas.unshift(novoAlerta);
    }

    return {
      aprovadoSemAlerta: !gerouAlerta,
      scoreRiscoCalculado: scoreRisco,
      gerouAlerta,
      tipoInfracao,
      requerComunicacaoCoaf: scoreRisco >= 85,
    };
  }
}
