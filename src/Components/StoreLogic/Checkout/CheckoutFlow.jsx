import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Steps, Card, Button, Spin, Alert } from "antd";
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
  useEffect(() => {
  if(window.fbq)
window.fbq("track", "CheckoutFlowPageView");
}, [])
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { deviceId } = useDevice();
  const { state } = useAppContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Fetch order data
  const fetchOrderData = async () => {
    if (!orderNumber) return;

    try {
      setLoading(true);
      const response = await checkoutApi.getOrderByOrderNumber(orderNumber);
      if (response.success) {
        setOrderData(response.data);

        // Determine current step based on progress
        if (response.data.progress.step3Complete) {
          setCurrentStep(2);
        } else if (response.data.progress.step2Complete) {
          setCurrentStep(1);
        } else if (response.data.progress.step1Complete) {
          setCurrentStep(0);
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items for initial order creation
  const fetchCartItems = async () => {
    if (!deviceId) return;

    try {
      const response = await cartApi.getCart({ deviceId });
      if (response.success) {
        setCartItems(response.data?.items || []);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Create order from cart (Step 0)
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const response = await checkoutApi.createOrderFromCart({
        deviceId,
        userId: state.user?.id,
      });

      if (response.success) {
        // Navigate to checkout with order number
        navigate(`/checkout/${response.data.orderNumber}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Handle step completion
  const handleStepComplete = (stepData) => {
    setOrderData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    navigate(`/checkout/payment-success?orderNumber=${orderNumber}`);
  };

  // Handle payment failure
  const handlePaymentFailure = () => {
    navigate(`/checkout/payment-failed?orderNumber=${orderNumber}`);
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrderData();
    } else {
      fetchCartItems();
    }
  }, [orderNumber, deviceId]);

  // If no order number, show initial checkout button
  if (!orderNumber) {
    return (
      <div className="checkout-flow-container">
        <div className="checkout-initial">
          <Card className="checkout-card">
            <div className="checkout-header">
              <h2>Ready to Checkout?</h2>
              <p>Review your cart and proceed to checkout</p>
            </div>

            <div className="cart-summary">
              <h4>Cart Summary</h4>
              <div className="cart-items">
                {cartItems.map((item, index) => {
                  // Helper function to normalize images (handle both string and array)
                  const normalizeImage = (image) => {
                    if (!image) return "";
                    if (typeof image === 'string') return image;
                    if (Array.isArray(image) && image.length > 0) return image[0];
                    return "";
                  };
                  
                  const coverImage = normalizeImage(item.productId?.coverImage);
                  
                  return (
                  <div key={index} className="cart-item">
                    <img
                      src={coverImage}
                      alt={item.productId?.productName}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.productId?.productName}</h4>
                      <p>Size: {item.size || "One Size"}</p>
                      {item.color && item.color !== "N/A" && item.color !== "n/a" && (
                        <p>Color: {item.color}</p>
                      )}
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">
                        ₹
                        {(() => {
                          const basePrice = item.productId?.basePricing || 0;
                          const discount = item.productId?.discount || 0;
                          const finalPrice =
                            discount > 0
                              ? Math.round(basePrice * (1 - discount / 100))
                              : basePrice;
                          return (
                            finalPrice * item.quantity
                          ).toLocaleString();
                        })()}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>

              <div className="checkout-actions">
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={handleCreateOrder}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (loading && !orderData) {
    return (
      <div className="checkout-flow-container">
        <div className="checkout-loading">
          <Spin size="large" />
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="checkout-flow-container">
        <div className="checkout-error">
          <Alert message="Error" description={error} type="error" showIcon />
          <Button onClick={() => navigate("/cart")}>
            Back to Cart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-flow-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-steps">
          <Steps current={currentStep} direction="horizontal">
            <Step title="Customer Info" />
            <Step title="Shipping Address" />
            <Step title="Order Confirmation" />
          </Steps>
        </div>

        <div className="checkout-main">
          <Card className="checkout-card">
            {currentStep === 0 && (
              <CustomerInfoStep
                orderData={orderData}
                onComplete={handleStepComplete}
                onError={setError}
              />
            )}

            {currentStep === 1 && (
              <ShippingAddressStep
                orderData={orderData}
                onComplete={handleStepComplete}
                onError={setError}
              />
            )}

            {currentStep === 2 && (
              <OrderConfirmationStep
                orderData={orderData}
                onComplete={handleStepComplete}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
                onError={setError}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFlow;
