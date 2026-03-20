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

  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);

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

  async function uploadImage(file: File, prefix: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${prefix}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("portfolio")
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let beforeUrl = formData.before_image_url;
      let afterUrl = formData.after_image_url;

      // 이미지 업로드 처리
      if (beforeFile) {
        beforeUrl = await uploadImage(beforeFile, 'before');
      }
      if (afterFile) {
        afterUrl = await uploadImage(afterFile, 'after');
      }

      if (!beforeUrl || !afterUrl) {
        alert("이미지를 등록해주세요.");
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        before_image_url: beforeUrl,
        after_image_url: afterUrl
      };

      if (editingId) {
        const { error } = await supabase
          .from("portfolio")
          .update(submissionData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("portfolio")
          .insert([submissionData]);
        if (error) throw error;
      }

      setIsAdding(false);
      resetForm();
      fetchPortfolio();
    } catch (err: any) {
      console.error("Error saving portfolio:", err);
      alert(`저장 중 오류가 발생했습니다: ${err.message || '네트워크 오류'}\n(Supabase Storage에 'portfolio' 버킷이 생성되어 있는지 확인해 주세요.)`);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      before_image_url: "",
      after_image_url: "",
      region_tag: "",
      is_featured: false
    });
    setBeforeFile(null);
    setAfterFile(null);
    setBeforePreview(null);
    setAfterPreview(null);
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
    setBeforePreview(item.before_image_url);
    setAfterPreview(item.after_image_url);
    setIsAdding(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'before') {
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
    } else {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">시공 사례 관리</h2>
        <button 
          onClick={() => {
            if (isAdding) {
              resetForm();
              setIsAdding(false);
            } else {
              setIsAdding(true);
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-600 transition-all active:scale-95"
        >
          {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isAdding ? "취소하기" : "새 사례 등록"}
        </button>
      </div>

      {isAdding && (
        <div className="rounded-3xl border border-slate-800 bg-[#16191e] p-8 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form className="grid gap-10 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">제목</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="예: 사북읍 고깃집 주방 후드 교체"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary transition-colors placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">지역 태그</label>
                <input 
                  type="text" 
                  value={formData.region_tag}
                  onChange={(e) => setFormData({...formData, region_tag: e.target.value})}
                  placeholder="예: 사북읍, 고한읍"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary transition-colors placeholder:text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">상세 설명</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-primary transition-colors placeholder:text-slate-700 resize-none"
                ></textarea>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="is_featured"
                  className="w-5 h-5 rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary/20"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                />
                <label htmlFor="is_featured" className="text-sm font-bold text-slate-300">메인 페이지 노출</label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Before Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-500 uppercase tracking-wider">Before 사진</label>
                  <div 
                    className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center overflow-hidden hover:border-amber-500/50 transition-colors cursor-pointer group"
                    onClick={() => document.getElementById('before-upload')?.click()}
                  >
                    {beforePreview ? (
                      <img src={beforePreview} alt="Before" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600 group-hover:text-amber-500">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-[10px] font-black">이미지 선택</span>
                      </div>
                    )}
                    <input 
                      id="before-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'before')}
                    />
                  </div>
                </div>

                {/* After Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-500 uppercase tracking-wider">After 사진</label>
                  <div 
                    className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 flex flex-col items-center justify-center overflow-hidden hover:border-blue-500/50 transition-colors cursor-pointer group"
                    onClick={() => document.getElementById('after-upload')?.click()}
                  >
                    {afterPreview ? (
                      <img src={afterPreview} alt="After" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600 group-hover:text-blue-500">
                        <ImageIcon className="h-8 w-8" />
                        <span className="text-[10px] font-black">이미지 선택</span>
                      </div>
                    )}
                    <input 
                      id="after-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => handleFileChange(e, 'after')}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
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
            <div key={item.id} className="group relative rounded-3xl border border-slate-800 bg-[#16191e]/50 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl hover:bg-slate-800/50 transition-all duration-300">
               <div className="flex gap-5">
                  <div className="relative h-28 w-36 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                    {item.after_image_url ? (
                        <img src={item.after_image_url} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <ImageIcon className="h-full w-full p-8 text-slate-800" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center justify-between">
                        <h4 className="font-bold text-lg text-slate-100 truncate pr-20">{item.title}</h4>
                        <div className="absolute right-5 top-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <MapPin className="h-3 w-3 text-primary" /> {item.region_tag || "지역 미지정"}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
               </div>
               {item.is_featured && (
                    <div className="absolute left-7 top-7 rounded-full bg-primary px-3 py-1 text-[10px] font-black text-white shadow-lg shadow-primary/20">
                        FEATURED
                    </div>
               )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-800 py-24 text-center">
                <div className="mx-auto h-16 w-16 rounded-3xl bg-slate-900 flex items-center justify-center mb-6">
                    <ImageIcon className="h-8 w-8 text-slate-700" />
                </div>
                <p className="text-slate-500 font-medium italic">등록된 시공 사례가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
