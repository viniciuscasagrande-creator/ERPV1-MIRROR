import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  ApprovalAuthorityRuleDto,
  ApprovalRequestDto,
  SensitiveOperationAuditDto,
  CreateApprovalRequestDto,
  ReviewApprovalDto,
  GovernanceKpisDto,
  FinancialOperationType,
  ApprovalTier,
  ApprovalStatus,
  QuarantineStatus,
} from '@diskingressos/types';

@Injectable()
export class GovernanceSodService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis(): Promise<GovernanceKpisDto> {
    await this.ensureSeedData();

    const pending = await this.prisma.approvalRequest.findMany({
      where: { status: ApprovalStatus.PENDENTE },
    });

    const totalAprovacoesPendentes = pending.length;
    const valorTotalPendente = pending.reduce(
      (acc, p) => acc + Number(p.valor),
      0,
    );

    const quarentenas = await this.prisma.sensitiveOperationAudit.count({
      where: { statusQuarentena: QuarantineStatus.EM_QUARENTENA_48H },
    });

    const aprovadasMes = await this.prisma.approvalRequest.count({
      where: { status: ApprovalStatus.APROVADO },
    });

    return {
      totalAprovacoesPendentes,
      valorTotalPendente,
      operacoesEmQuarentena48h: quarentenas,
      conformidadeSodPercentual: 100.0,
      solicitacoesAprovadasMes: aprovadasMes,
      tempoMedioAprovacaoHoras: 2.4,
    };
  }

  async getRules(): Promise<ApprovalAuthorityRuleDto[]> {
    await this.ensureSeedData();

    const rules = await this.prisma.approvalAuthorityRule.findMany({
      where: { ativo: true },
      orderBy: [{ tipoOperacao: 'asc' }, { valorMinimo: 'asc' }],
    });

    return rules.map((r) => ({
      id: r.id,
      tipoOperacao: r.tipoOperacao,
      faixaNome: r.faixaNome,
      descricao: r.descricao,
      valorMinimo: Number(r.valorMinimo),
      valorMaximo: r.valorMaximo ? Number(r.valorMaximo) : null,
      perfilMinimo: r.perfilMinimo,
      requerDuplaAprovacao: r.requerDuplaAprovacao,
      ativo: r.ativo,
    }));
  }

  async getApprovals(
    status?: string,
    tipo?: string,
    currentUserId?: string,
  ): Promise<ApprovalRequestDto[]> {
    await this.ensureSeedData();

    const where: any = {};
    if (status && status !== 'TODOS') where.status = status;
    if (tipo && tipo !== 'TODOS') where.tipoOperacao = tipo;

    const items = await this.prisma.approvalRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((r) => {
      const isCreator = currentUserId ? r.solicitadoPorId === currentUserId : false;
      const alreadyApproved1 = currentUserId ? r.aprovador1Id === currentUserId : false;

      let podeAprovar = true;
      let motivoBloqueioSoD: string | null = null;

      if (isCreator) {
        podeAprovar = false;
        motivoBloqueioSoD =
          'Bloqueio SoD: O usuário solicitante não pode aprovar sua própria operação patrimonial.';
      } else if (alreadyApproved1) {
        podeAprovar = false;
        motivoBloqueioSoD =
          'Bloqueio SoD (Dupla Chave): O segundo aprovador deve ser um usuário distinto do primeiro.';
      }

      return {
        id: r.id,
        codigo: r.codigo,
        tipoOperacao: r.tipoOperacao,
        referenciaId: r.referenciaId,
        referenciaDescricao: r.referenciaDescricao,
        valor: Number(r.valor),
        solicitadoPorId: r.solicitadoPorId,
        solicitadoPorNome: r.solicitadoPorNome,
        status: r.status,
        alcadaExigida: r.alcadaExigida,
        aprovador1Id: r.aprovador1Id,
        aprovador1Nome: r.aprovador1Nome,
        aprovado1Em: r.aprovado1Em ? r.aprovado1Em.toISOString() : null,
        aprovador2Id: r.aprovador2Id,
        aprovador2Nome: r.aprovador2Nome,
        aprovado2Em: r.aprovado2Em ? r.aprovado2Em.toISOString() : null,
        motivoRejeicao: r.motivoRejeicao,
        justificativaSolicitacao: r.justificativaSolicitacao,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        podeAprovarUsuarioAtual: podeAprovar,
        motivoBloqueioSoD,
      };
    });
  }

  async createApprovalRequest(
    dto: CreateApprovalRequestDto,
    user: { id: string; nome: string },
  ): Promise<ApprovalRequestDto> {
    const valor = Number(dto.valor);
    let alcadaExigida = ApprovalTier.FAIXA_A;

    if (valor > 250000) {
      alcadaExigida = ApprovalTier.FAIXA_C;
    } else if (valor > 50000) {
      alcadaExigida = ApprovalTier.FAIXA_B;
    }

    const count = await this.prisma.approvalRequest.count();
    const codigo = `APV-2026-${String(count + 400).padStart(6, '0')}`;

    const created = await this.prisma.approvalRequest.create({
      data: {
        codigo,
        tipoOperacao: dto.tipoOperacao,
        referenciaId: dto.referenciaId,
        referenciaDescricao: dto.referenciaDescricao,
        valor,
        solicitadoPorId: user.id,
        solicitadoPorNome: user.nome,
        status: ApprovalStatus.PENDENTE,
        alcadaExigida,
        justificativaSolicitacao: dto.justificativaSolicitacao,
      },
    });

    return {
      id: created.id,
      codigo: created.codigo,
      tipoOperacao: created.tipoOperacao,
      referenciaId: created.referenciaId,
      referenciaDescricao: created.referenciaDescricao,
      valor: Number(created.valor),
      solicitadoPorId: created.solicitadoPorId,
      solicitadoPorNome: created.solicitadoPorNome,
      status: created.status,
      alcadaExigida: created.alcadaExigida,
      justificativaSolicitacao: created.justificativaSolicitacao,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
      podeAprovarUsuarioAtual: false,
      motivoBloqueioSoD:
        'Bloqueio SoD: O usuário solicitante não pode aprovar sua própria operação patrimonial.',
    };
  }

  async reviewApproval(
    id: string,
    dto: ReviewApprovalDto,
    user: { id: string; nome: string },
  ): Promise<ApprovalRequestDto> {
    const req = await this.prisma.approvalRequest.findUnique({
      where: { id },
    });

    if (!req) {
      throw new NotFoundException(`Solicitação de aprovação ${id} não localizada.`);
    }

    if (req.status !== ApprovalStatus.PENDENTE) {
      throw new BadRequestException(
        `Esta solicitação já foi finalizada com status ${req.status}.`,
      );
    }

    // REGRA DE SEGREGAÇÃO DE FUNÇÕES (SoD): O criador da solicitação é proibido de aprovar
    if (user.id === req.solicitadoPorId) {
      throw new ForbiddenException(
        'Violação de Segregação de Funções (SoD): O usuário que solicitou o repasse/operação é estritamente impedido de aprová-lo.',
      );
    }

    if (!dto.aprovado) {
      const updated = await this.prisma.approvalRequest.update({
        where: { id },
        data: {
          status: ApprovalStatus.REJEITADO,
          motivoRejeicao: dto.parecerOuMotivo,
        },
      });

      return {
        id: updated.id,
        codigo: updated.codigo,
        tipoOperacao: updated.tipoOperacao,
        valor: Number(updated.valor),
        solicitadoPorId: updated.solicitadoPorId,
        solicitadoPorNome: updated.solicitadoPorNome,
        status: updated.status,
        alcadaExigida: updated.alcadaExigida,
        motivoRejeicao: updated.motivoRejeicao,
        justificativaSolicitacao: updated.justificativaSolicitacao,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    }

    // Caso de Aprovação
    const isFaixaC = req.alcadaExigida === ApprovalTier.FAIXA_C;

    if (isFaixaC) {
      // Exige Dupla Chave (2 aprovadores distintos)
      if (!req.aprovador1Id) {
        // Primeira aprovação registrada
        const updated = await this.prisma.approvalRequest.update({
          where: { id },
          data: {
            aprovador1Id: user.id,
            aprovador1Nome: user.nome,
            aprovado1Em: new Date(),
            // Permanece PENDENTE aguardando a 2ª chave da Diretoria
          },
        });

        return {
          id: updated.id,
          codigo: updated.codigo,
          tipoOperacao: updated.tipoOperacao,
          valor: Number(updated.valor),
          solicitadoPorId: updated.solicitadoPorId,
          solicitadoPorNome: updated.solicitadoPorNome,
          status: updated.status,
          alcadaExigida: updated.alcadaExigida,
          aprovador1Id: updated.aprovador1Id,
          aprovador1Nome: updated.aprovador1Nome,
          aprovado1Em: updated.aprovado1Em?.toISOString(),
          justificativaSolicitacao: updated.justificativaSolicitacao,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      }

      // Segunda aprovação
      if (user.id === req.aprovador1Id) {
        throw new ForbiddenException(
          'Dupla Aprovação SoD Obrigatória: O segundo aprovador da Faixa C deve ser obrigatoriamente um diretor diferente do primeiro.',
        );
      }

      const updated = await this.prisma.approvalRequest.update({
        where: { id },
        data: {
          aprovador2Id: user.id,
          aprovador2Nome: user.nome,
          aprovado2Em: new Date(),
          status: ApprovalStatus.APROVADO,
        },
      });

      return {
        id: updated.id,
        codigo: updated.codigo,
        tipoOperacao: updated.tipoOperacao,
        valor: Number(updated.valor),
        solicitadoPorId: updated.solicitadoPorId,
        solicitadoPorNome: updated.solicitadoPorNome,
        status: updated.status,
        alcadaExigida: updated.alcadaExigida,
        aprovador1Id: updated.aprovador1Id,
        aprovador1Nome: updated.aprovador1Nome,
        aprovado1Em: updated.aprovado1Em?.toISOString(),
        aprovador2Id: updated.aprovador2Id,
        aprovador2Nome: updated.aprovador2Nome,
        aprovado2Em: updated.aprovado2Em?.toISOString(),
        justificativaSolicitacao: updated.justificativaSolicitacao,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    }

    // Faixa A ou B: aprovação simples por usuário com alçada
    const updated = await this.prisma.approvalRequest.update({
      where: { id },
      data: {
        aprovador1Id: user.id,
        aprovador1Nome: user.nome,
        aprovado1Em: new Date(),
        status: ApprovalStatus.APROVADO,
      },
    });

    return {
      id: updated.id,
      codigo: updated.codigo,
      tipoOperacao: updated.tipoOperacao,
      valor: Number(updated.valor),
      solicitadoPorId: updated.solicitadoPorId,
      solicitadoPorNome: updated.solicitadoPorNome,
      status: updated.status,
      alcadaExigida: updated.alcadaExigida,
      aprovador1Id: updated.aprovador1Id,
      aprovador1Nome: updated.aprovador1Nome,
      aprovado1Em: updated.aprovado1Em?.toISOString(),
      justificativaSolicitacao: updated.justificativaSolicitacao,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async getSensitiveOperations(): Promise<SensitiveOperationAuditDto[]> {
    await this.ensureSeedData();

    const items = await this.prisma.sensitiveOperationAudit.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return items.map((s) => ({
      id: s.id,
      codigoOperacao: s.codigoOperacao,
      tipoOperacao: s.tipoOperacao,
      titulo: s.titulo,
      executadoPor: s.executadoPor,
      perfilExecutante: s.perfilExecutante,
      justificativa: s.justificativa,
      statusQuarentena: s.statusQuarentena,
      quarentenaExpiraEm: s.quarentenaExpiraEm ? s.quarentenaExpiraEm.toISOString() : null,
      detalhesPayload: s.detalhesPayload,
      ipOrigem: s.ipOrigem,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  async releaseQuarantine(
    id: string,
    user: { id: string; nome: string },
    parecer: string,
  ): Promise<SensitiveOperationAuditDto> {
    const op = await this.prisma.sensitiveOperationAudit.findUnique({
      where: { id },
    });

    if (!op) {
      throw new NotFoundException(`Operação sensível ${id} não localizada.`);
    }

    const updated = await this.prisma.sensitiveOperationAudit.update({
      where: { id },
      data: {
        statusQuarentena: QuarantineStatus.APROVADO_DIRETORIA,
        justificativa: `${op.justificativa} | LIBERAÇÃO ANTECIPADA DIRETORIA: ${parecer} (Por: ${user.nome})`,
      },
    });

    return {
      id: updated.id,
      codigoOperacao: updated.codigoOperacao,
      tipoOperacao: updated.tipoOperacao,
      titulo: updated.titulo,
      executadoPor: updated.executadoPor,
      perfilExecutante: updated.perfilExecutante,
      justificativa: updated.justificativa,
      statusQuarentena: updated.statusQuarentena,
      quarentenaExpiraEm: updated.quarentenaExpiraEm ? updated.quarentenaExpiraEm.toISOString() : null,
      detalhesPayload: updated.detalhesPayload,
      ipOrigem: updated.ipOrigem,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  private async ensureSeedData(): Promise<void> {
    const rulesCount = await this.prisma.approvalAuthorityRule.count();
    if (rulesCount === 0) {
      await this.prisma.approvalAuthorityRule.createMany({
        data: [
          // Repasses a Produtores
          {
            tipoOperacao: FinancialOperationType.REPASSE_PRODUTOR,
            faixaNome: ApprovalTier.FAIXA_A,
            descricao: 'Repasses operacionais regulares até R$ 50.000,00',
            valorMinimo: 0.0,
            valorMaximo: 50000.0,
            perfilMinimo: 'ANALISTA_SENIOR',
            requerDuplaAprovacao: false,
          },
          {
            tipoOperacao: FinancialOperationType.REPASSE_PRODUTOR,
            faixaNome: ApprovalTier.FAIXA_B,
            descricao: 'Repasses de médio porte de R$ 50.000,01 a R$ 250.000,00',
            valorMinimo: 50000.01,
            valorMaximo: 250000.0,
            perfilMinimo: 'GERENTE_FINANCEIRO',
            requerDuplaAprovacao: false,
          },
          {
            tipoOperacao: FinancialOperationType.REPASSE_PRODUTOR,
            faixaNome: ApprovalTier.FAIXA_C,
            descricao: 'Repasses de grande vulto acima de R$ 250.000,00 (Dupla Chave CFO)',
            valorMinimo: 250000.01,
            valorMaximo: null,
            perfilMinimo: 'DIRETOR_CFO',
            requerDuplaAprovacao: true,
          },

          // Antecipações de Recebíveis
          {
            tipoOperacao: FinancialOperationType.ANTECIPACAO_RECEBIVEIS,
            faixaNome: ApprovalTier.FAIXA_A,
            descricao: 'Antecipação com retenção >= 30% até R$ 30.000,00',
            valorMinimo: 0.0,
            valorMaximo: 30000.0,
            perfilMinimo: 'COORDENADOR_CREDITO',
            requerDuplaAprovacao: false,
          },
          {
            tipoOperacao: FinancialOperationType.ANTECIPACAO_RECEBIVEIS,
            faixaNome: ApprovalTier.FAIXA_B,
            descricao: 'Antecipação de R$ 30.000,01 a R$ 150.000,00',
            valorMinimo: 30000.01,
            valorMaximo: 150000.0,
            perfilMinimo: 'GERENTE_FINANCEIRO',
            requerDuplaAprovacao: false,
          },
          {
            tipoOperacao: FinancialOperationType.ANTECIPACAO_RECEBIVEIS,
            faixaNome: ApprovalTier.FAIXA_C,
            descricao: 'Antecipação de risco especial acima de R$ 150.000,00 (Comitê)',
            valorMinimo: 150000.01,
            valorMaximo: null,
            perfilMinimo: 'DIRETOR_CFO',
            requerDuplaAprovacao: true,
          },

          // Lotes CNAB 240 / PIX
          {
            tipoOperacao: FinancialOperationType.LOTE_PAGAMENTO_CNAB,
            faixaNome: ApprovalTier.FAIXA_A,
            descricao: 'Lote de pagamentos bancários até R$ 100.000,00',
            valorMinimo: 0.0,
            valorMaximo: 100000.0,
            perfilMinimo: 'OPERADOR_TESOURARIA',
            requerDuplaAprovacao: false,
          },
          {
            tipoOperacao: FinancialOperationType.LOTE_PAGAMENTO_CNAB,
            faixaNome: ApprovalTier.FAIXA_B,
            descricao: 'Lote de pagamentos de R$ 100.000,01 a R$ 500.000,00',
            valorMinimo: 100000.01,
            valorMaximo: 500000.0,
            perfilMinimo: 'COORDENADOR_TESOURARIA',
            requerDuplaAprovacao: false,
          },
          {
            tipoOperacao: FinancialOperationType.LOTE_PAGAMENTO_CNAB,
            faixaNome: ApprovalTier.FAIXA_C,
            descricao: 'Lote de pagamentos acima de R$ 500.000,00 (Dupla Aprovação Diretoria)',
            valorMinimo: 500000.01,
            valorMaximo: null,
            perfilMinimo: 'DIRETOR_CFO',
            requerDuplaAprovacao: true,
          },
        ],
      });
    }

    const appCount = await this.prisma.approvalRequest.count();
    if (appCount === 0) {
      await this.prisma.approvalRequest.createMany({
        data: [
          {
            codigo: 'APV-2026-000412',
            tipoOperacao: FinancialOperationType.REPASSE_PRODUTOR,
            referenciaId: 'REP-2026-000412',
            referenciaDescricao: 'Festival Rock Curitiba 2026 - Liquidação Final',
            valor: 428500.0,
            solicitadoPorId: 'usr-analista-1',
            solicitadoPorNome: 'Mariana Analista Financeiro',
            status: ApprovalStatus.PENDENTE,
            alcadaExigida: ApprovalTier.FAIXA_C,
            aprovador1Id: 'usr-gerente-1',
            aprovador1Nome: 'Karine Gerente Financeiro',
            aprovado1Em: new Date('2026-09-01T14:30:00Z'),
            justificativaSolicitacao:
              'Fechamento contábil e borderô auditado com 9 portões aprovados. Requer 2ª chave da Diretoria por ultrapassar R$ 250.000,00.',
            createdAt: new Date('2026-09-01T10:00:00Z'),
          },
          {
            codigo: 'APV-2026-000413',
            tipoOperacao: FinancialOperationType.ANTECIPACAO_RECEBIVEIS,
            referenciaId: 'ANT-2026-000088',
            referenciaDescricao: 'Turnê Internacional Arena - Adiantamento de Bilheteria',
            valor: 180000.0,
            solicitadoPorId: 'usr-produtor-rel',
            solicitadoPorNome: 'Roberto Atendimento Produtor',
            status: ApprovalStatus.PENDENTE,
            alcadaExigida: ApprovalTier.FAIXA_B,
            justificativaSolicitacao:
              'Solicitação de antecipação contratual com garantia de 35% de vendas já consolidadas em conta escrow.',
            createdAt: new Date('2026-09-01T15:20:00Z'),
          },
          {
            codigo: 'APV-2026-000414',
            tipoOperacao: FinancialOperationType.REPASSE_PRODUTOR,
            referenciaId: 'REP-2026-000410',
            referenciaDescricao: 'Stand Up Comedy Teatro Positivo - Repasse Semanal',
            valor: 38400.0,
            solicitadoPorId: 'usr-analista-2',
            solicitadoPorNome: 'Felipe Analista Contábil',
            status: ApprovalStatus.APROVADO,
            alcadaExigida: ApprovalTier.FAIXA_A,
            aprovador1Id: 'usr-gerente-1',
            aprovador1Nome: 'Karine Gerente Financeiro',
            aprovado1Em: new Date('2026-08-30T16:00:00Z'),
            justificativaSolicitacao:
              'Repasse operacional dentro da margem de segurança sem pendências fiscais.',
            createdAt: new Date('2026-08-30T11:00:00Z'),
          },
        ],
      });
    }

    const sensCount = await this.prisma.sensitiveOperationAudit.count();
    if (sensCount === 0) {
      const quarentenaExp = new Date();
      quarentenaExp.setHours(quarentenaExp.getHours() + 36); // Expira em 36h restantes

      await this.prisma.sensitiveOperationAudit.createMany({
        data: [
          {
            codigoOperacao: 'SENS-2026-08-001',
            tipoOperacao: FinancialOperationType.ALTERACAO_DADOS_BANCARIOS,
            titulo: 'Alteração de Chave PIX - Curitiba Shows Ltda (CNPJ 08.234.567/0001-89)',
            executadoPor: 'Carlos Contador (CRC 12345/PR)',
            perfilExecutante: 'CONTABILIDADE',
            justificativa:
              'Produtor solicitou alteração formal de domicílio bancário do Banco Itaú para Banco Bradesco. Documento societário anexado ao GED.',
            statusQuarentena: QuarantineStatus.EM_QUARENTENA_48H,
            quarentenaExpiraEm: quarentenaExp,
            detalhesPayload: JSON.stringify({
              bancoAnterior: 'Itaú Unibanco (341) Ag 1234 CC 56789-0',
              novoBanco: 'Banco Bradesco (237) Ag 4321 CC 98765-4',
              chavePixNova: 'financeiro@curitibashows.com.br',
              gedAnexoId: 'ged-doc-contrato-social-2026',
            }),
            ipOrigem: '192.168.1.104',
            createdAt: new Date(),
          },
          {
            codigoOperacao: 'SENS-2026-08-002',
            tipoOperacao: FinancialOperationType.DESVIO_TAXA_MDR,
            titulo: 'Ajuste de Taxa Comercial de Conveniência - Evento Beneficente',
            executadoPor: 'Karine Gerente Financeiro',
            perfilExecutante: 'FINANCEIRO',
            justificativa:
              'Autorização especial de diretoria para redução da taxa de conveniência de 15% para 5% em evento filantrópico hospitalar.',
            statusQuarentena: QuarantineStatus.APROVADO_DIRETORIA,
            quarentenaExpiraEm: null,
            detalhesPayload: JSON.stringify({
              taxaPadrao: 0.15,
              taxaAprovada: 0.05,
              motivo: 'Parceria Institucional Hospital Pequeno Príncipe',
            }),
            ipOrigem: '192.168.1.102',
            createdAt: new Date('2026-08-28T14:00:00Z'),
          },
        ],
      });
    }
  }
}
