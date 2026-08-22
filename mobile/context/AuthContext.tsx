import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "expo-router";
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
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    let token = await authToken.get();
    if (!token) {
      const refreshed = await tryRefreshSession();
      token = refreshed ? await authToken.get() : null;
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
        await authToken.clear();
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
      router.replace("/login");
    });
    return () => setOnSessionInvalid(null);
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token, refresh_token } = await authService.login(
      email,
      password,
    );
    await authToken.set(access_token, refresh_token);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = await authToken.getRefresh();
    const accessToken = await authToken.get();
    if (refreshToken) {
      try {
        await authService.logout(refreshToken, accessToken);
      } catch {
        // Local logout still happens if revoke fails.
      }
    }
    await authToken.clear();
    setUser(null);
    router.replace("/login");
  }, [router]);

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
