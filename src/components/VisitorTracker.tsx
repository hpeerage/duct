"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // 세션 내 중복 방문 기록 방지 (sessionStorage 활용)
        const hasVisited = sessionStorage.getItem("has_visited");
        if (hasVisited) return;

        // 방문 기록 추가
        const { error } = await supabase
          .from("visitor_logs")
          .insert([{ 
            session_id: Math.random().toString(36).substring(7) // 간단한 세션 식별자
          }]);

        if (!error) {
          sessionStorage.setItem("has_visited", "true");
        }
      } catch (err) {
        console.warn("Visitor tracking failed:", err);
      }
    };

    trackVisit();
  }, []);

  return null; // UI 없이 기능만 수행
}
