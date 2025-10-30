import React, { createContext, useContext, useState } from "react";

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

  const value = {
    openCartDrawer,
    openWishlistDrawer,
    triggerCartDrawer,
    triggerWishlistDrawer,
    closeCartDrawer,
    closeWishlistDrawer,
  };

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
};


