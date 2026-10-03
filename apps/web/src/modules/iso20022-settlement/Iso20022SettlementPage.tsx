import React, { useState } from 'react';
import {
  Network,
  Send,
  Zap,
  CheckCircle2,
  FileCode,
  Layers,
  ArrowRightLeft,
  Activity,
  Server,
} from 'lucide-react';
import {
  TipoMensagemIso20022,
  DirecaoMensagemIso,
} from '@diskingressos/types';
import type {
  Iso20022MessageLogDto,
  InterbankSettlementRecordDto,
  Iso20022DashboardKpisDto,
} from '@diskingressos/types';

export const Iso20022SettlementPage: React.FC = () => {
  const [kpis] = useState<Iso20022DashboardKpisDto>({
    mensagensIsoProcessadasHoje: 12450,
    latenciaMediaSpiMs: 115,
    volumeLiquidadoInterbancarioBrl: 18450000.0,
    taxaRejeicaoMensageriaPercent: 0.01,
    statusRedeRsfn: 'ONLINE_OPERACIONAL_REDUNDANTE',
  });

  const [mensagens] = useState<Iso20022MessageLogDto[]>([
    {
      id: 'iso-001',
      messageId: 'MSG-ISO-2026-pacs008-0042',
      messageType: TipoMensagemIso20022.PACS_008,
      direction: DirecaoMensagemIso.OUTBOUND,
      senderIspb: '60701190 (Itaú)',
      receiverIspb: '00360305 (Bradesco)',
      xmlPayload: '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08"><FIToFICstmrCdtTrf><GrpHdr><MsgId>MSG-ISO-2026-pacs008-0042</MsgId><CreDtTm>2026-04-01T17:00:00Z</CreDtTm></GrpHdr></FIToFICstmrCdtTrf></Document>',
      statusProcessamento: 'PROCESSADO_COM_SUCESSO',
      latenciaMs: 142,
      timestampMensagem: '2026-04-01T17:00:00Z',
    },
    {
      id: 'iso-002',
      messageId: 'MSG-ISO-2026-camt053-0019',
      messageType: TipoMensagemIso20022.CAMT_053,
      direction: DirecaoMensagemIso.INBOUND,
      senderIspb: '00038166 (Bacen SPI)',
      receiverIspb: '60701190 (Itaú)',
      xmlPayload: '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:camt.053.001.08"><BkToCstmrStmt><GrpHdr><MsgId>MSG-ISO-2026-camt053-0019</MsgId></GrpHdr></BkToCstmrStmt></Document>',
      statusProcessamento: 'PROCESSADO_COM_SUCESSO',
      latenciaMs: 88,
      timestampMensagem: '2026-04-01T17:01:00Z',
    },
    {
      id: 'iso-003',
      messageId: 'MSG-ISO-2026-pacs004-0008',
      messageType: TipoMensagemIso20022.PACS_004,
      direction: DirecaoMensagemIso.OUTBOUND,
      senderIspb: '60701190 (Itaú)',
      receiverIspb: '00000000 (Banco do Brasil)',
      xmlPayload: '<?xml version="1.0" encoding="UTF-8"?><Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.004.001.09"><PmtRtr><GrpHdr><MsgId>MSG-ISO-2026-pacs004-0008</MsgId></GrpHdr></PmtRtr></Document>',
      statusProcessamento: 'PROCESSADO_COM_SUCESSO',
      latenciaMs: 94,
      timestampMensagem: '2026-04-01T17:02:15Z',
    },
  ]);

  const [selectedXml, setSelectedXml] = useState<string | null>(mensagens[0].xmlPayload);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
              FASE 39 • MENSAGERIA ISO 20022 & RSFN / SPI
            </span>
            <span className="text-xs text-slate-500">Padrão Bacen SPI / STR / LBTR</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Liquidação Interbancária Contínua SPI & Mensageria ISO 20022
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Comunicação via Rede do Sistema Financeiro Nacional (RSFN), pacs.008, pacs.004, camt.053 e liquidação atômica sub-segundo.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Mensagens Hoje</span>
            <Send className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.mensagensIsoProcessadasHoje.toLocaleString('pt-BR')}
          </div>
          <span className="text-xs text-cyan-600 font-medium">ISO 20022 XML</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Latência Média SPI</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {kpis.latenciaMediaSpiMs}ms
          </div>
          <span className="text-xs text-emerald-600 font-medium">Sub-segundo (&lt;1000ms)</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Volume Interbancário</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ {(kpis.volumeLiquidadoInterbancarioBrl / 1000000).toFixed(2)}M
          </div>
          <span className="text-xs text-slate-500">Liquidado sem fila</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Taxa de Rejeição</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {kpis.taxaRejeicaoMensageriaPercent}%
          </div>
          <span className="text-xs text-emerald-600 font-medium">Conformidade Sintática 100%</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Conectividade RSFN</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-sm font-bold text-emerald-600 pt-1">
            ONLINE OPERACIONAL
          </div>
          <span className="text-xs text-slate-500">mTLS Bacen Ativo</span>
        </div>
      </div>

      {/* Grid: Mensagens e XML Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Mensagens */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-cyan-600" />
            Tráfego de Mensagens RSFN / SPI em Tempo Real
          </h2>

          <div className="space-y-3">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedXml(msg.xmlPayload)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-cyan-400 cursor-pointer transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">
                      {msg.messageType}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                        msg.direction === DirecaoMensagemIso.OUTBOUND
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {msg.direction}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {msg.latenciaMs}ms
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  {msg.senderIspb} ➔ {msg.receiverIspb}
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span className="font-mono">{msg.messageId}</span>
                  <span className="text-emerald-600 font-semibold">{msg.statusProcessamento}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XML Viewer */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-600" />
              Payload XML Padronizado (ISO 20022)
            </h2>
            <span className="text-xs text-slate-500">Esquema XSD Bacen Homologado</span>
          </div>

          <div className="flex-1 p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
            {selectedXml || '// Selecione uma mensagem ao lado para inspecionar o XML'}
          </div>
        </div>
      </div>
    </div>
  );
};
