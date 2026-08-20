import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { env } from "@/config/env";

const TOKEN_KEY = "access_token";
const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export const authToken = {
  get: async () => {
    if (Platform.OS === "web") {
      return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
    }
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  set: async (token: string) => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.setItem(TOKEN_KEY, token);
      return;
    }
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  clear: async () => {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem(TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

function parseErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object" || !("detail" in body)) {
    return "Request failed";
  }

  const detail = (body as { detail: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item: { msg?: string }) => item.msg ?? "")
      .filter(Boolean)
      .join(", ");
  }
  return "Request failed";
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await authToken.get();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        0,
        "The server is taking too long to respond. It may be waking up — try again in a moment.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 401) {
      await authToken.clear();
    }
    const body = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(response.status, parseErrorMessage(body));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown, options?: { auth?: boolean }) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      auth: options?.auth ?? true,
    }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
