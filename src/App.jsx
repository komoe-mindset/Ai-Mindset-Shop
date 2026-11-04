import React, { useState, useEffect } from 'react';
import { ShopProvider, useShopStore } from './store/shopStore.jsx';
import Navbar from './components/Navbar.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Shop from './pages/Shop.jsx';

function AppContent() {
  const { isAuthenticated } = useShopStore();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Normalize initial route from pathname or hash
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#', '');
    if (['/login', '/dashboard', '/shop'].includes(hash)) {
      return hash;
    }
    const path = window.location.pathname;
    if (['/login', '/dashboard', '/shop'].includes(path)) {
      return path;
    }
    return '/shop';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  // Sync route on popstate and pushState
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (['/login', '/dashboard', '/shop'].includes(hash)) {
        setCurrentRoute(hash);
      } else {
        const path = window.location.pathname;
        if (['/login', '/dashboard', '/shop'].includes(path)) {
          setCurrentRoute(path);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route) => {
    setCurrentRoute(route);
    try {
      window.history.pushState({}, '', route);
    } catch {
      window.location.hash = route;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#2D2A45] flex flex-col font-sans selection:bg-[#B9A7F5] selection:text-[#2D2A45]">
      {/* Top Navbar rendered across pages */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Page Routing */}
      <div className="flex-1">
        {currentRoute === '/login' && <Login onNavigate={navigateTo} />}

        {currentRoute === '/dashboard' && (
          <Dashboard onNavigate={navigateTo} />
        )}

        {currentRoute === '/shop' && (
          <Shop
            onOpenCart={() => setIsCartOpen(true)}
            onNavigate={navigateTo}
          />
        )}
      </div>

      {/* Global Slide-over Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onViewOrders={() => {
          setIsCartOpen(false);
          // When buyer wants to view orders, navigate to shop where My Orders is available
          navigateTo('/shop');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
