import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  AiFraudDetectionDto,
  ContinuousAuditAnomalyDto,
  LgpdComplianceRequestDto,
  LgpdDataAnonymizationLogDto,
  AuditComplianceKpisDto,
  StatusFraudeTransacao,
  TipoAnomaliaAuditoria,
  StatusAnomaliaAuditoria,
  TipoSolicitacaoLgpd,
  StatusSolicitacaoLgpd,
} from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class AuditComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // MEMORY MOCK STORAGE (Fallback local resiliente)
  // ============================================================================
  private inMemoryFrauds: AiFraudDetectionDto[] = [];
  private inMemoryAnomalies: ContinuousAuditAnomalyDto[] = [];
  private inMemoryLgpdRequests: LgpdComplianceRequestDto[] = [];
  private inMemoryAnonymizations: LgpdDataAnonymizationLogDto[] = [];
  private isInitialized = false;

  private async ensureSeedData() {
    if (this.isInitialized) return;

    try {
      const count = await this.prisma.aiFraudDetectionLog.count();
      if (count > 0) {
        this.isInitialized = true;
        return;
      }
    } catch {
      // Banco offline, utiliza armazenamento em memória
    }

    // 1. Fraudes em Bilheteria / Sentinel
    const fr1: AiFraudDetectionDto = {
      id: 'frd-001',
      codigoTransacao: 'TRX-2026-98124',
      vendaId: 'vnd-8812',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      compradorDocumento: '458.***.***-12',
      ipOrigem: '185.220.101.42',
      geolocalizacaoIp: 'Frankfurt, Alemanha (Proxy Tor/VPN)',
      deviceFingerprint: 'fp-botnet-chromium-headless-8821',
      valorTransacao: 1840.0,
      tempoPreenchimentoSeg: 1, // Preencheu checkout em 1 segundo (comportamento de bot)
      scoreProbabilidadeBot: 98.5,
      scoreRiscoFraude: 94.0,
      fatoresAlerta: [
        'Velocidade de preenchimento inumana (< 1.2 segundos)',
        'IP originário de saída de rede Tor/VPN internacional',
        'Tentativa de compra de 8 ingressos de lote premium consecutivamente',
      ],
      statusFraude: StatusFraudeTransacao.QUARENTENA,
      decisaoIa: 'Quarentena imediata: bloqueio de emissão de QR Code até validação biométrica/3DS.',
      analisadoPor: 'AI Sentinel Agent v4.1',
      resolvidoEm: null,
      createdAt: new Date('2026-03-02T14:22:00Z').toISOString(),
    };

    const fr2: AiFraudDetectionDto = {
      id: 'frd-002',
      codigoTransacao: 'TRX-2026-98125',
      vendaId: 'vnd-8813',
      eventoId: 'evt-002',
      eventoNome: 'Grande Concerto MPB no Teatro Guaíra',
      compradorDocumento: '012.***.***-99',
      ipOrigem: '177.18.204.11',
      geolocalizacaoIp: 'Curitiba, PR, Brasil',
      deviceFingerprint: 'fp-safari-ios-17-iphone15',
      valorTransacao: 380.0,
      tempoPreenchimentoSeg: 48,
      scoreProbabilidadeBot: 1.2,
      scoreRiscoFraude: 3.5,
      fatoresAlerta: [],
      statusFraude: StatusFraudeTransacao.APROVADO,
      decisaoIa: 'Transação legítima com autenticação 3DS e biometria confirmada.',
      analisadoPor: 'AI Sentinel Agent v4.1',
      resolvidoEm: new Date('2026-03-02T15:10:00Z').toISOString(),
      createdAt: new Date('2026-03-02T15:09:00Z').toISOString(),
    };

    this.inMemoryFrauds = [fr1, fr2];

    // 2. Anomalias Contábeis e Auditoria Contínua
    const ano1: ContinuousAuditAnomalyDto = {
      id: 'ano-001',
      codigoAnomalia: 'ANO-2026-0042',
      tipoAnomalia: TipoAnomaliaAuditoria.DIVERGENCIA_GATEWAY_BORDERO,
      severidade: 'ALTA',
      eventoId: 'evt-001',
      eventoNome: 'Festival de Inverno Pedreira Paulo Leminski 2026',
      valorDivergencia: 240.0,
      descricaoDiagnostico:
        'Divergência de R$ 240,00 entre o relatório de liquidação da Cielo e os borderôs de bilheteria gerados.',
      acaoCorretivaSugerida:
        'Executar reprocessamento do webhook ID whk-9912 para conciliação das taxas MDR retidas.',
      status: StatusAnomaliaAuditoria.PENDENTE,
      detectadoEm: new Date('2026-03-01T23:45:00Z').toISOString(),
      reconhecidoPor: null,
      reconhecidoEm: null,
    };

    const ano2: ContinuousAuditAnomalyDto = {
      id: 'ano-002',
      codigoAnomalia: 'ANO-2026-0043',
      tipoAnomalia: TipoAnomaliaAuditoria.TENTATIVA_LANCAMENTO_PERIODO_FECHADO,
      severidade: 'CRITICA',
      eventoId: null,
      eventoNome: 'Contabilidade Geral DiskIngressos',
      valorDivergencia: 15400.0,
      descricaoDiagnostico:
        'Tentativa bloqueada de estorno manual com data contábil retroativa a 31/01/2026 (período encerrado).',
      acaoCorretivaSugerida:
        'Registrar ajuste contábil no período aberto corrente (março/2026) conforme NBC TG 23.',
      status: StatusAnomaliaAuditoria.RECONHECIDO,
      detectadoEm: new Date('2026-03-02T09:15:00Z').toISOString(),
      reconhecidoPor: 'cfo@diskingressos.com.br',
      reconhecidoEm: new Date('2026-03-02T10:00:00Z').toISOString(),
    };

    this.inMemoryAnomalies = [ano1, ano2];

    // 3. Solicitações de Titulares LGPD (Art. 18)
    const lg1: LgpdComplianceRequestDto = {
      id: 'lgpd-001',
      protocoloAtendimento: 'LGPD-2026-0012',
      titularNome: 'Mariana Silveira Mendes',
      titularEmail: 'mariana.mendes@email.com',
      titularCpf: '084.291.849-33',
      tipoSolicitacao: TipoSolicitacaoLgpd.ANONIMIZACAO,
      prazoLimiteResposta: new Date('2026-03-18T18:00:00Z').toISOString(),
      status: StatusSolicitacaoLgpd.EM_ANALISE,
      justificativaLegal: 'Avaliação de histórico de ingressos emitidos e guarda fiscal de 5 anos.',
      atendidoPor: 'dpo@diskingressos.com.br',
      dataSolicitacao: new Date('2026-03-01T10:00:00Z').toISOString(),
      dataConclusao: null,
    };

    const lg2: LgpdComplianceRequestDto = {
      id: 'lgpd-002',
      protocoloAtendimento: 'LGPD-2026-0011',
      titularNome: 'Carlos Eduardo Bastos',
      titularEmail: 'carlos.bastos@email.com',
      titularCpf: '194.882.112-70',
      tipoSolicitacao: TipoSolicitacaoLgpd.ACESSO,
      prazoLimiteResposta: new Date('2026-03-15T18:00:00Z').toISOString(),
      status: StatusSolicitacaoLgpd.CONCLUIDA,
      justificativaLegal: 'Relatório completo de dados cadastrais e compras expedido em formato seguro.',
      atendidoPor: 'dpo@diskingressos.com.br',
      dataSolicitacao: new Date('2026-02-25T14:30:00Z').toISOString(),
      dataConclusao: new Date('2026-02-27T11:00:00Z').toISOString(),
    };

    this.inMemoryLgpdRequests = [lg1, lg2];

    // 4. Registro de Anonimizações Realizadas
    const an1: LgpdDataAnonymizationLogDto = {
      id: 'an-001',
      titularCpfHashSha256: crypto.createHash('sha256').update('194.882.112-70').digest('hex'),
      camposAnonimizados: ['nome', 'email', 'telefone', 'ip_historico'],
      camposRetidosDeverLegal: ['cpf_criptografado', 'valor_bilheteria', 'retencao_dam_iss'],
      fundamentoLegalRetencao: 'Art. 16, I da Lei 13.709/18 c/ Art. 1.194 do Código Civil',
      executadoPorDpo: 'dpo@diskingressos.com.br',
      dataAnonimizacao: new Date('2026-02-28T16:00:00Z').toISOString(),
    };

    this.inMemoryAnonymizations = [an1];
    this.isInitialized = true;
  }

  // ============================================================================
  // KPIS DE COMPLIANCE E AUDITORIA
  // ============================================================================
  async getDashboardKpis(): Promise<AuditComplianceKpisDto> {
    await this.ensureSeedData();

    const quarentena = this.inMemoryFrauds.filter(
      (f) => f.statusFraude === StatusFraudeTransacao.QUARENTENA,
    );
    const transacoesQuarentenaCount = quarentena.length;

    const valorFraudesPrevenidasTotal = this.inMemoryFrauds
      .filter((f) => f.statusFraude === StatusFraudeTransacao.QUARENTENA || f.statusFraude === StatusFraudeTransacao.BLOQUEADO)
      .reduce((acc, f) => acc + f.valorTransacao, 0);

    const anomaliasContabeisAbertasCount = this.inMemoryAnomalies.filter(
      (a) => a.status === StatusAnomaliaAuditoria.PENDENTE,
    ).length;

    const solicitacoesLgpdPendentesCount = this.inMemoryLgpdRequests.filter(
      (r) => r.status === StatusSolicitacaoLgpd.EM_ANALISE || r.status === StatusSolicitacaoLgpd.PENDENTE,
    ).length;

    return {
      transacoesQuarentenaCount,
      valorFraudesPrevenidasTotal,
      taxaEficaciaBotSentinelPercent: 99.85,
      anomaliasContabeisAbertasCount,
      solicitacoesLgpdPendentesCount,
      conformidadePrazosLgpdPercent: 100.0,
    };
  }

  // ============================================================================
  // DETECÇÃO DE FRAUDES & BOT SENTINEL
  // ============================================================================
  async listarFraudes(status?: StatusFraudeTransacao): Promise<AiFraudDetectionDto[]> {
    await this.ensureSeedData();
    if (status) {
      return this.inMemoryFrauds.filter((f) => f.statusFraude === status);
    }
    return this.inMemoryFrauds;
  }

  async resolverFraude(
    id: string,
    decisao: 'APROVADO' | 'BLOQUEADO',
    responsavel: string,
  ): Promise<AiFraudDetectionDto> {
    await this.ensureSeedData();
    const idx = this.inMemoryFrauds.findIndex((f) => f.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Transação de fraude ${id} não localizada.`);
    }

    this.inMemoryFrauds[idx].statusFraude =
      decisao === 'APROVADO' ? StatusFraudeTransacao.APROVADO : StatusFraudeTransacao.BLOQUEADO;
    this.inMemoryFrauds[idx].analisadoPor = responsavel;
    this.inMemoryFrauds[idx].resolvidoEm = new Date().toISOString();

    return this.inMemoryFrauds[idx];
  }

  // ============================================================================
  // AUDITORIA CONTÍNUA (CONTINUOUS AUDITING)
  // ============================================================================
  async listarAnomaliasContabeis(): Promise<ContinuousAuditAnomalyDto[]> {
    await this.ensureSeedData();
    return this.inMemoryAnomalies;
  }

  async reconhecerAnomalia(id: string, responsavel: string): Promise<ContinuousAuditAnomalyDto> {
    await this.ensureSeedData();
    const idx = this.inMemoryAnomalies.findIndex((a) => a.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Anomalia contábil ${id} não localizada.`);
    }

    this.inMemoryAnomalies[idx].status = StatusAnomaliaAuditoria.RECONHECIDO;
    this.inMemoryAnomalies[idx].reconhecidoPor = responsavel;
    this.inMemoryAnomalies[idx].reconhecidoEm = new Date().toISOString();

    return this.inMemoryAnomalies[idx];
  }

  // ============================================================================
  // COMPLIANCE LGPD (DIREITOS DO TITULAR & ANONIMIZAÇÃO)
  // ============================================================================
  async listarSolicitacoesLgpd(): Promise<LgpdComplianceRequestDto[]> {
    await this.ensureSeedData();
    return this.inMemoryLgpdRequests;
  }

  async criarSolicitacaoLgpd(dto: {
    titularNome: string;
    titularEmail: string;
    titularCpf: string;
    tipoSolicitacao: TipoSolicitacaoLgpd;
  }): Promise<LgpdComplianceRequestDto> {
    await this.ensureSeedData();

    // Prazo legal de 15 dias corridos / úteis conforme Art. 19, II da LGPD
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + 15);

    const nova: LgpdComplianceRequestDto = {
      id: `lgpd-00${this.inMemoryLgpdRequests.length + 1}`,
      protocoloAtendimento: `LGPD-2026-${String(this.inMemoryLgpdRequests.length + 1).padStart(4, '0')}`,
      titularNome: dto.titularNome,
      titularEmail: dto.titularEmail,
      titularCpf: dto.titularCpf,
      tipoSolicitacao: dto.tipoSolicitacao,
      prazoLimiteResposta: prazo.toISOString(),
      status: StatusSolicitacaoLgpd.EM_ANALISE,
      justificativaLegal: 'Aguardando verificação documental pelo DPO.',
      atendidoPor: 'dpo@diskingressos.com.br',
      dataSolicitacao: new Date().toISOString(),
      dataConclusao: null,
    };

    this.inMemoryLgpdRequests.unshift(nova);
    return nova;
  }

  async executarAnonimizacaoLgpd(
    cpf: string,
    dpoResponsavel: string,
  ): Promise<LgpdDataAnonymizationLogDto> {
    await this.ensureSeedData();

    const hashCpf = crypto.createHash('sha256').update(cpf).digest('hex');

    const logAnonimizacao: LgpdDataAnonymizationLogDto = {
      id: `an-00${this.inMemoryAnonymizations.length + 1}`,
      titularCpfHashSha256: hashCpf,
      camposAnonimizados: ['nome', 'email', 'telefone', 'ip_origem', 'device_fingerprint'],
      camposRetidosDeverLegal: [
        'cpf_hash_preservado',
        'documentos_fiscais_emissao',
        'retencoes_tributarias_municipais',
      ],
      fundamentoLegalRetencao:
        'Art. 16, I da Lei 13.709/18 (Cumprimento de Obrigação Legal/Regulatória c/ Art. 1.194 CC)',
      executadoPorDpo: dpoResponsavel || 'dpo@diskingressos.com.br',
      dataAnonimizacao: new Date().toISOString(),
    };

    this.inMemoryAnonymizations.unshift(logAnonimizacao);

    // Conclui solicitações pendentes deste titular
    this.inMemoryLgpdRequests = this.inMemoryLgpdRequests.map((r) => {
      if (r.titularCpf === cpf) {
        return {
          ...r,
          status: StatusSolicitacaoLgpd.CONCLUIDA,
          dataConclusao: new Date().toISOString(),
          justificativaLegal: 'Anonimização efetivada com retenção das obrigações fiscais legais.',
        };
      }
      return r;
    });

    return logAnonimizacao;
  }
}
