import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  TipoMensagemIso20022,
  DirecaoMensagemIso,
} from '@diskingressos/types';
import type {
  Iso20022MessageLogDto,
  InterbankSettlementRecordDto,
  RsfnNetworkAuditTrailDto,
  Iso20022DashboardKpisDto,
  DespacharMensagemIsoRequestDto,
  DespacharMensagemIsoResponseDto,
} from '@diskingressos/types';

@Injectable()
export class Iso20022SettlementService {
  private readonly logger = new Logger(Iso20022SettlementService.name);

  private inMemoryLogs: Iso20022MessageLogDto[] = [];
  private inMemorySettlements: InterbankSettlementRecordDto[] = [];
  private inMemoryRsfn: RsfnNetworkAuditTrailDto[] = [];
  private isInitialized = false;

  constructor(private readonly prisma: PrismaService) {}

  private async ensureSeedData(): Promise<void> {
    if (this.isInitialized) return;

    this.logger.log('Inicializando motor de Mensageria ISO 20022 e Liquidação Interbancária RSFN (Fase 39)...');

    const msg1: Iso20022MessageLogDto = {
      id: 'iso-001',
      messageId: 'MSG-ISO-2026-pacs008-0042',
      messageType: TipoMensagemIso20022.PACS_008,
      direction: DirecaoMensagemIso.OUTBOUND,
      senderIspb: '60701190',
      receiverIspb: '00360305',
      xmlPayload: '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08"><FIToFICstmrCdtTrf><GrpHdr><MsgId>MSG-ISO-2026-pacs008-0042</MsgId><CreDtTm>2026-04-01T17:00:00Z</CreDtTm><NbOfTxs>1</NbOfTxs><SttlmInf><SttlmMtd>CLRG</SttlmMtd></SttlmInf></GrpHdr></FIToFICstmrCdtTrf></Document>',
      statusProcessamento: 'PROCESSADO_COM_SUCESSO',
      latenciaMs: 142,
      timestampMensagem: '2026-04-01T17:00:00Z',
    };

    const msg2: Iso20022MessageLogDto = {
      id: 'iso-002',
      messageId: 'MSG-ISO-2026-camt053-0019',
      messageType: TipoMensagemIso20022.CAMT_053,
      direction: DirecaoMensagemIso.INBOUND,
      senderIspb: '00038166', // Bacen SPI
      receiverIspb: '60701190',
      xmlPayload: '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08"><BkToCstmrStmt><GrpHdr><MsgId>MSG-ISO-2026-camt053-0019</MsgId></GrpHdr></BkToCstmrStmt></Document>',
      statusProcessamento: 'PROCESSADO_COM_SUCESSO',
      latenciaMs: 88,
      timestampMensagem: '2026-04-01T17:01:00Z',
    };

    this.inMemoryLogs = [msg1, msg2];

    const s1: InterbankSettlementRecordDto = {
      id: 'sttl-001',
      codigoLiquidacao: 'LIQ-RSFN-2026-8812',
      canalLiquidacao: 'SPI_BACEN',
      valorLiquidadoBrl: 1650000.0,
      statusFinal: 'LIQUIDADO_SEM_DIVERGENCIA',
      dataLiquidacao: '2026-04-01T17:00:01Z',
    };

    this.inMemorySettlements = [s1];

    const r1: RsfnNetworkAuditTrailDto = {
      id: 'rsfn-001',
      sessaoRsfn: 'RSFN-SPI-PROD-NODE-01',
      certificadoTlsThumbprint: 'A48F9B124C09138E221980E47120B883AC9184EF',
      conectividadeStatus: 'ONLINE_OPERACIONAL',
    };

    this.inMemoryRsfn = [r1];
    this.isInitialized = true;
  }

  async getDashboardKpis(): Promise<Iso20022DashboardKpisDto> {
    await this.ensureSeedData();
    return {
      mensagensIsoProcessadasHoje: 12450,
      latenciaMediaSpiMs: 115,
      volumeLiquidadoInterbancarioBrl: 18450000.0,
      taxaRejeicaoMensageriaPercent: 0.01,
      statusRedeRsfn: 'ONLINE_OPERACIONAL_REDUNDANTE',
    };
  }

  async listarMensagens(): Promise<Iso20022MessageLogDto[]> {
    await this.ensureSeedData();
    return this.inMemoryLogs;
  }

  async listarLiquidacoes(): Promise<InterbankSettlementRecordDto[]> {
    await this.ensureSeedData();
    return this.inMemorySettlements;
  }

  async despacharMensagemIso(dto: DespacharMensagemIsoRequestDto): Promise<DespacharMensagemIsoResponseDto> {
    await this.ensureSeedData();
    const latenciaMs = Math.floor(Math.random() * 50) + 90;
    const messageId = `MSG-ISO-2026-${dto.tipoMensagem.slice(0, 8)}-${Date.now().toString().slice(-4)}`;
    const protocoloBacen = `SPI-BACEN-${Date.now()}`;

    const novoLog: Iso20022MessageLogDto = {
      id: `iso-${Date.now()}`,
      messageId,
      messageType: dto.tipoMensagem,
      direction: DirecaoMensagemIso.OUTBOUND,
      senderIspb: '60701190',
      receiverIspb: dto.ispbDestinatario,
      xmlPayload: `<Document xmlns="urn:iso:std:iso:20022:tech:xsd:${dto.tipoMensagem}"><MsgId>${messageId}</MsgId><Amt Ccy="BRL">${dto.valorBrl.toFixed(2)}</Amt></Document>`,
      statusProcessamento: 'PROCESSADO_COM_SUCESSO',
      latenciaMs,
      timestampMensagem: new Date().toISOString(),
    };

    this.inMemoryLogs.unshift(novoLog);

    return {
      sucesso: true,
      messageId,
      protocoloBacen,
      latenciaMs,
      statusRetorno: 'ACCP_ACEITO_LIQUIDACAO_RSFN',
    };
  }
}
