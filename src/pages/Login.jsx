import React, { useState } from 'react';
import { Bot, Store, MessageCircle, BarChart3, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';
import MindyMascot from '../components/MindyMascot.jsx';
import LanguageToggle from '../components/LanguageToggle.jsx';

export default function Login({ onNavigate }) {
  const { lang, t, login } = useShopStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    const res = await login({ email, password });
    setIsLoading(false);
    if (res.success) {
      onNavigate('/dashboard');
    } else {
      setAuthError(res.error || (lang === 'mm' ? 'အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်' : 'Invalid email or password'));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#2D2A45] flex flex-col justify-between">
      {/* Top Bar with Language Toggle and Quick Shop link */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl font-display tracking-tight text-[#2D2A45]">
            AiMindset <span className="text-[#7857ED]">Shop</span>
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A8E6CF] text-[#134F3A]">
            Myanmar
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/shop')}
            className="text-xs sm:text-sm font-bold text-[#6B4FD8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span className="hidden xs:inline">{t.nav.switchToShop}</span>
            <span className="xs:hidden">Shop</span>
          </button>
          <LanguageToggle />
        </div>
      </div>

      {/* Main Login Hero & Form Area */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mascot Greeting & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            {/* Mindy with cute cartoon speech bubble */}
            <div className="relative inline-flex flex-col items-center lg:items-start">
              {/* Speech bubble */}
              <div className="mb-2 bg-white border-2 border-[#8D74EB]/30 px-4 py-2.5 rounded-3xl shadow-sm text-xs sm:text-sm font-extrabold text-[#2D2A45] max-w-xs relative animate-bounce duration-1000">
                <span className="text-[#7857ED]">✨ Mindy:</span> {t.login.mindyGreeting}
                {/* Speech arrow */}
                <div className="absolute -bottom-2 left-10 w-4 h-4 bg-white border-b-2 border-r-2 border-[#8D74EB]/30 rotate-45" />
              </div>

              <div className="relative">
                <MindyMascot mood="welcome" size={200} />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-[#2D2A45]">
                {t.login.welcomeTitle}
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-md">
                {t.login.welcomeSubtitle}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B9A7F5]/25 border border-[#8D74EB]/30 text-xs font-bold text-[#5636B5]">
                <Sparkles className="w-4 h-4 text-[#7857ED]" />
                {t.tagline}
              </div>
            </div>
          </div>

          {/* Right Column: Login Card */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="cartoon-card p-6 sm:p-8 bg-white border-2 border-[#2D2A45]/12 shadow-xl">
              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#7857ED] block mb-1">
                  Merchant Access
                </span>
                <h2 className="text-2xl font-extrabold font-display text-[#2D2A45]">
                  {t.nav.login}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {lang === 'mm' ? 'သင့်ဆိုင်ရှင် အကောင့်ဖြင့် ဝင်ရောက်ပါ' : 'Sign in with your merchant credentials'}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2D2A45] mb-1.5">
                    {t.login.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    required
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFF8EC]/50 border-2 border-[#2D2A45]/15 focus:border-[#8D74EB] focus:bg-white text-sm font-semibold outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D2A45] mb-1.5">
                    {t.login.passwordLabel}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    required
                    className="w-full px-4 py-2.5 rounded-full bg-[#FFF8EC]/50 border-2 border-[#2D2A45]/15 focus:border-[#8D74EB] focus:bg-white text-sm font-semibold outline-hidden transition-all"
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-[#FFD6E0] rounded-2xl border border-[#FFA8BF] text-xs text-[#8C2442] font-semibold">
                    {authError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cartoon-btn-primary py-3 px-6 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isLoading ? t.login.loggingIn : (lang === 'mm' ? 'ဝင်ရောက်ရန်' : 'Log In')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-[#2D2A45]/10 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className="text-xs font-bold text-[#6B4FD8] hover:text-[#4E35A5] transition-colors cursor-pointer"
                >
                  {t.login.viewShopDirectly} →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Feature Cards as explicitly required:
            1. Telegram Bot Automation
            2. 24/7 Automated Store
            3. Customer Support & FAQs
            4. Inventory & CSV Controls
        */}
        <div className="mt-14 pt-10 border-t-2 border-[#2D2A45]/10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-extrabold font-display text-[#2D2A45]">
              {t.login.featuresHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Telegram Bot Automation */}
            <div className="cartoon-card p-5 bg-white border border-[#2D2A45]/10 flex flex-col justify-between cartoon-card-hover">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#B9A7F5]/30 border-2 border-[#8D74EB]/30 flex items-center justify-center mb-3 text-[#6B4FD8]">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-[#2D2A45] font-display mb-1.5">
                  {t.login.feature1Title}
                </h4>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  {t.login.feature1Desc}
                </p>
              </div>
            </div>

            {/* 2. 24/7 Automated Store */}
            <div className="cartoon-card p-5 bg-white border border-[#2D2A45]/10 flex flex-col justify-between cartoon-card-hover">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#A8E6CF]/40 border-2 border-[#5EB597]/40 flex items-center justify-center mb-3 text-[#144735]">
                  <Store className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-[#2D2A45] font-display mb-1.5">
                  {t.login.feature2Title}
                </h4>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  {t.login.feature2Desc}
                </p>
              </div>
            </div>

            {/* 3. Customer Support & FAQs */}
            <div className="cartoon-card p-5 bg-white border border-[#2D2A45]/10 flex flex-col justify-between cartoon-card-hover">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FFD6E0]/50 border-2 border-[#EAA4B5]/40 flex items-center justify-center mb-3 text-[#8C2442]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-[#2D2A45] font-display mb-1.5">
                  {t.login.feature3Title}
                </h4>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  {t.login.feature3Desc}
                </p>
              </div>
            </div>

            {/* 4. Inventory & CSV Controls */}
            <div className="cartoon-card p-5 bg-white border border-[#2D2A45]/10 flex flex-col justify-between cartoon-card-hover">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-[#FFF176]/40 border-2 border-[#F59E0B]/40 flex items-center justify-center mb-3 text-[#B45309]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-base text-[#2D2A45] font-display mb-1.5">
                  {t.login.feature4Title}
                </h4>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                  {t.login.feature4Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2D2A45]/10 py-4 px-4 text-center text-xs text-neutral-500 font-medium">
        AiMindset Shop • {t.tagline} • Designed for Myanmar SMBs
      </footer>
    </div>
  );
}
