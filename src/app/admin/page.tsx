"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-[#0f1115]">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-[#16191e] p-8 shadow-2xl md:p-12">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
             <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white italic">Clean Air Duct Admin</h2>
          <p className="mt-3 text-slate-500 text-sm">관리자 계정으로 로그인해 주세요.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="email">
                <Mail className="h-3.5 w-3.5" /> 이메일
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary transition-colors placeholder:text-slate-700"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                <Lock className="h-3.5 w-3.5" /> 비밀번호
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary transition-colors placeholder:text-slate-700"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-medium text-red-500 animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-blue-600 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : null}
            로그인
          </button>
        </form>
        
        <div className="pt-4 text-center">
            <a href="/" className="text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors">홈페이지로 돌아가기</a>
        </div>
      </div>
    </div>
  );
}
