import { env } from "@/config/env";

const TOKEN_KEY = "access_token";

// Render's free tier can sleep. Wait long enough for it to wake instead of failing fast.
const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// All token reads/writes go through here so pages never touch localStorage directly.
export const authToken = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
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
    return detail.map((item: { msg?: string }) => item.msg ?? "").filter(Boolean).join(", ");
  }
  return "Request failed";
}

// Shared fetch wrapper. Domain services call this; they never call fetch themselves.
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = authToken.get();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(
        0,
        "The server is taking too long to respond. It may be waking up — try again in a moment.",
      );
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    // Expired / missing token: drop it so the next visit goes back to login.
    if (response.status === 401) {
      authToken.clear();
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
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
