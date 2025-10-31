import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import cartApi from "../../../apis/cart";
import wishlistApi from "../../../apis/wishlist";

const CartWishlistContext = createContext();

export const useCartWishlist = () => {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error(
      "useCartWishlist must be used within a CartWishlistProvider"
    );
  }
  return context;
};

export const CartWishlistProvider = ({ children }) => {
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [openWishlistDrawer, setOpenWishlistDrawer] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const triggerCartDrawer = () => {
    setOpenCartDrawer(true);
  };

  const triggerWishlistDrawer = () => {
    setOpenWishlistDrawer(true);
  };

  const closeCartDrawer = () => {
    setOpenCartDrawer(false);
  };

  const closeWishlistDrawer = () => {
    setOpenWishlistDrawer(false);
  };

  const refreshCart = useCallback(async () => {
    try {
      const res = await cartApi.getCart();
      const items = Array.isArray(res?.data) ? res.data : res?.items || [];
      setCartItems(items);
    } catch (e) {
      // ignore
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await wishlistApi.getWishlist();
      const items = Array.isArray(res?.data) ? res.data : res?.items || [];
      setWishlistItems(items);
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch cart & wishlist once on mount
  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const wishlistIdSet = useMemo(() => {
    const set = new Set();
    wishlistItems.forEach((w) => set.add(w.productId || w._id || w.product?._id));
    return set;
  }, [wishlistItems]);

  const cartIdSet = useMemo(() => {
    const set = new Set();
    cartItems.forEach((c) => set.add(c.productId || c._id || c.product?._id));
    return set;
  }, [cartItems]);

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false;
    return wishlistIdSet.has(productId);
  }, [wishlistIdSet]);

  const isInCart = useCallback((productId) => {
    if (!productId) return false;
    return cartIdSet.has(productId);
  }, [cartIdSet]);

  const value = {
    openCartDrawer,
    openWishlistDrawer,
    triggerCartDrawer,
    triggerWishlistDrawer,
    closeCartDrawer,
    closeWishlistDrawer,
    cartItems,
    wishlistItems,
    isInCart,
    isInWishlist,
    refreshCart,
    refreshWishlist,
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};


