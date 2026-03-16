"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.push("/admin");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
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

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-4 text-white shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r transition-transform duration-300 md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center px-6 border-b">
            <span className="text-xl font-bold text-primary italic">정선닥트 Admin</span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <NavItem 
              href="/admin/dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              label="대시보드" 
              active 
            />
            <NavItem 
              href="/admin/inquiries" 
              icon={<MessageSquare className="h-5 w-5" />} 
              label="문의 관리" 
            />
            <NavItem 
              href="/admin/portfolio" 
              icon={<ImageIcon className="h-5 w-5" />} 
              label="시공 사례 관리" 
            />
          </nav>

          <div className="p-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:pl-64">
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
          <h1 className="text-lg font-bold">대시보드</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
              {session.user.email}
            </span>
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
    <a 
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
    </a>
  );
}
