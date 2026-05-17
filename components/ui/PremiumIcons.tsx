import React from "react";

interface IconProps {
  className?: string;
}

export function MetaCheckerIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="meta-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="meta-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="meta-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Outer circular radar lines */}
      <circle cx="20" cy="20" r="16" stroke="url(#meta-grad-2)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="20" cy="20" r="11" stroke="url(#meta-grad-1)" strokeWidth="1" opacity="0.4" />
      
      {/* Background document preview grid */}
      <rect x="8" y="12" width="10" height="2" rx="1" fill="#cbd5e1" opacity="0.8" />
      <rect x="8" y="17" width="16" height="1.5" rx="0.75" fill="#cbd5e1" opacity="0.5" />
      <rect x="8" y="21" width="12" height="1.5" rx="0.75" fill="#cbd5e1" opacity="0.5" />

      {/* Futuristic glowing magnifying glass */}
      <g filter="url(#meta-glow)">
        <circle cx="28" cy="24" r="8" stroke="url(#meta-grad-1)" strokeWidth="3" fill="#ffffff" fillOpacity="0.1" />
        <path d="M33.5 29.5L43 39" stroke="url(#meta-grad-1)" strokeWidth="3.5" strokeLinecap="round" />
        {/* Shiny glass highlight reflection */}
        <path d="M23 21C24.5 19.5 26.5 19 28 19.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      </g>
      
      {/* Glowing scanning target dot */}
      <circle cx="28" cy="24" r="2" fill="url(#meta-grad-2)" />
    </svg>
  );
}

export function WordCounterIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="word-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="word-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      
      {/* Curved background stat badge */}
      <circle cx="36" cy="14" r="9" fill="url(#word-grad-2)" opacity="0.15" />
      <circle cx="36" cy="14" r="6" stroke="url(#word-grad-2)" strokeWidth="1.5" strokeDasharray="2 2" />

      {/* Main 3D sheet of paper */}
      <rect x="6" y="8" width="28" height="34" rx="4" fill="#ffffff" stroke="url(#word-grad-1)" strokeWidth="2" />
      
      {/* Folded paper corner effect */}
      <path d="M28 8V14H34" fill="#fef3c7" stroke="url(#word-grad-1)" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Text lines represent content */}
      <rect x="10" y="16" width="12" height="2" rx="1" fill="url(#word-grad-2)" />
      <rect x="10" y="22" width="20" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="10" y="26" width="16" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="10" y="30" width="20" height="1.5" rx="0.75" fill="#94a3b8" />
      <rect x="10" y="34" width="10" height="1.5" rx="0.75" fill="#94a3b8" />

      {/* Stats micro-circle */}
      <circle cx="36" cy="14" r="3.5" fill="url(#word-grad-1)" />
    </svg>
  );
}

