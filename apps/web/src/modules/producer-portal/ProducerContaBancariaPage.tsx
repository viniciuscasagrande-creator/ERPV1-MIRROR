import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ProducerBankData } from '@diskingressos/types';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Building2,
  Lock,
  QrCode,
  CreditCard,
  Info,
} from 'lucide-react';

const BANCOS_LISTA = [
  { codigo: '341', nome: '341 - Banco Itaú Unibanco S.A.' },
  { codigo: '237', nome: '237 - Banco Bradesco S.A.' },
  { codigo: '033', nome: '033 - Banco Santander (Brasil) S.A.' },
  { codigo: '001', nome: '001 - Banco do Brasil S.A.' },
  { codigo: '104', nome: '104 - Caixa Econômica Federal' },
  { codigo: '260', nome: '260 - Nu Pagamentos S.A. (Nubank)' },
  { codigo: '077', nome: '077 - Banco Inter S.A.' },
  { codigo: '336', nome: '336 - Banco C6 S.A.' },
  { codigo: '208', nome: '208 - Banco BTG Pactual S.A.' },
  { codigo: '422', nome: '422 - Banco Safra S.A.' },
  { codigo: '748', nome: '748 - Banco Cooperativo Sicredi S.A.' },
  { codigo: '756', nome: '756 - Banco Cooperativo Sicoob S.A.' },
];

export const ProducerContaBancariaPage: React.FC = () => {
  const [bankData, setBankData] = useState<ProducerBankData>({
    bancoNome: 'Banco Itaú Unibanco S.A.',
    bancoCodigo: '341',
    agencia: '0432',
    contaCorrente: '29871-4',
    chavePix: 'financeiro@curitibashows.com.br',
  });

  const [tipoChavePix, setTipoChavePix] = useState<'CNPJ' | 'EMAIL' | 'TELEFONE' | 'EVP'>('EMAIL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const fetchBankData = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/producer-portal/dados-bancarios');
      if (res) {
        setBankData(res);
      }
    } catch (err) {
      console.warn('Erro ao carregar dados bancários, utilizando dados cadastrados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankData();
  }, []);

  const handleBancoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = BANCOS_LISTA.find((b) => b.codigo === e.target.value);
    if (selected) {
      setBankData((prev) => ({
        ...prev,
        bancoCodigo: selected.codigo,
        bancoNome: selected.nome,
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(false);
    try {
      await api.put('/producer-portal/dados-bancarios', bankData);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 5000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Falha ao salvar dados bancários.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Landmark className="w-6 h-6 text-indigo-400" />
          Dados Bancários & PIX para Repasses
        </h1>
        <p className="text-sm text-slate-400">
          Gerencie a conta corrente e chave PIX homologadas para recebimento das liquidações de bilheteria.
        </p>
      </div>

      {/* Card de Homologação e Segurança */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Conta Bancária Homologada</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  Ativa & Habilitada para Repasses
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Validação cadastral de titularidade ativa conforme regras de conformidade BACEN.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">Política de Segurança Antifraude:</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Por diretrizes rígidas de compliance contábil e prevenção a fraudes da DiskIngressos,
              os repasses são emitidos <strong>exclusivamente</strong> para contas bancárias
              registradas sob o mesmo CNPJ da empresa produtora titular do contrato do evento.
            </p>
          </div>
        </div>
      </div>

      {/* Formulário de Atualização */}
      <form onSubmit={handleSave} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            Informações Bancárias
          </h2>
          <span className="text-xs text-slate-400">* Campos obrigatórios</span>
        </div>

        {successMessage && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-3 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dados bancários atualizados com sucesso no sistema da DiskIngressos!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Banco */}
          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Instituição Bancária *
            </label>
            <select
              value={bankData.bancoCodigo}
              onChange={handleBancoChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              required
            >
              {BANCOS_LISTA.map((b) => (
                <option key={b.codigo} value={b.codigo}>
                  {b.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Agência */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Agência (com dígito se houver) *
            </label>
            <input
              type="text"
              value={bankData.agencia}
              onChange={(e) => setBankData((prev) => ({ ...prev, agencia: e.target.value }))}
              placeholder="Ex: 0432 ou 0432-1"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition font-mono"
              required
            />
          </div>

          {/* Conta Corrente */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Conta Corrente (com dígito) *
            </label>
            <input
              type="text"
              value={bankData.contaCorrente}
              onChange={(e) => setBankData((prev) => ({ ...prev, contaCorrente: e.target.value }))}
              placeholder="Ex: 29871-4"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition font-mono"
              required
            />
          </div>

          {/* Tipo de Chave PIX */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Tipo de Chave PIX</label>
            <select
              value={tipoChavePix}
              onChange={(e: any) => setTipoChavePix(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="EMAIL">E-mail</option>
              <option value="CNPJ">CNPJ da Produtora</option>
              <option value="TELEFONE">Telefone Celular</option>
              <option value="EVP">Chave Aleatória (EVP)</option>
            </select>
          </div>

          {/* Chave PIX */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Chave PIX Cadastrada *
            </label>
            <div className="relative">
              <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={bankData.chavePix}
                onChange={(e) => setBankData((prev) => ({ ...prev, chavePix: e.target.value }))}
                placeholder="Informe a chave PIX correspondente"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 transition font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <div className="pt-4 border-t border-slate-700/60 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-900/40 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Gravando Alterações...' : 'Salvar Dados Bancários'}
          </button>
        </div>
      </form>
    </div>
  );
};
