import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, CheckCircle2, ShieldCheck, ShoppingBag, Truck, MapPin, Phone, User, Package } from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';
import MindyMascot from './MindyMascot.jsx';

export default function CartDrawer({ isOpen, onClose, onViewOrders }) {
  const {
    lang,
    t,
    cart,
    cartTotalItems,
    cartSubtotalKs,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  } = useShopStore();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFeeKs = cart.length > 0 ? 2500 : 0;
  const grandTotalKs = cartSubtotalKs + deliveryFeeKs;

  if (!isOpen) return null;

  const validateForm = () => {
    const errs = {};
    if (!customerName.trim()) {
      errs.customerName = t.shop.errors.nameRequired;
    }
    if (!phone.trim()) {
      errs.phone = t.shop.errors.phoneRequired;
    } else if (phone.trim().length < 8) {
      errs.phone = lang === 'mm' ? 'ဖုန်းနံပါတ် အနည်းဆုံး ၈ လုံး ရှိရပါမည်' : 'Phone number must have at least 8 digits';
    }
    if (!address.trim()) {
      errs.address = t.shop.errors.addressRequired;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        customerName,
        phone,
        address,
        items: cart,
        deliveryFeeKs,
        paymentMethod,
      });

      setLastPlacedOrder(order);
      setIsSubmitting(false);
      setStep('success');
    }, 400);
  };

  const handleClose = () => {
    if (step === 'success') {
      setStep('cart');
      setLastPlacedOrder(null);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2D2A45]/40 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FFF8EC] border-l-2 border-[#2D2A45]/15 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b-2 border-[#2D2A45]/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B9A7F5]/30 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#6B4FD8]" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#2D2A45] text-lg font-display">
                  {step === 'cart' && t.shop.cartDrawerTitle}
                  {step === 'checkout' && t.shop.checkoutTitle}
                  {step === 'success' && t.shop.orderSuccessTitle}
                </h2>
                {step === 'cart' && (
                  <p className="text-xs text-[#2D2A45]/60 font-semibold">
                    {cartTotalItems} {t.orders.itemsCount}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#2D2A45] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {/* 1. CART STEP */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  // Empty Cart screen featuring Mindy Mascot
                  <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center p-6">
                    <div className="relative mb-4">
                      <MindyMascot mood="empty" size={170} />
                      <div className="absolute -top-3 -right-2 bg-[#FFD6E0] border border-[#FFA8BF] text-[#8C2442] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                        {t.mindy.cartEmpty}
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#2D2A45] font-display mb-2">
                      {t.shop.emptyCartTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#2D2A45]/70 max-w-xs mb-6">
                      {t.shop.emptyCartDesc}
                    </p>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="cartoon-btn-mint px-6 py-2.5 text-sm cursor-pointer"
                    >
                      {t.shop.startShopping}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-xs font-bold text-[#2D2A45]/60 uppercase tracking-wider">
                        {lang === 'mm' ? 'ခြင်းထဲရှိ ပစ္စည်းများ' : 'Selected Products'}
                      </span>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {lang === 'mm' ? 'အားလုံးဖျက်မည်' : 'Clear all'}
                      </button>
                    </div>

                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="p-3 bg-white rounded-2xl border-2 border-[#2D2A45]/10 flex items-center gap-3 shadow-xs"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-[#2D2A45]/10 bg-[#FFF8EC]"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-[#2D2A45] truncate font-display">
                            {lang === 'mm' && item.nameMm ? item.nameMm : item.name}
                          </h4>
                          <p className="text-xs font-bold text-[#7857ED]">
                            {item.priceKs.toLocaleString()} {t.shop.currency}
                          </p>

                          <div className="flex items-center justify-between mt-1.5">
                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-2 bg-[#FFF8EC] rounded-full border border-[#2D2A45]/15 px-1.5 py-0.5">
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold hover:bg-[#FFD6E0] cursor-pointer"
                                aria-label="Decrease"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-extrabold text-[#2D2A45] min-w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs font-bold hover:bg-[#A8E6CF] cursor-pointer"
                                aria-label="Increase"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-extrabold text-[#2D2A45]">
                              {(item.priceKs * item.quantity).toLocaleString()} {t.shop.currency}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#2D2A45]/40 hover:text-rose-500 p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* 2. CHECKOUT STEP */}
            {step === 'checkout' && (
              <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="bg-[#B9A7F5]/20 p-3 rounded-2xl border border-[#B9A7F5]/40 flex items-center gap-3">
                  <MindyMascot mood="welcome" size={54} />
                  <p className="text-xs text-[#2D2A45] font-semibold leading-relaxed">
                    {lang === 'mm'
                      ? 'လိပ်စာပြည့်စုံစွာ ဖြည့်သွင်းပေးပါနော်။ ပစ္စည်းရောက်မှ ငွေချေစနစ်ဖြင့် ပို့ဆောင်ပေးပါမည်!'
                      : 'Please enter your delivery details. Cash on Delivery is ready for you!'}
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2D2A45] mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#6B4FD8]" />
                    {t.shop.nameLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors({ ...errors, customerName: null });
                    }}
                    placeholder={t.shop.namePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 text-sm text-[#2D2A45] font-medium outline-hidden transition-all ${
                      errors.customerName
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-[#2D2A45]/15 focus:border-[#8D74EB]'
                    }`}
                  />
                  {errors.customerName && (
                    <p className="text-xs text-rose-500 font-bold mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2D2A45] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#6B4FD8]" />
                    {t.shop.phoneLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: null });
                    }}
                    placeholder={t.shop.phonePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 text-sm text-[#2D2A45] font-medium outline-hidden transition-all ${
                      errors.phone
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-[#2D2A45]/15 focus:border-[#8D74EB]'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-500 font-bold mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2D2A45] mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#6B4FD8]" />
                    {t.shop.addressLabel} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors({ ...errors, address: null });
                    }}
                    placeholder={t.shop.addressPlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 text-sm text-[#2D2A45] font-medium outline-hidden transition-all resize-none ${
                      errors.address
                        ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                        : 'border-[#2D2A45]/15 focus:border-[#8D74EB]'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-xs text-rose-500 font-bold mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-extrabold text-[#2D2A45] mb-1.5">
                    {t.shop.paymentLabel}
                  </label>
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#5EB597] bg-[#A8E6CF]/15 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#194D3B] text-white flex items-center justify-center text-xs">
                        ✓
                      </div>
                      <span className="text-xs sm:text-sm font-extrabold text-[#194D3B]">
                        {t.shop.codOption}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#A8E6CF] text-[#194D3B]">
                      Default
                    </span>
                  </div>
                </div>

                {/* Back to Cart button */}
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="text-xs text-[#2D2A45]/70 hover:text-[#2D2A45] font-bold underline block text-center w-full pt-1 cursor-pointer"
                >
                  {t.shop.backToCart}
                </button>
              </form>
            )}

            {/* 3. ORDER SUCCESS STEP */}
            {step === 'success' && lastPlacedOrder && (
              <div className="flex flex-col items-center text-center p-4">
                <div className="relative mb-3">
                  <MindyMascot mood="celebrate" size={170} />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A8E6CF] text-[#144735] font-extrabold text-xs mb-3 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.shop.orderSuccessTitle}
                </div>

                <h3 className="text-xl font-extrabold text-[#2D2A45] font-display mb-1">
                  {lastPlacedOrder.id}
                </h3>
                <p className="text-xs text-[#2D2A45]/70 max-w-xs mb-4">
                  {t.shop.saveOrderNote}
                </p>

                {/* Order Summary box */}
                <div className="w-full bg-white rounded-2xl border-2 border-[#2D2A45]/10 p-3.5 text-left mb-5 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-[#2D2A45]/8 pb-2">
                    <span className="text-neutral-500 font-semibold">{t.orders.customer}:</span>
                    <span className="font-extrabold text-[#2D2A45]">
                      {lastPlacedOrder.customerName} ({lastPlacedOrder.phone})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#2D2A45]/8 pb-2">
                    <span className="text-neutral-500 font-semibold">{t.orders.address}:</span>
                    <span className="font-semibold text-[#2D2A45] max-w-[200px] truncate text-right">
                      {lastPlacedOrder.address}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#2D2A45]/8 pb-2">
                    <span className="text-neutral-500 font-semibold">{t.orders.items}:</span>
                    <span className="font-bold text-[#2D2A45]">
                      {lastPlacedOrder.items.length} {t.orders.itemsCount}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm">
                    <span className="font-extrabold text-[#2D2A45]">{t.orders.total}:</span>
                    <span className="font-extrabold text-[#7857ED] text-base">
                      {lastPlacedOrder.totalKs.toLocaleString()} {t.shop.currency}
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                    }}
                    className="w-full cartoon-btn-primary py-3 text-sm cursor-pointer"
                  >
                    {t.shop.continueShopping}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      if (onViewOrders) onViewOrders();
                    }}
                    className="w-full py-2.5 px-4 rounded-full bg-white border-2 border-[#2D2A45]/15 text-[#2D2A45] font-extrabold text-xs sm:text-sm hover:bg-[#FFF8EC] transition-all cursor-pointer"
                  >
                    {t.shop.viewOrderHistory}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer with Price Breakdown and Action */}
          {step !== 'success' && cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t-2 border-[#2D2A45]/10 space-y-3">
              {/* Cost summary */}
              <div className="space-y-1.5 text-xs text-[#2D2A45]">
                <div className="flex justify-between font-semibold text-neutral-600">
                  <span>{t.shop.subtotal}</span>
                  <span>
                    {cartSubtotalKs.toLocaleString()} {t.shop.currency}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-neutral-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-neutral-400" />
                    {t.shop.deliveryFee}
                  </span>
                  <span>
                    {deliveryFeeKs.toLocaleString()} {t.shop.currency}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm sm:text-base pt-2 border-t border-[#2D2A45]/10 text-[#2D2A45]">
                  <span>{t.shop.totalAmount}</span>
                  <span className="text-[#7857ED] font-display">
                    {grandTotalKs.toLocaleString()} {t.shop.currency}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {step === 'cart' ? (
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full cartoon-btn-mint py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.shop.proceedToCheckout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="w-full cartoon-btn-primary py-3 text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? t.shop.placingOrder : t.shop.placeOrder}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
