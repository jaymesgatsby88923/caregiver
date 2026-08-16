import { api } from "./api";
import type { CurrentUser } from "@/types";

type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>(
      "/auth/login",
      { email, password },
      false,
    ),

  getCurrentUser: () => api.get<CurrentUser>("/auth/current-user"),
};
