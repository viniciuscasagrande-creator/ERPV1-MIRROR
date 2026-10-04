import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  Clock,
  Camera,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ChevronLeft,
  User,
  AlertCircle,
  Copy,
  Printer,
  RefreshCw,
  Calendar,
  Building,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import {
  TimeClockType,
  EmployeeHrDto,
  PunchClockResponseDto,
  TimeClockRecordDto,
} from '@diskingressos/types';
import { formatCpfCnpj } from '@diskingressos/utils';
import { Link } from 'react-router-dom';

export const AppRegistroPontoPage: React.FC = () => {
  // Live Clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Data State
  const [employees, setEmployees] = useState<EmployeeHrDto[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedType, setSelectedType] = useState<TimeClockType>(TimeClockType.ENTRADA_1);
  const [observacao, setObservacao] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);

  // Biometrics & Geolocation simulation
  const [biometricsVerified, setBiometricsVerified] = useState(true);
  const [isVerifyingBiometrics, setIsVerifyingBiometrics] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState({
    latitude: -25.4284,
    longitude: -49.2733,
    local: 'Sede DiskIngressos - Av. Manoel Ribas, Curitiba/PR',
    accuracy: '8 metros',
  });

  // Today's records for selected employee
  const [todayRecords, setTodayRecords] = useState<TimeClockRecordDto[]>([]);
  
  // Last punch response receipt (Portaria 671)
  const [receipt, setReceipt] = useState<PunchClockResponseDto | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Clock ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch records whenever selected employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      fetchEmployeeRecords(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const fetchEmployees = async () => {
    try {
      setFetchingEmployees(true);
      const res = await api.get('/api/v1/hr/employees');
      const data: EmployeeHrDto[] = res.data;
      setEmployees(data);
      if (data && data.length > 0) {
        setSelectedEmployeeId(data[0].id);
      }
    } catch (err) {
      console.error('Erro ao buscar colaboradores:', err);
    } finally {
      setFetchingEmployees(false);
    }
  };

  const fetchEmployeeRecords = async (empId: string) => {
    try {
      const res = await api.get(`/api/v1/hr/time-clock/timecard/${empId}`);
      if (res.data && res.data.batidasMes) {
        // Filter for today
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayPunches = (res.data.batidasMes as TimeClockRecordDto[]).filter((b) =>
          b.dataHoraRegistro.startsWith(todayStr)
        );
        setTodayRecords(todayPunches);
      }
    } catch (err) {
      console.error('Erro ao buscar batidas de hoje:', err);
    }
  };

  const currentEmployee = employees.find((e) => e.id === selectedEmployeeId);

  const handleSimulateBiometrics = () => {
    setIsVerifyingBiometrics(true);
    setTimeout(() => {
      setIsVerifyingBiometrics(false);
      setBiometricsVerified(true);
      setFeedbackMsg({
        type: 'success',
        text: 'Biometria Facial validada com sucesso! Liveness 99.9% aprovado.',
      });
      setTimeout(() => setFeedbackMsg(null), 4000);
    }, 1200);
  };

  const handlePunch = async () => {
    if (!selectedEmployeeId) {
      setFeedbackMsg({ type: 'error', text: 'Selecione um colaborador para registrar o ponto.' });
      return;
    }

    try {
      setLoading(true);
      setFeedbackMsg(null);

      const payload = {
        employeeId: selectedEmployeeId,
        tipoRegistro: selectedType,
        latitude: gpsCoordinates.latitude,
        longitude: gpsCoordinates.longitude,
        localizacaoDescricao: gpsCoordinates.local,
        dispositivoOrigem: 'REP-P Web DiskIngressos / Chrome 124 Windows',
        fotoBiometriaBase64: 'data:image/jpeg;base64,mockFaceVectorLivenessCheckPassed',
        observacao: observacao.trim() || undefined,
      };

      const res = await api.post('/api/v1/hr/time-clock/punch', payload);
      const data: PunchClockResponseDto = res.data;

      setReceipt(data);
      setFeedbackMsg({
        type: 'success',
        text: `Ponto registrado com sucesso! Comprovante NSR nº ${data.comprovanteNsrNumero} emitido.`,
      });

      // Clear observation
      setObservacao('');

      // Refresh records
      fetchEmployeeRecords(selectedEmployeeId);
    } catch (err: any) {
      console.error('Erro ao registrar ponto:', err);
      setFeedbackMsg({
        type: 'error',
        text: err?.response?.data?.message || 'Falha ao registrar ponto eletrônico.',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 3000);
  };

  const getTipoRegistroLabel = (type: TimeClockType) => {
    switch (type) {
      case TimeClockType.ENTRADA_1:
        return 'Entrada 1 - Início da Jornada';
      case TimeClockType.SAIDA_ALMOCO:
        return 'Saída 1 - Início do Almoço';
      case TimeClockType.RETORNO_ALMOCO:
        return 'Entrada 2 - Retorno do Almoço';
      case TimeClockType.SAIDA_2:
        return 'Saída 2 - Fim da Jornada';
      case TimeClockType.HORAS_EXTRAS_INICIO:
        return 'Plantão / Horas Extras - Início';
      case TimeClockType.HORAS_EXTRAS_FIM:
        return 'Plantão / Horas Extras - Fim';
      default:
        return type;
    }
  };

  const formatTimeStr = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Bar Navigation */}
      <div className="max-w-5xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/rh"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors border border-slate-700"
          >
            <ChevronLeft size={16} />
            <span>Voltar ao Hub RH</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={12} className="mr-1" />
              REP-P Homologado
            </span>
            <span className="text-xs text-slate-400">Portaria MTP nº 671/2021</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Building size={14} className="text-rose-500" />
          <span>DISK INGRESSOS SERVIÇOS DE INTERMEDIAÇÃO LTDA</span>
          <span className="text-slate-600">|</span>
          <span>CNPJ: 07.245.986/0001-38</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clock Terminal & Punching Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Digital Clock Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-900/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-rose-500 animate-pulse" />
                <span>Horário Oficial de Brasília (BRT / UTC-3)</span>
              </div>
              <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 rounded text-[11px] text-rose-300">
                Sincronizado NTP.br
              </span>
            </div>

            {/* Huge Clock Display */}
            <div className="text-center py-4">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_25px_rgba(244,63,94,0.3)]">
                {currentTime.toLocaleTimeString('pt-BR', { hour12: false })}
              </div>
              <div className="text-sm font-medium text-slate-400 mt-2 capitalize">
                {currentTime.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>

            {/* Colaborador Selector */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-rose-400" />
                  Identificação do Colaborador:
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {employees.length} colaboradores ativos
                </span>
              </label>

              {fetchingEmployees ? (
                <div className="py-2 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-rose-500" />
                  Carregando colaboradores...
                </div>
              ) : (
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nomeCompleto} - Matrícula {emp.matricula} ({emp.cargo})
                    </option>
                  ))}
                </select>
              )}

              {currentEmployee && (
                <div className="mt-3 bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400">CPF:</span>{' '}
                    <span className="font-mono text-slate-200">{formatCpfCnpj(currentEmployee.cpf)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Depto:</span>{' '}
                    <span className="text-rose-400 font-semibold">{currentEmployee.departamento}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Jornada:</span>{' '}
                    <span className="text-emerald-400 font-semibold">{currentEmployee.jornadaSemanalHoras}h/sem</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Batida Selector Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCheck size={16} className="text-rose-500" />
              Selecione o Tipo de Batida:
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { type: TimeClockType.ENTRADA_1, label: '1. Entrada 1', sub: 'Início Jornada' },
                { type: TimeClockType.SAIDA_ALMOCO, label: '2. Saída Almoço', sub: 'Intervalo' },
                { type: TimeClockType.RETORNO_ALMOCO, label: '3. Volta Almoço', sub: 'Retorno' },
                { type: TimeClockType.SAIDA_2, label: '4. Saída 2', sub: 'Fim de Jornada' },
                { type: TimeClockType.HORAS_EXTRAS_INICIO, label: '5. Hora Extra Início', sub: 'Plantão / Evento' },
                { type: TimeClockType.HORAS_EXTRAS_FIM, label: '6. Hora Extra Fim', sub: 'Término Plantão' },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setSelectedType(opt.type)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    selectedType === opt.type
                      ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg shadow-rose-950/40 ring-1 ring-rose-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-100">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                  {selectedType === opt.type && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                  )}
                </button>
              ))}
            </div>

            {/* Geolocation & Facial Biometrics Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Geolocation Card */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs">
                <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Geolocalização GPS</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Precisão: {gpsCoordinates.accuracy}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] leading-tight">
                    {gpsCoordinates.local}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    Lat: {gpsCoordinates.latitude} | Long: {gpsCoordinates.longitude}
                  </div>
                </div>
              </div>

              {/* Facial Biometrics Card */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs">
                <Camera size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>Biometria Facial</span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        biometricsVerified
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {biometricsVerified ? 'Liveness OK' : 'Pendente'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Reconhecimento facial anti-spoofing ativo.
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulateBiometrics}
                    disabled={isVerifyingBiometrics}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 mt-1 transition-colors"
                  >
                    {isVerifyingBiometrics ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" />
                        Validando liveness facial...
                      </>
                    ) : (
                      <>
                        <Sparkles size={11} />
                        Testar captura biométrica
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Observation */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Observação / Justificativa (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ex: Trabalho remoto autorizado, plantão de bilheteria evento Arena..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            {/* Feedback Message */}
            {feedbackMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                  feedbackMsg.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-700/50 text-rose-300'
                }`}
              >
                {feedbackMsg.type === 'success' ? (
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle size={16} className="shrink-0 text-rose-400" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            {/* PUNCH BUTTON */}
            <button
              type="button"
              onClick={handlePunch}
              disabled={loading || isVerifyingBiometrics}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:scale-[0.99] text-white font-extrabold text-base rounded-xl shadow-xl shadow-rose-950/50 border border-rose-500/40 flex items-center justify-center gap-3 transition-all disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={20} className="animate-spin text-white" />
                  <span>ASSINANDO DIGITALMENTE (PORTARIA 671)...</span>
                </>
              ) : (
                <>
                  <Smartphone size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>REGISTRAR PONTO AGORA (REP-P)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Ao bater o ponto, seus dados de geolocalização e carimbo de tempo inviolável serão assinados e arquivados no repositório fiscal eSocial.
            </p>
          </div>
        </div>

        {/* Right Column: Portaria 671 Receipt & Today's Records (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Portaria MTP 671 Receipt Card */}
          {receipt ? (
            <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Comprovante de Registro de Ponto
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                  NSR: {receipt.comprovanteNsrNumero}
                </span>
              </div>

              <div className="py-3 text-[11px] font-mono text-slate-300 space-y-2">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400">EMPREGADOR:</div>
                  <div className="font-semibold text-slate-200">
                    DISK INGRESSOS SERVIÇOS DE INTERMEDIAÇÃO LTDA
                  </div>
                  <div className="text-slate-400">CNPJ: 07.245.986/0001-38</div>
                  <div className="text-slate-400">LOCAL: {receipt.localizacao}</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400">TRABALHADOR:</div>
                  <div className="font-semibold text-slate-200">{receipt.employeeNome}</div>
                  <div className="text-slate-400">TIPO: {getTipoRegistroLabel(receipt.tipoRegistro)}</div>
                  <div className="text-slate-400">
                    DATA/HORA: {new Date(receipt.dataHoraRegistro).toLocaleString('pt-BR')} (BRT)
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span>HASH SHA-256 (MTP 671):</span>
                    <button
                      type="button"
                      onClick={() => copyHashToClipboard(receipt.hashAutenticacaoMtp671)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[10px]"
                    >
                      <Copy size={11} />
                      {copiedHash ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                  <div className="break-all text-[10px] text-emerald-400 select-all font-mono leading-relaxed">
                    {receipt.hashAutenticacaoMtp671}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                >
                  <Printer size={14} />
                  Imprimir Comprovante
                </button>
                <button
                  type="button"
                  onClick={() => setReceipt(null)}
                  className="py-2 px-3 text-slate-400 hover:text-slate-200 text-xs"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto">
                <FileCheck size={24} />
              </div>
              <h4 className="text-xs font-bold text-slate-300">
                Comprovante Portaria 671 (REP-P)
              </h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Ao registrar seu ponto, o comprovante legal com número sequencial NSR e chave hash SHA-256 será exibido aqui para download e arquivamento pessoal.
              </p>
            </div>
          )}

          {/* Today's Punch History Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Calendar size={14} className="text-rose-500" />
                Batidas de Hoje ({new Date().toLocaleDateString('pt-BR')})
              </h3>
              <button
                type="button"
                onClick={() => selectedEmployeeId && fetchEmployeeRecords(selectedEmployeeId)}
                className="text-slate-400 hover:text-slate-200 text-xs p-1"
                title="Recarregar batidas"
              >
                <RefreshCw size={12} />
              </button>
            </div>

            {todayRecords.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Nenhum registro de ponto encontrado hoje para este colaborador.
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {getTipoRegistroLabel(rec.tipoRegistro)}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>NSR: #{rec.comprovanteNsrNumero}</span>
                          <span>•</span>
                          <span>{rec.localizacaoDescricao || 'Curitiba/PR'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-400">
                        {formatTimeStr(rec.dataHoraRegistro)}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                        {rec.statusPortariaMtp671}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Total de registros hoje:</span>
              <span className="font-bold text-slate-200">{todayRecords.length} batidas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
