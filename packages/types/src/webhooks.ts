export interface WebhookSubscriptionDto {
  id: string;
  nome: string;
  url: string;
  secret: string;
  ativo: boolean;
  eventos: string[];
  ultimoDisparo?: string | null;
  ultimoStatus?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookDto {
  nome: string;
  url: string;
  eventos: string[];
  ativo?: boolean;
}

export interface WebhookDeliveryLogDto {
  id: string;
  subscriptionId: string;
  evento: string;
  payload: any;
  statusCode?: number | null;
  sucesso: boolean;
  resposta?: string | null;
  tentativas: number;
  createdAt: string;
}

export interface TriggerWebhookTestDto {
  subscriptionId: string;
  evento: string;
  customPayload?: any;
}
