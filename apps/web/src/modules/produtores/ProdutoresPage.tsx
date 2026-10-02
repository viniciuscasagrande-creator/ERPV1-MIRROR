import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import {
  Building2,
  Search,
  Plus,
  Percent,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatCurrencyBRL, formatCpfCnpj } from '@diskingressos/utils';

export const ProdutoresPage: React.FC = () => {
  const [producers, setProducers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducers = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/producers', { params: { search } });
      setProducers(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-disk-600" />
            <span>Produtores & Parceiros de Eventos</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Parâmetros contratuais, dados bancários homologados e controle financeiro por produtor.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-disk-600 hover:bg-disk-700 text-white font-semibold text-xs shadow-md shadow-rose-900/30 transition-all">
          <Plus className="w-4 h-4" />
          <span>Novo Produtor</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
          className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Lista em Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-sm">
            Carregando produtores cadastrados...
          </div>
        ) : producers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 text-sm">
            Nenhum produtor encontrado.
          </div>
        ) : (
          producers.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {p.nomeFantasia}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {formatCpfCnpj(p.cnpj)}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {p.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{p.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.telefone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {p.cidade}/{p.estado}
                  </span>
                </p>
              </div>

              {/* Parâmetros Contratuais */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Comissão Disk
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {p.taxaComissao}%
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    MDR Cartão
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{p.taxaMdr}%</p>
                </div>
              </div>

              {/* Volume Financeiro do Produtor */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400">Eventos Ativos</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {p.eventosAtivos} de {p.totalEventos}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400">Líquido a Repassar</span>
                  <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    {formatCurrencyBRL(p.totalLiquidoProdutor)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
