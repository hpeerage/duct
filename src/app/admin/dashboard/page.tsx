"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Users, CheckCircle2, Clock, Loader2, Database, Eraser, AlertCircle, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    visitors: "0" // 통계 수집 전 초기값
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetType, setResetType] = useState<'inquiries' | 'portfolio' | 'all'>('inquiries');

  const fetchData = async () => {
    try {
      const { data: inquiries, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (inquiries) {
        setRecentInquiries(inquiries.slice(0, 5));
        setStats({
          total: inquiries.length,
          pending: inquiries.filter(i => i.status === 'pending').length,
          completed: inquiries.filter(i => i.status === 'completed').length,
          visitors: "0"
        });
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetData = async () => {
    setResetting(true);
    try {
      const uuidZero = "00000000-0000-0000-0000-000000000000";
      
      if (resetType === 'inquiries' || resetType === 'all') {
        const { error } = await supabase
          .from("inquiries")
          .delete()
          .neq("id", uuidZero);
        if (error) throw error;
      }

      if (resetType === 'portfolio' || resetType === 'all') {
        const { error } = await supabase
          .from("portfolio")
          .delete()
          .neq("id", uuidZero);
        if (error) throw error;
      }
      
      alert(`${resetType === 'all' ? '전체 데이터' : resetType === 'inquiries' ? '문의 데이터' : '시공 사례 데이터'}가 초기화되었습니다.`);
      await fetchData();
    } catch (err) {
      console.error("Reset failed:", err);
      alert("데이터 초기화 중 오류가 발생했습니다.");
    } finally {
      setResetting(false);
      setShowConfirm(false);
    }
  };

  const openResetConfirm = (type: 'inquiries' | 'portfolio' | 'all') => {
    setResetType(type);
    setShowConfirm(true);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black">대시보드</h1>
          <p className="text-muted-foreground">실시간 관리 현황 및 데이터 통계</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => openResetConfirm('inquiries')}
            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-colors border shadow-sm"
          >
            <MessageSquare className="h-4 w-4 text-blue-500" />
            문의 리셋
          </button>
          <button 
            onClick={() => openResetConfirm('portfolio')}
            className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-colors border shadow-sm"
          >
            <ImageIcon className="h-4 w-4 text-purple-500" />
            사례 리셋
          </button>
          <button 
            onClick={() => openResetConfirm('all')}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
          >
            <Database className="h-4 w-4" />
            전체 초기화
          </button>
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border overflow-hidden"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {resetType === 'all' ? '전체 데이터를 ' : 
                     resetType === 'inquiries' ? '문의 내역을 ' : '시공 사례를 '}
                    초기화할까요?
                  </h3>
                  <p className="text-slate-500 mt-1 leading-relaxed">
                    이 작업은 되돌릴 수 없으며, 선택한 테이블의 모든 기록이 <strong>영구적으로 삭제</strong>됩니다. 테스트 완료 후 실데이터 입력을 앞둔 상황에서만 수행해 주세요.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  disabled={resetting}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button 
                  onClick={handleResetData}
                  disabled={resetting}
                  className="flex-1 px-4 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resetting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Eraser className="h-5 w-5" />
                      삭제하기
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={<MessageSquare className="h-6 w-6 text-blue-600" />} 
          label="전체 문의" 
          value={stats.total.toString()} 
          trend="누적 데이터" 
        />
        <StatCard 
          icon={<Clock className="h-6 w-6 text-amber-600" />} 
          label="대기 중" 
          value={stats.pending.toString()} 
          trend={stats.pending > 0 ? "신속 확인 필요" : "모두 확인됨"} 
        />
        <StatCard 
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />} 
          label="처리 완료" 
          value={stats.completed.toString()} 
          trend="성공적인 서비스" 
        />
        <StatCard 
          icon={<Users className="h-6 w-6 text-purple-600" />} 
          label="월간 방문자" 
          value={stats.visitors} 
          trend="수집 대기 중" 
        />
      </div>

      {/* Recent Inquiries List */}
      <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">최근 문의 내역</h2>
          <button className="text-sm font-bold text-primary hover:underline">전체 보기</button>
        </div>
        <div className="divide-y text-slate-900 font-sans">
          {recentInquiries.length > 0 ? (
            recentInquiries.map((inquiry) => (
              <InquiryRow 
                key={inquiry.id}
                name={inquiry.name} 
                region={inquiry.region} 
                content={inquiry.content} 
                date={new Date(inquiry.created_at).toLocaleDateString()} 
                status={inquiry.status} 
              />
            ))
          ) : (
            <div className="p-10 text-center text-muted-foreground font-sans">
              최근 문의 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend: string;
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="rounded-3xl border bg-white p-6 shadow-sm flex flex-col gap-4"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-black mt-1">{value}</h3>
        <p className="text-xs font-bold text-primary mt-2">{trend}</p>
      </div>
    </motion.div>
  );
}

function InquiryRow({ name, region, content, date, status }: {
  name: string;
  region: string;
  content: string;
  date: string;
  status: 'pending' | 'completed';
}) {
  return (
    <div className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50 transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{name}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-muted-foreground">{region}</span>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-1">{content}</p>
      </div>
      <div className="flex items-center justify-between sm:gap-6">
        <span className="text-sm text-muted-foreground">{date}</span>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-bold",
          status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
        )}>
          {status === 'pending' ? '대기' : '완료'}
        </span>
      </div>
    </div>
  );
}
