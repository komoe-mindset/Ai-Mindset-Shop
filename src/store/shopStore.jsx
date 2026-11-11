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
};

// Read ?shop= parameter from URL (default 'ai-mindset-shop')
export function getShopSlugFromUrl() {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const searchSlug = searchParams.get('shop');
    if (searchSlug && searchSlug.trim()) {
      return searchSlug.trim();
    }
    const hash = window.location.hash || '';
    if (hash.includes('?')) {
      const hashParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
      const hashSlug = hashParams.get('shop');
      if (hashSlug && hashSlug.trim()) {
        return hashSlug.trim();
      }
    }
  } catch {
    // ignore
  }
  return 'ai-mindset-shop';
}

// Retry helper for transient Supabase network errors (e.g. the occasional
// "connection closed" from the API gateway). Rebuilds the query on each
// attempt because a Supabase query builder must not be re-awaited.
async function queryWithRetry(buildQuery, attempts = 3) {
  let lastError = null;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await buildQuery();
      if (res.error) throw res.error;
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

// Database mappers: snake_case to camelCase
function mapProductFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    shopId: row.shop_id || null,
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
    shopId: row.shop_id || null,
    telegramUserId: row.telegram_user_id ? Number(row.telegram_user_id) : null,
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
    shopId: row.shop_id || null,
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

  // Auth session state (managed via Supabase Auth)
  const [session, setSession] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Shop state (Change 1: read from URL and store currentShopId)
  const [currentShopId, setCurrentShopId] = useState(() => {
    return !isSupabaseConfigured ? 'e20baa90-1c1f-481f-b16f-61a44b60566a' : null;
  });
  const [currentShop, setCurrentShop] = useState(null);
  const [shopNotFound, setShopNotFound] = useState(false);

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

  // Helper to ensure currentShopId is available before any write (Change 2)
  const resolveShopId = async () => {
    if (currentShopId) return currentShopId;
    if (!isSupabaseConfigured || !supabase) {
      return 'e20baa90-1c1f-481f-b16f-61a44b60566a';
    }
    const slug = getShopSlugFromUrl();
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error || !data) {
        console.warn('Could not resolve shop for slug in Supabase, using default shop:', slug, error?.message || error);
        return 'e20baa90-1c1f-481f-b16f-61a44b60566a';
      }
      setCurrentShopId(data.id);
      setCurrentShop(data);
      return data.id;
    } catch (err) {
      console.warn('Exception resolving shop id, using default shop:', err?.message || err);
      return 'e20baa90-1c1f-481f-b16f-61a44b60566a';
    }
  };

  // Change 4: Supabase Auth Session listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setIsAuthenticated(Boolean(initialSession));
    }).catch((err) => {
      console.warn('Error fetching Supabase session:', err?.message || err);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setIsAuthenticated(Boolean(currentSession));
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Change 4: Real Supabase Auth login
  const login = async ({ email, password }) => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthenticated(true);
      return { success: true };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        console.warn('Supabase signInWithPassword error:', error.message);
        return { success: false, error: error.message };
      }
      setSession(data.session);
      setIsAuthenticated(Boolean(data.session));
      return { success: true, session: data.session };
    } catch (err) {
      console.warn('Supabase login exception:', err?.message || err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // Change 4: Sign out calling supabase.auth.signOut()
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err?.message || err);
      }
    }
    setSession(null);
    setIsAuthenticated(false);
    setOrders([]);
  };

  // Change 1 & Change 7: Split initial load & filter by currentShopId
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function loadShopData() {
      setIsLoading(true);
      const slug = getShopSlugFromUrl();

      try {
        // Look up the shop row by slug (retry transient network errors)
        const { data: shopData } = await queryWithRetry(() =>
          supabase
            .from('shops')
            .select('*')
            .eq('slug', slug)
            .maybeSingle()
        );

        if (!shopData) {
          console.warn(`Shop with slug "${slug}" not found.`);
          if (isMounted) {
            setShopNotFound(true);
            setCurrentShopId(null);
            setCurrentShop(null);
            setProducts([]);
            setFaqs([]);
            setOrders([]);
            setSupabaseError(null);
          }
          return;
        }

        const shopId = shopData.id;
        if (isMounted) {
          setCurrentShopId(shopId);
          setCurrentShop(shopData);
          setShopNotFound(false);
        }

        // Load products (filtered by currentShopId, active = true for anonymous customers)
        const buildProductsQuery = () => {
          let q = supabase
            .from('products')
            .select('*')
            .eq('shop_id', shopId);
          if (!session) {
            q = q.eq('active', true);
          }
          return q.order('created_at', { ascending: false });
        };

        // Load FAQs (filtered by currentShopId)
        const buildFaqsQuery = () =>
          supabase
            .from('faqs')
            .select('*')
            .eq('shop_id', shopId)
            .order('created_at', { ascending: false });

        // Load products and FAQs independently, each with retries: one
        // transient failure must not blank the whole shop. Only a products
        // failure after all retries falls back to demo data.
        const [productsRes, faqsRes] = await Promise.allSettled([
          queryWithRetry(buildProductsQuery),
          queryWithRetry(buildFaqsQuery),
        ]);

        if (productsRes.status === 'rejected') {
          throw productsRes.reason;
        }
        if (faqsRes.status === 'rejected') {
          console.warn(
            'Supabase FAQs failed after retries, showing products without FAQs:',
            faqsRes.reason?.message || faqsRes.reason
          );
        }

        if (isMounted) {
          setProducts(
            (productsRes.status === 'fulfilled' ? productsRes.value.data || [] : []).map(mapProductFromDb)
          );
          setFaqs(
            (faqsRes.status === 'fulfilled' ? faqsRes.value.data || [] : []).map(mapFaqFromDb)
          );
          setSupabaseError(null);
        }

        // Change 7: Load orders ONLY when a merchant session exists, filtered by currentShopId
        if (session) {
          try {
            const ordersRes = await supabase
              .from('orders')
              .select('*')
              .eq('shop_id', shopId)
              .order('created_at', { ascending: false });

            if (ordersRes.error) {
              console.warn('Error fetching merchant orders:', ordersRes.error?.message || ordersRes.error);
            } else if (isMounted) {
              setOrders((ordersRes.data || []).map(mapOrderFromDb));
            }
          } catch (ordErr) {
            console.warn('Exception fetching merchant orders:', ordErr?.message || ordErr);
          }
        } else {
          // Anonymous customers have no orders list from Supabase
          if (isMounted) {
            setOrders([]);
          }
        }
      } catch (err) {
        console.warn('Supabase connection error:', err?.message || err);
        if (isMounted) {
          setSupabaseError('Supabase connection failed, showing demo data');
          // Fall back to sample data ONLY when Supabase connection fails
          setCurrentShopId('e20baa90-1c1f-481f-b16f-61a44b60566a');
          setCurrentShop({
            id: 'e20baa90-1c1f-481f-b16f-61a44b60566a',
            slug: slug || 'ai-mindset-shop',
            bot_username: 'aimindsetshop_bot',
            name: 'AiMindset Shop',
          });
          setShopNotFound(false);
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

    loadShopData();

    return () => {
      isMounted = false;
    };
  }, [session]);

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

  // Change 7: Generate unique AMS- order ID using Date.now() instead of reading orders array
  const generateNextOrderId = () => {
    return `AMS-${Date.now()}`;
  };

  // PRODUCT ACTIONS (Change 2: Always send shop_id)
  const addProduct = async (newProductData) => {
    const shopId = await resolveShopId();
    if (!shopId) {
      console.warn('Cannot add product: shop_id is missing');
      setSupabaseError('Shop not found, cannot add product');
      return null;
    }

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
        shop_id: shopId,
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
          console.warn('Supabase addProduct error:', error?.message || error);
          setSupabaseError(`Failed to add product: ${error.message}`);
          return null;
        }
        const mapped = mapProductFromDb(data || dbRow);
        setProducts((prev) => [mapped, ...prev]);
        return mapped;
      } catch (err) {
        console.warn('Supabase addProduct exception:', err?.message || err);
        setSupabaseError('Failed to add product');
        return null;
      }
    } else {
      const newProduct = {
        id,
        shopId,
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
    const shopId = await resolveShopId();
    if (isSupabaseConfigured && supabase) {
      const updatePayload = {};
      if (shopId) updatePayload.shop_id = shopId;
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
        let query = supabase.from('products').update(updatePayload).eq('id', id);
        if (shopId) query = query.eq('shop_id', shopId);
        const { error } = await query;
        if (error) {
          console.warn('Supabase updateProduct error:', error?.message || error);
          setSupabaseError(`Failed to update product: ${error.message}`);
          return;
        }
      } catch (err) {
        console.warn('Supabase updateProduct exception:', err?.message || err);
        setSupabaseError('Failed to update product');
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
    const shopId = await resolveShopId();
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').delete().eq('id', id);
        if (shopId) query = query.eq('shop_id', shopId);
        const { error } = await query;
        if (error) {
          console.warn('Supabase deleteProduct error:', error?.message || error);
          setSupabaseError(`Failed to delete product: ${error.message}`);
          return;
        }
      } catch (err) {
        console.warn('Supabase deleteProduct exception:', err?.message || err);
        setSupabaseError('Failed to delete product');
        return;
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
  };

  const restockProduct = async (id, amount = 10) => {
    const shopId = await resolveShopId();
    const currentProd = products.find((p) => p.id === id);
    const newStock = (currentProd ? currentProd.stock : 0) + amount;

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').update({ stock: newStock }).eq('id', id);
        if (shopId) query = query.eq('shop_id', shopId);
        const { error } = await query;
        if (error) {
          console.warn('Supabase restockProduct error:', error?.message || error);
          setSupabaseError(`Failed to restock product: ${error.message}`);
          return;
        }
      } catch (err) {
        console.warn('Supabase restockProduct exception:', err?.message || err);
        setSupabaseError('Failed to restock product');
        return;
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p))
    );
  };

  // ORDER ACTIONS (Changes 2, 3, 5, 6, 7)
  const placeOrder = ({ customerName, phone, address, items, deliveryFeeKs = 2500, paymentMethod = 'Cash on Delivery' }) => {
    const subtotal = items.reduce((sum, item) => sum + item.priceKs * item.quantity, 0);
    const totalKs = subtotal + deliveryFeeKs;
    const newId = generateNextOrderId();

    // Change 3: Read Telegram user id if inside Telegram Mini App
    let telegramUserId = undefined;
    try {
      const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
      if (typeof tgId === 'number' && !isNaN(tgId)) {
        telegramUserId = tgId;
      } else if (typeof tgId === 'string' && /^\d+$/.test(tgId)) {
        telegramUserId = Number(tgId);
      }
    } catch {
      // ignore
    }

    const orderData = {
      id: newId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        priceKs: i.priceKs,
        quantity: i.quantity, // quantity, NOT qty
      })),
      deliveryFeeKs,
      totalKs,
      status: 'Pending', // Enforce 'Pending' - do not let caller override
      paymentMethod,
      createdAt: new Date().toISOString(),
      isNew: true,
      shopId: currentShopId,
      ...(telegramUserId !== undefined ? { telegramUserId } : {}),
    };

    if (isSupabaseConfigured && supabase) {
      const asyncOrderFlow = async () => {
        try {
          // Change 2: Do not send shop_id as null; wait for currentShopId
          const shopId = await resolveShopId();
          if (!shopId) {
            console.warn('Cannot place order: shop_id is required');
            setSupabaseError('Shop not found, cannot place order');
            return null;
          }

          const orderRow = {
            id: newId,
            shop_id: shopId,
            customer_name: orderData.customerName,
            phone: orderData.phone,
            address: orderData.address,
            items: orderData.items,
            delivery_fee_ks: orderData.deliveryFeeKs,
            total_ks: orderData.totalKs,
            status: 'Pending', // Enforce 'Pending'
            payment_method: orderData.paymentMethod,
            is_new: true,
            created_at: orderData.createdAt,
          };

          // Change 3: Include telegram_user_id (number) when inside Telegram
          if (telegramUserId !== undefined) {
            orderRow.telegram_user_id = telegramUserId;
          }

          // Change 7: Insert without .select() because anonymous customers have no SELECT policy
          const { error: insertError } = await supabase.from('orders').insert([orderRow]);
          if (insertError) {
            console.warn('Supabase placeOrder insert error:', insertError?.message || insertError);
            setSupabaseError(`Order insert failed: ${insertError.message}`);
            return null;
          }

          // Change 5: Call decrement_stock RPC for each item using quantity (NOT qty)
          for (const it of items) {
            const { error: rpcError } = await supabase.rpc('decrement_stock', {
              p_product_id: it.productId,
              p_qty: Number(it.quantity),
              p_shop_id: shopId,
            });
            if (rpcError) {
              console.warn(`Supabase decrement_stock error for product ${it.productId}:`, rpcError?.message || rpcError);
              setSupabaseError(`Failed to update product stock: ${rpcError.message}`);
            }
          }

          // Only after a successful insert, update local orders, myOrderIds, product stock, and clear the cart
          orderData.shopId = shopId;
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
          setOrders((prev) => [orderData, ...prev]);
          setMyOrderIds((prev) => [newId, ...prev]);
          setCart([]);
          return orderData;
        } catch (err) {
          console.warn('Supabase placeOrder exception:', err?.message || err);
          setSupabaseError('Order placement failed');
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

      setOrders((prev) => [orderData, ...prev]);
      setMyOrderIds((prev) => [newId, ...prev]);
      setCart([]);
      return orderData;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const shopId = await resolveShopId();
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('orders')
          .update({ status: newStatus, is_new: false })
          .eq('id', orderId);
        if (shopId) query = query.eq('shop_id', shopId);
        const { error } = await query;
        if (error) {
          console.warn('Supabase updateOrderStatus error:', error?.message || error);
          setSupabaseError(`Failed to update order status: ${error.message}`);
          return;
        }
      } catch (err) {
        console.warn('Supabase updateOrderStatus exception:', err?.message || err);
        setSupabaseError('Failed to update order status');
        return;
      }
    }

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus, isNew: false } : ord))
    );
  };

  const markOrderSeen = async (orderId) => {
    const shopId = await resolveShopId();
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('orders')
          .update({ is_new: false })
          .eq('id', orderId);
        if (shopId) query = query.eq('shop_id', shopId);
        const { error } = await query;
        if (error) {
          console.warn('Supabase markOrderSeen error:', error?.message || error);
        }
      } catch (err) {
        console.warn('Supabase markOrderSeen exception:', err?.message || err);
      }
    }

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, isNew: false } : ord))
    );
  };

  // FAQ ACTIONS
  const addFaq = async ({ question, answer, questionMm, answerMm }) => {
    const shopId = await resolveShopId();
    if (!shopId) {
      console.warn('Cannot add FAQ: shop_id is required');
      setSupabaseError('Shop not found, cannot add FAQ');
      return null;
    }
    const newId = `faq-${Date.now()}`;
    const q = question.trim();
    const a = answer.trim();
    const qMm = questionMm?.trim() || q;
    const aMm = answerMm?.trim() || a;

    if (isSupabaseConfigured && supabase) {
      const dbRow = {
        id: newId,
        shop_id: shopId,
        question: q,
        question_mm: qMm,
        answer: a,
        answer_mm: aMm,
        created_at: new Date().toISOString(),
      };

      try {
        const { data, error } = await supabase.from('faqs').insert([dbRow]).select().single();
        if (error) {
          console.warn('Supabase addFaq error:', error?.message || error);
          setSupabaseError(`Failed to add FAQ: ${error.message}`);
          return null;
        }
        const mapped = mapFaqFromDb(data || dbRow);
        setFaqs((prev) => [mapped, ...prev]);
        return mapped;
      } catch (err) {
        console.warn('Supabase addFaq exception:', err?.message || err);
        setSupabaseError('Failed to add FAQ');
        return null;
      }
    } else {
      const newFaq = {
        id: newId,
        shopId,
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
    const shopId = await resolveShopId();
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('faqs').delete().eq('id', id);
        if (shopId) query = query.eq('shop_id', shopId);
        const { error } = await query;
        if (error) {
          console.warn('Supabase deleteFaq error:', error?.message || error);
          setSupabaseError(`Failed to delete FAQ: ${error.message}`);
          return;
        }
      } catch (err) {
        console.warn('Supabase deleteFaq exception:', err?.message || err);
        setSupabaseError('Failed to delete FAQ');
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
        session,
        isAuthenticated,
        login,
        logout,
        currentShopId,
        currentShop,
        shopNotFound,
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
