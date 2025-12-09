import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography, Space, Divider } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";

const { Title, Text } = Typography;

const PaymentSuccess = () => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "PaymentSuccessPageView");
  }, []);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await checkoutApi.getOrderDetails(orderId);
          if (response.success) {
            setOrderData(response.data);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-content">
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
          title="Payment Successful!"
          subTitle={
            <div>
              <Text>Your order has been placed successfully.</Text>
              {orderNumber && (
                <div style={{ marginTop: 8 }}>
                  <Text strong>Order Number: {orderNumber}</Text>
                </div>
              )}
            </div>
          }
          extra={[
            <Button
              type="primary"
              key="continue"
              onClick={handleContinueShopping}
            >
              <ShoppingOutlined /> Continue Shopping
            </Button>,
            <Button key="home" onClick={handleGoHome}>
              <HomeOutlined /> Go to Home
            </Button>,
          ]}
        />

        {orderData && (
          <Card className="order-summary-card" style={{ marginTop: 24 }}>
            <Title level={4}>Order Summary</Title>
            <div className="order-summary">
              <div className="summary-item">
                <Text>Order Number:</Text>
                <Text strong>{orderData.orderNumber}</Text>
              </div>
              {orderData.subtotal && (
                <>
                  <div className="summary-item">
                    <Text>Subtotal (incl. GST):</Text>
                    <Text>₹{orderData.subtotal?.toLocaleString()}</Text>
                  </div>
                  <div
                    className="summary-item"
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      paddingLeft: "12px",
                    }}
                  >
                    <Text type="secondary">Base Price:</Text>
                    <Text type="secondary">
                      ₹
                      {Math.round(
                        (orderData.subtotal * 100) / 118
                      ).toLocaleString()}
                    </Text>
                  </div>
                  <div
                    className="summary-item"
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      paddingLeft: "12px",
                    }}
                  >
                    <Text type="secondary">GST (18% included):</Text>
                    <Text type="secondary">
                      ₹
                      {Math.round(
                        (orderData.subtotal * 18) / 118
                      ).toLocaleString()}
                    </Text>
                  </div>
                </>
              )}
              <div className="summary-item">
                <Text>Total Amount:</Text>
                <Text strong>₹{orderData.total?.toLocaleString()}</Text>
              </div>
              <div className="summary-item">
                <Text>Payment Status:</Text>
                <Text strong style={{ color: "#52c41a" }}>
                  Completed
                </Text>
              </div>
              <div className="summary-item">
                <Text>Order Date:</Text>
                <Text>
                  {new Date(orderData.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </div>

            <Divider />

            <div className="next-steps">
              <Title level={5}>What's Next?</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>
                  • You will receive an order confirmation email shortly
                </Text>
                <Text>
                  • Your order will be processed and shipped within 2-3 business
                  days
                </Text>
                <Text>• You can track your order using the order number</Text>
                <Text>
                  • For any queries, please contact our customer support
                </Text>
              </Space>
            </div>
          </Card>
        )}

        <div className="contact-support">
          <Card>
            <Title level={5}>Need Help?</Title>
            <Text>
              If you have any questions about your order, please contact our
              customer support team.
            </Text>
            <div style={{ marginTop: 16 }}>
              <Button type="link" onClick={() => navigate("/contact-us")}>
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
