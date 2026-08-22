import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  authToken,
  setOnSessionInvalid,
  tryRefreshSession,
} from "@/services/api";
import { authService } from "@/services/authService";
import type { CurrentUser } from "@/types";

type AuthContextValue = {
  user: CurrentUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    let token = authToken.get();
    if (!token) {
      const refreshed = await tryRefreshSession();
      token = refreshed ? authToken.get() : null;
    }
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        authToken.clear();
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    setOnSessionInvalid(() => {
      setUser(null);
    });
    return () => setOnSessionInvalid(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token, refresh_token } = await authService.login(
      email,
      password,
    );
    authToken.set(access_token, refresh_token);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = authToken.getRefresh();
    const accessToken = authToken.get();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken, accessToken);
      } catch {
        // Local logout still happens if revoke fails.
      }
    }
    authToken.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
