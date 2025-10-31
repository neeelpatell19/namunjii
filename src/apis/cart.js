import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createCartApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Add item to cart
    addToCart: (cartData) =>
      api.post("/cart/add", cartData).then((res) => res.data),

    // Get cart items
    getCart: (params = {}) =>
      api.get("/cart", { params }).then((res) => res.data),

    // Update cart item
    updateCartItem: (updateData) =>
      api.put("/cart/update", updateData).then((res) => res.data),

    // Remove item from cart
    removeFromCart: (productId) =>
      api.delete(`/cart/remove/${productId}`).then((res) => res.data),

    // Clear entire cart
    clearCart: () => api.delete("/cart/clear").then((res) => res.data),

    // Get cart count
    getCartCount: () => api.get("/cart/count").then((res) => res.data),
  };
};

const cartApi = createCartApi();

export default cartApi;