export function CaseConverterIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="case-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="case-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <filter id="case-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Left box: Uppercase letter A */}
      <g filter="url(#case-shadow)">
        <rect x="4" y="10" width="18" height="22" rx="4" fill="#ffffff" stroke="url(#case-grad-1)" strokeWidth="2" />
        <text x="9" y="26" fill="url(#case-grad-1)" fontSize="15" fontWeight="900" fontFamily="sans-serif">A</text>
      </g>

      {/* Right box: Lowercase letter a */}
      <g filter="url(#case-shadow)">
        <rect x="26" y="16" width="18" height="22" rx="4" fill="#ffffff" stroke="url(#case-grad-1)" strokeWidth="2" />
        <text x="32" y="32" fill="url(#case-grad-1)" fontSize="14" fontWeight="900" fontFamily="sans-serif">a</text>
      </g>

      {/* Floating transformation arrow loop */}
      <path
        d="M21 16C23 13 25.5 13 27 15"
        stroke="url(#case-grad-1)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 15L24 18M27 15L28 11"
        stroke="url(#case-grad-1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      <path
        d="M27 32C25 35 22.5 35 21 33"
        stroke="url(#case-grad-1)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M21 33L24 30M21 33L20 37"
        stroke="url(#case-grad-1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImageCompressorIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="comp-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="comp-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Picture Frame with sleek rounded corners */}
      <rect x="6" y="10" width="36" height="28" rx="5" fill="#ffffff" stroke="url(#comp-grad-1)" strokeWidth="2.5" />
      
      {/* Glossy inner background */}
      <rect x="9" y="13" width="30" height="22" rx="3.5" fill="#f8fafc" />

      {/* Mountain vectors inside picture */}
      <path d="M9 30L18 20L26 28L33 22L39 30" stroke="url(#comp-grad-1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Gradient glowing sun inside image */}
      <circle cx="16" cy="18" r="3.5" fill="url(#comp-grad-1)" />

      {/* Glowing compression arrows pointing inward (up and down) */}
      <g opacity="0.9">
        {/* Top down compression arrow */}
        <path d="M24 3V10M24 10L21 7M24 10L27 7" stroke="url(#comp-grad-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Bottom up compression arrow */}
        <path d="M24 45V38M24 38L21 41M24 38L27 41" stroke="url(#comp-grad-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ImageResizerIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="resize-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Outer original boundary frame (dotted) */}
      <rect x="6" y="6" width="36" height="36" rx="4" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* Inner resized preview boundary (solid) */}
      <rect x="6" y="16" width="26" height="26" rx="4" fill="#ffffff" stroke="url(#resize-grad-1)" strokeWidth="2.5" />

      {/* Picture details inside the resized solid box */}
      <circle cx="13" cy="23" r="2.5" fill="url(#resize-grad-1)" />
      <path d="M9 36L14 30L20 36" stroke="url(#resize-grad-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Anchor drag nodes (interactive circles at the resizing corners) */}
      <circle cx="32" cy="16" r="3" fill="#ffffff" stroke="url(#resize-grad-1)" strokeWidth="2" />
      <circle cx="6" cy="16" r="3" fill="#ffffff" stroke="url(#resize-grad-1)" strokeWidth="2" />
      <circle cx="32" cy="42" r="3" fill="#ffffff" stroke="url(#resize-grad-1)" strokeWidth="2" />

      {/* Outward expansion arrow (showing resize motion) */}
      <path d="M26 22L38 10" stroke="url(#resize-grad-1)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 10H38V16" stroke="url(#resize-grad-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ImageConverterIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="conv-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="conv-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="conv-shadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.5" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Floating 3D Card 1: PNG format (bottom layer) */}
      <g filter="url(#conv-shadow)" opacity="0.6">
        <rect x="6" y="16" width="18" height="24" rx="3.5" fill="#ffffff" stroke="url(#conv-grad-2)" strokeWidth="1.5" />
        <rect x="9" y="20" width="12" height="1.5" fill="#e2e8f0" />
        <rect x="9" y="24" width="8" height="1.5" fill="#e2e8f0" />
        <text x="9" y="34" fill="url(#conv-grad-2)" fontSize="6" fontWeight="bold" fontFamily="sans-serif">PNG</text>
      </g>

      {/* Floating 3D Card 2: JPG format (top layer) */}
      <g filter="url(#conv-shadow)">
        <rect x="24" y="8" width="18" height="24" rx="3.5" fill="#ffffff" stroke="url(#conv-grad-1)" strokeWidth="2.2" />
        <circle cx="29" cy="14" r="2" fill="url(#conv-grad-1)" />
        <path d="M27 24L31 20L35 24" stroke="url(#conv-grad-1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="27" y="29" fill="url(#conv-grad-1)" fontSize="6.5" fontWeight="black" fontFamily="sans-serif">JPG</text>
      </g>

      {/* Orbital exchange sweep arrows in center */}
      <path
        d="M21 14C23 18 24 20 22 23"
        stroke="url(#conv-grad-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M22 23L18 21M22 23L24 20"
        stroke="url(#conv-grad-1)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CharacterCounterIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="char-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Grid of keys representing keyboard layout */}
      <rect x="6" y="8" width="10" height="8" rx="2" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" />
      <rect x="19" y="8" width="10" height="8" rx="2" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" />
      <rect x="32" y="8" width="10" height="8" rx="2" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" opacity="0.5" />
      
      {/* Row 2 */}
      <rect x="6" y="19" width="10" height="8" rx="2" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" opacity="0.5" />
      
      {/* Center glowing key with 'C' */}
      <g>
        <rect x="19" y="19" width="10" height="8" rx="2" fill="url(#char-grad-1)" />
        <text x="22" y="25" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">C</text>
      </g>
      
      <rect x="32" y="19" width="10" height="8" rx="2" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" />

      {/* Row 3 - Spacebar and modifiers */}
      <rect x="6" y="30" width="7" height="8" rx="1.5" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" opacity="0.5" />
      <rect x="16" y="30" width="16" height="8" rx="2" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" />
      <rect x="35" y="30" width="7" height="8" rx="1.5" fill="#ffffff" stroke="url(#char-grad-1)" strokeWidth="1.5" />

      {/* Glowing connection wave (represents metrics/analysis) */}
      <path d="M12 42C18 39 22 45 28 42C34 39 37 43 42 41" stroke="url(#char-grad-1)" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

