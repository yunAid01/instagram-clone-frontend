// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // 👈 1. '방송실' 컴포넌트 import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Instagram Clone",
  description: "Built with GCM",
};

export default function RootLayout({
  children, // 👈 2. 이 children이 바로 '사진'입니다.
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* 👈 3. '액자' 안에 '방송 시스템'을 설치합니다. */}
          {children}   {/* 👈 4. 그 안에 '사진'을 넣습니다. */}
        </AuthProvider>
      </body>
    </html>
  );
}