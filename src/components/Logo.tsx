import React from "react";
import { motion } from "motion/react";

interface LogoIconProps {
  className?: string;
}

export function LogoIcon({ className = "h-7 w-7" }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transform group-hover:scale-105 transition-transform duration-300`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" /> {/* orange-400 */}
          <stop offset="100%" stopColor="#ea580c" /> {/* orange-600 */}
        </linearGradient>
        <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#27272a" /> {/* zinc-800 */}
          <stop offset="100%" stopColor="#a1a1aa" /> {/* zinc-400 */}
        </linearGradient>
      </defs>

      {/* Golden Ratio Ring (Tilted Orbit) */}
      <path
        d="M 15 55 C 15 35, 85 25, 85 45 C 85 65, 15 75, 15 55"
        stroke="url(#ringGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        className="opacity-80"
      />

      {/* Dynamic Glowing Laser Accent on Orbit */}
      <path
        d="M 45 31 C 65 27, 85 32, 85 45 C 85 55, 60 63, 40 65"
        stroke="#f97316"
        strokeWidth="6"
        strokeLinecap="round"
        className="animate-pulse"
      />

      {/* Center Isometric Solo Pillar ("1") supporting a golden sphere */}
      {/* Back shadow of pillar */}
      <polygon
        points="46,80 54,80 54,35 46,35"
        fill="#7c2d12"
        className="opacity-40"
      />
      {/* Main Pillar Body */}
      <polygon
        points="45,78 55,78 55,30 45,30"
        fill="url(#pillarGrad)"
      />
      {/* Front highlight of pillar */}
      <polygon
        points="49,78 51,78 51,30 49,30"
        fill="#ffedd5"
        className="opacity-60"
      />

      {/* Golden Sphere of Leverage floating on top */}
      <circle
        cx="50"
        cy="20"
        r="8"
        fill="#fed7aa"
        className="animate-bounce"
        style={{ animationDuration: "3s" }}
      />
      <circle
        cx="48"
        cy="18"
        r="3"
        fill="#ffffff"
        className="opacity-80"
      />
    </svg>
  );
}

export default function Logo() {
  return (
    <div className="flex items-center gap-4 select-none group">
      {/* High-End Isometric Glowing Symbol */}
      <div className="relative h-13 w-13 flex items-center justify-center flex-shrink-0">
        {/* Glow effect backdrops */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl blur-md opacity-45 group-hover:opacity-65 transition-opacity duration-300" />
        <div className="absolute inset-0.5 bg-zinc-950 rounded-xl border border-zinc-800" />
        
        {/* Futuristic SVG Logo */}
        <LogoIcon className="relative h-9 w-9" />
      </div>

      {/* Exquisite Typography - Chinese on top, English below */}
      <div className="flex flex-col justify-center">
        {/* Chinese (Top) - Premium Sans Serif, enlarged for strong presence */}
        <span className="font-sans text-[20px] sm:text-[23px] font-black tracking-[0.16em] text-zinc-950 uppercase leading-none">
          一人公司
        </span>
        {/* English (Bottom) - Sleek Monospace */}
        <span className="mt-2 font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.08em] text-orange-500 uppercase leading-none">
          ONE PERSON COMPANY
        </span>
      </div>
    </div>
  );
}
