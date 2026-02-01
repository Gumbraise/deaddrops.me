export async function apiFetch<T>(
  path: string,
  opts: { method?: string; body?: unknown; idToken?: string | null } = {},
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("Missing env: NEXT_PUBLIC_API_BASE_URL");

  const res = await fetch(`${base}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "content-type": "application/json",
      ...(opts.idToken ? { Authorization: `Bearer ${opts.idToken}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  return (await res.json()) as T;
}

