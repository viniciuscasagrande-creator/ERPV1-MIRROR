export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  DIRETORIA = 'DIRETORIA',
  FINANCEIRO = 'FINANCEIRO',
  CONTABILIDADE = 'CONTABILIDADE',
  OPERACIONAL = 'OPERACIONAL',
  PRODUTOR = 'PRODUTOR',
}

export enum StatusOperacao {
  ATIVO = 'ATIVO',
  BLOQUEADO = 'BLOQUEADO',
  INATIVO = 'INATIVO',
}

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  nome: string;
  roles: PerfilUsuario[];
  producerId?: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthUserResponse {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  telefone?: string | null;
  roles: PerfilUsuario[];
  producerId?: string | null;
  producerName?: string | null;
}

export interface LoginResponse {
  user: AuthUserResponse;
  tokens: AuthTokens;
}
