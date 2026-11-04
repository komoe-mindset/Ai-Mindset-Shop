import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_FAQS } from '../data/sampleData.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
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

// Database mappers: snake_case to camelCase
function mapProductFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name || '',
    nameMm: row.name_mm ?? row.name ?? '',
    priceKs: Number(row.price_ks) || 0,
    stock: Number(row.stock) || 0,
    category: row.category || 'General',
    categoryMm: row.category_mm ?? row.category ?? 'အထွေထွေ',
    imageUrl: row.image_url || '',
    description: row.description || '',
    active: row.active !== undefined ? Boolean(row.active) : true,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapOrderFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    customerName: row.customer_name || '',
    phone: row.phone || '',
    address: row.address || '',
    items: Array.isArray(row.items) ? row.items : [],
    deliveryFeeKs: Number(row.delivery_fee_ks) || 0,
    totalKs: Number(row.total_ks) || 0,
    status: row.status || 'Pending',
    paymentMethod: row.payment_method || 'Cash on Delivery',
    isNew: row.is_new !== undefined ? Boolean(row.is_new) : false,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapFaqFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    question: row.question || '',
    questionMm: row.question_mm ?? row.question ?? '',
    answer: row.answer || '',
    answerMm: row.answer_mm ?? row.answer ?? '',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Language state (kept in localStorage)
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
  });

  const t = lang === 'mm' ? mm : en;

  const setLanguage = (newLang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEYS.LANG, newLang);
  };

  // Auth mock state for Merchant Dashboard demo (kept in localStorage)
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

  // Loading and error states for Supabase
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [supabaseError, setSupabaseError] = useState(null);

  // Products state
  const [products, setProducts] = useState(() => {
    if (isSupabaseConfigured) {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    if (isSupabaseConfigured) {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Customer's personal orders placed in this browser session (kept in localStorage)
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
    if (isSupabaseConfigured) {
      return [];
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_FAQS;
  });

  // Customer Cart state (kept in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  });

  // Initial fetch from Supabase on mount when configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchFromSupabase() {
      setIsLoading(true);
      try {
        const [productsRes, ordersRes, faqsRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('faqs').select('*').order('created_at', { ascending: false }),
        ]);

        if (productsRes.error) throw productsRes.error;
        if (ordersRes.error) throw ordersRes.error;
        if (faqsRes.error) throw faqsRes.error;

        if (isMounted) {
          const mappedProducts = (productsRes.data || []).map(mapProductFromDb);
          const mappedOrders = (ordersRes.data || []).map(mapOrderFromDb);
          const mappedFaqs = (faqsRes.data || []).map(mapFaqFromDb);

          setProducts(mappedProducts);
          setOrders(mappedOrders);
          setFaqs(mappedFaqs);
          setSupabaseError(null);
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        if (isMounted) {
          setSupabaseError('Supabase connection failed, showing demo data');
          // Fallback to sample data when Supabase connection fails
          setProducts(INITIAL_PRODUCTS);
          setOrders(INITIAL_ORDERS);
          setFaqs(INITIAL_FAQS);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchFromSupabase();

    return () => {
      isMounted = false;
    };
  }, []);

  // When Supabase is NOT configured, persist products, orders, and faqs to localStorage
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    }
  }, [faqs]);

  // Always persist Cart & My Orders in localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ORDERS, JSON.stringify(myOrderIds));
  }, [myOrderIds]);

  // Generate next sequential AMS-#### Order ID from the highest existing order id
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
  const addProduct = async (newProductData) => {
    const timestamp = Date.now();
    const id = `prod-${timestamp}`;
    const name = newProductData.name.trim();
    const nameMm = newProductData.nameMm?.trim() || name;
    const priceKs = Number(newProductData.priceKs) || 0;
    const stock = Number(newProductData.stock) || 0;
    const category = newProductData.category || 'General';
    const categoryMm = newProductData.categoryMm || category || 'အထွေထွေ';
    const imageUrl = newProductData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80';
    const description = newProductData.description?.trim() || '';
    const active = true;

    if (isSupabaseConfigured && supabase) {
      const dbRow = {
        id,
        name,
        name_mm: nameMm,
        price_ks: priceKs,
        stock,
        category,
        category_mm: categoryMm,
        image_url: imageUrl,
        description,
        active,
        created_at: new Date().toISOString(),
      };

      try {
        const { data, error } = await supabase.from('products').insert([dbRow]).select().single();
        if (error) {
          console.error('Supabase addProduct error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return null;
        }
        const mapped = mapProductFromDb(data || dbRow);
        setProducts((prev) => [mapped, ...prev]);
        return mapped;
      } catch (err) {
        console.error('Supabase addProduct exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return null;
      }
    } else {
      const newProduct = {
        id,
        name,
        nameMm,
        priceKs,
        stock,
        category,
        categoryMm,
        imageUrl,
        description,
        active,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    }
  };

  const updateProduct = async (id, updatedFields) => {
    if (isSupabaseConfigured && supabase) {
      const updatePayload = {};
      if (updatedFields.name !== undefined) updatePayload.name = updatedFields.name;
      if (updatedFields.nameMm !== undefined) updatePayload.name_mm = updatedFields.nameMm;
      if (updatedFields.priceKs !== undefined) updatePayload.price_ks = Number(updatedFields.priceKs);
      if (updatedFields.stock !== undefined) updatePayload.stock = Number(updatedFields.stock);
      if (updatedFields.category !== undefined) updatePayload.category = updatedFields.category;
      if (updatedFields.categoryMm !== undefined) updatePayload.category_mm = updatedFields.categoryMm;
      if (updatedFields.imageUrl !== undefined) updatePayload.image_url = updatedFields.imageUrl;
      if (updatedFields.description !== undefined) updatePayload.description = updatedFields.description;
      if (updatedFields.active !== undefined) updatePayload.active = updatedFields.active;

      try {
        const { error } = await supabase.from('products').update(updatePayload).eq('id', id);
        if (error) {
          console.error('Supabase updateProduct error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return;
        }
      } catch (err) {
        console.error('Supabase updateProduct exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return;
      }
    }

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

  const deleteProduct = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteProduct error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return;
        }
      } catch (err) {
        console.error('Supabase deleteProduct exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return;
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
  };

  const restockProduct = async (id, amount = 10) => {
    const currentProd = products.find((p) => p.id === id);
    const newStock = (currentProd ? currentProd.stock : 0) + amount;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', id);
        if (error) {
          console.error('Supabase restockProduct error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return;
        }
      } catch (err) {
        console.error('Supabase restockProduct exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return;
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p))
    );
  };

  // ORDER ACTIONS
  const placeOrder = ({ customerName, phone, address, items, deliveryFeeKs = 2500, paymentMethod = 'Cash on Delivery' }) => {
    const subtotal = items.reduce((sum, item) => sum + item.priceKs * item.quantity, 0);
    const totalKs = subtotal + deliveryFeeKs;
    const newId = generateNextOrderId();

    const orderData = {
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
      isNew: true,
    };

    if (isSupabaseConfigured && supabase) {
      const orderRow = {
        id: newId,
        customer_name: orderData.customerName,
        phone: orderData.phone,
        address: orderData.address,
        items: orderData.items,
        delivery_fee_ks: orderData.deliveryFeeKs,
        total_ks: orderData.totalKs,
        status: 'Pending',
        payment_method: orderData.paymentMethod,
        is_new: true,
        created_at: orderData.createdAt,
      };

      const asyncOrderFlow = async () => {
        try {
          const { data, error } = await supabase.from('orders').insert([orderRow]).select().single();
          if (error) {
            console.error('Supabase placeOrder error:', error);
            setSupabaseError('Supabase connection failed, showing demo data');
            return null;
          }

          // Decrement stock for each ordered product in the products table
          for (const it of items) {
            const currentProd = products.find((p) => p.id === it.productId);
            if (currentProd) {
              const remainingStock = Math.max(0, currentProd.stock - it.quantity);
              await supabase
                .from('products')
                .update({ stock: remainingStock })
                .eq('id', it.productId);
            }
          }

          // Only after a successful insert, update local orders, myOrderIds, product stock, and clear the cart
          const savedOrder = mapOrderFromDb(data || orderRow);
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
          setOrders((prev) => [savedOrder, ...prev]);
          setMyOrderIds((prev) => [newId, ...prev]);
          setCart([]);
          return savedOrder;
        } catch (err) {
          console.error('Supabase placeOrder exception:', err);
          setSupabaseError('Supabase connection failed, showing demo data');
          return null;
        }
      };

      const promise = asyncOrderFlow();

      // Return synchronously accessible order object with .then/.catch for thenability
      return Object.assign(orderData, {
        then: promise.then.bind(promise),
        catch: promise.catch.bind(promise),
      });
    } else {
      // Deduct stock for each purchased item locally
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

      // Add to orders, myOrderIds, and clear cart
      setOrders((prev) => [orderData, ...prev]);
      setMyOrderIds((prev) => [newId, ...prev]);
      setCart([]);
      return orderData;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus, is_new: false })
          .eq('id', orderId);
        if (error) {
          console.error('Supabase updateOrderStatus error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return;
        }
      } catch (err) {
        console.error('Supabase updateOrderStatus exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return;
      }
    }

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus, isNew: false } : ord))
    );
  };

  const markOrderSeen = async (orderId) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ is_new: false })
          .eq('id', orderId);
        if (error) {
          console.error('Supabase markOrderSeen error:', error);
        }
      } catch (err) {
        console.error('Supabase markOrderSeen exception:', err);
      }
    }

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, isNew: false } : ord))
    );
  };

  // FAQ ACTIONS
  const addFaq = async ({ question, answer, questionMm, answerMm }) => {
    const newId = `faq-${Date.now()}`;
    const q = question.trim();
    const a = answer.trim();
    const qMm = questionMm?.trim() || q;
    const aMm = answerMm?.trim() || a;

    if (isSupabaseConfigured && supabase) {
      const dbRow = {
        id: newId,
        question: q,
        question_mm: qMm,
        answer: a,
        answer_mm: aMm,
        created_at: new Date().toISOString(),
      };

      try {
        const { data, error } = await supabase.from('faqs').insert([dbRow]).select().single();
        if (error) {
          console.error('Supabase addFaq error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return null;
        }
        const mapped = mapFaqFromDb(data || dbRow);
        setFaqs((prev) => [mapped, ...prev]);
        return mapped;
      } catch (err) {
        console.error('Supabase addFaq exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return null;
      }
    } else {
      const newFaq = {
        id: newId,
        question: q,
        answer: a,
        questionMm: qMm,
        answerMm: aMm,
        createdAt: new Date().toISOString(),
      };
      setFaqs((prev) => [newFaq, ...prev]);
      return newFaq;
    }
  };

  const deleteFaq = async (id) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (error) {
          console.error('Supabase deleteFaq error:', error);
          setSupabaseError('Supabase connection failed, showing demo data');
          return;
        }
      } catch (err) {
        console.error('Supabase deleteFaq exception:', err);
        setSupabaseError('Supabase connection failed, showing demo data');
        return;
      }
    }

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

  // Loading state displayed until initial Supabase fetch finishes
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-16 h-16 rounded-3xl bg-[#B9A7F5]/30 border-2 border-[#8D74EB]/40 flex items-center justify-center mb-4 animate-bounce shadow-sm">
          <span className="text-2xl">🛍️</span>
        </div>
        <h2 className="text-xl font-extrabold text-[#2D2A45] font-display mb-1">
          AiMindset Shop
        </h2>
        <p className="text-xs text-[#2D2A45]/70 font-semibold animate-pulse">
          Connecting to shop database...
        </p>
      </div>
    );
  }

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
        isDemoMode: !isSupabaseConfigured || Boolean(supabaseError),
        isLoading,
        supabaseError,
      }}
    >
      {/* Visible notification when Supabase connection fails */}
      {supabaseError && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#FFD6E0] text-[#8C2442] border-2 border-[#FFA8BF] rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#E0315D] animate-ping" />
          <span>{supabaseError}</span>
          <button
            type="button"
            onClick={() => setSupabaseError(null)}
            className="ml-1 text-[#8C2442] hover:opacity-80 font-extrabold cursor-pointer"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
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
