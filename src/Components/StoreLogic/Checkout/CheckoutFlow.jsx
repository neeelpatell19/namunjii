import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Steps, Card, Button, Spin, Alert } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAppContext } from "../Context/AppContext";
import { useDevice } from "../../../hooks/useDevice";
import checkoutApi from "../../../apis/checkout";
import cartApi from "../../../apis/cart";
import CustomerInfoStep from "./CustomerInfoStep";
import ShippingAddressStep from "./ShippingAddressStep";
import OrderConfirmationStep from "./OrderConfirmationStep";
import "./CheckoutFlow.css";

const { Step } = Steps;

const CheckoutFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { deviceId } = useDevice();
  const { state } = useAppContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Check if we have an orderId in URL (for returning from payment)
  const orderId = searchParams.get("orderId");

  // Fetch cart items
  const fetchCartItems = async () => {
    if (!deviceId) return;

    try {
      const response = await cartApi.getCart({ deviceId });
      if (response.success) {
        setCartItems(response.data?.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items");
    }
  };

  useEffect(() => {
    if (orderId) {
      // If we have an orderId, fetch order details
      fetchOrderDetails(orderId);
    } else {
      // Fetch cart items
      fetchCartItems();
    }
  }, [orderId, deviceId]);

  useEffect(() => {
    if (!orderId && cartItems.length === 0 && deviceId) {
      // If no cart items and no orderId, redirect to cart
      navigate("/cart");
    }
  }, [cartItems.length, orderId, deviceId, navigate]);

  const fetchOrderDetails = async (id) => {
    try {
      setLoading(true);
      const response = await checkoutApi.getOrderDetails(id);
      if (response.success) {
        setOrderData(response.data);
        setCustomerInfo(response.data.customerInfo);
        setShippingAddress(response.data.shippingAddress);

        // Set current step based on order status
        if (response.data.status === "draft") {
          setCurrentStep(0);
        } else if (response.data.status === "user_info_added") {
          setCurrentStep(1);
        } else if (response.data.status === "address_added") {
          setCurrentStep(2);
        } else if (response.data.status === "payment_pending") {
          setCurrentStep(2);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkoutApi.createOrderFromCart({
        deviceId,
        userId: null, // Add userId if user is logged in
      });

      if (response.success) {
        setOrderData(response.data);
        setCurrentStep(1);
      } else {
        setError(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerInfoSubmit = async (info) => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkoutApi.addCustomerInfo({
        orderId: orderData.orderId,
        ...info,
      });

      if (response.success) {
        setCustomerInfo(info);
        setOrderData((prev) => ({ ...prev, ...response.data }));
        setCurrentStep(2);
      } else {
        setError(response.message || "Failed to save customer information");
      }
    } catch (error) {
      console.error("Error saving customer info:", error);
      setError("Failed to save customer information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingAddressSubmit = async (address) => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkoutApi.addShippingAddress({
        orderId: orderData.orderId,
        ...address,
      });

      if (response.success) {
        setShippingAddress(address);
        setOrderData((prev) => ({ ...prev, ...response.data }));
        setCurrentStep(3);
      } else {
        setError(response.message || "Failed to save shipping address");
      }
    } catch (error) {
      console.error("Error saving shipping address:", error);
      setError("Failed to save shipping address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirmation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await checkoutApi.confirmOrderAndGeneratePayment({
        orderId: orderData.orderId,
      });

      if (response.success) {
        // Redirect to Razorpay payment link
        window.location.href = response.data.paymentLink;
      } else {
        setError(response.message || "Failed to generate payment link");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      handleBackToCart();
    }
  };

  if (loading && !orderData) {
    return (
      <div className="checkout-loading">
        <Spin size="large" />
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="checkout-error">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleBackToCart}>
              Back to Cart
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="checkout-flow">
      <div className="checkout-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          className="back-button"
        >
          Back
        </Button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-steps">
          <Steps current={currentStep} direction="horizontal" responsive>
            <Step title="Customer Info" />
            <Step title="Shipping Address" />
            <Step title="Order Confirmation" />
            <Step title="Payment" />
          </Steps>
        </div>

        <div className="checkout-form-container">
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: "20px" }}
            />
          )}

          <Card className="checkout-form-card">
            {currentStep === 0 && (
              <div className="checkout-start">
                <h2>Ready to Checkout?</h2>
                <p>Review your cart items and proceed to checkout.</p>
                <div className="cart-summary">
                  <p>
                    <strong>Items in cart:</strong> {cartItems.length}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹
                    {cartItems
                      .reduce((sum, item) => {
                        const basePrice = item.productId.basePricing || 0;
                        const discount = item.productId.discount || 0;
                        const finalPrice =
                          discount > 0
                            ? Math.round(basePrice * (1 - discount / 100))
                            : basePrice;
                        return sum + finalPrice * item.quantity;
                      }, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCreateOrder}
                  loading={loading}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}

            {currentStep === 1 && (
              <CustomerInfoStep
                onSubmit={handleCustomerInfoSubmit}
                loading={loading}
                initialData={customerInfo}
              />
            )}

            {currentStep === 2 && (
              <ShippingAddressStep
                onSubmit={handleShippingAddressSubmit}
                loading={loading}
                initialData={shippingAddress}
                customerInfo={customerInfo}
              />
            )}

            {currentStep === 3 && (
              <OrderConfirmationStep
                orderData={orderData}
                customerInfo={customerInfo}
                shippingAddress={shippingAddress}
                onConfirmPayment={handlePaymentConfirmation}
                loading={loading}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
