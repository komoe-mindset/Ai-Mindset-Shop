import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_FAQS } from '../data/sampleData.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { en } from '../i18n/en.js';
import { mm } from '../i18n/mm.js';

const STORAGE_KEYS = {
  PRODUCTS: 'aimindset_shop_products_v1',
  ORDERS: 'aimindset_shop_orders_v1',
  FAQS: 'aimindset_shop_faqs_v1',
  CART: 'aimindset_shop_cart_v1',
  LANG: 'aimindset_shop_lang_v1',
  USER_ORDERS: 'aimindset_shop_my_orders_v1',
  AUTH: 'aimindset_shop_auth_v1',
};

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Language state
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
  });

  const t = lang === 'mm' ? mm : en;

  const setLanguage = (newLang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
  };

  // Auth mock state for Merchant Dashboard demo
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  const loginDemo = () => {
    // TODO - replace demo login with Supabase Auth.
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  // Products state (shared between Dashboard & Shop)
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state (shared between Dashboard & Shop)
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Customer's personal orders placed in this browser session
  const [myOrderIds, setMyOrderIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_ORDERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['AMS-1001'];
  });

  // FAQs state
  const [faqs, setFaqs] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_FAQS;
  });

  // Customer Cart state
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Persist products
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Persist orders
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Persist FAQs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  // Persist My Order IDs
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ORDERS, JSON.stringify(myOrderIds));
  }, [myOrderIds]);

  // Generate next sequential AMS-#### Order ID
  const generateNextOrderId = () => {
    let maxNumber = 1000;
    orders.forEach((ord) => {
      if (typeof ord.id === 'string' && ord.id.startsWith('AMS-')) {
        const num = parseInt(ord.id.replace('AMS-', ''), 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });
    return `AMS-${maxNumber + 1}`;
  };

  // PRODUCT ACTIONS
  const addProduct = (newProductData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: newProductData.name.trim(),
      nameMm: newProductData.nameMm?.trim() || newProductData.name.trim(),
      priceKs: Number(newProductData.priceKs) || 0,
      stock: Number(newProductData.stock) || 0,
      category: newProductData.category || 'General',
      categoryMm: newProductData.categoryMm || newProductData.category || 'အထွေထွေ',
      imageUrl: newProductData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
      description: newProductData.description?.trim() || '',
      active: true,
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updatedFields,
            priceKs: Number(updatedFields.priceKs !== undefined ? updatedFields.priceKs : p.priceKs),
            stock: Number(updatedFields.stock !== undefined ? updatedFields.stock : p.stock),
          };
        }
        return p;
      })
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCart((prev) => prev.filter((item) => item.productId !== id));
  };

  const restockProduct = (id, amount = 10) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p))
    );
  };

  // ORDER ACTIONS
  const placeOrder = ({ customerName, phone, address, items, deliveryFeeKs = 2500, paymentMethod = 'Cash on Delivery' }) => {
    const subtotal = items.reduce((sum, item) => sum + item.priceKs * item.quantity, 0);
    const totalKs = subtotal + deliveryFeeKs;
    const newId = generateNextOrderId();

    const newOrder = {
      id: newId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        priceKs: i.priceKs,
        quantity: i.quantity,
      })),
      deliveryFeeKs,
      totalKs,
      status: 'Pending',
      paymentMethod,
      createdAt: new Date().toISOString(),
      isNew: true, // Marked with NEW badge in dashboard
    };

    // Deduct stock for each purchased item
    setProducts((prev) =>
      prev.map((prod) => {
        const ordered = items.find((i) => i.productId === prod.id);
        if (ordered) {
          const remainingStock = Math.max(0, prod.stock - ordered.quantity);
          return { ...prod, stock: remainingStock };
        }
        return prod;
      })
    );

    // Add to orders
    setOrders((prev) => [newOrder, ...prev]);
    // Save to user's personal session orders
    setMyOrderIds((prev) => [newId, ...prev]);
    // Clear shopping cart
    setCart([]);

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus, isNew: false } : ord))
    );
  };

  const markOrderSeen = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, isNew: false } : ord))
    );
  };

  // FAQ ACTIONS
  const addFaq = ({ question, answer, questionMm, answerMm }) => {
    const newFaq = {
      id: `faq-${Date.now()}`,
      question: question.trim(),
      answer: answer.trim(),
      questionMm: questionMm?.trim() || question.trim(),
      answerMm: answerMm?.trim() || answer.trim(),
    };
    setFaqs((prev) => [newFaq, ...prev]);
  };

  const deleteFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // CART ACTIONS
  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          nameMm: product.nameMm,
          priceKs: product.priceKs,
          imageUrl: product.imageUrl,
          stock: product.stock,
          quantity: Math.min(product.stock, Math.max(1, quantity)),
        },
      ];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const maxStock = product ? product.stock : 999;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(maxStock, newQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotalKs = cart.reduce((sum, item) => sum + item.priceKs * item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        lang,
        setLanguage,
        t,
        isAuthenticated,
        loginDemo,
        logout,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        restockProduct,
        orders,
        placeOrder,
        updateOrderStatus,
        markOrderSeen,
        myOrderIds,
        faqs,
        addFaq,
        deleteFaq,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalItems,
        cartSubtotalKs,
        isDemoMode: !isSupabaseConfigured,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShopStore() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopStore must be used within a ShopProvider');
  }
  return context;
}
