import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createSubcategoryApi = () => {
  const api = createBaseApi(`${URLS.base}/sub-categories`);
  return {
    // Get subcategories for selection
    getSubCategoriesForSelection: (params = {}) =>
      api.get("/for-selection", { params }).then((res) => res.data),
  };
};

const subcategoryApi = createSubcategoryApi();

export default subcategoryApi;


