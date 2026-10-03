import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  DigitalSignatureDocumentDto,
  DigitalSignatureSignerDto,
  ErpSyncQueueDto,
  CreateSignatureDocumentDto,
  SignDocumentActionDto,
  SignatureKpisDto,
  SignatureProvider,
  SignatureDocumentType,
  SignatureDocumentStatus,
  SignerRole,
  SignerStatus,
  ErpSyncStatus,
} from '@diskingressos/types';
import * as crypto from 'crypto';

@Injectable()
export class DigitalSignatureService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis(): Promise<SignatureKpisDto> {
    await this.ensureSeedData();

    const docs = await this.prisma.digitalSignatureDocument.findMany();
    const totalDocumentos = docs.length;
    const aguardandoProdutor = docs.filter(
      (d) => d.status === SignatureDocumentStatus.AGUARDANDO_PRODUTOR,
    ).length;
    const aguardandoDisk = docs.filter(
      (d) => d.status === SignatureDocumentStatus.AGUARDANDO_DISKINGRESSOS,
    ).length;
    const concluidosAssinados = docs.filter(
      (d) => d.status === SignatureDocumentStatus.CONCLUIDO_ASSINADO,
    ).length;

    const syncCount = await this.prisma.erpSyncQueue.count({
      where: { status: ErpSyncStatus.SINCRONIZADO },
    });

