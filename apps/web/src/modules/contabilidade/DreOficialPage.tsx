import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { DreStatement } from '@diskingressos/types';
import { formatCurrencyBRL } from '@diskingressos/utils';
import {
  LineChart,
  RefreshCw,
  TrendingUp,
  Percent,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  PieChart,
} from 'lucide-react';

export const DreOficialPage: React.FC = () => {
  const [dre, setDre] = useState<DreStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState(2026);

  const fetchDre = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/contabilidade/dre', {
        params: { ano },
      });
      setDre(res || null);
    } catch (err) {
      console.error('Falha ao carregar DRE:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDre();
  }, [ano]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LineChart className="w-7 h-7 text-indigo-600" />
            DRE Oficial DiskIngressos
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Demonstração do Resultado do Exercício corporativo auditado e apurado em regime de competência
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={ano}
            onChange={(e) => setAno(parseInt(e.target.value, 10))}
            className="px-3 py-2 text-sm font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          >
            <option value={2026}>Exercício 2026</option>
            <option value={2025}>Exercício 2025</option>
          </select>
          <button
            onClick={fetchDre}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {dre && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Receita Líquida</span>
              <DollarSign className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrencyBRL(dre.receitaLiquida)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Comissões e Taxas de Conveniência
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Lucro Bruto</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrencyBRL(dre.lucroBruto)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Após custos de adquirência MDR
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Lucro Líquido Contábil</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrencyBRL(dre.lucroLiquidoPeriodo)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Resultado final da DiskIngressos
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
              <span>Margem Líquida</span>
              <Percent className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {dre.margemLiquidaPercent.toFixed(1)}%
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Rentabilidade líquida sobre receita
            </div>
          </div>
        </div>
      )}

      {/* Cascata DRE Estruturada */}
      {dre && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Demonstrativo Consolidado em Cascata
            </h2>
            <span className="text-xs text-slate-400">Valores em Reais (BRL)</span>
          </div>

          <div className="space-y-3 font-mono text-sm">
            {/* 1. Receita Bruta */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  (+) RECEITA OPERACIONAL BRUTA
                </p>
                <p className="text-xs text-slate-400 font-sans">
                  Comissões de Bilheteria (10%) + Taxas de Serviço e Conveniência
                </p>
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {formatCurrencyBRL(dre.receitaBruta)}
              </span>
            </div>

            {/* 2. Deduções */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
              <div>
                <p className="font-semibold">(-) Deduções e Estornos de Ingressos Cancelados</p>
                <p className="text-[11px] text-slate-400 font-sans">Reversões proporcionais de taxa</p>
              </div>
              <span>-{formatCurrencyBRL(dre.deducoes)}</span>
            </div>

            {/* Subtotal: Receita Líquida */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 font-bold">
              <span className="text-indigo-900 dark:text-indigo-300">
                (=) RECEITA OPERACIONAL LÍQUIDA
              </span>
              <span className="text-indigo-900 dark:text-indigo-300 text-base">
                {formatCurrencyBRL(dre.receitaLiquida)}
              </span>
            </div>

            {/* 3. Custos MDR */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
              <div>
                <p className="font-semibold">(-) Custos de Adquirência e MDR de Cartões</p>
                <p className="text-[11px] text-slate-400 font-sans">Taxas Cielo, Stone, Rede sobre transações</p>
              </div>
              <span>-{formatCurrencyBRL(dre.custosAdquirenciaMdr)}</span>
            </div>

            {/* Subtotal: Lucro Bruto */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 font-bold">
              <span className="text-blue-900 dark:text-blue-300">
                (=) LUCRO BRUTO CONTÁBIL
              </span>
              <span className="text-blue-900 dark:text-blue-300 text-base">
                {formatCurrencyBRL(dre.lucroBruto)}
              </span>
            </div>

            {/* 4. Despesas Operacionais */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
              <div>
                <p className="font-semibold">(-) Despesas Operacionais e Administrativas</p>
                <p className="text-[11px] text-slate-400 font-sans">Infraestrutura AWS, servidores, suporte e folha</p>
              </div>
              <span>-{formatCurrencyBRL(dre.despesasOperacionais)}</span>
            </div>

            {/* 5. Despesas Tributárias */}
            <div className="flex items-center justify-between px-3 py-2 text-xs text-rose-600 dark:text-rose-400">
              <div>
                <p className="font-semibold">(-) Despesas Tributárias e Municipais</p>
                <p className="text-[11px] text-slate-400 font-sans">ISSQN Prefeitura de Curitiba e tributos sobre faturamento</p>
              </div>
              <span>-{formatCurrencyBRL(dre.despesasTributarias)}</span>
            </div>

            {/* Resultado Final: Lucro Líquido */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-500 font-bold text-lg">
              <div>
                <span className="text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  (=) LUCRO LÍQUIDO DO EXERCÍCIO
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-sans font-normal ml-8">
                  Margem Líquida Oficial: {dre.margemLiquidaPercent.toFixed(1)}% sobre o faturamento
                </span>
              </div>
              <span className="text-emerald-900 dark:text-emerald-300 text-xl font-extrabold">
                {formatCurrencyBRL(dre.lucroLiquidoPeriodo)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
