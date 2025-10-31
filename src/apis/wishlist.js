import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createWishlistApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Add item to wishlist
    addToWishlist: (wishlistData) =>
      api.post("/wishlist/add", wishlistData).then((res) => res.data),

    // Get wishlist items
    getWishlist: (params = {}) =>
      api.get("/wishlist", { params }).then((res) => res.data),

    // Remove item from wishlist
    removeFromWishlist: (productId) =>
      api.delete(`/wishlist/remove/${productId}`).then((res) => res.data),

    // Clear entire wishlist
    clearWishlist: () => api.delete("/wishlist/clear").then((res) => res.data),

    // Get wishlist count
    getWishlistCount: () => api.get("/wishlist/count").then((res) => res.data),

    // Check if product is in wishlist
    checkInWishlist: (productId) =>
      api.get(`/wishlist/check/${productId}`).then((res) => res.data),
  };
};

const wishlistApi = createWishlistApi();

export default wishlistApi;





