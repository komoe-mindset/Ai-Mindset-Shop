import React from 'react';

/**
 * Mindy Mascot
 * A cute round lavender robot with a star antenna, mint apron, big friendly eyes, and a shopping bag.
 * Pure vector SVG illustration with no embedded text inside the image.
 */
export default function MindyMascot({ mood = 'welcome', size = 180, className = '' }) {
  // mood: 'welcome' | 'empty' | 'celebrate' | 'mini'
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Mindy the Robot Mascot"
    >
      <svg
        viewBox="0 0 240 240"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="50" y1="50" x2="190" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D4C8FF" />
            <stop offset="0.6" stopColor="#B9A7F5" />
            <stop offset="1" stopColor="#9B82EB" />
          </linearGradient>
          <linearGradient id="apronGrad" x1="80" y1="130" x2="160" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#C4F4E4" />
            <stop offset="1" stopColor="#87D4BA" />
          </linearGradient>
          <linearGradient id="starGrad" x1="110" y1="12" x2="130" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF176" />
            <stop offset="1" stopColor="#FFC107" />
          </linearGradient>
          <linearGradient id="bagGrad" x1="170" y1="140" x2="215" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFDEE9" />
            <stop offset="1" stopColor="#FFB6C1" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="120" cy="216" rx="64" ry="12" fill="#2D2A45" fillOpacity="0.12" />

        {/* Star Antenna */}
        {/* Antenna rod */}
        <path d="M120 72 L120 42" stroke="#8D74EB" strokeWidth="6" strokeLinecap="round" />
        <circle cx="120" cy="46" r="5" fill="#A8E6CF" />

        {/* Shiny 5-point Star on top of antenna */}
        <g transform="translate(120, 26)">
          <path
            d="M 0 -16 L 4.5 -5 L 16 -4 L 7.5 4 L 10 15 L 0 9 L -10 15 L -7.5 4 L -16 -4 L -4.5 -5 Z"
            fill="url(#starGrad)"
            stroke="#F59E0B"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Star twinkle highlight */}
          <circle cx="-3" cy="-4" r="2.5" fill="#FFFFFF" fillOpacity="0.9" />
        </g>

        {/* Robot Ears / Side Sensors */}
        <rect x="36" y="98" width="16" height="28" rx="8" fill="#8D74EB" />
        <rect x="40" y="103" width="8" height="18" rx="4" fill="#A8E6CF" />

        <rect x="188" y="98" width="16" height="28" rx="8" fill="#8D74EB" />
        <rect x="192" y="103" width="8" height="18" rx="4" fill="#A8E6CF" />

        {/* Little Cute Robot Feet */}
        <ellipse cx="98" cy="210" rx="16" ry="8" fill="#8D74EB" />
        <ellipse cx="142" cy="210" rx="16" ry="8" fill="#8D74EB" />
        <ellipse cx="98" cy="208" rx="13" ry="5" fill="#D4C8FF" />
        <ellipse cx="142" cy="208" rx="13" ry="5" fill="#D4C8FF" />

        {/* Main Round Lavender Robot Body */}
        <rect
          x="48"
          y="68"
          width="144"
          height="136"
          rx="68"
          fill="url(#bodyGrad)"
          stroke="#7E65DE"
          strokeWidth="3.5"
        />

        {/* Glossy Head Highlight */}
        <path
          d="M 80 82 C 100 74 140 74 160 82"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />

        {/* Robot Face Screen Container */}
        <rect
          x="66"
          y="88"
          width="108"
          height="62"
          rx="28"
          fill="#FFFFFF"
          stroke="#EDE9FE"
          strokeWidth="2"
        />

        {/* Rosy Blush Cheeks */}
        <ellipse cx="78" cy="128" rx="10" ry="6" fill="#FFB7C5" fillOpacity="0.75" />
        <ellipse cx="162" cy="128" rx="10" ry="6" fill="#FFB7C5" fillOpacity="0.75" />

        {/* Friendly Big Eyes depending on Mood */}
        {mood === 'welcome' && (
          <g>
            {/* Left Big Eye */}
            <circle cx="96" cy="115" r="13" fill="#2D2A45" />
            <circle cx="92" cy="111" r="5" fill="#FFFFFF" />
            <circle cx="101" cy="120" r="2.5" fill="#FFFFFF" />

            {/* Right Big Eye */}
            <circle cx="144" cy="115" r="13" fill="#2D2A45" />
            <circle cx="140" cy="111" r="5" fill="#FFFFFF" />
            <circle cx="149" cy="120" r="2.5" fill="#FFFFFF" />

            {/* Happy Smile */}
            <path
              d="M 112 128 Q 120 136 128 128"
              stroke="#2D2A45"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {mood === 'empty' && (
          <g>
            {/* Curious / slightly concerned cute eyes */}
            <circle cx="96" cy="116" r="12" fill="#2D2A45" />
            <circle cx="94" cy="113" r="4.5" fill="#FFFFFF" />
            
            <circle cx="144" cy="116" r="12" fill="#2D2A45" />
            <circle cx="142" cy="113" r="4.5" fill="#FFFFFF" />

            {/* Thoughtful small round mouth */}
            <circle cx="120" cy="130" r="4" fill="#2D2A45" />
          </g>
        )}

        {mood === 'celebrate' && (
          <g>
            {/* Star Joy Sparkle Eyes */}
            <path
              d="M 96 106 L 98 113 L 105 115 L 98 117 L 96 124 L 94 117 L 87 115 L 94 113 Z"
              fill="#2D2A45"
            />
            {/* Right winking joyful curve */}
            <path
              d="M 136 117 Q 144 107 152 117"
              stroke="#2D2A45"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Open happy laugh */}
            <path
              d="M 112 125 Q 120 139 128 125 Z"
              fill="#FF6B8B"
              stroke="#2D2A45"
              strokeWidth="2.5"
            />
            {/* Floating celebration stars */}
            <path d="M 50 60 L 53 66 L 59 67 L 54 71 L 56 78 L 50 74 L 44 78 L 46 71 L 41 67 L 47 66 Z" fill="#F59E0B" />
            <path d="M 190 56 L 192 61 L 197 62 L 193 65 L 195 71 L 190 68 L 185 71 L 187 65 L 183 62 L 188 61 Z" fill="#F59E0B" />
          </g>
        )}

        {/* Mint Apron */}
        <g id="mint-apron">
          {/* Apron straps */}
          <path d="M 88 152 L 98 160" stroke="#74C8AB" strokeWidth="4" strokeLinecap="round" />
          <path d="M 152 152 L 142 160" stroke="#74C8AB" strokeWidth="4" strokeLinecap="round" />
          {/* Apron main cloth */}
          <path
            d="M 86 160 C 86 156 94 154 120 154 C 146 154 154 156 154 160 L 158 196 C 158 202 150 205 120 205 C 90 205 82 202 82 196 Z"
            fill="url(#apronGrad)"
            stroke="#5EB597"
            strokeWidth="2.5"
          />
          {/* Apron Front Pocket */}
          <path
            d="M 104 174 H 136 C 136 186 132 192 120 192 C 108 192 104 186 104 174 Z"
            fill="#FFFFFF"
            fillOpacity="0.85"
            stroke="#74C8AB"
            strokeWidth="1.8"
          />
          {/* Small Heart on Apron Pocket */}
          <path
            d="M 120 185 C 117 181 113 182 113 185 C 113 188 120 190 120 190 C 120 190 127 188 127 185 C 127 182 123 181 120 185 Z"
            fill="#B9A7F5"
          />
        </g>

        {/* Cute Robot Arms */}
        {/* Left Arm waving slightly */}
        <path
          d="M 52 150 Q 30 145 38 130"
          stroke="#8D74EB"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="38" cy="129" r="6.5" fill="#D4C8FF" stroke="#7E65DE" strokeWidth="2" />

        {/* Right Arm holding Shopping Bag */}
        <path
          d="M 188 150 Q 206 156 202 170"
          stroke="#8D74EB"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Shopping Bag (No text inside) */}
        <g id="shopping-bag" transform="translate(182, 158)">
          {/* Bag Handle */}
          <path
            d="M 12 12 C 12 0 28 0 28 12"
            stroke="#2D2A45"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Bag Body */}
          <path
            d="M 5 10 L 35 10 L 38 44 C 38 46 36 48 33 48 L 7 48 C 4 48 2 46 2 44 Z"
            fill="#A8E6CF"
            stroke="#5EB597"
            strokeWidth="2.5"
          />
          {/* Bag Fold & Accent */}
          <path d="M 5 10 L 10 18 L 30 18 L 35 10" fill="#74C8AB" fillOpacity="0.4" />
          {/* Bag Heart Badge */}
          <circle cx="20" cy="30" r="7" fill="#FFF8EC" />
          <path
            d="M 20 32 C 18 29.5 15 30 15 32 C 15 34 20 36 20 36 C 20 36 25 34 25 32 C 25 30 22 29.5 20 32 Z"
            fill="#B9A7F5"
          />
        </g>
      </svg>
    </div>
  );
}
