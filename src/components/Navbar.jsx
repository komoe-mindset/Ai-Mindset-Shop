import React from 'react';
import { ShoppingBag, Store, ShieldCheck, LogOut, Sparkles, ShoppingCart } from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import MindyMascot from './MindyMascot.jsx';

export default function Navbar({ currentRoute, onNavigate, onOpenCart }) {
  const { t, isAuthenticated, logout, cartTotalItems, isDemoMode } = useShopStore();

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8EC]/95 backdrop-blur-md border-b-2 border-[#2D2A45]/10 shadow-xs">
      {/* Top micro-banner for Telegram Web App context and Demo Data status */}
      <div className="bg-[#B9A7F5]/25 border-b border-[#2D2A45]/10 px-3 py-1 text-xs text-[#2D2A45] flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 font-bold text-[#6B4FD8]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {t.brand}
          </span>
          <span className="hidden sm:inline text-neutral-400">•</span>
          <span className="hidden sm:inline text-neutral-600 truncate">{t.tagline}</span>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFD6E0] text-[#8C2442] border border-[#FFA8BF]"
              title={t.demoDataActive}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E0315D] animate-ping"></span>
              {t.demoBadge}
            </span>
          )}
          <LanguageToggle />
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand logo & Mindy Avatar */}
        <button
          type="button"
          onClick={() => onNavigate('/shop')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-[#B9A7F5]/40 flex items-center justify-center border-2 border-[#8D74EB]/40 group-hover:scale-105 transition-transform overflow-hidden">
            <MindyMascot mood="welcome" size={42} className="relative top-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#2D2A45] font-display">
                AiMindset <span className="text-[#7857ED]">Shop</span>
              </span>
            </div>
            <p className="text-[11px] text-[#2D2A45]/60 font-semibold leading-none hidden xs:block">
              Myanmar Telegram Commerce
            </p>
          </div>
        </button>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Customer Shop link */}
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRoute === '/shop'
                ? 'bg-[#A8E6CF] text-[#1E4D3D] border-2 border-[#57B794] shadow-xs'
                : 'bg-white hover:bg-[#A8E6CF]/30 text-[#2D2A45] border-2 border-[#2D2A45]/15'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden xs:inline">{t.nav.customerShop}</span>
            <span className="xs:hidden">Shop</span>
          </button>

          {/* Merchant Dashboard link */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                onNavigate('/dashboard');
              } else {
                onNavigate('/login');
              }
            }}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRoute === '/dashboard' || currentRoute === '/login'
                ? 'bg-[#B9A7F5] text-[#2D2A45] border-2 border-[#8D74EB] shadow-xs'
                : 'bg-white hover:bg-[#B9A7F5]/30 text-[#2D2A45] border-2 border-[#2D2A45]/15'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.dashboard}</span>
            <span className="sm:hidden">Merchant</span>
          </button>

          {/* Cart Trigger button (Shown prominently in customer shop mode) */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open Cart"
            className="relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm bg-[#FFD6E0] text-[#2D2A45] border-2 border-[#EAA4B5] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingCart className="w-4 h-4 text-[#8C2442]" />
            <span className="hidden xs:inline font-bold">{t.shop.cartButton}</span>
            {cartTotalItems > 0 && (
              <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#E0315D] text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs animate-bounce">
                {cartTotalItems}
              </span>
            )}
          </button>

          {/* Logout if authenticated on merchant dashboard */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              title={t.nav.logout}
              aria-label={t.nav.logout}
              className="p-2 rounded-full bg-white hover:bg-red-50 text-[#2D2A45]/70 hover:text-red-600 border-2 border-[#2D2A45]/15 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
