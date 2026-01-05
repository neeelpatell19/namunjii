import createBaseApi from "./base";
import { URLS } from "../config/urls";
import axios from "axios";

const createProductApi = () => {
  const api = createBaseApi(URLS.base);
  
  // Request cache to prevent duplicate simultaneous requests
  const pendingRequests = new Map();
  
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
      
      // Create a unique key for request deduplication
      const requestKey = url;
      
      // Cancel any existing pending request for this URL
      // This prevents multiple simultaneous requests for the same URL
      if (pendingRequests.has(requestKey)) {
        const existingRequest = pendingRequests.get(requestKey);
        // Cancel the previous request if it's still active
        if (existingRequest.abortController && !existingRequest.abortController.signal.aborted) {
          existingRequest.abortController.abort();
        }
        pendingRequests.delete(requestKey);
      }
      
      // Use the provided signal, or create a new AbortController for deduplication
      const abortController = signal ? null : new AbortController();
      const requestSignal = signal || abortController.signal;
      
      // Only include signal in config if it's not null
      const config = { signal: requestSignal };
      
      // Create the request promise
      const requestPromise = api.get(url, config)
        .then((res) => {
          // Clean up from pending requests on success
          if (pendingRequests.get(requestKey)?.promise === requestPromise) {
            pendingRequests.delete(requestKey);
          }
          return res.data;
        })
        .catch((error) => {
          // Clean up from pending requests on error
          if (pendingRequests.get(requestKey)?.promise === requestPromise) {
            pendingRequests.delete(requestKey);
          }
          
          // Check if request was cancelled - silently handle cancellation errors
          // Don't log or throw errors for cancelled requests
          if (requestSignal.aborted || 
              error.code === 'ERR_CANCELED' || 
              error.name === 'AbortError' || 
              error.name === 'CanceledError' ||
              axios.isCancel(error)) {
            // Create a silent cancellation error that components can check for
            const cancelError = new Error('Request cancelled');
            cancelError.name = 'AbortError';
            cancelError.isCancelled = true;
            cancelError.code = 'ERR_CANCELED';
            throw cancelError;
          }
          
          // Handle CORS and network errors for non-cancelled requests
          if (!error.response) {
            // This is a network error or CORS error
            // Only throw if it's not a cancellation
            const errorMessage = error.message || 'Network error occurred';
            throw new Error(`Failed to fetch products: ${errorMessage}. Please check your connection and try again.`);
          }
          
          // Re-throw other errors
          throw error;
        });
      
      // Store the pending request for deduplication
      pendingRequests.set(requestKey, {
        promise: requestPromise,
        abortController: abortController
      });
      
      return requestPromise;
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

// Export getProducts for convenience (uses the same instance)
export const getProducts = productApi.getProducts.bind(productApi);

export default productApi;
