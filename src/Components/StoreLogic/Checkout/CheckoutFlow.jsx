import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin, Alert } from "antd";
import { useAppContext } from "../Context/AppContext";
import { useDevice } from "../../../hooks/useDevice";
import checkoutApi from "../../../apis/checkout";
import cartApi from "../../../apis/cart";
import CheckoutPage from "./CheckoutPage";
import "./CheckoutFlow.css";

const CheckoutFlow = () => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "CheckoutFlowPageView");
  }, []);
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const { deviceId } = useDevice();
  const { state } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Fetch order data when orderNumber present
  const fetchOrderData = async () => {
    if (!orderNumber) return;
    try {
      setLoading(true);
      const response = await checkoutApi.getOrderByOrderNumber(orderNumber);
      if (response.success) {
        setOrderData(response.data);
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

  // Create order from cart
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const response = await checkoutApi.createOrderFromCart({
        deviceId,
        userId: state.user?.id,
      });
      if (response.success) {
        if (window.fbq) window.fbq("track", "CheckoutPageView");
        navigate(`/checkout/${response.data.orderNumber}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setError(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrderData();
    } else {
      fetchCartItems();
    }
  }, [orderNumber, deviceId]);


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
                  const normalizeImage = (image) => {
                    if (!image) return "";
                    if (typeof image === "string") return image;
                    if (Array.isArray(image) && image.length > 0) return image[0];
                    return "";
                  };
                  const coverImage = normalizeImage(item.productId?.coverImage);
                  return (
                    <div key={index} className="cart-item">
                      <img src={coverImage} alt={item.productId?.productName} className="item-image" />
                      <div className="item-details">
                        <h4>{item.productId?.productName}</h4>
                        <p>Size: {item.size || "One Size"}</p>
                        {item.color && item.color !== "N/A" && item.color !== "n/a" && (
                          <p>Color: {item.color}</p>
                        )}
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">
                          ₹{(() => {
                            const basePrice = item.productId?.basePricing || 0;
                            const discount = item.productId?.discount || 0;
                            const finalPrice = discount > 0
                              ? Math.round(basePrice * (1 - discount / 100))
                              : basePrice;
                            return (finalPrice * item.quantity).toLocaleString();
                          })()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-actions">
                <Button type="primary" size="large" loading={loading} onClick={handleCreateOrder}>
                  Proceed to Checkout
                </Button>
              </div>
            </div>

            {error && (
              <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 16 }} />
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
          <Button onClick={() => navigate("/cart")}>Back to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-flow-container">
      <div className="checkout-content">
        <div className="checkout-main">
          <CheckoutPage
            orderData={orderData}
            onError={setError}
          />
        </div>
        {error && (
          <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 16 }} />
        )}
      </div>
    </div>
  );
};

export default CheckoutFlow;