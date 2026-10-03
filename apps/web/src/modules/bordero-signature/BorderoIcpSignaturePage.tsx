import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  Clock,
  Key,
  FileText,
  CheckCircle2,
  Lock,
  ExternalLink,
  QrCode,
  Download,
} from 'lucide-react';
import {
  StatusAssinaturaBordero,
  PadraoCriptograficoAssinatura,
} from '@diskingressos/types';
import type {
  DigitalBorderoSealDto,
  IcpSignatureAuditTrailDto,
  BorderoSignatureDashboardKpisDto,
} from '@diskingressos/types';

export const BorderoIcpSignaturePage: React.FC = () => {
  const [kpis] = useState<BorderoSignatureDashboardKpisDto>({
    totalBorderosAssinadosIcp: 148,
    totalBorderosPendentes: 2,
    conformidadeItiPercent: 100.0,
    carimbosTempoAtivos: 148,
    volumeFinanceiroHomologadoBrl: 18450000.0,
  });

  const [borderos, setBorderos] = useState<DigitalBorderoSealDto[]>([
    {
      id: 'seal-001',
      codigoBordero: 'BOR-ICP-2026-0042',
      eventoId: 'evt-rock-arena',
      produtorId: 'prod-prime-tour',
      hashDocSha256: 'a9f3b8c4d2e1f0a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
      statusAssinatura: StatusAssinaturaBordero.ASSINADO_ICP_BRASIL,
      certificadoEmissor: 'AC SERPRO Brasil v10 (ICP-Brasil)',
      padraoAssinatura: PadraoCriptograficoAssinatura.PADES_LTV,
      urlDocumentoPdf: 'https://storage.diskingressos.com.br/borderos/BOR-ICP-2026-0042.pdf',
      criadoEm: '2026-04-01T14:00:00Z',
    },
    {
      id: 'seal-002',
      codigoBordero: 'BOR-ICP-2026-0043',
      eventoId: 'evt-symphonic',
      produtorId: 'prod-curitiba-shows',
      hashDocSha256: 'b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
      statusAssinatura: StatusAssinaturaBordero.ASSINADO_ICP_BRASIL,
      certificadoEmissor: 'AC CERTISIGN Brasil v11 (ICP-Brasil)',
      padraoAssinatura: PadraoCriptograficoAssinatura.PADES_LTV,
      urlDocumentoPdf: 'https://storage.diskingressos.com.br/borderos/BOR-ICP-2026-0043.pdf',
      criadoEm: '2026-04-01T14:30:00Z',
    },
  ]);

  const [auditTrails] = useState<IcpSignatureAuditTrailDto[]>([
    {
      id: 'trail-001',
      borderoSealId: 'seal-001',
      signatarioNome: 'Carlos Eduardo Silveira (Diretor Financeiro)',
      signatarioCpfCnpj: '042.891.309-88',
      protocoloValidadorIti: 'ITI-PADES-LTV-2026-881923',
      carimboDoTempo: '2026-04-01T14:05:22Z',
      ipOrigem: '177.18.204.55',
      statusValidacao: 'CONFORME_ITI_MP_2200',
    },
    {
      id: 'trail-002',
      borderoSealId: 'seal-001',
      signatarioNome: 'Marcos Vinicius Pereira (Produtor Delegado)',
      signatarioCpfCnpj: '812.449.102-15',
      protocoloValidadorIti: 'ITI-PADES-LTV-2026-881924',
      carimboDoTempo: '2026-04-01T14:10:15Z',
      ipOrigem: '189.32.110.82',
      statusValidacao: 'CONFORME_ITI_MP_2200',
    },
  ]);

  const [isSigning, setIsSigning] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSimularAssinatura = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSuccessMsg('Borderô BOR-ICP-2026-0044 assinado com sucesso via Certificado A1/A3 ICP-Brasil com carimbo de tempo do Observatório Nacional!');
      const novo: DigitalBorderoSealDto = {
        id: `seal-${Date.now()}`,
        codigoBordero: `BOR-ICP-2026-0044`,
        eventoId: 'evt-broadway-guaira',
        produtorId: 'prod-teatro-guaira',
        hashDocSha256: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        statusAssinatura: StatusAssinaturaBordero.ASSINADO_ICP_BRASIL,
        certificadoEmissor: 'AC SERPRO Brasil v10 (ICP-Brasil)',
        padraoAssinatura: PadraoCriptograficoAssinatura.PADES_LTV,
        urlDocumentoPdf: 'https://storage.diskingressos.com.br/borderos/BOR-ICP-2026-0044.pdf',
        criadoEm: new Date().toISOString(),
      };
      setBorderos([novo, ...borderos]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
              FASE 36 • ASSINATURA QUALIFICADA ICP-BRASIL & ITI
            </span>
            <span className="text-xs text-slate-500">MP 2.200-2/2001 & Lei 14.063/2020</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Auditoria de Borderô Digital com Assinatura ICP-Brasil & ITI
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Homologação jurídica irrevogável, carimbo do tempo oficial (ACT Observatório Nacional) e padrão PAdES-LTV.
          </p>
        </div>

        <button
          onClick={handleSimularAssinatura}
          disabled={isSigning}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Key className="w-4 h-4" />
          {isSigning ? 'Assinando via Token ICP-Brasil...' : 'Assinar Borderô com Certificado Digital'}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs underline font-semibold">
            Fechar
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Borderôs Homologados</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis.totalBorderosAssinadosIcp}
          </div>
          <span className="text-xs text-blue-600 font-medium">ICP-Brasil / PAdES</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Pendentes de Assinatura</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {kpis.totalBorderosPendentes}
          </div>
          <span className="text-xs text-slate-500">Em conferência final</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Conformidade ITI</span>
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {kpis.conformidadeItiPercent}%
          </div>
          <span className="text-xs text-emerald-600 font-medium">Validador Oficial Aprovado</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Carimbos do Tempo</span>
            <Lock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {kpis.carimbosTempoAtivos}
          </div>
          <span className="text-xs text-purple-600 font-medium">ACT Obs. Nacional</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Volume Homologado</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ {(kpis.volumeFinanceiroHomologadoBrl / 1000000).toFixed(2)}M
          </div>
          <span className="text-xs text-slate-500">Com fé pública irrefutável</span>
        </div>
      </div>

      {/* Grid: Borderôs e Trilhas de Auditoria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Borderôs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Borderôs com Selo Digital Qualificado PAdES-LTV
          </h2>

          <div className="space-y-3">
            {borderos.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {b.codigoBordero}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold rounded-full">
                      {b.statusAssinatura}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(b.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-col gap-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Certificado:</span>{' '}
                    {b.certificadoEmissor}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Hash SHA-256:</span>{' '}
                    <span className="font-mono text-[11px] text-slate-500 break-all">{b.hashDocSha256}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-500">Padrão: {b.padraoAssinatura} (Long Term Validation)</span>
                  <a
                    href={b.urlDocumentoPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar PDF Selado
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trilha de Auditoria ITI */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-purple-600" />
            Trilha de Conformidade ITI / MP 2.200
          </h2>
          <p className="text-xs text-slate-500">
            Registro cronológico das assinaturas digitais coletadas e validadas perante o Instituto Nacional de Tecnologia da Informação (ITI).
          </p>

          <div className="space-y-3">
            {auditTrails.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1.5"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.signatarioNome}
                </div>
                <div className="text-xs text-slate-500 flex justify-between">
                  <span>CPF/CNPJ: {t.signatarioCpfCnpj}</span>
                  <span>IP: {t.ipOrigem}</span>
                </div>
                <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                  {t.protocoloValidadorIti}
                </div>
                <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
                  <span>Carimbo: {new Date(t.carimboDoTempo).toLocaleTimeString('pt-BR')}</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {t.statusValidacao}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
