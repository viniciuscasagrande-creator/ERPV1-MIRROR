import { PerfilUsuario, StatusOperacao } from './auth.js';

export interface UserSummary {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  telefone?: string | null;
  ativo: boolean;
  status: StatusOperacao;
  producerId?: string | null;
  producerName?: string | null;
  roles: PerfilUsuario[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleDefinition {
  id: string;
  nome: PerfilUsuario;
  descricao: string;
  permissions?: PermissionDefinition[];
}

export interface PermissionDefinition {
  id: string;
  recurso: string;
  acao: string;
  descricao: string;
}
