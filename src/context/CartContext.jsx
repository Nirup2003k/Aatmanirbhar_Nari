import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'aatmanirbhar_cart';

export const parsePriceNumber = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  if (!priceStr || typeof priceStr !== 'string') return 0;
  const match = priceStr.match(/[\d]+(?:\.[\d]+)?/);
  return match ? parseFloat(match[0]) : 0;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (parsed && parsed.businessId && Array.isArray(parsed.items)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
    }
    return null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingConflict, setPendingConflict] = useState(null);

  useEffect(() => {
    try {
      if (cart && cart.items && cart.items.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Error persisting cart to localStorage:', e);
    }
  }, [cart]);

  const openCartDrawer = useCallback(() => setIsCartOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartOpen(false), []);
  const toggleCartDrawer = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const executeAddToCart = useCallback((bizId, bizName, item) => {
    setCart((prevCart) => {
      if (!prevCart || prevCart.businessId !== bizId || !prevCart.items) {
        return {
          businessId: bizId,
          businessName: bizName,
          items: [item],
        };
      }

      const existingIndex = prevCart.items.findIndex((i) => i.serviceId === item.serviceId);
      let updatedItems = [...prevCart.items];

      if (existingIndex >= 0) {
        const existingItem = updatedItems[existingIndex];
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
        };
      } else {
        updatedItems.push(item);
      }

      return {
        ...prevCart,
        businessName: bizName,
        items: updatedItems,
      };
    });

    setIsCartOpen(true);
  }, []);

  const addToCart = useCallback((businessId, businessName, service, quantity = 1) => {
    const numBusinessId = parseInt(businessId, 10);
    const numServiceId = parseInt(service.id, 10);
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const unitPrice = parsePriceNumber(service.price);

    const newItem = {
      serviceId: numServiceId,
      name: service.name,
      priceStr: service.price,
      unitPrice,
      quantity: qty,
    };

    // Case 1: Cart exists and belongs to a DIFFERENT business with items
    if (cart && cart.items && cart.items.length > 0 && cart.businessId !== numBusinessId) {
      setPendingConflict({
        newBusinessId: numBusinessId,
        newBusinessName: businessName,
        item: newItem,
      });
      return;
    }

    // Case 2: Cart is empty or belongs to SAME business
    executeAddToCart(numBusinessId, businessName, newItem);
  }, [cart, executeAddToCart]);

  const confirmConflictReplacement = useCallback(() => {
    if (pendingConflict) {
      setCart({
        businessId: pendingConflict.newBusinessId,
        businessName: pendingConflict.newBusinessName,
        items: [pendingConflict.item],
      });
      setPendingConflict(null);
      setIsCartOpen(true);
    }
  }, [pendingConflict]);

  const cancelConflictReplacement = useCallback(() => {
    setPendingConflict(null);
  }, []);

  const updateQuantity = useCallback((serviceId, newQuantity) => {
    const numServiceId = parseInt(serviceId, 10);
    const qty = parseInt(newQuantity, 10);

    setCart((prevCart) => {
      if (!prevCart || !prevCart.items) return prevCart;

      if (qty <= 0) {
        const remainingItems = prevCart.items.filter((i) => i.serviceId !== numServiceId);
        if (remainingItems.length === 0) return null;
        return { ...prevCart, items: remainingItems };
      }

      const updatedItems = prevCart.items.map((item) =>
        item.serviceId === numServiceId ? { ...item, quantity: qty } : item
      );

      return { ...prevCart, items: updatedItems };
    });
  }, []);

  const removeFromCart = useCallback((serviceId) => {
    const numServiceId = parseInt(serviceId, 10);
    setCart((prevCart) => {
      if (!prevCart || !prevCart.items) return prevCart;
      const remainingItems = prevCart.items.filter((i) => i.serviceId !== numServiceId);
      if (remainingItems.length === 0) return null;
      return { ...prevCart, items: remainingItems };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const cartCount = useMemo(() => {
    return cart && cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart && cart.items ? cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) : 0;
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      pendingConflict,
      confirmConflictReplacement,
      cancelConflictReplacement,
    }),
    [
      cart,
      cartCount,
      cartTotal,
      isCartOpen,
      openCartDrawer,
      closeCartDrawer,
      toggleCartDrawer,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      pendingConflict,
      confirmConflictReplacement,
      cancelConflictReplacement,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Different Business Conflict Modal */}
      {pendingConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-brand-secondary mb-2">
              Replace cart items?
            </h3>
            <p className="text-sm text-brand-text mb-6 leading-relaxed">
              Your cart currently contains items from <span className="font-semibold text-brand-primary">{cart?.businessName}</span>. Adding items from <span className="font-semibold text-brand-primary">{pendingConflict.newBusinessName}</span> will clear your current cart.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelConflictReplacement}
                className="px-4 py-2 text-xs font-bold text-brand-muted hover:text-brand-secondary transition-colors"
              >
                Keep Existing Cart
              </button>
              <button
                onClick={confirmConflictReplacement}
                className="px-4 py-2 text-xs font-bold text-white bg-brand-primary hover:bg-brand-primary/90 rounded-lg shadow-sm transition-colors"
              >
                Clear & Add New Items
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
