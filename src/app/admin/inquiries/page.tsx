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
  Loader2,
  Eye,
  Image as ImageIcon,
  X,
  User,
  Phone,
  MapPin,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">사진</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">이름/업소명</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">연락처</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">지역</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">문의 내용</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">상태</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </td>
                </tr>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-800/30 transition-colors group">
                     <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-400">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {inquiry.photo_url ? (
                        <div className="relative group/thumb inline-block">
                           <img 
                            src={inquiry.photo_url} 
                            alt="thumb" 
                            className="h-10 w-10 rounded-lg object-cover border border-slate-700 group-hover/thumb:border-primary transition-colors"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=Error';
                              (e.target as HTMLImageElement).classList.add('opacity-50');
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => setSelectedInquiry(inquiry)}>
                            <Eye className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg border border-slate-800 flex items-center justify-center bg-slate-900/50">
                          <ImageIcon className="h-4 w-4 text-slate-700" />
                        </div>
                      )}
                    </td>
                    <td 
                      className="px-6 py-4 font-bold whitespace-nowrap text-slate-200 cursor-pointer hover:text-primary hover:underline transition-all underline-offset-4"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      {inquiry.name}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <a href={`tel:${inquiry.phone}`} className="text-primary hover:underline font-medium">{inquiry.phone}</a>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{inquiry.region}</span>
                    </td>
                    <td 
                      className="px-6 py-4 text-sm max-w-xs truncate text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      {inquiry.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
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
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                            title="상세 보기"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
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
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-slate-600 italic">
                    문의 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
       </div>

      <DetailModal 
        inquiry={selectedInquiry} 
        onClose={() => setSelectedInquiry(null)} 
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}

const DetailModal = ({ inquiry, onClose, onUpdateStatus }: { inquiry: any, onClose: () => void, onUpdateStatus: (id: string, status: string) => void }) => {
  if (!inquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1d23] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#1a1d23] border-b border-slate-800 p-6 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-white">문의 상세 내용</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="h-6 w-6 text-slate-400" />
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User className="h-3 w-3" /> 성함 / 업소명
              </div>
              <div className="text-lg font-bold text-white">{inquiry.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Phone className="h-3 w-3" /> 연락처
              </div>
              <div className="text-lg font-bold text-primary">
                <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> 지역
              </div>
              <div className="text-lg font-bold text-white">{inquiry.region}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Clock className="h-3 w-3" /> 일시
              </div>
              <div className="text-lg font-bold text-white">
                {new Date(inquiry.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare className="h-3 w-3" /> 문의 내용
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap min-h-[150px]">
              {inquiry.content}
            </div>
          </div>

          {inquiry.photo_url && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> 첨부 사진
              </div>
              <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 group/img relative">
                <img 
                  src={inquiry.photo_url} 
                  alt="Inquiry photo" 
                  className="w-full h-auto object-contain min-h-[200px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const msg = document.createElement('div');
                      msg.className = "p-10 text-center text-slate-500 italic";
                      msg.innerText = "이미지를 불러올 수 없습니다. 권한 설정을 확인해 주세요.";
                      parent.appendChild(msg);
                    }
                  }}
                />
                <a 
                  href={inquiry.photo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-md transition-all opacity-0 group-hover/img:opacity-100 flex items-center gap-1 border border-white/10"
                >
                  <ExternalLink className="h-3 w-3" /> 새 창에서 보기
                </a>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button 
              onClick={() => {
                onUpdateStatus(inquiry.id, inquiry.status === 'pending' ? 'completed' : 'pending');
                onClose();
              }}
              className={cn(
                "px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
                inquiry.status === 'pending' 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              )}
            >
              {inquiry.status === 'pending' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
              {inquiry.status === 'pending' ? "완료로 표시" : "대기로 표시"}
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all underline underline-offset-4 decoration-slate-600"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