export function PasswordGeneratorIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="pass-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="pass-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="pass-glow" x="-10%" y="-10%" width="125%" height="125%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Sleek metallic security shield */}
      <path
        d="M24 6C15 9 10 15 10 24C10 33 18 39 24 42C30 39 38 33 38 24C38 15 33 9 24 6Z"
        fill="#ffffff"
        stroke="url(#pass-grad-1)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* Inner accent shield */}
      <path
        d="M24 9.5C17.5 12 13.5 17 13.5 24C13.5 30.5 19.5 35 24 37.5C28.5 35 34.5 30.5 34.5 24C34.5 17 30.5 12 24 9.5Z"
        fill="url(#pass-grad-2)"
        fillOpacity="0.08"
        stroke="url(#pass-grad-2)"
        strokeWidth="1.2"
        strokeDasharray="2 2"
      />

      {/* Cybernetic Key floating on top */}
      <g filter="url(#pass-glow)">
        <circle cx="20" cy="22" r="5" stroke="url(#pass-grad-1)" strokeWidth="3" fill="#ffffff" />
        <circle cx="20" cy="22" r="1.5" fill="url(#pass-grad-1)" />
        
        {/* Key shaft */}
        <path d="M25 22H33" stroke="url(#pass-grad-1)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Key teeth */}
        <path d="M30 22V25M33 22V25" stroke="url(#pass-grad-1)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function SpeedIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="speed-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="speed-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <filter id="speed-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Speedometer concentric arcs */}
      <path
        d="M8 36C6 30 8 20 14 14C20 8 30 7 36 12C41 17 43 26 40 33"
        stroke="#e2e8f0"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M12 33C10 28 11.5 20 16.5 15.5C21.5 11 29.5 10.5 34.5 14.5C38.5 18 39.5 25.5 37 31"
        stroke="url(#speed-grad-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 3"
        opacity="0.8"
      />

      {/* Dynamic 3D Glowing energy rays */}
      <g filter="url(#speed-glow)">
        <path
          d="M27 6L14 26H25L21 42L34 22H23L27 6Z"
          fill="url(#speed-grad-1)"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function AccuracyIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="acc-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="acc-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
        <filter id="acc-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#ea580c" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Concentric target rings */}
      <circle cx="24" cy="24" r="18" stroke="url(#acc-grad-1)" strokeWidth="3" fill="#ffffff" filter="url(#acc-glow)" />
      <circle cx="24" cy="24" r="12" stroke="url(#acc-grad-1)" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="24" cy="24" r="7" stroke="url(#acc-grad-1)" strokeWidth="2" fill="url(#acc-grad-2)" fillOpacity="0.3" />
      
      {/* Precision Crosshairs */}
      <path d="M24 2V10M24 38V46M2 24H10M38 24H46" stroke="url(#acc-grad-1)" strokeWidth="2" strokeLinecap="round" />

      {/* Sleek diagonal arrow hitting the bullseye */}
      <g>
        {/* Arrow shaft */}
        <path d="M40 8L25.5 22.5" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
        
        {/* Arrow feathers */}
        <path d="M37 5L42 10M34 8L39 13" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

        {/* Glowing impact spot */}
        <circle cx="24" cy="24" r="3.5" fill="url(#acc-grad-1)" />
        <circle cx="24" cy="24" r="1" fill="#ffffff" />
      </g>
    </svg>
  );
}

