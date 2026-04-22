const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://fit-notion-backend-api.onrender.com/api";

// Ensure no trailing slash
const BASE = BASE_URL.replace(/\/$/, "");

// Token helpers
function getToken(): string | null {
  return localStorage.getItem("fitnotion_token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("fitnotion_token", token);
  else localStorage.removeItem("fitnotion_token");
}

// Core API function
export async function api<T = any>(
  path: string,
  options: {
    method?: string;
    body?: any;
    auth?: boolean;
  } = {}
): Promise<T> {
  if (!path.startsWith("/")) {
    throw new Error("API path must start with '/'");
  }

  const url = `${BASE}${path}`;

  // 🔍 Debug (remove later)
  console.log("API CALL:", url);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    throw new Error("Network error: unable to reach backend");
  }

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error("❌ RAW RESPONSE (NOT JSON):", text);
    throw new Error("Server returned invalid response (HTML instead of JSON)");
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data as T;
}

// Export base for debugging
export const API_BASE = BASE;
