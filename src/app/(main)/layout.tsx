import { Phone } from "lucide-react";
import Script from "next/script";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}
          </Script>
        </>
      )}
      <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <a href="/duct/" className="flex items-center gap-2">
            <img src="/duct/logo.png" alt="Clean Air Duct Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold tracking-tight text-primary uppercase">Clean Air Duct</span>
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#services" className="hover:text-primary transition-colors">서비스</a>
            <a href="#portfolio" className="hover:text-primary transition-colors">시공사례</a>
            <a href="#contact" className="hover:text-primary transition-colors">견적문의</a>
          </nav>
          <a 
            href="tel:010-7444-8039" 
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            전화문의
          </a>
        </div>
      </header>

      <main className="pt-16 pb-24">
        {children}
      </main>

      {/* Floating Call Button for Mobile */}
      <a 
        href="tel:010-7444-8039"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg animate-bounce active:scale-95 md:h-16 md:w-auto md:px-6 md:rounded-2xl"
        aria-label="전화 상담하기"
      >
        <Phone className="h-6 w-6" />
        <span className="ml-2 hidden text-lg font-bold md:block text-white">전화 상담하기</span>
      </a>

      <footer className="border-t bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2024 Clean Air Duct. All rights reserved.</p>
          <p className="mt-2 text-xs text-muted-foreground">정선군 전 지역 (사북, 고한, 남면, 화암 등) 출장 가능</p>
        </div>
      </footer>
    </>
  );
}
