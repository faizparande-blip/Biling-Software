import React from 'react';

/**
 * Local vector produce graphics for M.A.B TRADERS.
 * Zero external network dependency. Synchronous, high-fidelity SVG.
 * Maintains strict aspect ratio (preserveAspectRatio="xMidYMid meet").
 */

export const PomegranateGraphic = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`produce-vector pomegranate-vector ${className}`}
    aria-label="Pomegranate (डाळिंब)"
  >
    {/* Crown / Calyx */}
    <path
      d="M50 14 L42 22 L45 28 L55 28 L58 22 Z"
      fill="#991b1b"
      stroke="#7f1d1d"
      strokeWidth="1.5"
    />
    <path d="M40 18 L34 10 L44 18" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 14 L50 6 L52 14" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M60 18 L66 10 L56 18" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />

    {/* Fruit Main Body */}
    <circle cx="50" cy="56" r="38" fill="url(#pomGradLocal)" stroke="#7f1d1d" strokeWidth="2.5" />

    {/* Highlights and texture */}
    <ellipse cx="40" cy="42" rx="14" ry="10" fill="#fca5a5" opacity="0.4" />

    {/* Natural opening showing ripe ruby seeds */}
    <path
      d="M52 46 C64 46, 76 56, 74 72 C72 82, 58 84, 50 82 C46 80, 48 68, 50 58 Z"
      fill="#450a0a"
      stroke="#7f1d1d"
      strokeWidth="1.5"
    />

    {/* Seeds (Arils) */}
    <circle cx="58" cy="56" r="3.2" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8" />
    <circle cx="65" cy="58" r="3.2" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.8" />
    <circle cx="56" cy="65" r="3.4" fill="#b91c1c" stroke="#450a0a" strokeWidth="0.8" />
    <circle cx="63" cy="67" r="3.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8" />
    <circle cx="70" cy="66" r="3" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.8" />
    <circle cx="59" cy="74" r="3.2" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.8" />
    <circle cx="66" cy="74" r="3.1" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8" />

    {/* Seed reflections */}
    <circle cx="57" cy="55" r="1" fill="#ffffff" opacity="0.8" />
    <circle cx="64" cy="57" r="1" fill="#ffffff" opacity="0.8" />
    <circle cx="62" cy="66" r="1" fill="#ffffff" opacity="0.8" />

    <defs>
      <radialGradient id="pomGradLocal" cx="38%" cy="38%" r="65%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="45%" stopColor="#dc2626" />
        <stop offset="85%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
    </defs>
  </svg>
);

export const MabLogoGraphic = ({ size = 52, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`mab-center-logo-vector ${className}`}
    aria-label="M.A.B Traders Logo"
  >
    {/* Outer red ring with thin white border */}
    <circle cx="50" cy="50" r="48" fill="#b91c1c" stroke="#991b1b" strokeWidth="2" />
    <circle cx="50" cy="50" r="44" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="41" fill="none" stroke="#fca5a5" strokeWidth="0.8" strokeDasharray="3 2" />

    {/* Central Bold White Letters MAB */}
    <text
      x="50"
      y="58"
      textAnchor="middle"
      fill="#ffffff"
      fontFamily="'Arial Black', 'Impact', sans-serif"
      fontSize="26"
      fontWeight="900"
      letterSpacing="1.5"
    >
      MAB
    </text>
  </svg>
);

export const OnionGraphic = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`produce-vector onion-vector ${className}`}
    aria-label="Onion (कांदा)"
  >
    {/* Green sprout shoot at the top */}
    <path
      d="M48 24 C44 14, 38 6, 32 4 C36 10, 42 18, 46 25 Z"
      fill="#15803d"
      stroke="#166534"
      strokeWidth="1"
    />
    <path
      d="M50 22 C52 12, 54 4, 52 2 C54 8, 54 16, 52 24 Z"
      fill="#16a34a"
      stroke="#15803d"
      strokeWidth="1"
    />
    <path
      d="M52 24 C58 14, 66 8, 72 6 C66 12, 60 18, 56 25 Z"
      fill="#22c55e"
      stroke="#15803d"
      strokeWidth="1"
    />

    {/* Onion Bulb Body */}
    <path
      d="M50 24 C28 24, 14 42, 14 62 C14 80, 30 90, 50 90 C70 90, 86 80, 86 62 C86 42, 72 24, 50 24 Z"
      fill="url(#onionGradLocal)"
      stroke="#701a75"
      strokeWidth="2.5"
    />

    {/* Papery Onion Scales */}
    <path
      d="M50 24 C38 34, 30 52, 30 68 C30 78, 38 86, 50 90"
      stroke="#a21caf"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.8"
      fill="none"
    />
    <path
      d="M50 24 C62 34, 70 52, 70 68 C70 78, 62 86, 50 90"
      stroke="#a21caf"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.8"
      fill="none"
    />
    <path
      d="M50 24 C44 38, 40 54, 40 70 C40 80, 44 87, 50 90"
      stroke="#86198f"
      strokeWidth="1.2"
      fill="none"
      opacity="0.6"
    />
    <path
      d="M50 24 C56 38, 60 54, 60 70 C60 80, 56 87, 50 90"
      stroke="#86198f"
      strokeWidth="1.2"
      fill="none"
      opacity="0.6"
    />

    {/* Bottom Rootlets */}
    <path d="M46 90 L44 97 M48 90 L48 98 M52 90 L53 97 M55 90 L57 95" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" />

    {/* Highlights */}
    <ellipse cx="32" cy="48" rx="8" ry="14" transform="rotate(-20 32 48)" fill="#fdf4ff" opacity="0.35" />

    <defs>
      <radialGradient id="onionGradLocal" cx="42%" cy="42%" r="60%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="35%" stopColor="#c026d3" />
        <stop offset="75%" stopColor="#86198f" />
        <stop offset="100%" stopColor="#581c87" />
      </radialGradient>
    </defs>
  </svg>
);
