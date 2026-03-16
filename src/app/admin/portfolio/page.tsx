"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  MapPin, 
  Check, 
  X,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    before_image_url: "",
    after_image_url: "",
    region_tag: "",
    is_featured: false
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  async function fetchPortfolio() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("portfolio")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("portfolio")
          .insert([formData]);
        if (error) throw error;
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        before_image_url: "",
        after_image_url: "",
        region_tag: "",
        is_featured: false
      });
      fetchPortfolio();
    } catch (err) {
      console.error("Error saving portfolio:", err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    try {
      const { error } = await supabase
        .from("portfolio")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      before_image_url: item.before_image_url,
      after_image_url: item.after_image_url,
      region_tag: item.region_tag,
      is_featured: item.is_featured
    });
    setIsAdding(true);
  };

  return (
    <div className="space-y-6 text-slate-900 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">시공 사례 관리</h2>
        <button 
          onClick={() => {
            setIsAdding(!isAdding);
            if (isAdding) setEditingId(null);
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isAdding ? "취소하기" : "새 사례 등록"}
        </button>
      </div>

      {isAdding && (
        <div className="rounded-3xl border bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">제목</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="예: 사북읍 고깃집 주방 후드 교체"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">지역 태그</label>
                <input 
                  type="text" 
                  value={formData.region_tag}
                  onChange={(e) => setFormData({...formData, region_tag: e.target.value})}
                  placeholder="예: 사북읍, 고한읍"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">상세 설명</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-primary resize-none"
                ></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Before 이미지 URL (임시)</label>
                <input 
                  type="text" 
                  required
                  value={formData.before_image_url}
                  onChange={(e) => setFormData({...formData, before_image_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">After 이미지 URL (임시)</label>
                <input 
                  type="text" 
                  required
                  value={formData.after_image_url}
                  onChange={(e) => setFormData({...formData, after_image_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input 
                  type="checkbox" 
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                />
                <label htmlFor="is_featured" className="text-sm font-medium">메인 페이지 노출</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-white shadow-lg hover:bg-blue-700"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "수정 완료" : "사례 등록하기"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading && !isAdding ? (
        <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-3xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex gap-4">
                  <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {item.after_image_url ? (
                        <img src={item.after_image_url} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon className="h-full w-full p-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold truncate pr-16">{item.title}</h4>
                        <div className="absolute right-4 top-4 flex gap-2">
                            <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider font-bold">
                        <MapPin className="h-3 w-3" /> {item.region_tag || "지역 미지정"}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  </div>
               </div>
               {item.is_featured && (
                    <div className="absolute left-6 top-6 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-black text-white backdrop-blur-sm">
                        MAIN
                    </div>
               )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed py-20 text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-12 w-12 mb-4 opacity-20" />
                등록된 시공 사례가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
