import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography, Space, Divider } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";
import "./PaymentPages.css";

const { Title, Text } = Typography;

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await checkoutApi.getOrderDetails(orderId);
      if (response.success) {
        setOrderData(response.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewOrder = () => {
    // Navigate to order details or order history
    navigate("/orders");
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <Result
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title="Payment Successful!"
          subTitle={
            <div className="success-message">
              <Text type="secondary">
                Thank you for your order! Your payment has been processed
                successfully.
              </Text>
              {orderNumber && (
                <div className="order-info">
                  <Text strong>Order Number: {orderNumber}</Text>
                </div>
              )}
            </div>
          }
          extra={
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<ShoppingOutlined />}
                  onClick={handleContinueShopping}
                  size="large"
                >
                  Continue Shopping
                </Button>
                <Button
                  icon={<HomeOutlined />}
                  onClick={handleGoHome}
                  size="large"
                >
                  Go to Home
                </Button>
              </Space>

              {orderData && (
                <Card className="order-summary-card" size="small">
                  <Title level={4}>Order Summary</Title>
                  <div className="order-details">
                    <div className="detail-row">
                      <Text>Order Total:</Text>
                      <Text strong>₹{orderData.total?.toLocaleString()}</Text>
                    </div>
                    <div className="detail-row">
                      <Text>Items:</Text>
                      <Text>{orderData.items?.length} item(s)</Text>
                    </div>
                    <div className="detail-row">
                      <Text>Payment Status:</Text>
                      <Text type="success">Completed</Text>
                    </div>
                    {orderData.shippingAddress && (
                      <>
                        <Divider />
                        <div className="shipping-info">
                          <Text strong>Shipping to:</Text>
                          <div className="address">
                            <Text>{orderData.shippingAddress.fullName}</Text>
                            <br />
                            <Text>
                              {orderData.shippingAddress.addressLine1}
                            </Text>
                            {orderData.shippingAddress.addressLine2 && (
                              <>
                                <br />
                                <Text>
                                  {orderData.shippingAddress.addressLine2}
                                </Text>
                              </>
                            )}
                            <br />
                            <Text>
                              {orderData.shippingAddress.city},{" "}
                              {orderData.shippingAddress.state} -{" "}
                              {orderData.shippingAddress.pincode}
                            </Text>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )}

              <div className="next-steps">
                <Title level={5}>What's Next?</Title>
                <ul>
                  <li>You will receive an order confirmation email shortly</li>
                  <li>We'll send you SMS updates about your order status</li>
                  <li>
                    Your order will be processed and shipped within 1-2 business
                    days
                  </li>
                  <li>Expected delivery: 3-5 business days</li>
                </ul>
              </div>
            </Space>
          }
        />
      </div>
    </div>
  );
};

export default PaymentSuccess;
