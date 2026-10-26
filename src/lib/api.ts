import type {
  Paginated,
  SignupPayload,
  TokenResponse,
  Tokens,
  User,
} from "./types";

const BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1`;
const STORAGE_KEY = "mukando_tokens";

function loadTokens(): Tokens | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
  } catch {
    return null;
  }
}

let tokens: Tokens | null = loadTokens();
let onAuthLost: () => void = () => {};
let refreshing: Promise<void> | null = null;

export function setAuthLostHandler(fn: () => void) {
  onAuthLost = fn;
}

export function hasTokens() {
  return Boolean(tokens && tokens.access);
}

export function setTokens(value: Tokens | null) {
  tokens = value;
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ErrorBody {
  detail?: string | { loc?: (string | number)[]; msg: string }[];
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  form?: Record<string, string>;
  auth?: boolean;
}

function errorMessage(body: ErrorBody | null, status: number): string {
  const detail = body && body.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => `${(e.loc || []).slice(1).join(".")}: ${e.msg}`)
      .join("; ");
  }
  return `Request failed (${status})`;
}

async function parse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshTokens(): Promise<void> {
  if (!tokens || !tokens.refresh) throw new ApiError(401, "Session expired");
  if (!refreshing) {
    refreshing = fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refresh }),
    })
      .then(async (r) => {
        if (!r.ok) throw new ApiError(401, "Session expired");
        const data: TokenResponse = await r.json();
        setTokens({ access: data.access_token, refresh: data.refresh_token });
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

async function request<T>(
  path: string,
  { method = "GET", body, form, auth = true }: RequestOptions = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {};
  let payload: string | undefined;
  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form).toString();
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  if (auth && tokens && tokens.access)
    headers.Authorization = `Bearer ${tokens.access}`;

  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: payload,
    });
  } catch {
    throw new ApiError(
      0,
      "Cannot reach the server. Check that the API is running and CORS allows this origin.",
    );
  }

  if (response.status === 401 && auth && retry && tokens && tokens.refresh) {
    try {
      await refreshTokens();
    } catch {
      setTokens(null);
      onAuthLost();
      throw new ApiError(401, "Session expired. Please sign in again.");
    }
    return request<T>(path, { method, body, form, auth }, false);
  }

  const data = await parse(response);
  if (!response.ok)
    throw new ApiError(
      response.status,
      errorMessage(data as ErrorBody | null, response.status),
    );
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  async login(email: string, password: string) {
    const data = await request<TokenResponse>("/auth/login", {
      method: "POST",
      form: { username: email, password },
      auth: false,
    });
    setTokens({ access: data.access_token, refresh: data.refresh_token });
  },
  async signup(payload: SignupPayload) {
    const data = await request<{ tokens: TokenResponse; user: User }>(
      "/auth/signup",
      { method: "POST", body: payload, auth: false },
    );
    setTokens({
      access: data.tokens.access_token,
      refresh: data.tokens.refresh_token,
    });
    return data.user;
  },
  async logout() {
    const current = tokens;
    setTokens(null);
    if (current && current.refresh) {
      try {
        await fetch(`${BASE}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${current.access}`,
          },
          body: JSON.stringify({ refresh_token: current.refresh }),
        });
      } catch {
        return;
      }
    }
  },
  forgot: (email: string) =>
    request<unknown>("/auth/forgot-password", {
      method: "POST",
      body: { email },
      auth: false,
    }),
  reset: (token: string, new_password: string) =>
    request<unknown>("/auth/reset-password", {
      method: "POST",
      body: { token, new_password },
      auth: false,
    }),
};

export async function fetchAll<T>(path: string, size = 100): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  for (;;) {
    const data = await api.get<Paginated<T>>(
      `${path}?page=${page}&size=${size}`,
    );
    items.push(...data.items);
    if (page >= data.pages) return items;
    page += 1;
  }
}
