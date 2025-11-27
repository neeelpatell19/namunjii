import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createBrandApi = () => {
  const api = createBaseApi(`${URLS.base}/products`);
  return {
    // Get brands for selection
    getBrandsForSelection: (type = null) => {
      const params = type ? { type } : {};
      return api.get("/brands", { params }).then((res) => res.data);
    },
  };
};

const brandApi = createBrandApi();

export default brandApi;

