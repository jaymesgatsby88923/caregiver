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
};
