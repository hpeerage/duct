"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PhoneCall, Hammer, Wrench, ShieldCheck, Mail, MapPin, Camera, User, Phone } from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-primary py-20 text-center text-white md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[#000] opacity-5"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container relative z-10 px-4"
        >
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold tracking-wider uppercase">
            정선 전 지역 1시간 이내 출동
          </span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            "정선 사장님들의 주방,<br />
            <span className="text-accent">1시간 안에</span> 달려가서 해결합니다."
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 md:text-xl">
            사북에서 고한까지, 정선 전 지역 식당 닥트 시공·수리·AS 전문업체.<br className="hidden md:block" />
            멀리서 찾지 마세요. 정선 원주민이 직접 해결해 드립니다.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a 
              href="tel:010-0000-0000" 
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              <PhoneCall className="h-5 w-5" />
              지금 바로 전화하기
            </a>
            <a 
              href="#contact" 
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:w-auto"
            >
              <Mail className="h-5 w-5" />
              무료 견적 문의
            </a>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">무엇이 필요하신가요?</h3>
          <p className="text-muted-foreground">정선 닥트가 제공하는 전문 서비스입니다.</p>
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
              <h3 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">최근 시공 사례</h3>
              <p className="text-muted-foreground">정선 사장님들이 직접 경험한 변화를 확인하세요.</p>
            </div>
            <a href="#" className="text-sm font-bold text-primary hover:underline">전체 사례 보기 &rarr;</a>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <BeforeAfterSlider 
                beforeImage="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" 
                afterImage="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80" 
              />
              <div className="px-2">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xl font-bold">사북읍 고깃집 주방 후드 교체</h4>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-primary">사북읍</span>
                </div>
                <p className="text-muted-foreground">기름때로 막혔던 노후 후드를 고성능 저소음 후드로 교체하여 쾌적한 주방으로 변신했습니다.</p>
              </div>
            </div>
            <div className="space-y-6">
              <BeforeAfterSlider 
                beforeImage="https://images.unsplash.com/photo-1590691515228-5fd7403f778a?w=800&q=80" 
                afterImage="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80" 
              />
              <div className="px-2">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xl font-bold">고한리 중식당 옥상 팬 수리</h4>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-primary">고한읍</span>
                </div>
                <p className="text-muted-foreground">이웃 민원의 원인이었던 옥상 배기 팬의 소음과 진동 문제를 베어링 교체 및 밸런싱으로 해결했습니다.</p>
              </div>
            </div>
          </div>
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
          <div className="space-y-8">
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

          <div className="rounded-3xl border bg-white p-6 shadow-xl md:p-10">
            <form className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold" htmlFor="name">
                    <User className="h-4 w-4 text-muted-foreground" /> 성함 / 업소명
                  </label>
                  <input 
                    id="name" 
                    type="text" 
                    placeholder="홍길동 / 정선식당"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold" htmlFor="phone">
                    <Phone className="h-4 w-4 text-muted-foreground" /> 연락처
                  </label>
                  <input 
                    id="phone" 
                    type="tel" 
                    placeholder="010-1234-5678"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold" htmlFor="region">
                  <MapPin className="h-4 w-4 text-muted-foreground" /> 지역 선택
                </label>
                <select 
                  id="region"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
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
                  placeholder="예: 주방 후드 소음이 심합니다. / 닥트 신규 설치 견적 문의합니다."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold cursor-pointer" htmlFor="photo">
                   <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">현장 사진 첨부 (선택)</span>
                    <input id="photo" type="file" className="hidden" accept="image/*" />
                   </div>
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full rounded-2xl bg-primary py-5 text-xl font-black text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-95"
              >
                무료 견적 신청하기
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="flex flex-col items-start rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-6 rounded-2xl bg-blue-50 p-4">
        {icon}
      </div>
      <h4 className="mb-3 text-xl font-bold">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 justify-center md:justify-start">
      <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0" />
      <span className="text-lg font-semibold">{text}</span>
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
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        {isLink ? (
          <a href={`tel:${value}`} className="text-xl font-bold text-primary hover:underline">{value}</a>
        ) : (
          <div className="text-xl font-bold">{value}</div>
        )}
      </div>
    </div>
  );
}
