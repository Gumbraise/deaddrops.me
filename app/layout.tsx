import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DeadDrops",
  description: "DeadDrops map",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>{children}</body>
    </html>
  );
}

