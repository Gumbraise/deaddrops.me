"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>Firebase Auth UI à implémenter.</p>
      <p style={{ opacity: 0.7 }}>Ready: {String(ready)}</p>
    </main>
  );
}

