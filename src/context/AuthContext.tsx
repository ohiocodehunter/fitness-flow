import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setToken } from "@/lib/api";

export type User = { id: string; email: string; displayName: string; units: "kg" | "lb" };

type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const me = await api<User>("/api/me");
      setUser(me);
    } catch {
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("fitnotion_token")) await refresh();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const r = await api<{ token: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    setToken(r.token);
    setUser(r.user);
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    const r = await api<{ token: string; user: User }>("/api/auth/signup", {
      method: "POST",
      body: { email, password, displayName },
      auth: false,
    });
    setToken(r.token);
    setUser(r.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, signup, logout, refresh }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}