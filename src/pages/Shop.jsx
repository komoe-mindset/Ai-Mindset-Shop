import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
  Package,
  History,
  X,
  Store,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';
import ProductCard from '../components/ProductCard.jsx';
import MindyMascot from '../components/MindyMascot.jsx';
import { CATEGORIES } from '../data/sampleData.js';

export default function Shop({ onOpenCart, onNavigate }) {
  const {
    lang,
    t,
    products,
    cartTotalItems,
    orders,
    myOrderIds,
  } = useShopStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showMyOrdersModal, setShowMyOrdersModal] = useState(false);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (!prod.active) return false;
      const matchesCategory =
        selectedCategory === 'all' || prod.category === selectedCategory;
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        prod.name.toLowerCase().includes(term) ||
        (prod.nameMm && prod.nameMm.toLowerCase().includes(term)) ||
        prod.category.toLowerCase().includes(term) ||
        (prod.description && prod.description.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  // Customer's personal orders placed
  const myOrders = useMemo(() => {
    return orders.filter((o) => myOrderIds.includes(o.id));
  }, [orders, myOrderIds]);

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#2D2A45] pb-24">
      {/* Telegram Web App Top Status Bar Simulation */}
      <div className="bg-[#2481CC] text-white px-3 py-1.5 text-[11px] font-semibold flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span>Telegram Web App • @AiMindsetShopBot</span>
        </div>
        <button
          type="button"
          onClick={() => setShowMyOrdersModal(true)}
          className="text-white hover:underline flex items-center gap-1 cursor-pointer font-bold"
        >
          <History className="w-3.5 h-3.5" />
          <span>{t.shop.viewOrders} ({myOrders.length})</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        {/* Mindy Hero Welcome Banner */}
        <div className="cartoon-card bg-gradient-to-r from-[#B9A7F5]/30 via-[#FFD6E0]/25 to-[#A8E6CF]/30 border-2 border-[#8D74EB]/25 p-5 sm:p-7 relative overflow-hidden mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 relative z-10">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 border border-[#8D74EB]/20 text-xs font-extrabold text-[#7857ED] shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {t.shop.telegramBanner}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-[#2D2A45]">
                {t.shop.title}
              </h1>

              <p className="text-xs sm:text-sm text-[#2D2A45]/80 font-semibold max-w-md">
                {t.shop.welcomeMindy}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#A8E6CF] text-[#144735] border border-[#5EB597]">
                  ✓ Cash on Delivery (COD)
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFD6E0] text-[#8C2442] border border-[#FFA8BF]">
                  ⚡ Fast Door-to-Door Delivery
                </span>
              </div>
            </div>

            {/* Mindy Mascot illustration */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute -top-3 -left-4 bg-white/95 px-3 py-1 rounded-2xl text-[11px] font-extrabold text-[#7857ED] border border-[#8D74EB]/20 shadow-xs hidden xs:block">
                {t.mindy.welcome}
              </div>
              <MindyMascot mood="welcome" size={150} />
            </div>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3 mb-6">
          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.shop.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#2D2A45]/15 text-sm sm:text-base bg-white focus:border-[#8D74EB] outline-hidden font-medium shadow-xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const catLabel = lang === 'mm' ? cat.nameMm : cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#B9A7F5] text-[#2D2A45] border-2 border-[#8D74EB] shadow-xs scale-102'
                      : 'bg-white hover:bg-[#FFF8EC] text-[#2D2A45]/80 border-2 border-[#2D2A45]/12'
                  }`}
                >
                  {catLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="cartoon-card p-12 text-center bg-white border-2 border-[#2D2A45]/10 my-8">
            <MindyMascot mood="empty" size={130} className="mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-[#2D2A45] font-display mb-1">
              {t.products.noProductsFound}
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              {lang === 'mm'
                ? 'အခြားသော ပစ္စည်းအမည် သို့မဟုတ် အမျိုးအစားကို ရွေးချယ်ရှာဖွေကြည့်ပါ'
                : 'Try clearing your search query or selecting a different category.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="cartoon-btn-mint px-5 py-2 text-xs cursor-pointer"
            >
              {lang === 'mm' ? 'အားလုံး ပြန်ကြည့်မည်' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} onOpenCart={onOpenCart} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Sticky Cart Bar for Mobile Telegram Experience */}
      {cartTotalItems > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-30">
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full cartoon-btn-primary py-3 px-5 flex items-center justify-between shadow-2xl cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white text-[#2D2A45] font-extrabold text-xs flex items-center justify-center">
                {cartTotalItems}
              </div>
              <span className="text-sm font-extrabold">
                {t.shop.cartButton}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm font-extrabold">
              <span>{t.shop.proceedToCheckout}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* ========================================================
          MY ORDERS MODAL
         ======================================================== */}
      {showMyOrdersModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D2A45]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="cartoon-card w-full max-w-md bg-white border-2 border-[#2D2A45]/15 p-5 sm:p-6 shadow-2xl relative animate-fade-in max-h-[85vh] flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#2D2A45]/10 mb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#7857ED]" />
                <h3 className="text-lg font-extrabold text-[#2D2A45] font-display">
                  {t.shop.myOrdersTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMyOrdersModal(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#2D2A45] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Orders list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {myOrders.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold">{t.shop.noPreviousOrders}</p>
                </div>
              ) : (
                myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl bg-[#FFF8EC]/60 border border-[#2D2A45]/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="font-extrabold text-sm text-[#2D2A45] font-display">
                        {ord.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          ord.status === 'Delivered'
                            ? 'bg-[#A8E6CF] text-[#144735]'
                            : ord.status === 'Confirmed'
                            ? 'bg-[#B9A7F5] text-[#2D2A45]'
                            : ord.status === 'Cancelled'
                            ? 'bg-[#FFD6E0] text-[#8C2442]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-neutral-500 font-medium">
                      {t.shop.orderPlacedOn}{' '}
                      {new Date(ord.createdAt).toLocaleDateString(
                        lang === 'mm' ? 'my-MM' : 'en-US',
                        { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>

                    <div className="space-y-1 pt-1 border-t border-[#2D2A45]/5">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-neutral-700">
                          <span className="truncate max-w-[200px]">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-mono">
                            {(it.priceKs * it.quantity).toLocaleString()} Ks
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between font-extrabold text-sm text-[#7857ED] pt-1 border-t border-[#2D2A45]/8">
                      <span>{t.orders.total}:</span>
                      <span>
                        {ord.totalKs.toLocaleString()} {t.shop.currency}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#2D2A45]/10 mt-3">
              <button
                type="button"
                onClick={() => setShowMyOrdersModal(false)}
                className="w-full cartoon-btn-mint py-2.5 text-xs cursor-pointer"
              >
                {t.shop.continueShopping}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
