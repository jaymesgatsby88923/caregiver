import { api } from "./api";
import type { CurrentUser } from "@/types";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

// Auth endpoints. Login skips the Bearer header because the user has no token yet.
export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>(
      "/auth/login",
      { email, password },
      { auth: false },
    ),

  getCurrentUser: () => api.get<CurrentUser>("/auth/current-user"),

  logout: (refreshToken: string, accessToken: string | null) =>
    api.post<{ ok: boolean }>(
      "/auth/logout",
      { refresh_token: refreshToken, access_token: accessToken },
      { auth: false },
    ),

  forgotPassword: (email: string) =>
    api.post<{ ok: boolean }>("/auth/forgot-password", { email }, { auth: false }),

  resetPassword: (body: {
    password: string;
    access_token?: string | null;
    refresh_token?: string | null;
    code?: string | null;
  }) =>
    api.post<{ ok: boolean }>(
      "/auth/reset-password",
      {
        password: body.password,
        ...(body.code ? { code: body.code } : {}),
        ...(body.access_token && body.refresh_token
          ? {
              access_token: body.access_token,
              refresh_token: body.refresh_token,
            }
          : {}),
      },
      { auth: false },
    ),
};
