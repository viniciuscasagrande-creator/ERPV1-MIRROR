import { create } from 'zustand';
import { AuthUserResponse, AuthTokens, PerfilUsuario } from '@diskingressos/types';

interface AuthState {
  user: AuthUserResponse | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUserResponse, tokens: AuthTokens) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  hasRole: (role: PerfilUsuario) => boolean;
  hasAnyRole: (roles: PerfilUsuario[]) => boolean;
}

const STORAGE_KEY = 'diskingressos_auth';

function loadInitialState(): { user: AuthUserResponse | null; tokens: AuthTokens | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Falha ao restaurar autenticação:', e);
  }
  return { user: null, tokens: null };
}

const initial = loadInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initial.user,
  tokens: initial.tokens,
  isAuthenticated: !!initial.tokens?.accessToken,
  isLoading: false,

  setAuth: (user, tokens) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, tokens }));
    set({ user, tokens, isAuthenticated: true, isLoading: false });
  },

  setTokens: (tokens) => {
    const current = get();
    if (current.user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: current.user, tokens }),
      );
    }
    set({ tokens });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
  },

  hasRole: (role) => {
    const user = get().user;
    if (!user || !user.roles) return false;
    if (user.roles.includes(PerfilUsuario.ADMIN)) return true;
    return user.roles.includes(role);
  },

  hasAnyRole: (roles) => {
    const user = get().user;
    if (!user || !user.roles) return false;
    if (user.roles.includes(PerfilUsuario.ADMIN)) return true;
    return roles.some((r) => user.roles.includes(r));
  },
}));