export function ClarityIcon({ className = "h-8 w-8" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="clar-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="clar-grad-2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
        </linearGradient>
        <filter id="clar-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Soft circular background glow ray */}
      <circle cx="24" cy="24" r="15" fill="url(#clar-grad-1)" opacity="0.08" />

      {/* Sparkling multi-faceted premium 3D diamond */}
      <g filter="url(#clar-glow)">
        {/* Main Diamond Body */}
        <path
          d="M14 14H34L41 22L24 40L7 22L14 14Z"
          fill="#ffffff"
          stroke="url(#clar-grad-1)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Facet lines */}
        <path d="M14 14L24 22M34 14L24 22M7 22H41M24 22V40M7 22L24 22M41 22L24 22" stroke="url(#clar-grad-1)" strokeWidth="1.5" strokeLinejoin="round" />
        
        {/* Diamond table facets */}
        <path d="M14 14H24H34" stroke="url(#clar-grad-1)" strokeWidth="2.5" />
      </g>

      {/* Magical Star Sparkles around the diamond */}
      <g>
        {/* Star 1 */}
        <path d="M38 6V12M35 9H41" stroke="url(#clar-grad-1)" strokeWidth="1.5" strokeLinecap="round" />
        {/* Star 2 */}
        <path d="M10 34V38M8 36H12" stroke="url(#clar-grad-1)" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function HomeIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="home-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="home-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#ea580c" floodOpacity="0.15" />
        </filter>
      </defs>
      <g filter="url(#home-glow)">
        {/* Sleek 3D house frame */}
        <path
          d="M24 6L8 18V40C8 41.1 8.9 42 10 42H18V30H30V42H38C39.1 42 40 41.1 40 40V18L24 6Z"
          fill="#ffffff"
          stroke="url(#home-grad-1)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Glowing door indicator */}
        <rect x="22" y="34" width="4" height="8" rx="1" fill="url(#home-grad-1)" />
        {/* Circular glass window */}
        <circle cx="24" cy="17" r="3" stroke="url(#home-grad-1)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function ExploreIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="exp-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="exp-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
      {/* Outer compass ring */}
      <circle cx="24" cy="24" r="18" stroke="url(#exp-grad-1)" strokeWidth="2.5" fill="#ffffff" />
      <circle cx="24" cy="24" r="14" stroke="url(#exp-grad-1)" strokeWidth="1" strokeDasharray="2 2" />
      
      {/* Compass cardinal dots */}
      <circle cx="24" cy="10" r="1" fill="url(#exp-grad-1)" />
      <circle cx="24" cy="38" r="1" fill="url(#exp-grad-1)" />
      <circle cx="10" cy="24" r="1" fill="url(#exp-grad-1)" />
      <circle cx="38" cy="24" r="1" fill="url(#exp-grad-1)" />

      {/* Futuristic 3D compass needle */}
      <g>
        {/* North pointer (Orange) */}
        <path d="M24 24L28 16L24 10L20 16L24 24Z" fill="url(#exp-grad-1)" stroke="url(#exp-grad-1)" strokeWidth="1" strokeLinejoin="round" />
        {/* South pointer (Amber) */}
        <path d="M24 24L20 32L24 38L28 32L24 24Z" fill="url(#exp-grad-2)" stroke="url(#exp-grad-1)" strokeWidth="1" strokeLinejoin="round" />
        
        <circle cx="24" cy="24" r="2.5" fill="#ffffff" stroke="url(#exp-grad-1)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function BlogIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blog-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      {/* Background folder/sheet preview shadow */}
      <path d="M12 12H38V40H12V12Z" fill="#f8fafc" />

      {/* Main sleek 3D Newsletter fold */}
      <path
        d="M8 8H36C37.1 8 38 8.9 38 10V38C38 39.1 37.1 40 36 40H8C6.9 40 6 39.1 6 38V10C6 8.9 6.9 8 8 8Z"
        fill="#ffffff"
        stroke="url(#blog-grad-1)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Front folded corner */}
      <path d="M32 8V14H38" fill="#ffedd5" stroke="url(#blog-grad-1)" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Header section of blog card */}
      <rect x="10" y="14" width="12" height="6" rx="1" fill="url(#blog-grad-1)" />

      {/* Content lines */}
      <rect x="10" y="24" width="20" height="2" rx="1" fill="url(#blog-grad-1)" />
      <rect x="10" y="29" width="16" height="1.5" rx="0.75" fill="#cbd5e1" />
      <rect x="10" y="33" width="20" height="1.5" rx="0.75" fill="#cbd5e1" />
    </svg>
  );
}


