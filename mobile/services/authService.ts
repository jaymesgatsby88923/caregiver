import { api } from "./api";
import type { CurrentUser } from "@/types";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }, { auth: false }),

  getCurrentUser: () => api.get<CurrentUser>("/auth/current-user"),

  logout: (refreshToken: string, accessToken: string | null) =>
    api.post<{ ok: boolean }>(
      "/auth/logout",
      { refresh_token: refreshToken, access_token: accessToken },
      { auth: false },
    ),

  forgotPassword: (email: string) =>
    api.post<{ ok: boolean }>("/auth/forgot-password", { email }, { auth: false }),
};