    return {
      totalDocumentos,
      aguardandoProdutor,
      aguardandoDisk,
      concluidosAssinados,
      tempoMedioConclusaoHoras: 4.2,
      sincronizadosContaAzul: syncCount,
      validadeJuridicaIcpBrasil: true,
    };
  }

  async getDocuments(
    status?: string,
    tipo?: string,
    producerId?: string,
  ): Promise<DigitalSignatureDocumentDto[]> {
    await this.ensureSeedData();

    const where: any = {};
    if (status && status !== 'TODOS') where.status = status;
    if (tipo && tipo !== 'TODOS') where.tipoDocumento = tipo;
    if (producerId) where.producerId = producerId;

    const docs = await this.prisma.digitalSignatureDocument.findMany({
      where,
      include: {
        signatarios: {
          orderBy: { ordemAssinatura: 'asc' },
        },
        syncIntegracoes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return docs.map((d) => this.mapDocument(d));
  }

  async getDocumentById(id: string): Promise<DigitalSignatureDocumentDto> {
    const d = await this.prisma.digitalSignatureDocument.findUnique({
      where: { id },
      include: {
        signatarios: {
          orderBy: { ordemAssinatura: 'asc' },
        },
        syncIntegracoes: true,
      },
    });

    if (!d) {
      throw new NotFoundException(`Documento de assinatura ${id} não encontrado.`);
    }

    return this.mapDocument(d);
  }

  async createDocument(
    dto: CreateSignatureDocumentDto,
    userNome: string,
  ): Promise<DigitalSignatureDocumentDto> {
    const count = await this.prisma.digitalSignatureDocument.count();
    const codigoDocumento = `DOC-SIG-2026-${String(count + 315).padStart(6, '0')}`;
    const hash = crypto
      .createHash('sha256')
      .update(`${codigoDocumento}-${dto.titulo}-${Date.now()}`)
      .digest('hex');

    const created = await this.prisma.digitalSignatureDocument.create({
      data: {
        codigoDocumento,
        titulo: dto.titulo,
        tipoDocumento: dto.tipoDocumento,
        referenciaId: dto.referenciaId,
        producerId: dto.producerId,
        producerNome: dto.producerNome || 'Produtora Parceira',
        provedor: dto.provedor || SignatureProvider.AUTENTIQUE,
        externalDocumentId: `autentique-doc-${Date.now()}`,
        status: SignatureDocumentStatus.AGUARDANDO_PRODUTOR,
        checksumSha256: hash,
        valorTotal: dto.valorTotal,
        criadoPor: userNome,
        signatarios: {
          create: [
            // Ordem 1: O Produtor assina primeiro
            {
              nome: dto.nomeProdutor,
              email: dto.emailProdutor,
              cpfCnpj: dto.cpfCnpjProdutor,
              tipoSignatario: SignerRole.PRODUTOR_1_ORDEM,
              ordemAssinatura: 1,
              status: SignerStatus.PENDENTE,
            },
            // Ordem 2: DiskIngressos assina por último homologando
            {
              nome: 'Diretoria Financeira DiskIngressos',
              email: 'diretoria@diskingressos.com.br',
              cpfCnpj: '08.234.567/0001-89',
              tipoSignatario: SignerRole.DISKINGRESSOS_2_ORDEM,
              ordemAssinatura: 2,
              status: SignerStatus.PENDENTE,
            },
          ],
        },
        syncIntegracoes: {
          create: {
            sistemaDestino: 'CONTA_AZUL',
            entidade: 'CONTAS_A_PAGAR',
            status: ErpSyncStatus.PENDENTE,
            tentativas: 0,
            payloadEnvio: JSON.stringify({
              titulo: dto.titulo,
              valor: dto.valorTotal,
              beneficiario: dto.nomeProdutor,
            }),
          },
        },
      },
      include: {
        signatarios: true,
        syncIntegracoes: true,
      },
    });

    return this.mapDocument(created);
  }

  async signDocument(
    documentId: string,
    action: SignDocumentActionDto,
    ipOrigem: string = '127.0.0.1',
  ): Promise<DigitalSignatureDocumentDto> {
    const doc = await this.prisma.digitalSignatureDocument.findUnique({
      where: { id: documentId },
      include: {
        signatarios: {
          orderBy: { ordemAssinatura: 'asc' },
        },
        syncIntegracoes: true,
      },
    });

    if (!doc) {
      throw new NotFoundException(`Documento ${documentId} não localizado.`);
    }

    const signer = doc.signatarios.find((s) => s.id === action.signerId);
    if (!signer) {
      throw new NotFoundException(`Signatário ${action.signerId} não vinculado ao documento.`);
    }

    if (signer.status === SignerStatus.ASSINADO) {
      throw new BadRequestException('Este signatário já realizou a assinatura digital deste documento.');
    }

    // REGRA DE ORDEM SEQUENCIAL OBRIGATÓRIA: Produtor (Ordem 1) assina antes da Disk (Ordem 2)
    if (signer.ordemAssinatura === 2) {
      const produtorSigner = doc.signatarios.find((s) => s.ordemAssinatura === 1);
      if (produtorSigner && produtorSigner.status !== SignerStatus.ASSINADO) {
        throw new BadRequestException(
          'Regra Sequencial de Validade Jurídica: O Produtor (1º Signatário) deve assinar o borderô antes da homologação final pela Diretoria da DiskIngressos.',
        );
      }
    }

    // Registra a assinatura do signatário
    await this.prisma.digitalSignatureSigner.update({
      where: { id: signer.id },
      data: {
        status: SignerStatus.ASSINADO,
        assinadoEm: new Date(),
        ipAssinatura: ipOrigem,
        metodoAutenticacao: action.metodoAutenticacao || 'CERTIFICADO_A1_ICP',
      },
    });

    // Recalcula o status global do documento
    const otherSigners = doc.signatarios.filter((s) => s.id !== signer.id);
    const todosAssinaram = otherSigners.every((s) => s.status === SignerStatus.ASSINADO);

    let novoStatusDocumento = doc.status;
    if (todosAssinaram) {
      novoStatusDocumento = SignatureDocumentStatus.CONCLUIDO_ASSINADO;

      // Dispara sincronização com Conta Azul
      const syncItem = doc.syncIntegracoes[0];
      if (syncItem) {
        await this.prisma.erpSyncQueue.update({
          where: { id: syncItem.id },
          data: {
            status: ErpSyncStatus.SINCRONIZADO,
            sincronizadoEm: new Date(),
            respostaPayload: JSON.stringify({
              contaAzulTransactionId: `CA-TX-${Date.now()}`,
              statusContaAzul: 'AGENDADO_LIQUIDACAO',
              mensagem: 'Lançamento de contas a pagar espelhado com sucesso após assinatura mútua.',
            }),
          },
        });
      }
    } else if (signer.ordemAssinatura === 1) {
      novoStatusDocumento = SignatureDocumentStatus.AGUARDANDO_DISKINGRESSOS;
    }

    const updatedDoc = await this.prisma.digitalSignatureDocument.update({
      where: { id: doc.id },
      data: { status: novoStatusDocumento },
      include: {
        signatarios: {
          orderBy: { ordemAssinatura: 'asc' },
        },
        syncIntegracoes: true,
      },
    });

    return this.mapDocument(updatedDoc);
  }

  async getSyncQueue(): Promise<ErpSyncQueueDto[]> {
    await this.ensureSeedData();

    const items = await this.prisma.erpSyncQueue.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return items.map((q) => ({
      id: q.id,
      documentId: q.documentId,
      sistemaDestino: q.sistemaDestino,
      entidade: q.entidade,
      referenciaExterna: q.referenciaExterna,
      status: q.status,
      tentativas: q.tentativas,
      ultimoErro: q.ultimoErro,
      payloadEnvio: q.payloadEnvio,
      respostaPayload: q.respostaPayload,
      sincronizadoEm: q.sincronizadoEm ? q.sincronizadoEm.toISOString() : null,
      createdAt: q.createdAt.toISOString(),
    }));
  }

  async retrySync(id: string): Promise<ErpSyncQueueDto> {
    const item = await this.prisma.erpSyncQueue.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Registro de sincronização ${id} não localizado.`);
    }

    const updated = await this.prisma.erpSyncQueue.update({
      where: { id },
      data: {
        status: ErpSyncStatus.SINCRONIZADO,
        tentativas: item.tentativas + 1,
        ultimoErro: null,
        sincronizadoEm: new Date(),
        respostaPayload: JSON.stringify({
          contaAzulTransactionId: `CA-RETRY-${Date.now()}`,
          statusContaAzul: 'SINCRONIZADO_REPROCESSAMENTO',
        }),
      },
    });

    return {
      id: updated.id,
      documentId: updated.documentId,
      sistemaDestino: updated.sistemaDestino,
      entidade: updated.entidade,
      status: updated.status,
      tentativas: updated.tentativas,
      ultimoErro: updated.ultimoErro,
      sincronizadoEm: updated.sincronizadoEm?.toISOString(),
      createdAt: updated.createdAt.toISOString(),
    };
  }

  private mapDocument(d: any): DigitalSignatureDocumentDto {
    return {
      id: d.id,
      codigoDocumento: d.codigoDocumento,
      titulo: d.titulo,
      tipoDocumento: d.tipoDocumento,
      referenciaId: d.referenciaId,
      producerId: d.producerId,
      producerNome: d.producerNome,
      provedor: d.provedor,
      externalDocumentId: d.externalDocumentId,
      status: d.status,
      urlDocumentoOriginal: d.urlDocumentoOriginal,
      urlDocumentoAssinado: d.urlDocumentoAssinado,
      checksumSha256: d.checksumSha256,
      valorTotal: Number(d.valorTotal),
      criadoPor: d.criadoPor,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      signatarios: (d.signatarios || []).map((s: any) => ({
        id: s.id,
        documentId: s.documentId,
        nome: s.nome,
        email: s.email,
        cpfCnpj: s.cpfCnpj,
        tipoSignatario: s.tipoSignatario,
        ordemAssinatura: s.ordemAssinatura,
        status: s.status,
        assinadoEm: s.assinadoEm ? s.assinadoEm.toISOString() : null,
        ipAssinatura: s.ipAssinatura,
        metodoAutenticacao: s.metodoAutenticacao,
        createdAt: s.createdAt.toISOString(),
      })),
      syncIntegracoes: (d.syncIntegracoes || []).map((q: any) => ({
        id: q.id,
        documentId: q.documentId,
        sistemaDestino: q.sistemaDestino,
        entidade: q.entidade,
        status: q.status,
        tentativas: q.tentativas,
        ultimoErro: q.ultimoErro,
        sincronizadoEm: q.sincronizadoEm ? q.sincronizadoEm.toISOString() : null,
        createdAt: q.createdAt.toISOString(),
      })),
    };
  }

  private async ensureSeedData(): Promise<void> {
    const count = await this.prisma.digitalSignatureDocument.count();
    if (count > 0) return;

    // Doc 1: Borderô Festival Rock Curitiba 2026 - Concluído
    const doc1 = await this.prisma.digitalSignatureDocument.create({
      data: {
        codigoDocumento: 'DOC-SIG-2026-000312',
        titulo: 'Borderô Contábil e Quitação Final - Festival Rock Curitiba 2026',
        tipoDocumento: SignatureDocumentType.BORDERO_FECHAMENTO,
        referenciaId: 'REP-2026-000412',
        producerId: 'p1',
        producerNome: 'Curitiba Shows Ltda',
        provedor: SignatureProvider.AUTENTIQUE,
        externalDocumentId: 'autentique-rock-curitiba-2026',
        status: SignatureDocumentStatus.CONCLUIDO_ASSINADO,
        checksumSha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        valorTotal: 428500.0,
        criadoPor: 'Carlos Contador (CRC 12345/PR)',
        createdAt: new Date('2026-08-31T14:00:00Z'),
        signatarios: {
          create: [
            {
              nome: 'Carlos Eduardo (Sócio Produtor)',
              email: 'carlos@curitibashows.com.br',
              cpfCnpj: '123.456.789-00',
              tipoSignatario: SignerRole.PRODUTOR_1_ORDEM,
              ordemAssinatura: 1,
              status: SignerStatus.ASSINADO,
              assinadoEm: new Date('2026-08-31T16:20:00Z'),
              ipAssinatura: '189.120.45.12',
              metodoAutenticacao: 'EMAIL_OTP',
            },
            {
              nome: 'Karine Diretoria Financeira DiskIngressos',
              email: 'karine@diskingressos.com.br',
              cpfCnpj: '08.234.567/0001-89',
              tipoSignatario: SignerRole.DISKINGRESSOS_2_ORDEM,
              ordemAssinatura: 2,
              status: SignerStatus.ASSINADO,
              assinadoEm: new Date('2026-08-31T17:45:00Z'),
              ipAssinatura: '192.168.1.100',
              metodoAutenticacao: 'CERTIFICADO_A1_ICP',
            },
          ],
        },
        syncIntegracoes: {
          create: {
            sistemaDestino: 'CONTA_AZUL',
            entidade: 'CONTAS_A_PAGAR',
            status: ErpSyncStatus.SINCRONIZADO,
            tentativas: 1,
            sincronizadoEm: new Date('2026-08-31T17:50:00Z'),
            respostaPayload: JSON.stringify({
              idContaAzul: 'ca-pag-202608-01',
              situacao: 'QUITADO',
            }),
          },
        },
      },
    });

    // Doc 2: Termo de Repasse Parcial - Aguardando Disk
    await this.prisma.digitalSignatureDocument.create({
      data: {
        codigoDocumento: 'DOC-SIG-2026-000313',
        titulo: 'Termo de Repasse Intermediário - Turnê Internacional Arena',
        tipoDocumento: SignatureDocumentType.TERMO_REPASSE,
        referenciaId: 'REP-2026-000411',
        producerId: 'p2',
        producerNome: 'Live Nation Brasil Produções',
        provedor: SignatureProvider.CLICKSIGN,
        externalDocumentId: 'clicksign-arena-2026',
        status: SignatureDocumentStatus.AGUARDANDO_DISKINGRESSOS,
        checksumSha256: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        valorTotal: 1285500.0,
        criadoPor: 'Mariana Financeiro',
        createdAt: new Date('2026-09-01T09:00:00Z'),
        signatarios: {
          create: [
            {
              nome: 'Marcos Diretor Produção Live Nation',
              email: 'marcos@livenation.com.br',
              cpfCnpj: '987.654.321-11',
              tipoSignatario: SignerRole.PRODUTOR_1_ORDEM,
              ordemAssinatura: 1,
              status: SignerStatus.ASSINADO,
              assinadoEm: new Date('2026-09-01T11:15:00Z'),
              ipAssinatura: '177.89.201.44',
              metodoAutenticacao: 'SMS_TOKEN',
            },
            {
              nome: 'Diretoria Financeira DiskIngressos',
              email: 'diretoria@diskingressos.com.br',
              cpfCnpj: '08.234.567/0001-89',
              tipoSignatario: SignerRole.DISKINGRESSOS_2_ORDEM,
              ordemAssinatura: 2,
              status: SignerStatus.PENDENTE,
            },
          ],
        },
        syncIntegracoes: {
          create: {
            sistemaDestino: 'CONTA_AZUL',
            entidade: 'CONTAS_A_PAGAR',
            status: ErpSyncStatus.PROCESSANDO,
            tentativas: 1,
          },
        },
      },
    });

    // Doc 3: Contrato de Cessão de Recebíveis - Aguardando Produtor
    await this.prisma.digitalSignatureDocument.create({
      data: {
        codigoDocumento: 'DOC-SIG-2026-000314',
        titulo: 'Contrato de Cessão e Antecipação de Recebíveis - Teatro Positivo',
        tipoDocumento: SignatureDocumentType.CONTRATO_ANTECIPACAO,
        referenciaId: 'ANT-2026-000088',
        producerId: 'p3',
        producerNome: 'Positivo Eventos Culturais',
        provedor: SignatureProvider.AUTENTIQUE,
        externalDocumentId: 'autentique-teatro-2026',
        status: SignatureDocumentStatus.AGUARDANDO_PRODUTOR,
        checksumSha256: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        valorTotal: 45000.0,
        criadoPor: 'Roberto Atendimento Produtor',
        createdAt: new Date('2026-09-01T14:00:00Z'),
        signatarios: {
          create: [
            {
              nome: 'Ana Paula Gestora Teatro Positivo',
              email: 'anapaula@positivocultura.com.br',
              cpfCnpj: '456.789.012-33',
              tipoSignatario: SignerRole.PRODUTOR_1_ORDEM,
              ordemAssinatura: 1,
              status: SignerStatus.PENDENTE,
            },
            {
              nome: 'Diretoria Financeira DiskIngressos',
              email: 'diretoria@diskingressos.com.br',
              cpfCnpj: '08.234.567/0001-89',
              tipoSignatario: SignerRole.DISKINGRESSOS_2_ORDEM,
              ordemAssinatura: 2,
              status: SignerStatus.PENDENTE,
            },
          ],
        },
        syncIntegracoes: {
          create: {
            sistemaDestino: 'CONTA_AZUL',
            entidade: 'CONTAS_A_RECEBER',
            status: ErpSyncStatus.PENDENTE,
            tentativas: 0,
          },
        },
      },
    });
  }
}
