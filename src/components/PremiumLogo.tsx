import React from "react";
import { motion } from "motion/react";

interface PremiumLogoProps {
  className?: string;
  glow?: boolean;
}

export default function PremiumLogo({ className = "w-10 h-10", glow = true }: PremiumLogoProps) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-sky-500/25 rounded-xl blur-lg animate-pulse" />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        {/* Definition block for gradients */}
        <defs>
          <linearGradient id="premiumLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="hexagonStroke" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon Chamber */}
        <polygon
          points="50,5 90,28 90,72 50,95 10,72 10,28"
          fill="#030712"
          stroke="url(#hexagonStroke)"
          strokeWidth="3.5"
          className="stroke-slate-800"
        />

        {/* Dynamic Circuited Hexagon (slightly smaller index offset) */}
        <motion.polygon
          points="50,12 83,31 83,69 50,88 17,69 17,31"
          stroke="url(#premiumLogoGrad)"
          strokeWidth="2.5"
          strokeDasharray="240"
          animate={{
            strokeDashoffset: [240, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          fill="none"
        />

        {/* Microchip nodes connection */}
        <path
          d="M 50,12 L 50,28 M 83,31 L 70,38 M 83,69 L 70,62 M 50,88 L 50,72 M 17,69 L 30,62 M 17,31 L 30,38"
          stroke="url(#premiumLogoGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Central Core Processor unit */}
        <rect
          x="35"
          y="35"
          width="30"
          height="30"
          rx="6"
          fill="#0c1524"
          stroke="url(#premiumLogoGrad)"
          strokeWidth="2"
        />

        {/* Internal core light pulsar */}
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="#38bdf8"
          animate={{
            r: [4, 8, 4],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Micro Pin Accents */}
        <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
        
        {/* Telemetry Corner indicators */}
        <circle cx="50" cy="28" r="1.5" fill="#10b981" />
        <circle cx="70" cy="38" r="1.5" fill="#38bdf8" />
        <circle cx="70" cy="62" r="1.5" fill="#4f46e5" />
        <circle cx="50" cy="72" r="1.5" fill="#10b981" />
        <circle cx="30" cy="62" r="1.5" fill="#38bdf8" />
        <circle cx="30" cy="38" r="1.5" fill="#4f46e5" />
      </svg>
    </div>
  );
}
