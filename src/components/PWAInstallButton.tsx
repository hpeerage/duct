"use client";

import { useState, useEffect } from "react";
import { Download, X, Share, PlusSquare, ArrowBigDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // iOS 체크
    const isIOSDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    // 이미 설치되었는지 확인 (분산실행 모드)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return;
    }

    // Android/Desktop install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS의 경우 무조건 버튼을 보여주거나 특정 조건에서 보여줌
    if (isIOSDevice) {
      // 5초 후 버튼 노출 (사용자 방해 최소화)
      const timer = setTimeout(() => setShowButton(true), 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowButton(false);
    }
  };

  if (!showButton) return null;

  return (
    <>
      {/* Floating Install Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-6 z-50 sm:bottom-10 sm:left-10"
      >
        <button
          onClick={handleInstallClick}
          className="group flex items-center gap-3 rounded-full bg-slate-900 border border-slate-700 px-6 py-4 text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">App Install</span>
            <span className="text-sm font-black">앱 버전 설치하기</span>
          </div>
        </button>
      </motion.div>

      {/* iOS Manual Instruction Modal */}
      <AnimatePresence>
        {showIOSModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm rounded-[32px] bg-white p-8 shadow-2xl"
            >
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="space-y-6 text-center text-slate-900">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-primary">
                  <Share className="h-8 w-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">홈 화면에 추가</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    iPhone/iPad 사용자는 아래 순서대로<br />직접 바로가기를 만들 수 있습니다.
                  </p>
                </div>

                <div className="space-y-4 rounded-2xl bg-slate-50 p-6 text-left">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm border border-slate-100">1</div>
                    <p className="text-sm font-bold">하단 메뉴의 <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-200 p-1"><Share className="h-4 w-4" /></span> 버튼 클릭</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm border border-slate-100">2</div>
                    <p className="text-sm font-bold">메뉴를 올려 <span className="text-primary font-black">'홈 화면에 추가'</span> 클릭</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold shadow-sm border border-slate-100">3</div>
                    <p className="text-sm font-bold">우측 상단 <span className="text-primary font-black">'추가'</span>를 눌러 완료</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSModal(false)}
                  className="w-full rounded-2xl bg-primary py-4 text-lg font-black text-white shadow-lg active:scale-95 transition-transform"
                >
                  확인했습니다
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
