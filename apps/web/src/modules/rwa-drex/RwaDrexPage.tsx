import React, { useState } from 'react';
import {
  Coins,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calculator,
  ArrowRightLeft,
  Sparkles,
  Lock,
  Layers,
  Banknote,
  FileCheck2,
} from 'lucide-react';
import {
  TipoAtivoTokenizado,
  PadraoToken,
  NetworkChain,
  StatusPoolRwa,
  FaseEventoEscrow,
  StatusOracleEscrow,
  StatusTradeSecundario,
} from '@diskingressos/types';
import type {
  RwaTicketTokenPoolDto,
  SmartContractEscrowTriggerDto,
  SecondaryMarketTradeDto,
  RwaAccountingRegisterDto,
  SimularRevendaSecundariaResponseDto,
} from '@diskingressos/types';

export const RwaDrexPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pools' | 'escrow' | 'secundario' | 'contabil'>('pools');
  const [isSimuladorOpen, setIsSimuladorOpen] = useState(false);

  // Estados do Simulador Anti-Cambismo
  const [precoFaceSim, setPrecoFaceSim] = useState(250.0);
  const [precoRevendaSim, setPrecoRevendaSim] = useState(280.0);
  const [simulacaoResultado, setSimulacaoResultado] = useState<SimularRevendaSecundariaResponseDto | null>(null);

  // Dados Mock Realistas para Demonstração Executiva
  const [pools] = useState<RwaTicketTokenPoolDto[]>([
    {
      id: 'pool-001',
      codigoTokenPool: 'RWA-DREX-2026-001',
      nomePool: 'Festival Rock Curitiba Prime 2026 - Lote VIP RWA',
      eventoId: 'evt-001',
      eventoNome: 'Festival Rock Curitiba Prime 2026',
      produtorId: 'prod-001',
      produtorNome: 'Prime Eventos Culturais S.A.',
      tipoAtivoTokenizado: TipoAtivoTokenizado.LOTE_INGRESSOS,
      padraoToken: PadraoToken.ERC3643_PERMISSIONED,
      contractAddress: '0x71C8A336F158d6265B54e3dE55aF3A4b419409bE',
      networkChain: NetworkChain.BACEN_DREX_HYPERLEDGER,
      totalTokensEmitidos: 10000,
      tokensDisponiveis: 1200,
      tokensLiquidados: 8800,
      valorFaceUnitarioBrl: 250.0,
      valorCaptadoBrl: 2500000.0,
      taxaRetornoAnualPercent: 14.25,
      statusPool: StatusPoolRwa.ATIVO_LANCADO,
      dataEmissao: '2026-02-10T10:00:00Z',
      dataMaturidade: '2026-04-15T23:59:59Z',
    },
    {
      id: 'pool-002',
      codigoTokenPool: 'RWA-DREX-2026-002',
      nomePool: 'Coldplay Eco Experience - Recebíveis Futuros A&B',
      eventoId: 'evt-002',
      eventoNome: 'Tour Coldplay Eco Music Experience 2026',
      produtorId: 'prod-002',
      produtorNome: 'Live Nation Brasil Entretenimento Ltda',
      tipoAtivoTokenizado: TipoAtivoTokenizado.RECEBIVEL_FUTURO,
      padraoToken: PadraoToken.DREX_PILOT,
      contractAddress: '0x3B88e40428B715C8aB15783A9250b730591295A2',
      networkChain: NetworkChain.BACEN_DREX_HYPERLEDGER,
      totalTokensEmitidos: 5000,
      tokensDisponiveis: 500,
      tokensLiquidados: 4500,
      valorFaceUnitarioBrl: 500.0,
      valorCaptadoBrl: 2500000.0,
      taxaRetornoAnualPercent: 13.8,
      statusPool: StatusPoolRwa.ATIVO_LANCADO,
      dataEmissao: '2026-02-15T14:00:00Z',
      dataMaturidade: '2026-05-30T23:59:59Z',
    },
    {
      id: 'pool-003',
      codigoTokenPool: 'RWA-POLY-2026-003',
      nomePool: 'Pedreira Sunset Sessions - Lote Pista Tokenizada',
      eventoId: 'evt-003',
      eventoNome: 'Eletrônica Sunset Pedreira Paulo Leminski',
      produtorId: 'prod-003',
      produtorNome: 'Pedreira Live Entertainment Ltda',
      tipoAtivoTokenizado: TipoAtivoTokenizado.LOTE_INGRESSOS,
      padraoToken: PadraoToken.ERC1155_HYBRID,
      contractAddress: '0x992B104F5E6D8A3A95E4A786c6F523412a8321F5',
      networkChain: NetworkChain.POLYGON_POS,
      totalTokensEmitidos: 15000,
      tokensDisponiveis: 3000,
      tokensLiquidados: 12000,
      valorFaceUnitarioBrl: 120.0,
      valorCaptadoBrl: 1800000.0,
      taxaRetornoAnualPercent: 12.0,
      statusPool: StatusPoolRwa.ATIVO_LANCADO,
      dataEmissao: '2026-02-20T11:00:00Z',
      dataMaturidade: '2026-04-30T23:59:59Z',
    },
  ]);

  const [triggers, setTriggers] = useState<SmartContractEscrowTriggerDto[]>([
    {
      id: 'trg-001',
      tokenPoolId: 'pool-001',
      eventoId: 'evt-001',
      faseEvento: FaseEventoEscrow.SOUNDCHECK_HOMOLOGADO,
      percentualLiberacao: 20.0,
      valorLiberadoBrl: 500000.0,
      oracleStatus: StatusOracleEscrow.LIQUIDADO_DREX,
      txHashBlockchain: '0x8823fba93c129e9240bf3812fa48194b29019284201824059128301294819203',
      dataLiberacao: '2026-03-01T15:30:00Z',
      criadoEm: '2026-02-10T10:30:00Z',
    },
    {
      id: 'trg-002',
      tokenPoolId: 'pool-001',
      eventoId: 'evt-001',
      faseEvento: FaseEventoEscrow.ABERTURA_PORTOES,
      percentualLiberacao: 40.0,
      valorLiberadoBrl: 1000000.0,
      oracleStatus: StatusOracleEscrow.LIQUIDADO_DREX,
      txHashBlockchain: '0x4491029410940192830192481029480192834019283019284019283049182304',
      dataLiberacao: '2026-03-01T17:00:00Z',
      criadoEm: '2026-02-10T10:30:00Z',
    },
    {
      id: 'trg-003',
      tokenPoolId: 'pool-001',
      eventoId: 'evt-001',
      faseEvento: FaseEventoEscrow.ENCERRAMENTO_VALIDADO,
      percentualLiberacao: 40.0,
      valorLiberadoBrl: 1000000.0,
      oracleStatus: StatusOracleEscrow.VERIFICADO_ORACULO,
      txHashBlockchain: '0x1203948102934810293481029348102934810293481029348102934810293481',
      criadoEm: '2026-02-10T10:30:00Z',
    },
  ]);

  const [trades] = useState<SecondaryMarketTradeDto[]>([
    {
      id: 'trade-001',
      codigoOperacao: 'SEC-TRADE-2026-9812',
      tokenPoolId: 'pool-001',
      ticketId: 'tkt-rwa-8812',
      compradorWallet: '0x1a89F6...4D22',
      vendedorWallet: '0x88cB91...21F4',
      precoFaceOriginalBrl: 250.0,
      precoRevendaBrl: 290.0,
      agioPercentual: 16.0,
      taxaRoyaltyProdutorBrl: 14.5,
      taxaPlataformaDiskBrl: 7.25,
      txHashDrex: '0x5501928301928401928301924801928340192830192840192830192840192830',
      statusTrade: StatusTradeSecundario.LIQUIDADO,
      executadoEm: '2026-03-02T14:20:00Z',
    },
    {
      id: 'trade-002',
      codigoOperacao: 'SEC-TRADE-2026-9813',
      tokenPoolId: 'pool-001',
      ticketId: 'tkt-rwa-8813',
      compradorWallet: '0x44bB01...7A99',
      vendedorWallet: '0x992C88...33E1',
      precoFaceOriginalBrl: 250.0,
      precoRevendaBrl: 275.0,
      agioPercentual: 10.0,
      taxaRoyaltyProdutorBrl: 13.75,
      taxaPlataformaDiskBrl: 6.88,
      txHashDrex: '0x7701928301928401928301924801928340192830192840192830192840192831',
      statusTrade: StatusTradeSecundario.LIQUIDADO,
      executadoEm: '2026-03-02T16:45:00Z',
    },
  ]);

  const [registers] = useState<RwaAccountingRegisterDto[]>([
    {
      id: 'reg-001',
      codigoLancamento: 'OCPC10-2026-001',
      tokenPoolId: 'pool-001',
      tipoLancamento: 'CAPTACAO_INICIAL',
      valorBrl: 2500000.0,
      contaDebito: '1.1.2.04 - Ativos Digitais Sob Custódia DREX',
      contaCredito: '2.1.9.01 - Obrigações por Tokens RWA Emitidos',
      historicoOcpc10:
        'Registro da captação de recursos via tokenização RWA de ingressos VIP sob regulação CVM Res. 88/22 e custódia DREX.',
      dataRegistro: '2026-02-10T11:00:00Z',
    },
    {
      id: 'reg-002',
      codigoLancamento: 'OCPC10-2026-002',
      tokenPoolId: 'pool-001',
      tipoLancamento: 'LIBERACAO_ESCROW',
      valorBrl: 1500000.0,
      contaDebito: '2.1.9.01 - Obrigações por Tokens RWA Emitidos',
      contaCredito: '1.1.1.02 - Conta Reservas Bancárias DREX / Liquidada',
      historicoOcpc10:
        'Liquidação programável em DREX liberada por Smart Contract após marcos de Soundcheck e Abertura de Portões.',
      dataRegistro: '2026-03-01T17:30:00Z',
    },
  ]);

  const handleSimularRevenda = () => {
    const agio = Number((((precoRevendaSim - precoFaceSim) / precoFaceSim) * 100).toFixed(2));
    const permitido = agio <= 20.0;
    const royalty = permitido ? Number((precoRevendaSim * 0.05).toFixed(2)) : 0;
    const disk = permitido ? Number((precoRevendaSim * 0.025).toFixed(2)) : 0;
    const liquido = permitido ? Number((precoRevendaSim - royalty - disk).toFixed(2)) : 0;

    setSimulacaoResultado({
      permitido,
      agioPercentual: agio,
      agioMaximoPermitidoPercentual: 20.0,
      motivoBloqueio: permitido
        ? undefined
        : `Ágio de +${agio}% excede o teto regulatório anti-cambismo de +20%. Trava de Smart Contract bloqueia a transação.`,
      taxaRoyaltyProdutorBrl: royalty,
      taxaPlataformaDiskBrl: disk,
      valorLiquidoVendedorBrl: liquido,
      regrasAntiCambismoCvm88: permitido ? 'CONFORME_CVM_88_TRAVA_ATIVA' : 'BLOQUEADO_POR_TRAVA_CAMBISMO',
    });
  };

  const handleExecutarTrigger = (id: string) => {
    setTriggers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              oracleStatus: StatusOracleEscrow.LIQUIDADO_DREX,
              dataLiberacao: new Date().toISOString(),
              txHashBlockchain: '0x' + Math.random().toString(16).substring(2).padEnd(64, '0'),
            }
          : t,
      ),
    );
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header Corporativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-300">
              FASE 27: RWA, DREX & SMART CONTRACTS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              CVM Res. 88 & Res. 175 / Bacen
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-7 h-7 text-violet-500" />
            Tokenização de Ativos RWA, Recebíveis em DREX & Liquidação Escrow
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Emissão de Tokens de Bilheteria, Smart Contracts com Oráculos Físicos e Mercado Secundário Regulado com Trava Anti-Cambismo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimuladorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Calculator className="w-4 h-4" />
            Simulador Anti-Cambismo & Royalties
          </button>
          <button
            onClick={() => alert('Nova emissão de token pool RWA iniciada sob marco da Resolução CVM 88.')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-violet-500" />
            Emitir Nova Pool RWA
          </button>
        </div>
      </div>

      {/* 4 Cards de KPIs Executivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 dark:bg-violet-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Value Locked (TVL)
            </span>
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 6.800.000,00
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-violet-600 font-medium">3 pools ativas</span> custodiadas no Piloto DREX Bacen
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tokens RWA em Circulação
            </span>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            30.000 <span className="text-base font-normal text-slate-500">unidades</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Padrão permissionado ERC-3643 / DREX
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 dark:bg-emerald-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mercado Secundário Regulado
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 565,00
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">100% transacionado</span> via carteiras KYC DREX
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Royalties Anti-Cambismo
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            R$ 42,38
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span className="text-amber-600 font-medium">Split 7.5%</span> (5% Produtor + 2.5% DiskIngressos)
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('pools')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'pools'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Coins className="w-4 h-4" />
          Pools de Tokens RWA (DREX Pilot)
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'escrow'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Smart Contracts & Liquidação por Oráculo
        </button>

        <button
          onClick={() => setActiveTab('secundario')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'secundario'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <Lock className="w-4 h-4" />
          Mercado Secundário Regulado Anti-Cambismo
        </button>

        <button
          onClick={() => setActiveTab('contabil')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'contabil'
              ? 'border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Escrituração Contábil OCPC 10 / CVM
        </button>
      </div>

      {/* CONTEÚDO TAB 1: POOLS DE TOKENS */}
      {activeTab === 'pools' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Pools de Ativos do Mundo Real (RWA) no Piloto DREX Bacen
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tokens permissionados com identidade verificada (KYC/AML) conforme Instrução CVM 88 e CVM 175
              </p>
            </div>
            <span className="text-xs bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300 px-3 py-1 rounded-full font-semibold">
              R$ 6.8M TVL em DREX
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Pool</th>
                  <th className="py-3 px-4">Evento / Produtor</th>
                  <th className="py-3 px-4">Padrão / Rede</th>
                  <th className="py-3 px-4 text-right">Tokens (Totais / Disp)</th>
                  <th className="py-3 px-4 text-right">Valor Face</th>
                  <th className="py-3 px-4 text-right">Captação Total</th>
                  <th className="py-3 px-4 text-right">Taxa (a.a.)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {pools.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{p.nomePool}</div>
                      <div className="text-xs text-slate-400 font-mono">{p.codigoTokenPool}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-white">{p.eventoNome}</div>
                      <div className="text-xs text-slate-400">{p.produtorNome}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-violet-600 font-semibold">{p.padraoToken}</div>
                      <div className="text-xs text-slate-400">{p.networkChain}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      <div>{p.totalTokensEmitidos.toLocaleString('pt-BR')} emitidos</div>
                      <div className="text-slate-400">{p.tokensDisponiveis.toLocaleString('pt-BR')} livres</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      R$ {p.valorFaceUnitarioBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {p.valorCaptadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-bold">
                      {p.taxaRetornoAnualPercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {p.statusPool}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 2: SMART CONTRACTS & ORÁCULO */}
      {activeTab === 'escrow' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Liquidação Condicional por Smart Contracts (Oráculo de Evento)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Liberação automatizada dos fundos em DREX para o produtor conforme marcos operacionais auditados
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
              Oráculo IoT & Bilheteria Integrado
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Marco do Evento</th>
                  <th className="py-3 px-4 text-right">% Liberação</th>
                  <th className="py-3 px-4 text-right">Valor em DREX</th>
                  <th className="py-3 px-4 text-center">Status Oráculo</th>
                  <th className="py-3 px-4">TxHash Blockchain</th>
                  <th className="py-3 px-4 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {triggers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {t.faseEvento}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-violet-600">
                      {t.percentualLiberacao.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {t.valorLiberadoBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          t.oracleStatus === StatusOracleEscrow.LIQUIDADO_DREX
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        }`}
                      >
                        {t.oracleStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 max-w-[200px] truncate">
                      {t.txHashBlockchain || 'Aguardando validação do oráculo'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {t.oracleStatus === StatusOracleEscrow.VERIFICADO_ORACULO && (
                        <button
                          onClick={() => handleExecutarTrigger(t.id)}
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Liquidar DREX
                        </button>
                      )}
                      {t.oracleStatus === StatusOracleEscrow.LIQUIDADO_DREX && (
                        <span className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Pago
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 3: MERCADO SECUNDÁRIO REGULADO ANTI-CAMBISMO */}
      {activeTab === 'secundario' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Mercado Secundário Regulado com Trava Anti-Cambismo
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Teto máximo de ágio limitado por código em +20% e split programável de royalties contínuos (CVM Res. 88)
              </p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full font-semibold">
              Zero Cambismo Ilegal
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Operação / Ingresso</th>
                  <th className="py-3 px-4">Comprador / Vendedor</th>
                  <th className="py-3 px-4 text-right">Face Original</th>
                  <th className="py-3 px-4 text-right">Revenda (BRL)</th>
                  <th className="py-3 px-4 text-right">Ágio</th>
                  <th className="py-3 px-4 text-right">Royalty Produtor (5%)</th>
                  <th className="py-3 px-4 text-right">Taxa Disk (2.5%)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {trades.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{t.codigoOperacao}</div>
                      <div className="text-xs text-slate-400 font-mono">{t.ticketId}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-slate-500">
                      <div>De: {t.vendedorWallet}</div>
                      <div>Para: {t.compradorWallet}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs">
                      R$ {t.precoFaceOriginalBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {t.precoRevendaBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-emerald-600 font-semibold">
                      +{t.agioPercentual.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold text-violet-600">
                      R$ {t.taxaRoyaltyProdutorBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-500">
                      R$ {t.taxaPlataformaDiskBrl.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {t.statusTrade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEÚDO TAB 4: ESCRITURAÇÃO CONTÁBIL OCPC 10 */}
      {activeTab === 'contabil' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Escrituração de Criptoativos e RWA no Balanço Patrimonial (OCPC 10 / CVM)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lançamentos em partidas dobradas de custódia em DREX, obrigações tokenizadas e liquidações programáveis
              </p>
            </div>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full font-semibold">
              Auditoria de Saldos DREX
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Código / Tipo</th>
                  <th className="py-3 px-4 text-right">Valor (BRL)</th>
                  <th className="py-3 px-4">Conta Débito</th>
                  <th className="py-3 px-4">Conta Crédito</th>
                  <th className="py-3 px-4">Histórico OCPC 10</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                {registers.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{r.codigoLancamento}</div>
                      <div className="text-xs text-violet-600 font-mono font-medium">{r.tipoLancamento}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      R$ {r.valorBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {r.contaDebito}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {r.contaCredito}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500 max-w-xs">
                      {r.historicoOcpc10}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR ANTI-CAMBISMO */}
      {isSimuladorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-violet-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Simulador de Revenda & Trava Anti-Cambismo
                </h3>
              </div>
              <button
                onClick={() => setIsSimuladorOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Preço de Face Original (R$)
                </label>
                <input
                  type="number"
                  value={precoFaceSim}
                  onChange={(e) => setPrecoFaceSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Preço Pretendido de Revenda (R$)
                </label>
                <input
                  type="number"
                  value={precoRevendaSim}
                  onChange={(e) => setPrecoRevendaSim(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSimularRevenda}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Validar Trava Smart Contract CVM 88
            </button>

            {simulacaoResultado && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  simulacaoResultado.permitido
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-2 border-inherit">
                  <span className="font-bold text-sm">
                    {simulacaoResultado.permitido ? 'Operação Aprovada pelo Smart Contract' : 'Operação Bloqueada'}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-bold ${
                      simulacaoResultado.permitido
                        ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100'
                    }`}
                  >
                    Ágio: {simulacaoResultado.agioPercentual > 0 ? `+${simulacaoResultado.agioPercentual}%` : `${simulacaoResultado.agioPercentual}%`} (Máx: +20%)
                  </span>
                </div>

                {simulacaoResultado.permitido ? (
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Royalty Produtor (5%):</span>
                      <div className="font-bold text-violet-600">R$ {simulacaoResultado.taxaRoyaltyProdutorBrl.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Taxa DiskIngressos (2.5%):</span>
                      <div className="font-bold text-slate-700 dark:text-slate-300">R$ {simulacaoResultado.taxaPlataformaDiskBrl.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Líquido do Vendedor:</span>
                      <div className="font-bold text-emerald-600 text-sm">R$ {simulacaoResultado.valorLiquidoVendedorBrl.toFixed(2)}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    {simulacaoResultado.motivoBloqueio}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
