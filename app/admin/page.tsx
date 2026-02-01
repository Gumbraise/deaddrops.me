"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "../providers";
import { apiFetch } from "../../lib/api";

type Me = { id: string; firebase_uid: string; role: "user" | "admin" } | null;

export default function AdminPage() {
  const { user, idToken, loading } = useAuth();
  const [me, setMe] = useState<Me>(null);
  const [status, setStatus] = useState<any>(null);
  const [deaddrops, setDeaddrops] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [q, setQ] = useState("");
  const [isExternal, setIsExternal] = useState<boolean | undefined>(undefined);

  const [newName, setNewName] = useState("");
  const [newIsExternal, setNewIsExternal] = useState(false);

  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState<number | undefined>(undefined);
  const [limit, setLimit] = useState<number | undefined>(100);

  const canAdmin = useMemo(() => me?.role === "admin", [me]);

  useEffect(() => {
    let mounted = true;
    async function loadMe() {
      if (!idToken) return;
      const ensured = await apiFetch<NonNullable<Me>>("/me/ensure", { method: "POST", idToken });
      if (mounted) setMe(ensured);
    }
    void loadMe();
    return () => {
      mounted = false;
    };
  }, [idToken]);

  useEffect(() => {
    if (!idToken || !canAdmin) return;
    let mounted = true;
    const interval = setInterval(() => {
      void apiFetch("/admin/import/status", { idToken })
        .then((s) => mounted && setStatus(s))
        .catch(() => {});
    }, 2000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [idToken, canAdmin]);

  useEffect(() => {
    let mounted = true;
    async function loadList() {
      if (!idToken || !canAdmin) return;
      const qs = new URLSearchParams();
      if (q.trim()) qs.set("q", q.trim());
      if (isExternal !== undefined) qs.set("isExternal", String(isExternal));
      const res = await apiFetch<{ items: any[] }>(`/admin/deaddrops?${qs.toString()}`, { idToken });
      if (mounted) setDeaddrops(res.items ?? []);
    }
    void loadList();
    return () => {
      mounted = false;
    };
  }, [idToken, canAdmin, q, isExternal]);

  async function refreshList() {
    if (!idToken) return;
    const qs = new URLSearchParams();
    if (q.trim()) qs.set("q", q.trim());
    if (isExternal !== undefined) qs.set("isExternal", String(isExternal));
    const res = await apiFetch<{ items: any[] }>(`/admin/deaddrops?${qs.toString()}`, { idToken });
    setDeaddrops(res.items ?? []);
  }

  async function triggerImport(body: any) {
    if (!idToken) return;
    setError(null);
    setBusy(true);
    try {
      await apiFetch("/admin/import/deaddrops", { method: "POST", body, idToken });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function createDeaddrop() {
    if (!idToken) return;
    setError(null);
    setBusy(true);
    try {
      await apiFetch("/admin/deaddrops", {
        method: "POST",
        body: { name: newName.trim(), isExternal: newIsExternal },
        idToken,
      });
      setNewName("");
      await refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function deleteDeaddrop(id: string) {
    if (!idToken) return;
    setError(null);
    setBusy(true);
    try {
      await apiFetch(`/admin/deaddrops/${id}`, { method: "DELETE", idToken });
      await refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function editDeaddrop(id: string, currentName: string) {
    if (!idToken) return;
    const nextName = window.prompt("New name", currentName);
    if (!nextName || nextName.trim().length === 0 || nextName.trim() === currentName) return;

    setError(null);
    setBusy(true);
    try {
      await apiFetch(`/admin/deaddrops/${id}`, { method: "PATCH", body: { name: nextName.trim() }, idToken });
      await refreshList();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Admin</h1>
        <p>Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Admin</h1>
        <p>
          <Link href="/login">Login</Link> requis.
        </p>
      </main>
    );
  }

  if (!canAdmin) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Admin</h1>
        <p style={{ color: "crimson" }}>Accès refusé.</p>
        <p style={{ opacity: 0.7 }}>uid: {user.uid}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p style={{ opacity: 0.7 }}>uid: {user.uid}</p>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <section style={{ marginTop: 16 }}>
        <h2>Import</h2>
        <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
          <button onClick={() => triggerImport({ mode: "resume", limit })} disabled={busy}>
            Trigger Resume
          </button>

          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Start ID
              <input
                type="number"
                value={rangeStart}
                onChange={(e) => setRangeStart(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </label>
            <label>
              End ID (optional)
              <input
                type="number"
                value={rangeEnd ?? ""}
                onChange={(e) => setRangeEnd(e.target.value ? Number(e.target.value) : undefined)}
                style={{ width: "100%" }}
              />
            </label>
            <label>
              Limit (optional)
              <input
                type="number"
                value={limit ?? ""}
                onChange={(e) => setLimit(e.target.value ? Number(e.target.value) : undefined)}
                style={{ width: "100%" }}
              />
            </label>
            <button onClick={() => triggerImport({ mode: "range", startId: rangeStart, endId: rangeEnd, limit })} disabled={busy}>
              Trigger Range
            </button>
          </div>
        </div>

        <h3>Status</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(status, null, 2)}</pre>
      </section>

      <section style={{ marginTop: 16 }}>
        <h2>Deaddrops</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          <select
            value={isExternal === undefined ? "all" : isExternal ? "external" : "internal"}
            onChange={(e) => {
              const v = e.target.value;
              setIsExternal(v === "all" ? undefined : v === "external");
            }}
          >
            <option value="all">All</option>
            <option value="external">External</option>
            <option value="internal">Internal</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input placeholder="New deaddrop name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" checked={newIsExternal} onChange={(e) => setNewIsExternal(e.target.checked)} />
            External
          </label>
          <button onClick={createDeaddrop} disabled={busy || newName.trim().length === 0}>
            Create
          </button>
        </div>

        <table style={{ width: "100%", marginTop: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>External ID</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd" }} />
            </tr>
          </thead>
          <tbody>
            {deaddrops.map((d) => (
              <tr key={d.id}>
                <td style={{ padding: "6px 0" }}>{d.name}</td>
                <td style={{ padding: "6px 0" }}>{d.externalId ?? ""}</td>
                <td style={{ padding: "6px 0" }}>{d.statusCurrent}</td>
                <td style={{ padding: "6px 0" }}>
                  <button onClick={() => editDeaddrop(d.id, d.name)} disabled={busy} style={{ marginRight: 8 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteDeaddrop(d.id)} disabled={busy}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
