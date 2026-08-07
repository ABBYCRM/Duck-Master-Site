import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  useExchangeMobileAuthorizationCode,
  useLogoutMobileSession,
  useGetCurrentAuthUser,
  type AuthUser,
} from '@workspace/api-client-react';

// Allow expo-web-browser to auto-complete auth sessions
WebBrowser.maybeCompleteAuthSession();

const ISSUER_URL = 'https://replit.com/oidc';
const CLIENT_ID = process.env.EXPO_PUBLIC_REPL_ID ?? '';
const AUTH_TOKEN_KEY = '@gdy/auth_token';

// Module-level token ref — registered once via setAuthTokenGetter
const _tokenRef: { current: string | null } = { current: null };

/** Called by setAuthTokenGetter in _layout.tsx to supply the bearer token */
export function getStoredAuthToken(): string | null {
  return _tokenRef.current;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isSigningIn: false,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const exchangeMutation = useExchangeMobileAuthorizationCode();
  const logoutMutation = useLogoutMobileSession();

  // OIDC discovery
  const discovery = AuthSession.useAutoDiscovery(ISSUER_URL);

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'gdy-mobile',
    path: 'auth',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['openid', 'email', 'profile', 'offline_access'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      prompt: AuthSession.Prompt.Login,
    },
    discovery
  );

  // Current user query — only enabled when we have a token
  const { data: authData, refetch: refetchUser } = useGetCurrentAuthUser({
    query: { enabled: !!token, retry: false, queryKey: [] },
  });

  const user = authData?.user ?? null;

  // Persist token changes to the module ref and AsyncStorage
  const applyToken = useCallback(async (t: string | null) => {
    _tokenRef.current = t;
    setToken(t);
    if (t) {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, t);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, []);

  // Load stored token on mount
  useEffect(() => {
    AsyncStorage.getItem(AUTH_TOKEN_KEY)
      .then((stored) => {
        if (stored) {
          _tokenRef.current = stored;
          setToken(stored);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Handle auth response from expo-auth-session
  useEffect(() => {
    if (response?.type === 'success' && request?.codeVerifier) {
      const { code, state } = response.params;
      setIsSigningIn(true);
      exchangeMutation
        .mutateAsync({
          data: {
            code,
            code_verifier: request.codeVerifier,
            redirect_uri: redirectUri,
            state: state ?? request.state ?? '',
          },
        })
        .then(async (result) => {
          await applyToken(result.token);
          await refetchUser();
        })
        .catch((err) => {
          console.warn('[AuthContext] Token exchange failed', err);
        })
        .finally(() => setIsSigningIn(false));
    } else if (response?.type === 'error') {
      console.warn('[AuthContext] Auth request error', response.error);
      setIsSigningIn(false);
    } else if (response?.type === 'cancel') {
      setIsSigningIn(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const login = useCallback(async () => {
    if (!request) return;
    setIsSigningIn(true);
    try {
      await promptAsync();
    } catch {
      setIsSigningIn(false);
    }
  }, [request, promptAsync]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // Ignore — still clear local state
    }
    await applyToken(null);
  }, [logoutMutation, applyToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        isSigningIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
