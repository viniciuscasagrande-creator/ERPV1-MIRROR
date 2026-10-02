import { StatusOperacao } from './auth.js';

export interface ProducerSummary {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  status: StatusOperacao;
  createdAt: string;
  updatedAt: string;
}
