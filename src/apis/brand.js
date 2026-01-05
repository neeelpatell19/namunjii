import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createBrandApi = () => {
  const api = createBaseApi(`${URLS.base}/products`);
  return {
    // Get brands for selection
    getBrandsForSelection: (type = null, signal = null) => {
      const params = type ? { type } : {};
      const config = { params };
      if (signal) config.signal = signal;
      return api.get("/brands", config).then((res) => res.data);
    },
  };
};

const brandApi = createBrandApi();

export default brandApi;

