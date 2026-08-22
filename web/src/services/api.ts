import { env } from "@/config/env";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

// Render's free tier can sleep. Wait long enough for it to wake instead of failing fast.
const REQUEST_TIMEOUT_MS = 60_000;
const TRANSIENT_RETRIES = 2;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

// All token reads/writes go through here so pages never touch localStorage directly.
export const authToken = {
  get: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

let onSessionInvalid: (() => void) | null = null;

export function setOnSessionInvalid(handler: (() => void) | null) {
  onSessionInvalid = handler;
}

function invalidateSession() {
  authToken.clear();
  onSessionInvalid?.();
}

let refreshInFlight: Promise<boolean> | null = null;

export async function tryRefreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = authToken.getRefresh();
    if (!refreshToken) return false;

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      let response: Response;
      try {
        response = await fetch(`${env.apiUrl}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }

      if (!response.ok) return false;
      const data = (await response.json()) as TokenPair;
      if (!data.access_token || !data.refresh_token) return false;
      authToken.set(data.access_token, data.refresh_token);
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
  _transientAttempts?: number;
  _didRefresh?: boolean;
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

function timeoutMessage() {
  return "The server is taking too long to respond. It may be waking up — try again in a moment.";
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const {
    auth = true,
    _transientAttempts = 0,
    _didRefresh = false,
    ...fetchOptions
  } = options;

  const retryTransient = () =>
    request<T>(endpoint, {
      ...options,
      auth,
      _transientAttempts: _transientAttempts + 1,
      _didRefresh,
    });

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
    if (_transientAttempts < TRANSIENT_RETRIES) {
      return retryTransient();
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(0, timeoutMessage());
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (response.status === 503 && _transientAttempts < TRANSIENT_RETRIES) {
    return retryTransient();
  }

  if (response.status === 401 && auth && !_didRefresh) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return request<T>(endpoint, {
        ...options,
        auth,
        _didRefresh: true,
        _transientAttempts: 0,
      });
    }
    invalidateSession();
  }

  if (!response.ok) {
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
