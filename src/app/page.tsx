"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  PhoneCall, 
  Hammer, 
  Wrench, 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Camera, 
  User, 
  Phone,
  Loader2,
  Check
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    region: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const heroImages = [
    "/images/hero_bg01.png",
    "/images/hero_bg02.png",
    "/images/hero_bg03.png",
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("inquiries")
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            region: formData.region,
            content: formData.content,
            status: "pending",
          },
        ]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: "", phone: "", region: "", content: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      // 실운영이 아니므로 에러 오버레이 방지를 위해 warn으로 처리
      console.warn("Error submitting inquiry (Supabase placeholder):", err);
      alert("현재 미리보기 모드입니다. 정식 Supabase 설정 후 데이터 저장이 가능합니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-primary py-24 text-center text-white md:py-40">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 bg-primary">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 z-0 h-full w-full"
            >
              <img 
                src={heroImages[currentImageIndex]} 
                alt="Background" 
                className="h-full w-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Overlay Gradients */}
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/80 via-blue-900/40 to-primary/80" />
          <div className="absolute inset-0 z-10 bg-slate-900/20 backdrop-blur-[2px]" />

          {/* Floating Animated Orbs (Preserved for additional depth) */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-cyan-400 blur-[100px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, -40, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-white/20 blur-[120px]"
          />
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
          className="container relative z-10 px-4"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 }
            }}
            className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold tracking-wider uppercase border border-white/20 backdrop-blur-md"
          >
            정선 전 지역 1시간 이내 출동
          </motion.span>
          
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="mb-8 text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-[1.1]"
          >
            "정선 사장님들의 주방,<br />
            <motion.span 
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(0, 0, 0, 0)",
                  "0 4px 15px rgba(0, 0, 0, 0.3)",
                  "0 0 0px rgba(0, 0, 0, 0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-accent underline decoration-accent/40 underline-offset-8 drop-shadow-lg"
            >
              1시간 안에
            </motion.span> 달려가서 해결합니다."
          </motion.h2>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="mx-auto mb-12 max-w-2xl text-lg text-blue-100/90 md:text-2xl font-medium leading-relaxed"
          >
            사북에서 고한까지, 정선 전 지역 식당 닥트 시공·수리·AS 전문업체.<br className="hidden md:block" />
            멀리서 찾지 마세요. 정선 원주민이 직접 해결해 드립니다.
          </motion.p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 }
            }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <a 
              href="tel:010-0000-0000" 
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-10 py-5 text-xl font-black text-white shadow-[0_10px_30px_-10px_rgba(253,224,71,0.5)] transition-all hover:scale-105 hover:bg-yellow-400 active:scale-95 sm:w-auto"
            >
              <PhoneCall className="h-6 w-6" />
              지금 바로 전화하기
            </a>
            <a 
              href="#contact" 
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/20 bg-white/5 px-10 py-5 text-xl font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 sm:w-auto"
            >
              <Mail className="h-6 w-6" />
              무료 견적 문의
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-slate-900">무엇이 필요하신가요?</h3>
          <p className="text-muted-foreground font-sans">Clean Air Duct가 제공하는 전문 서비스입니다.</p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard 
            icon={<Hammer className="h-8 w-8 text-primary" />}
            title="신규 닥트 시공"
            description="식당 주방 환경에 최적화된 고성능 닥트 시스템을 설계하고 시공합니다."
          />
          <ServiceCard 
            icon={<Wrench className="h-8 w-8 text-primary" />}
            title="수리 및 유지보수"
            description="소음, 흡입력 저하 등 모든 고장 문제를 즉시 방문하여 완벽하게 수리합니다."
          />
          <ServiceCard 
            icon={<ShieldCheck className="h-8 w-8 text-primary" />}
            title="정기 관리 서비스"
            description="주기적인 필터 청소 및 팬 점검으로 항상 쾌적한 주방 환경을 유지해 드립니다."
          />
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-slate-900">최근 시공 사례</h3>
              <p className="text-muted-foreground font-sans">정선 사장님들이 직접 경험한 변화를 확인하세요.</p>
            </div>
            <a href="#" className="text-sm font-bold text-primary hover:underline font-sans">전체 사례 보기 &rarr;</a>
          </div>
          
          <PortfolioList />
        </div>
      </section>

      {/* Trust Points */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <TrustPoint text="강원도 정선 지역 전문" />
            <TrustPoint text="1시간 이내 신속 출동" />
            <TrustPoint text="정직하고 합리적인 비용" />
            <TrustPoint text="철저한 사후 A/S 보장" />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="container mx-auto mb-20 px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8 text-slate-900 font-sans">
            <div>
              <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">무료 견적 문의</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                현장 사진을 첨부해 주시면 더욱 정확하고 빠른 견적이 가능합니다. 
                접수 확인 후 즉시 연락드리겠습니다.
              </p>
            </div>
            
            <div className="grid gap-6">
              <ContactInfo icon={<Phone className="h-6 w-6" />} label="전화번호" value="010-0000-0000" isLink />
              <ContactInfo icon={<MapPin className="h-6 w-6" />} label="서비스 지역" value="정선군 전 지역 (사북, 고한, 남면, 화암 등)" />
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-xl md:p-10 text-slate-900 font-sans">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check className="h-10 w-10" />
                </div>
                <h3 className="mb-2 text-2xl font-bold">문의가 접수되었습니다!</h3>
                <p className="text-muted-foreground">확인 후 신속하게 연락드리겠습니다.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-primary font-bold hover:underline"
                >
                  새 문의 작성하기
                </button>
              </motion.div>
            ) : (
              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold" htmlFor="name">
                      <User className="h-4 w-4 text-muted-foreground" /> 성함 / 업소명
                    </label>
                    <input 
                      id="name" 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동 / 정선식당"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold" htmlFor="phone">
                      <Phone className="h-4 w-4 text-muted-foreground" /> 연락처
                    </label>
                    <input 
                      id="phone" 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold" htmlFor="region">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> 지역 선택
                  </label>
                  <select 
                    id="region"
                    required
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none font-sans"
                  >
                    <option value="">지역을 선택해 주세요</option>
                    <option value="사북읍">사북읍</option>
                    <option value="고한읍">고한읍</option>
                    <option value="남면">남면</option>
                    <option value="화암면">화암면</option>
                    <option value="기타">기타 (정선군 내)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold" htmlFor="content">
                    <Mail className="h-4 w-4 text-muted-foreground" /> 문의 내용
                  </label>
                  <textarea 
                    id="content" 
                    rows={4} 
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="예: 주방 후드 소음이 심합니다. / 닥트 신규 설치 견적 문의합니다."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none font-sans"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" htmlFor="photo">
                     <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-sans">현장 사진 첨부 (선택)</span>
                      <input id="photo" type="file" className="hidden" accept="image/*" />
                     </div>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-xl font-black text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-95 disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-6 w-6 animate-spin" />}
                  무료 견적 신청하기
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function PortfolioList() {
    const [portfolio, setPortfolio] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                const { data, error } = await supabase
                    .from("portfolio")
                    .select("*")
                    .eq("is_featured", true)
                    .order("created_at", { ascending: false })
                    .limit(2);

                if (error) throw error;
                setPortfolio(data || []);
            } catch (err) {
                // 에러 오버레이 방지를 위해 warn으로 처리
                console.warn("Error fetching portfolio (Supabase placeholder):", err);
            } finally {
                setLoading(false);
            }
        }
        fetchPortfolio();
    }, []);

    if (loading) {
        return (
            <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (portfolio.length === 0) {
        return (
            <div className="grid gap-12 lg:grid-cols-2 opacity-50 grayscale">
                <div className="space-y-6">
                    <BeforeAfterSlider 
                        beforeImage="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" 
                        afterImage="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" 
                    />
                    <div className="px-2">
                        <h4 className="text-xl font-bold">사북읍 고깃집 주방 후드 교체</h4>
                        <p className="text-muted-foreground">시공 사례 데이터 준비 중입니다.</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <BeforeAfterSlider 
                        beforeImage="https://images.unsplash.com/photo-1590691515228-5fd7403f778a?w=800&q=80" 
                        afterImage="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" 
                    />
                    <div className="px-2">
                        <h4 className="text-xl font-bold">고한리 중식당 옥상 팬 수리</h4>
                        <p className="text-muted-foreground">시공 사례 데이터 준비 중입니다.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-12 lg:grid-cols-2">
            {portfolio.map((item) => (
                <div key={item.id} className="space-y-6">
                    <BeforeAfterSlider 
                        beforeImage={item.before_image_url} 
                        afterImage={item.after_image_url} 
                    />
                    <div className="px-2">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-primary font-sans">{item.region_tag}</span>
                        </div>
                        <p className="text-muted-foreground font-sans">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col items-start rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md text-slate-900"
    >
      <div className="mb-6 rounded-2xl bg-blue-50 p-4">
        {icon}
      </div>
      <h4 className="mb-3 text-xl font-bold">{title}</h4>
      <p className="text-muted-foreground leading-relaxed font-sans">{description}</p>
    </motion.div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 justify-center md:justify-start">
      <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0" />
      <span className="text-lg font-semibold font-sans">{text}</span>
    </div>
  );
}

function ContactInfo({ icon, label, value, isLink = false }: { icon: React.ReactNode, label: string, value: string, isLink?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-muted-foreground font-sans">{label}</div>
        {isLink ? (
          <a href={`tel:${value}`} className="text-xl font-bold text-primary hover:underline font-sans">{value}</a>
        ) : (
          <div className="text-xl font-bold font-sans">{value}</div>
        )}
      </div>
    </div>
  );
}
