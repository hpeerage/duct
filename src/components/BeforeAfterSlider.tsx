"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoveLeft, MoveRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl cursor-col-resize select-none border shadow-inner group"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
    >
      {/* After Image (Base) */}
      <div className="absolute inset-0">
        <div className="absolute top-4 right-4 z-10 rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm opacity-90">
          시공 후
        </div>
        <Image 
          src={afterImage} 
          alt="After" 
          fill 
          className="object-cover"
          draggable={false}
          priority
        />
      </div>

      {/* Before Image (Top Overlay with Clip Path) */}
      <div 
        className="absolute inset-0 z-20 overflow-hidden" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="absolute top-4 left-4 z-10 rounded-lg bg-gray-600 px-3 py-1 text-xs font-bold text-white shadow-sm opacity-90">
          시공 전
        </div>
        <Image 
          src={beforeImage} 
          alt="Before" 
          fill 
          className="object-cover"
          draggable={false}
          priority
        />
      </div>

      {/* Slider Handle Line */}
      <div 
        className="absolute bottom-0 top-0 z-30 w-[2px] bg-white/80 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-x-150"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-xl active:scale-90 transition-all hover:scale-110">
          <div className="flex gap-0.5 pointer-events-none">
            <MoveLeft className="h-4 w-4" />
            <MoveRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
