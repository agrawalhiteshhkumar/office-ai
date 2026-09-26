import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Office AI™ | Institutional Operating System",
  description: "AI-Native Administrative, Governance, Regulatory & Evidence Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
