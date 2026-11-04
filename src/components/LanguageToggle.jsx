import React from 'react';
import { useShopStore } from '../store/shopStore.jsx';

export default function LanguageToggle({ className = '' }) {
  const { lang, setLanguage } = useShopStore();

  return (
    <div
      className={`inline-flex items-center p-1 bg-[#FFF8EC] border-2 border-[#2D2A45]/15 rounded-full shadow-inner ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
          lang === 'en'
            ? 'bg-[#B9A7F5] text-[#2D2A45] shadow-sm scale-105'
            : 'text-[#2D2A45]/70 hover:text-[#2D2A45]'
        }`}
      >
        🇬🇧 EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('mm')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
          lang === 'mm'
            ? 'bg-[#A8E6CF] text-[#2D2A45] shadow-sm scale-105'
            : 'text-[#2D2A45]/70 hover:text-[#2D2A45]'
        }`}
      >
        🇲🇲 MM
      </button>
    </div>
  );
}
