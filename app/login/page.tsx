"use client";

import { useMemo, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import { auth } from "../../lib/firebaseClient";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../providers";

export default function LoginPage() {
  const router = useRouter();
  const { idToken, loading, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(() => email.length > 3 && password.length >= 6 && !busy, [email, password, busy]);

  async function ensureMe(token: string) {
    await apiFetch("/me/ensure", { method: "POST", idToken: token });
  }

  async function onLogin() {
    setError(null);
    setBusy(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      await ensureMe(token);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onRegister() {
    setError(null);
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      await ensureMe(token);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>

      {loading ? <p>Loading…</p> : null}
      {user ? <p style={{ opacity: 0.7 }}>Signed in as: {user.email ?? user.uid}</p> : null}
      {idToken ? <p style={{ opacity: 0.7 }}>Token ready</p> : null}

      <div style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onLogin} disabled={!canSubmit}>
            Login
          </button>
          <button onClick={onRegister} disabled={!canSubmit}>
            Register
          </button>
        </div>
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      </div>
    </main>
  );
}
