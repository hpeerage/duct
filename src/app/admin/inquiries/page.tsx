"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  Clock, 
  Trash2,
  ExternalLink,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      
      setInquiries(inquiries.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  }

  const filteredInquiries = inquiries.filter(item => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white">문의 내역 관리</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="이름, 지역 검색..." 
              className="rounded-xl border border-slate-800 bg-slate-900 py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-primary transition-colors placeholder:text-slate-700"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
          >
            <option value="all">전체 상태</option>
            <option value="pending">대기 중</option>
            <option value="completed">완료</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#16191e]/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1d23] border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">날짜</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">이름/업소명</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">연락처</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">지역</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">문의 내용</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </td>
                </tr>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-400">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold whitespace-nowrap text-slate-200">{inquiry.name}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline font-medium">{inquiry.phone}</a>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{inquiry.region}</span>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate text-slate-400">
                      {inquiry.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border",
                        inquiry.status === "pending" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                      )}>
                        {inquiry.status === "pending" ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {inquiry.status === "pending" ? "대기" : "완료"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => updateStatus(inquiry.id, inquiry.status === 'pending' ? 'completed' : 'pending')}
                            className={cn(
                                "p-2 rounded-lg transition-colors border shadow-sm",
                                inquiry.status === 'pending' ? "text-green-500 bg-green-500/10 border-green-500/20 hover:bg-green-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
                            )}
                            title={inquiry.status === 'pending' ? "완료로 표시" : "대기로 표시"}
                         >
                            <CheckCircle className="h-4 w-4" />
                         </button>
                         <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                            <MoreVertical className="h-4 w-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-600 italic">
                    문의 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
