import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>DeadDrops</h1>
      <p style={{ marginTop: 0 }}>Prototype web (dev)</p>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/subscribe">Subscribe</Link>
        </li>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
      </ul>
    </main>
  );
}

