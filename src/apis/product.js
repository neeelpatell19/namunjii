import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createProductApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Get product by ID
    getProductById: (productId) =>
      api.get(`/products/${productId}`).then((res) => {
        console.log('Product API Response:', res.data);
        return res.data;
      }),

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
      // Build query string manually to support arrays (e.g., ?size=XS&size=S&size=L)
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // For arrays, append each value separately with the same key
          value.forEach((v) => searchParams.append(key, v));
        } else if (value !== null && value !== undefined && value !== "") {
          // For non-array values, append normally
          searchParams.append(key, value);
        }
      });

      const queryString = searchParams.toString();
      const url = queryString
        ? `/products/public?${queryString}`
        : "/products/public";
      return api.get(url).then((res) => res.data);
    },

    // Get all unique sizes from products
    getSizes: (type = null) => {
      const params = type ? { type } : {};
      return api.get("/products/sizes", { params }).then((res) => res.data);
    },

    // Get all unique colors from products
    getColors: (type = null) => {
      const params = type ? { type } : {};
      return api.get("/products/colors", { params }).then((res) => res.data);
    },

    // Get search suggestions (autocomplete)
    getSearchSuggestions: (query, limit = 10) =>
      api
        .get("/products/search-suggestions", {
          params: { q: query, limit },
        })
        .then((res) => res.data),
  };
};

const productApi = createProductApi();

// Additional API methods for products listing
export const getProducts = async (params = {}) => {
  // Build query string manually to support arrays (e.g., ?size=XS&size=S&size=L)
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // For arrays, append each value separately with the same key
      value.forEach((v) => searchParams.append(key, v));
    } else if (value !== null && value !== undefined && value !== "") {
      // For non-array values, append normally
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  const url = queryString
    ? `/products/public?${queryString}`
    : "/products/public";

  // Create a new API instance for this call
  const api = createBaseApi(URLS.base);
  return api.get(url).then((res) => res.data);
};

export default productApi;
