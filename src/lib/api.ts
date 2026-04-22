const BASE = (import.meta.env.VITE_API_URL || "https://fit-notion-backend-api.onrender.com/api").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("fitnotion_token");
}

export function setToken(t: string | null) {
  if (t) localStorage.setItem("fitnotion_token", t);
  else localStorage.removeItem("fitnotion_token");
}

export async function api<T = any>(
  path: string,
  opts: { method?: string; body?: any; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts.auth !== false) {
    const t = getToken();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data as T;
}

export const API_BASE = BASE;
