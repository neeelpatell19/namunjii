import axios from "axios";
import Cookies from "js-cookie";

// Helper function to get token from cookies or localStorage
const getToken = () => {
  // First check cookies, then localStorage
  return Cookies.get("token") || localStorage.getItem("token") || "";
};

const createBaseApi = (url, headers = {}, config = {}) => {
  const deviceId = localStorage.getItem("deviceId");
  const token = getToken();

  const api = axios.create({
    baseURL: url,
    headers: {
      Authorization: token ? `Token ${token}` : "",
      "x-device-id": deviceId || "",
      "Content-Type": "application/json",
      ...headers,
    },
    withCredentials: true,
    ...config,
  });

  // Add response interceptor to handle errors gracefully
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle cancelled requests (AbortError) - silently reject without logging
      if (axios.isCancel(error) || 
          error.name === 'AbortError' || 
          error.name === 'CanceledError' ||
          error.code === 'ERR_CANCELED' ||
          error.isCancelled === true) {
        // Return a rejected promise that can be caught but won't log errors
        return Promise.reject(error);
      }

      // Handle CORS and network errors - only log if not cancelled
      if (!error.response) {
        // Check if this might be a cancelled request (no response usually means cancelled or network issue)
        // Only log if we're sure it's not a cancellation
        const isLikelyCancelled = error.config?.signal?.aborted || 
                                 error.message?.includes('cancelled') ||
                                 error.message?.includes('aborted');
        
        if (!isLikelyCancelled) {
          // Network error or CORS error (but not cancelled)
          if (error.message && error.message.includes('CORS')) {
            console.warn('CORS error detected. This may be due to server configuration.');
          } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.warn('Network error. Request may have been cancelled or server is unreachable.');
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default createBaseApi;
