import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createHomeApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Get dynamic home page data
    getHome: () => api.get("/user-home").then((res) => res.data),
  };
};

const homeApi = createHomeApi();

export default homeApi;
