import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const svgSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  };

  return (
    <div className={`group flex items-center gap-3 transition-all ${className}`}>
      {/* Icon Badge */}
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-xl border border-amber-500/35 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-amber-950/40 p-1.5 shadow-[0_0_18px_rgba(245,158,11,0.22)] backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/60 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] ${iconSizes[size]}`}
      >
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60" />
        
        {/* Modern Vector Emblem */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`relative z-10 text-amber-400 transition-transform duration-300 group-hover:rotate-[-4deg] ${svgSizes[size]}`}
        >
          <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="shield-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Shield / Radar Outline */}
          <path
            d="M12 2.75L19.5 6V11.5C19.5 16.2 16.3 20.35 12 21.5C7.7 20.35 4.5 16.2 4.5 11.5V6L12 2.75Z"
            stroke="url(#shield-stroke)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Pulse / Failure Detection Waveform & Check */}
          <path
            d="M8.5 12L10.75 14.5L15.5 9.5"
            stroke="url(#logo-grad)"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Radar scan node dot */}
          <circle cx="16.5" cy="7.5" r="1.25" fill="#fbbf24" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className={`font-display font-bold tracking-tight text-[color:var(--foreground)] ${textSizes[size]}`}>
          Smart Failure Detection
        </span>
      )}
    </div>
  );
}
