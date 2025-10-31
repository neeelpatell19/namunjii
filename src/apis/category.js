import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createCategoryApi = () => {
  const api = createBaseApi(`${URLS.base}/categories`);
  return {
    // Get categories for selection
    getCategoriesForSelection: (params = {}) =>
      api.get("/for-selection", { params }).then((res) => res.data),
  };
};

const categoryApi = createCategoryApi();

export default categoryApi;
