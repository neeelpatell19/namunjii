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
      const items = Array.isArray(res?.data) ? res.data : res?.data?.items || res?.items || [];
      setCartItems(items);
    } catch (e) {
      console.error("Error refreshing cart:", e);
      setCartItems([]);
    }
  }, []);

  const refreshWishlist = useCallback(async () => {
    try {
      const res = await wishlistApi.getWishlist();
      const items = Array.isArray(res?.data) ? res.data : res?.data?.items || res?.items || [];
      setWishlistItems(items);
    } catch (e) {
      console.error("Error refreshing wishlist:", e);
      setWishlistItems([]);
    }
  }, []);

  // Fetch cart & wishlist once on mount
  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const wishlistIdSet = useMemo(() => {
    const set = new Set();
    wishlistItems.forEach((w) => {
      // Handle different possible structures
      const productId = 
        w.productId?._id || // nested product object
        (typeof w.productId === 'string' ? w.productId : null) || // direct productId string
        w.product?._id || // alternative product property
        w._id; // item's own _id
      if (productId) {
        // Convert to string for consistent comparison
        set.add(String(productId));
      }
    });
    return set;
  }, [wishlistItems]);

  const cartIdSet = useMemo(() => {
    const set = new Set();
    cartItems.forEach((c) => {
      // Handle different possible structures
      const productId = 
        c.productId?._id || // nested product object (most common)
        (typeof c.productId === 'string' ? c.productId : null) || // direct productId string
        c.product?._id || // alternative product property
        c._id; // item's own _id
      if (productId) {
        // Convert to string for consistent comparison
        set.add(String(productId));
      }
    });
    return set;
  }, [cartItems]);

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false;
    // Convert to string for consistent comparison
    const productIdStr = String(productId);
    return wishlistIdSet.has(productIdStr);
  }, [wishlistIdSet]);

  const isInCart = useCallback((productId) => {
    if (!productId) return false;
    // Convert to string for consistent comparison
    const productIdStr = String(productId);
    return cartIdSet.has(productIdStr);
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


