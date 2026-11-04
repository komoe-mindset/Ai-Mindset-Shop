import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';

export default function ProductCard({ product, onOpenCart }) {
  const { lang, t, cart, addToCart, updateCartQuantity } = useShopStore();
  const [justAdded, setJustAdded] = useState(false);

  // Cart item if already present
  const cartItem = cart.find((item) => item.productId === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock <= 0;

  const productName = lang === 'mm' && product.nameMm ? product.nameMm : product.name;
  const categoryName = lang === 'mm' && product.categoryMm ? product.categoryMm : product.category;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = () => {
    if (currentQuantityInCart < product.stock) {
      updateCartQuantity(product.id, currentQuantityInCart + 1);
    }
  };

  const handleDecrement = () => {
    updateCartQuantity(product.id, currentQuantityInCart - 1);
  };

  return (
    <div className="cartoon-card cartoon-card-hover overflow-hidden flex flex-col justify-between group transition-all duration-300 relative border-2 border-[#2D2A45]/10 bg-white">
      {/* Top Image & Status Badges */}
      <div className="relative aspect-4/3 w-full bg-[#FFF8EC] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            // Safe fallback if external unsplash image fails to load
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-md text-[#2D2A45] border border-[#2D2A45]/10 shadow-xs">
          {categoryName}
        </span>

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#2D2A45] text-white shadow-xs">
            {t.products.outOfStockBadge}
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FFD6E0] text-[#9E2A4B] border border-[#FFA8BF] shadow-xs flex items-center gap-1 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            {t.products.lowStockBadge}
          </span>
        ) : (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A8E6CF]/90 text-[#194D3B] border border-[#74C8AB] shadow-xs">
            {product.stock} {t.products.stockRemaining}
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-[#2D2A45] text-base sm:text-lg line-clamp-2 mb-1.5 font-display leading-snug">
            {productName}
          </h3>
          {product.description && (
            <p className="text-xs text-[#2D2A45]/65 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="pt-2 mt-auto border-t border-[#2D2A45]/8">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-[#2D2A45]/60 font-medium block">
                {lang === 'mm' ? 'စျေးနှုန်း' : 'Price'}
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#2D2A45] font-display">
                {product.priceKs.toLocaleString()} {t.shop.currency}
              </span>
            </div>

            {/* In-stock indicator badge */}
            <div className="text-right">
              <span className="text-[11px] text-[#2D2A45]/60 font-semibold">
                {isOutOfStock
                  ? t.shop.outOfStock
                  : `${product.stock} ${t.products.stockRemaining}`}
              </span>
            </div>
          </div>

          {/* Action buttons: Stepper or Add Button */}
          {currentQuantityInCart > 0 ? (
            <div className="flex items-center justify-between gap-2 p-1 bg-[#FFF8EC] rounded-full border-2 border-[#2D2A45]/15">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#FFD6E0] text-[#2D2A45] flex items-center justify-center font-bold border border-[#2D2A45]/15 active:scale-90 transition-transform cursor-pointer"
                title="Decrease"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <span className="font-extrabold text-sm text-[#2D2A45] px-2 font-display">
                {currentQuantityInCart}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={currentQuantityInCart >= product.stock}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#A8E6CF] disabled:opacity-40 disabled:hover:bg-white text-[#2D2A45] flex items-center justify-center font-bold border border-[#2D2A45]/15 active:scale-90 transition-transform cursor-pointer"
                title="Increase"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-2.5 px-4 rounded-full font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 border-2 border-neutral-300 cursor-not-allowed'
                  : justAdded
                  ? 'bg-[#A8E6CF] text-[#194D3B] border-2 border-[#5EB597]'
                  : 'cartoon-btn-primary'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#194D3B]" />
                  <span>{lang === 'mm' ? 'ခြင်းထဲထည့်ပြီး' : 'Added to Cart!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? t.shop.outOfStock : t.shop.addToCart}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
