import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createProductApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Get product by ID
    getProductById: (productId) =>
      api.get(`/products/${productId}`).then((res) => res.data),

    // Get products by category
    getProductsByCategory: (categoryId, params = {}) =>
      api
        .get(`/products/category/${categoryId}`, { params })
        .then((res) => res.data),

    // Get products by subcategory
    getProductsBySubcategory: (subcategoryId, params = {}) =>
      api
        .get(`/products/subcategory/${subcategoryId}`, { params })
        .then((res) => res.data),

    // Search products
    searchProducts: (query, params = {}) =>
      api
        .get("/products/search", { params: { q: query, ...params } })
        .then((res) => res.data),

    // Get featured products
    getFeaturedProducts: (params = {}) =>
      api.get("/products/featured", { params }).then((res) => res.data),

    // Get new arrivals
    getNewArrivals: (params = {}) =>
      api.get("/products/new-arrivals", { params }).then((res) => res.data),

    // Get best sellers
    getBestSellers: (params = {}) =>
      api.get("/products/best-sellers", { params }).then((res) => res.data),

    // Get all products with filters (public endpoint)
    getProducts: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/products/public?${queryString}`
        : "/products/public";
      return api.get(url).then((res) => res.data);
    },
  };
};

const productApi = createProductApi();

// Additional API methods for products listing
export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString
    ? `/products/public?${queryString}`
    : "/products/public";

  // Create a new API instance for this call
  const api = createBaseApi(URLS.base);
  return api.get(url).then((res) => res.data);
};

export default productApi;
