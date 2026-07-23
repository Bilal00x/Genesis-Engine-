"""
Auth Layout
"""

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Game Studio - Authentication",
  description: "Sign in to AI Game Studio",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen bg-background text-text items-center justify-center p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
