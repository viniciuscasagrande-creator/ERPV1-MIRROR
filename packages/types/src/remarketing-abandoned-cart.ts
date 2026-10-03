export enum CartAbandonmentStage {
  SELECAO_ASSENTO = 'SELECAO_ASSENTO',
  IDENTIFICACAO = 'IDENTIFICACAO',
  PAGAMENTO_PENDENTE = 'PAGAMENTO_PENDENTE',
  RECUSADO_ANTIFRAUDE = 'RECUSADO_ANTIFRAUDE',
}

export enum RecoveryStatus {
  ABANDONADO_RECENTE = 'ABANDONADO_RECENTE',
  GATILHO_WHATSAPP_ENVIADO = 'GATILHO_WHATSAPP_ENVIADO',
  GATILHO_SMS_ENVIADO = 'GATILHO_SMS_ENVIADO',
  RECUPERADO = 'RECUPERADO',
  EXPIRADO = 'EXPIRADO',
}

export enum RfmClusterTier {
  CHAMPIONS = 'CHAMPIONS',
  LOYAL = 'LOYAL',
  AT_RISK = 'AT_RISK',
  ABOUT_TO_SLEEP = 'ABOUT_TO_SLEEP',
  HIBERNATING = 'HIBERNATING',
}

export enum RemarketingChannel {
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
}

export interface AbandonedCartRecoveryDto {
  id: string;
  checkoutSessionId: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
  eventoId: string;
  nomeEvento: string;
  setorLote: string;
  quantidadeIngressos: number;
  valorTotal: number;
  estagioAbandono: CartAbandonmentStage;
  statusRecuperacao: RecoveryStatus;
  dataAbandono: string;
  dataRecuperacao?: string;
  cupomIncentivo?: string;
  canalRecuperacao?: RemarketingChannel;
  urlRecuperacaoCheckout: string;
}

export interface RfmCustomerSegmentDto {
  id: string;
  clienteCpf: string;
  clienteNome: string;
  clienteEmail: string;
  recenciaDias: number;
  frequenciaEventos: number;
  valorMonetarioTotal: number; // LTV
  clusterRfm: RfmClusterTier;
  scoreRfmPontuacao: number;
  audienciaMetaCustomSync: boolean;
  audienciaGoogleMatchSync: boolean;
  ultimaAtualizacao: string;
}

export interface RemarketingTriggerAutomationDto {
  id: string;
  nomeRegra: string;
  gatilhoEvento: string;
  tempoEsperaMinutos: number;
  canalEnvio: string;
  templateMensagem: string;
  ativo: boolean;
  totalDisparos: number;
  totalConvertidos: number;
  taxaConversaoPercent: number;
}

export interface RemarketingMetricsDto {
  totalCarrinhosAbandonados: number;
  totalCarrinhosRecuperados: number;
  taxaRecuperacaoGlobalPercent: number;
  receitaRecuperadaBRL: number;
  carrinhosEmAberto: number;
  audienciasSincronizadas: number;
  disparosAutomacaoAtivos: number;
  ticketMedioRecuperadoBRL: number;
}
