import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Phone } from "lucide-react";
import Script from "next/script";
import VisitorTracker from "@/components/VisitorTracker";
import PWAInstallButton from "@/components/PWAInstallButton";

// const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#002b5c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Clean Air Duct | 전문가용 닥트 시공 및 A/S",
  description: "사북에서 고한까지 전 지역 식당 닥트 시공, 수리, AS 전문업체 Clean Air Duct입니다. 1시간 안에 달려갑니다.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/image_0.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "클린에어닥트",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="클린에어닥트" />
      </head>
      <body className="font-sans min-h-screen bg-background text-foreground">
        <VisitorTracker />
        <PWAInstallButton />
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
