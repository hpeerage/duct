"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session && !isLoginPage) {
        router.push("/admin");
      }
    }).catch(err => {
      console.warn("Session check failed (placeholder):", err);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !isLoginPage) {
        router.push("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!session && !isLoginPage) return null;

  // 로그인 페이지면 바로 렌더링 (다크 테마 배경 적용)
  if (isLoginPage) return <div className="bg-[#0f1115] min-h-screen">{children}</div>;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 font-sans">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-[#16191e] border-r border-slate-800 transition-transform duration-300 md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center px-6 border-b border-slate-800 bg-[#1a1d23]">
            <Link href="/duct/" className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white uppercase">Clean Air Duct</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">메뉴</div>
            <NavItem 
              href="/admin/dashboard" 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              label="대시보드" 
              active={pathname === "/admin/dashboard"} 
            />
            <NavItem 
              href="/admin/inquiries" 
              icon={<MessageSquare className="h-4 w-4" />} 
              label="문의 관리" 
              active={pathname === "/admin/inquiries"}
            />
            <NavItem 
              href="/admin/portfolio" 
              icon={<ImageIcon className="h-4 w-4" />} 
              label="시공 사례 관리" 
              active={pathname === "/admin/portfolio"}
            />
          </nav>

          <div className="p-4 border-t border-slate-800 bg-[#1a1d23]/50">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-[#0f1115]/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>대시보드</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-slate-200">{session.user.email}</span>
              <span className="text-[10px] text-slate-500">Administrator</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="text-xs font-bold">{session.user.email[0].toUpperCase()}</span>
            </div>
          </div>
        </header>
        <div className="p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
}) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all",
        active ? "bg-primary text-white shadow-md shadow-primary/20" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <ChevronRight className={cn("h-4 w-4 opacity-50", active ? "opacity-100" : "")} />
    </Link>
  );
}
