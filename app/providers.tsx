"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth";

import { auth } from "../lib/firebaseClient";

type AuthState = {
  user: User | null;
  idToken: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onIdTokenChanged(auth, async (u) => {
      setUser(u);
      setIdToken(u ? await u.getIdToken() : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthState>(() => ({ user, idToken, loading }), [user, idToken, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within Providers");
  return ctx;
}

