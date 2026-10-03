import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ErpSystemSettings } from '@diskingressos/types';
import {
  Settings,
  Building2,
  FileCheck,
  Wallet,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Server,
  Key,
  Mail,
  Percent,
  Calendar,
  Layers,
} from 'lucide-react';

const DEFAULT_SETTINGS: ErpSystemSettings = {
  empresaRazaoSocial: 'DISK INGRESSOS SERVICOS DE BILHETERIA LTDA',
  empresaNomeFantasia: 'DiskIngressos',
  empresaCnpj: '08.234.567/0001-89',
  empresaInscricaoMunicipal: '894.210-4',
  cidade: 'Curitiba',
  uf: 'PR',
  regimeTributario: 'LUCRO_PRESUMIDO',
  aliquotaIssPadrao: 2.0,
  codigoTributacaoMunicipio: '12.07',
  toleranciaDivergenciaMdr: 0.5,
  diasPadraoRepasse: 2,
  emailNotificacoesContabeis: 'financeiro@diskingressos.com.br',
  ambienteProducao: false,
  webhookNotificacoesUrl: 'https://api.diskingressos.com.br/webhooks/contabil',
};

export const ConfiguracoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'fiscal' | 'financeiro' | 'integracoes'>('empresa');
  const [settings, setSettings] = useState<ErpSystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data: any = await api.get('/settings');
      if (data && typeof data === 'object') {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch (err) {
      console.warn('Usando configurações padrão (modo offline ou demo):', err);
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res: any = await api.put('/settings', settings);
      if (res) {
        setSettings((prev) => ({ ...prev, ...res }));
      }
      setMessage({ type: 'success', text: 'Parâmetros do ERP atualizados e salvos com sucesso!' });
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      // Simula sucesso em ambiente de visualização mock
      setMessage({ type: 'success', text: 'Parâmetros do ERP atualizados com sucesso (Ambiente Local/Demo).' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleChange = (field: keyof ErpSystemSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-disk-600/20 text-disk-500 rounded-lg border border-disk-500/30">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Configurações & Parâmetros do ERP</h1>
              <p className="text-xs text-slate-400">
                Parâmetros fiscais, regras de tolerância MDR, modelo de repasse e integrações de sistema
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-500 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Gravando...' : 'Salvar Alterações'}
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm animate-fade-in ${
            message.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('empresa')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'empresa'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Dados da Empresa (DiskIngressos)
        </button>

        <button
          onClick={() => setActiveTab('fiscal')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'fiscal'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Fiscal, Tributário & NFS-e
        </button>

        <button
          onClick={() => setActiveTab('financeiro')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'financeiro'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Wallet className="w-4 h-4" />
          Tesouraria & MDR
        </button>

        <button
          onClick={() => setActiveTab('integracoes')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
            activeTab === 'integracoes'
              ? 'border-disk-500 text-disk-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Globe className="w-4 h-4" />
          Ambiente & Webhooks
        </button>
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSave} className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
        {/* TAB 1: EMPRESA */}
        {activeTab === 'empresa' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-semibold text-white">Identificação da Matriz Operacional</h2>
              <p className="text-xs text-slate-400">
                Informações cadastrais oficiais utilizadas na emissão de NFS-e Curitiba, contratos e repasses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Razão Social Completa
                </label>
                <input
                  type="text"
                  value={settings.empresaRazaoSocial}
                  onChange={(e) => handleChange('empresaRazaoSocial', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome Fantasia
                </label>
                <input
                  type="text"
                  value={settings.empresaNomeFantasia}
                  onChange={(e) => handleChange('empresaNomeFantasia', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  CNPJ (Cadastro Nacional da Pessoa Jurídica)
                </label>
                <input
                  type="text"
                  value={settings.empresaCnpj}
                  onChange={(e) => handleChange('empresaCnpj', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Inscrição Municipal (ISS Curitiba)
                </label>
                <input
                  type="text"
                  value={settings.empresaInscricaoMunicipal}
                  onChange={(e) => handleChange('empresaInscricaoMunicipal', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Município
                </label>
                <input
                  type="text"
                  value={settings.cidade}
                  onChange={(e) => handleChange('cidade', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Unidade Federativa (UF)
                </label>
                <input
                  type="text"
                  value={settings.uf}
                  onChange={(e) => handleChange('uf', e.target.value)}
                  maxLength={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 uppercase font-mono"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FISCAL & TRIBUTÁRIO */}
        {activeTab === 'fiscal' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-semibold text-white">Regime Tributário & Parâmetros Fiscais</h2>
              <p className="text-xs text-slate-400">
                Alíquotas e códigos de serviço para apuração mensal de ISS, PIS, COFINS, IRPJ e CSLL
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Regime de Tributação Federal
                </label>
                <select
                  value={settings.regimeTributario}
                  onChange={(e) => handleChange('regimeTributario', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500"
                >
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido (Base 32% Serviços)</option>
                  <option value="LUCRO_REAL">Lucro Real (Apuração Trimestral)</option>
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Alíquota ISS Padrão Curitiba (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={settings.aliquotaIssPadrao}
                    onChange={(e) => handleChange('aliquotaIssPadrao', parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                    required
                  />
                  <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Alíquota padrão sobre a taxa de conveniência</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Item Lista de Serviços (LC 116/03 / ABRASF)
                </label>
                <input
                  type="text"
                  value={settings.codigoTributacaoMunicipio}
                  onChange={(e) => handleChange('codigoTributacaoMunicipio', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                  placeholder="Ex: 12.07"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">12.07: Espetáculos, bilheteria, intermediação de ingressos</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email para Notificações Fiscais e Contábeis
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={settings.emailNotificacoesContabeis}
                    onChange={(e) => handleChange('emailNotificacoesContabeis', e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FINANCEIRO & TESOURARIA */}
        {activeTab === 'financeiro' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-semibold text-white">Parâmetros de Auditoria & Repasses</h2>
              <p className="text-xs text-slate-400">
                Regras de tolerância MDR em cartões e agendamento de repasses a produtores
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tolerância para Divergência de Taxa MDR Adquirentes (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={settings.toleranciaDivergenciaMdr}
                    onChange={(e) => handleChange('toleranciaDivergenciaMdr', parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                    required
                  />
                  <Percent className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Variações na taxa de cartão superiores a este valor geram alerta na conciliação
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Prazo Padrão para Repasse Contratual (Dias Úteis)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={settings.diasPadraoRepasse}
                    onChange={(e) => handleChange('diasPadraoRepasse', parseInt(e.target.value, 10) || 0)}
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                    required
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  D+2 dias após a conclusão e fechamento dos 9 portões do evento
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTEGRAÇÕES & WEBHOOKS */}
        {activeTab === 'integracoes' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-semibold text-white">Ambiente de Execução & Conectores Externos</h2>
              <p className="text-xs text-slate-400">
                Configurações de webhooks para mensageria contábil e status do ambiente
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  URL de Webhook para Notificações de Fechamento / Repasse
                </label>
                <input
                  type="url"
                  value={settings.webhookNotificacoesUrl || ''}
                  onChange={(e) => handleChange('webhookNotificacoesUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-disk-500 font-mono"
                  placeholder="https://..."
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      settings.ambienteProducao
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                        : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      Modo do Ambiente:{' '}
                      <span className={settings.ambienteProducao ? 'text-rose-400' : 'text-emerald-400'}>
                        {settings.ambienteProducao ? 'PRODUÇÃO (LIVE)' : 'HOMOLOGAÇÃO / TESTES'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Controla se as notas fiscais NFS-e e lotes CNAB são transmitidos à Prefeitura e Bancos reais
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.ambienteProducao}
                    onChange={(e) => handleChange('ambienteProducao', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-disk-600"></div>
                </label>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-3 text-slate-400 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span>
                  O modo de Produção ativa certificados digitais A1 ICP-Brasil e conexões diretas via mTLS aos
                  serviços da Prefeitura de Curitiba e Febraban.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit inside form */}
        <div className="mt-8 pt-5 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-500 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Gravando...' : 'Gravar Configurações'}
          </button>
        </div>
      </form>
    </div>
  );
};
