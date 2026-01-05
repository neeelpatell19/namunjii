import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createProductApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Get product by ID
    getProductById: (productId, signal = null) => {
      const config = signal ? { signal } : {};
      return api.get(`/products/${productId}`, config).then((res) => {
        console.log('Product API Response:', res.data);
        return res.data;
      });
    },

    // Get products by category
    getProductsByCategory: (categoryId, params = {}, signal = null) => {
      const config = { params };
      if (signal) config.signal = signal;
      return api.get(`/products/category/${categoryId}`, config).then((res) => res.data);
    },

    // Get products by subcategory
    getProductsBySubcategory: (subcategoryId, params = {}, signal = null) => {
      const config = { params };
      if (signal) config.signal = signal;
      return api.get(`/products/subcategory/${subcategoryId}`, config).then((res) => res.data);
    },

    // Search products
    searchProducts: (query, params = {}, signal = null) => {
      const config = { params: { q: query, ...params } };
      if (signal) config.signal = signal;
      return api.get("/products/search", config).then((res) => res.data);
    },

    // Get featured products
    getFeaturedProducts: (params = {}, signal = null) => {
      const config = { params };
      if (signal) config.signal = signal;
      return api.get("/products/featured", config).then((res) => res.data);
    },

    // Get new arrivals
    getNewArrivals: (params = {}, signal = null) => {
      const config = { params };
      if (signal) config.signal = signal;
      return api.get("/products/new-arrivals", config).then((res) => res.data);
    },

    // Get best sellers
    getBestSellers: (params = {}, signal = null) => {
      const config = { params };
      if (signal) config.signal = signal;
      return api.get("/products/best-sellers", config).then((res) => res.data);
    },

    // Get all products with filters (public endpoint)
    getProducts: (params = {}, signal = null) => {
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
      
      // Only include signal in config if it's not null
      const config = signal ? { signal } : {};
      
      return api.get(url, config)
        .then((res) => res.data)
        .catch((error) => {
          // Check if request was cancelled
          if (signal && signal.aborted) {
            throw error; // Re-throw cancelled errors
          }
          
          // Handle CORS and network errors
          if (!error.response) {
            // This is a network error or CORS error
            if (error.code === 'ERR_CANCELED' || error.name === 'AbortError' || error.name === 'CanceledError') {
              throw error; // Re-throw cancellation errors
            }
            // For other network errors, throw with a more descriptive message
            const errorMessage = error.message || 'Network error occurred';
            throw new Error(`Failed to fetch products: ${errorMessage}. Please check your connection and try again.`);
          }
          
          // Re-throw other errors
          throw error;
        });
    },

    // Get all unique sizes from products
    getSizes: (type = null, signal = null) => {
      const params = type ? { type } : {};
      const config = { params };
      if (signal) config.signal = signal;
      return api.get("/products/sizes", config).then((res) => res.data);
    },

    // Get all unique colors from products
    getColors: (type = null, signal = null) => {
      const params = type ? { type } : {};
      const config = { params };
      if (signal) config.signal = signal;
      return api.get("/products/colors", config).then((res) => res.data);
    },

    // Get search suggestions (autocomplete)
    getSearchSuggestions: (query, limit = 10, signal = null) => {
      const config = { params: { q: query, limit } };
      if (signal) config.signal = signal;
      return api.get("/products/search-suggestions", config).then((res) => res.data);
    },
  };
};

const productApi = createProductApi();

// Additional API methods for products listing
export const getProducts = async (params = {}, signal = null) => {
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
  
  // Only include signal in config if it's not null
  const config = signal ? { signal } : {};
  
  return api.get(url, config)
    .then((res) => res.data)
    .catch((error) => {
      // Check if request was cancelled
      if (signal && signal.aborted) {
        throw error; // Re-throw cancelled errors
      }
      
      // Handle CORS and network errors
      if (!error.response) {
        // This is a network error or CORS error
        if (error.code === 'ERR_CANCELED' || error.name === 'AbortError' || error.name === 'CanceledError') {
          throw error; // Re-throw cancellation errors
        }
        // For other network errors, throw with a more descriptive message
        const errorMessage = error.message || 'Network error occurred';
        throw new Error(`Failed to fetch products: ${errorMessage}. Please check your connection and try again.`);
      }
      
      // Re-throw other errors
      throw error;
    });
};

export default productApi;
