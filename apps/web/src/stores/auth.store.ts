import { create } from 'zustand';
import { AuthUserResponse, AuthTokens, PerfilUsuario } from '@diskingressos/types';

interface AuthState {
  user: AuthUserResponse | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  setAuth: (user: AuthUserResponse, tokens: AuthTokens, isDemoMode?: boolean) => void;
  setTokens: (tokens: AuthTokens) => void;
  logout: () => void;
  hasRole: (role: PerfilUsuario) => boolean;
  hasAnyRole: (roles: PerfilUsuario[]) => boolean;
}

const STORAGE_KEY = 'diskingressos_auth';

function loadInitialState(): {
  user: AuthUserResponse | null;
  tokens: AuthTokens | null;
  isDemoMode: boolean;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const isDemo =
        !!parsed.isDemoMode ||
        parsed.tokens?.accessToken?.startsWith('demo_mock_') ||
        false;
      return { user: parsed.user, tokens: parsed.tokens, isDemoMode: isDemo };
    }
  } catch (e) {
    console.error('Falha ao restaurar autenticação:', e);
  }
  return { user: null, tokens: null, isDemoMode: false };
}

const initial = loadInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initial.user,
  tokens: initial.tokens,
  isAuthenticated: !!initial.tokens?.accessToken,
  isLoading: false,
  isDemoMode: initial.isDemoMode,

  setAuth: (user, tokens, isDemoMode = false) => {
    const demo =
      isDemoMode ||
      tokens.accessToken?.startsWith('demo_mock_') ||
      false;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user, tokens, isDemoMode: demo }),
    );
    set({ user, tokens, isAuthenticated: true, isLoading: false, isDemoMode: demo });
  },

  setTokens: (tokens) => {
    const current = get();
    if (current.user) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: current.user, tokens, isDemoMode: current.isDemoMode }),
      );
    }
    set({ tokens });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      isDemoMode: false,
    });
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
