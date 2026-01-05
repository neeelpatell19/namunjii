import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createOrderApi = () => {
  const api = createBaseApi(URLS.base);
  return {
    // Get all orders by mobile number
    getAllOrdersByMobileNumber: (mobileNumber) =>
      api
        .post("/order/getAllOrdersByMobileNumber", { mobileNumber })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response?.data || error;
        }),
    // Track order
    trackOrder: (orderId) =>
      api
        .get("/track-order", {
          params: { orderId },
        })
        .then((res) => res.data)
        .catch((error) => {
          throw error.response?.data || error;
        }),
  };
};

const orderApi = createOrderApi();

export default orderApi;

