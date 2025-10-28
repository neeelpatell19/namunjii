import createBaseApi from "./base";
import { URLS } from "../config/urls";

const createCheckoutApi = () => {
  const api = createBaseApi(URLS.base);

  return {
    // Step 0: Create order from cart
    createOrderFromCart: (data) => {
      return api.post("/checkout/create-order", data).then((res) => res.data);
    },

    // Step 1: Add customer information
    addCustomerInfo: (data) => {
      return api.post("/checkout/customer-info", data).then((res) => res.data);
    },

    // Step 2: Add shipping address
    addShippingAddress: (data) => {
      return api
        .post("/checkout/shipping-address", data)
        .then((res) => res.data);
    },

    // Step 3: Confirm order and generate payment link
    confirmOrderAndGeneratePayment: (data) => {
      return api
        .post("/checkout/confirm-payment", data)
        .then((res) => res.data);
    },

    // Get order details by ID
    getOrderDetails: (orderId) => {
      return api.get(`/checkout/order/${orderId}`).then((res) => res.data);
    },

    // Get order details by order number (for checkout flow refresh)
    getOrderByOrderNumber: (orderNumber) => {
      return api
        .get(`/checkout/order-number/${orderNumber}`)
        .then((res) => res.data);
    },

    // Get user orders
    getUserOrders: (params) => {
      return api.get("/checkout/orders", { params }).then((res) => res.data);
    },
  };
};

const checkoutApi = createCheckoutApi();
export default checkoutApi;
