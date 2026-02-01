"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Purchases from "@revenuecat/purchases-js";

import { useAuth } from "../providers";

type RcPackage = any;

function packageKey(p: RcPackage): string {
  return String(p?.identifier ?? p?.packageType ?? "").toLowerCase();
}

export default function SubscribePage() {
  const { user, loading } = useAuth();
  const [packages, setPackages] = useState<RcPackage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [entitlements, setEntitlements] = useState<any>(null);

  const apiKey = process.env.NEXT_PUBLIC_REVENUECAT_PUBLIC_API_KEY;

  const explorerMonthly = useMemo(() => packages.find((p) => packageKey(p).includes("$rc_monthly")), [packages]);
  const explorerAnnual = useMemo(() => packages.find((p) => packageKey(p).includes("$rc_annual")), [packages]);
  const proMonthly = useMemo(
    () => packages.find((p) => packageKey(p).includes("$rc_custom_pro_monthly") || packageKey(p).includes("pro_monthly")),
    [packages],
  );
  const proAnnual = useMemo(
    () => packages.find((p) => packageKey(p).includes("$rc_custom_pro_annual") || packageKey(p).includes("pro_annual")),
    [packages],
  );

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!user) return;
      if (!apiKey) {
        setError("Missing env: NEXT_PUBLIC_REVENUECAT_PUBLIC_API_KEY");
        return;
      }

      setError(null);
      setBusy(true);
      try {
        Purchases.configure({ apiKey, appUserId: user.uid });
        const purchases = Purchases.getSharedInstance();
        const offerings = await purchases.getOfferings();
        const current = offerings?.current;
        const available = current?.availablePackages ?? [];
        if (mounted) setPackages(available);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setBusy(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [user, apiKey]);

  async function buy(rcPackage: RcPackage) {
    if (!user) return;
    setError(null);
    setBusy(true);
    try {
      const purchases = Purchases.getSharedInstance();
      await purchases.purchasePackage(rcPackage);
      const info = await purchases.getCustomerInfo();
      setEntitlements(info?.entitlements ?? info);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Subscribe</h1>
        <p>Loading…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Subscribe</h1>
        <p>
          <Link href="/login">Login</Link> requis.
        </p>
      </main>
    );
  }

  function labelFor(rcPackage: RcPackage) {
    const title = rcPackage?.product?.title ?? rcPackage?.storeProduct?.title ?? rcPackage?.identifier ?? "Package";
    const price =
      rcPackage?.product?.priceString ??
      rcPackage?.storeProduct?.priceString ??
      rcPackage?.product?.price ??
      rcPackage?.storeProduct?.price ??
      "";
    return `${title}${price ? ` — ${price}` : ""}`;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Subscribe</h1>
      <p style={{ opacity: 0.7 }}>appUserId: {user.uid}</p>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <h2 style={{ marginBottom: 0 }}>Explorer</h2>
        <button onClick={() => explorerMonthly && buy(explorerMonthly)} disabled={!explorerMonthly || busy}>
          {explorerMonthly ? `Mensuel: ${labelFor(explorerMonthly)}` : "Mensuel (indisponible)"}
        </button>
        <button onClick={() => explorerAnnual && buy(explorerAnnual)} disabled={!explorerAnnual || busy}>
          {explorerAnnual ? `Annuel: ${labelFor(explorerAnnual)}` : "Annuel (indisponible)"}
        </button>

        <h2 style={{ marginBottom: 0, marginTop: 16 }}>Pro / Hunter</h2>
        <button onClick={() => proMonthly && buy(proMonthly)} disabled={!proMonthly || busy}>
          {proMonthly ? `Mensuel: ${labelFor(proMonthly)}` : "Mensuel (indisponible)"}
        </button>
        <button onClick={() => proAnnual && buy(proAnnual)} disabled={!proAnnual || busy}>
          {proAnnual ? `Annuel: ${labelFor(proAnnual)}` : "Annuel (indisponible)"}
        </button>
      </div>

      {busy ? <p>Working…</p> : null}

      {entitlements ? (
        <>
          <h2>Entitlements</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(entitlements, null, 2)}</pre>
        </>
      ) : null}
    </main>
  );
}
