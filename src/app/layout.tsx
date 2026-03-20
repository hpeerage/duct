import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Phone } from "lucide-react";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clean Air Duct | 전문가용 닥트 시공 및 A/S",
  description: "사북에서 고한까지 전 지역 식당 닥트 시공, 수리, AS 전문업체 Clean Air Duct입니다. 1시간 안에 달려갑니다.",
  icons: {
    icon: "/duct/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
