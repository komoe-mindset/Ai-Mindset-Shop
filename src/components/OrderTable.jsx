import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, Truck, XCircle, Sparkles, Check } from 'lucide-react';
import { useShopStore } from '../store/shopStore.jsx';

export default function OrderTable() {
  const { lang, t, orders, updateOrderStatus, markOrderSeen } = useShopStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = statusFilter === 'ALL' || order.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.phone.includes(term) ||
      (order.address && order.address.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setToastMessage(`${orderId}: ${t.orders.statusUpdated}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: t.orders.statusPending,
        };
      case 'Confirmed':
        return {
          bg: 'bg-[#B9A7F5]/30 text-[#4E35A5] border-[#8D74EB]/40',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: t.orders.statusConfirmed,
        };
      case 'Delivered':
        return {
          bg: 'bg-[#A8E6CF] text-[#134F3A] border-[#69C1A3]',
          icon: <Truck className="w-3.5 h-3.5" />,
          label: t.orders.statusDelivered,
        };
      case 'Cancelled':
        return {
          bg: 'bg-[#FFD6E0] text-[#9E2A4B] border-[#EAA4B5]',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: t.orders.statusCancelled,
        };
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-800 border-neutral-300',
          icon: null,
          label: status,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D2A45] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-white/20 animate-fade-in">
          <Check className="w-4 h-4 text-[#A8E6CF]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="cartoon-card p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.orders.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-[#2D2A45]/15 text-xs sm:text-sm bg-[#FFF8EC]/40 focus:bg-white focus:border-[#8D74EB] outline-hidden font-medium"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['ALL', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#2D2A45] text-white shadow-xs'
                  : 'bg-[#FFF8EC] text-[#2D2A45] border border-[#2D2A45]/15 hover:bg-neutral-100'
              }`}
            >
              {st === 'ALL'
                ? t.orders.allStatuses
                : st === 'Pending'
                ? t.orders.statusPending
                : st === 'Confirmed'
                ? t.orders.statusConfirmed
                : st === 'Delivered'
                ? t.orders.statusDelivered
                : t.orders.statusCancelled}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="cartoon-card p-12 text-center text-neutral-500">
          <p className="text-sm font-bold">{t.orders.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            return (
              <div
                key={order.id}
                onMouseEnter={() => {
                  if (order.isNew) markOrderSeen(order.id);
                }}
                className={`cartoon-card p-4 sm:p-5 transition-all ${
                  order.isNew
                    ? 'border-2 border-[#8D74EB] bg-[#B9A7F5]/5 shadow-md'
                    : 'border-2 border-[#2D2A45]/10 bg-white'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: ID, Customer Info & Date */}
                  <div className="space-y-1.5 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-base sm:text-lg text-[#2D2A45] font-display">
                        {order.id}
                      </span>
                      {order.isNew && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#8D74EB] text-white flex items-center gap-1 animate-bounce">
                          <Sparkles className="w-3 h-3" />
                          {t.orders.newBadge}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-[#2D2A45]">
                      {order.customerName} •{' '}
                      <a
                        href={`tel:${order.phone}`}
                        className="text-[#6B4FD8] hover:underline font-mono"
                      >
                        {order.phone}
                      </a>
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-1">
                      📍 {order.address}
                    </p>

                    <p className="text-[11px] text-neutral-400 font-medium">
                      {new Date(order.createdAt).toLocaleString(
                        lang === 'mm' ? 'my-MM' : 'en-US',
                        {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }
                      )}
                    </p>
                  </div>

                  {/* Middle Column: Items Summary */}
                  <div className="flex-1 bg-[#FFF8EC]/60 p-3 rounded-2xl border border-[#2D2A45]/8">
                    <p className="text-xs font-bold text-neutral-500 mb-1">
                      {t.orders.items} ({order.items.length} {t.orders.itemsCount}):
                    </p>
                    <ul className="text-xs space-y-1">
                      {order.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between items-center text-[#2D2A45]">
                          <span className="font-semibold truncate max-w-[240px]">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-mono text-neutral-600">
                            {(it.priceKs * it.quantity).toLocaleString()} Ks
                          </span>
                        </li>
                      ))}
                    </ul>
                    {order.deliveryFeeKs > 0 && (
                      <div className="flex justify-between text-[11px] text-neutral-500 pt-1 mt-1 border-t border-[#2D2A45]/5">
                        <span>{t.orders.deliveryFee}:</span>
                        <span>{order.deliveryFeeKs.toLocaleString()} Ks</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Total & Status Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 min-w-[180px]">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-neutral-500 font-semibold block">
                        {t.orders.total} ({t.orders.paymentCod})
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-[#7857ED] font-display">
                        {order.totalKs.toLocaleString()} {t.shop.currency}
                      </span>
                    </div>

                    {/* Status Dropdown / Action */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs font-bold py-1.5 px-3 rounded-full border-2 border-[#2D2A45]/20 bg-white text-[#2D2A45] hover:border-[#8D74EB] cursor-pointer outline-hidden"
                      >
                        <option value="Pending">{t.orders.statusPending}</option>
                        <option value="Confirmed">{t.orders.statusConfirmed}</option>
                        <option value="Delivered">{t.orders.statusDelivered}</option>
                        <option value="Cancelled">{t.orders.statusCancelled}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
