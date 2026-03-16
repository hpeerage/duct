"use client";

import { motion } from "framer-motion";
import { CheckCircle2, PhoneCall, Hammer, Wrench, ShieldCheck, Mail } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-primary py-20 text-center text-white md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
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

      {/* Trust Points */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <TrustPoint text="강원도 정선 지역 전문" />
            <TrustPoint text="1시간 이내 신속 출동" />
            <TrustPoint text="정직하고 합리적인 비용" />
            <TrustPoint text="철저한 사후 A/S 보장" />
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section id="contact" className="container mx-auto mb-20 px-4">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-white md:py-20">
          <h3 className="mb-6 text-3xl font-bold md:text-4xl">혼자 고민하지 마세요.</h3>
          <p className="mb-10 text-lg text-blue-100">전화 한 통이면 주방 고민이 해결됩니다.</p>
          <a 
            href="tel:010-0000-0000" 
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-10 py-5 text-xl font-black text-primary transition-transform hover:scale-105"
          >
            010-0000-0000
          </a>
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
      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
      <span className="text-lg font-semibold">{text}</span>
    </div>
  );
}
