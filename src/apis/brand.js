import createBaseApi from "./base";
import { URLS } from "../config/urls";
import axios from "axios";

const createBrandApi = () => {
  const api = createBaseApi(`${URLS.base}/products`);
  
  // Helper function to retry requests with exponential backoff
  const retryRequest = async (requestFn, maxRetries = 3, initialDelay = 300) => {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn();
        return result;
      } catch (error) {
        lastError = error;

        // Don't retry if request was intentionally cancelled
        if (
          error.code === "ERR_CANCELED" ||
          error.name === "AbortError" ||
          error.name === "CanceledError" ||
          axios.isCancel(error) ||
          error.isCancelled === true
        ) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying (exponential backoff)
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };
  
  return {
    // Get brands for selection
    getBrandsForSelection: (type = null, signal = null) => {
      const params = type ? { type } : {};
      
      // Create request function that can retry without signal if canceled
      const makeRequest = (useSignal = true) => {
        const config = { params };
        if (useSignal && signal && !signal.aborted) config.signal = signal;
        return api.get("/brands", config).then((res) => res.data);
      };
      
      // Try initial request
      return makeRequest(true)
        .catch((error) => {
          // Check if request was canceled
          const isCanceled = 
            error.code === "ERR_CANCELED" ||
            error.name === "AbortError" ||
            error.name === "CanceledError" ||
            axios.isCancel(error) ||
            error.isCancelled === true ||
            (signal && signal.aborted);
          
          // If canceled, retry without signal (critical request)
          if (isCanceled) {
            // Wait a bit then retry without signal, with additional retries
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                retryRequest(() => makeRequest(false), 2, 200)
                  .then(resolve)
                  .catch((retryError) => {
                    console.error("Error fetching brands after retries:", retryError);
                    reject(retryError);
                  });
              }, 200);
            });
          }
          // For other errors, use retry logic
          return retryRequest(() => makeRequest(true)).catch((retryError) => {
            console.error("Error fetching brands after retries:", retryError);
            throw retryError;
          });
        });
    },
  };
};

const brandApi = createBrandApi();

export default brandApi;

