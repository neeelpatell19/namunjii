import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography, Space, Alert } from "antd";
import {
  CloseCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";

const { Title, Text } = Typography;

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");
  const reason = searchParams.get("reason");

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

  const handleRetryPayment = () => {
    if (orderData?.paymentInfo?.paymentLink) {
      window.open(orderData.paymentInfo.paymentLink, "_blank");
    } else {
      // Navigate back to checkout
      navigate(`/checkout/${orderData?.orderNumber}`);
    }
  };

  const handleGoToCart = () => {
    navigate("/products");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getFailureMessage = () => {
    switch (reason) {
      case "cancelled":
        return "Payment was cancelled by you.";
      case "failed":
        return "Payment failed due to technical issues.";
      case "timeout":
        return "Payment session timed out.";
      case "insufficient_funds":
        return "Insufficient funds in your account.";
      case "Order not found":
        return "Order not found. Please try again.";
      default:
        return "Payment failed. Please try again.";
    }
  };

  const getSuggestions = () => {
    switch (reason) {
      case "cancelled":
        return [
          "You can retry the payment using the same payment method",
          "Try using a different payment method",
          "Contact your bank if the issue persists",
        ];
      case "failed":
        return [
          "Check your internet connection",
          "Try using a different payment method",
          "Contact your bank for assistance",
        ];
      case "timeout":
        return [
          "Complete the payment process quickly",
          "Ensure stable internet connection",
          "Try again with a different payment method",
        ];
      case "insufficient_funds":
        return [
          "Add money to your account",
          "Use a different payment method",
          "Try using a credit card instead",
        ];
      default:
        return [
          "Try using a different payment method",
          "Check your internet connection",
          "Contact customer support if the issue persists",
        ];
    }
  };

  return (
    <div className="payment-failed-container">
      <div className="payment-failed-content">
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          title="Payment Failed"
          subTitle={
            <div>
              <Text>{getFailureMessage()}</Text>
              {orderData?.orderNumber && (
                <div style={{ marginTop: 8 }}>
                  <Text strong>Order Number: {orderData.orderNumber}</Text>
                </div>
              )}
            </div>
          }
          extra={[
            <Button type="primary" key="retry" onClick={handleRetryPayment}>
              <ReloadOutlined /> Retry Payment
            </Button>,
            <Button key="cart" onClick={handleGoToCart}>
              <ShoppingCartOutlined /> Go to Cart
            </Button>,
            <Button key="home" onClick={handleGoHome}>
              <HomeOutlined /> Go to Home
            </Button>,
          ]}
        />

        <Alert
          message="What you can do:"
          description={
            <ul style={{ marginBottom: 0 }}>
              {getSuggestions().map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {orderData && (
          <Card className="order-details-card">
            <Title level={4}>Order Details</Title>
            <div className="order-details">
              <div className="detail-item">
                <Text>Order Number:</Text>
                <Text strong>{orderData.orderNumber}</Text>
              </div>
              <div className="detail-item">
                <Text>Total Amount:</Text>
                <Text strong>₹{orderData.total?.toLocaleString()}</Text>
              </div>
              <div className="detail-item">
                <Text>Payment Status:</Text>
                <Text strong style={{ color: "#ff4d4f" }}>
                  Failed
                </Text>
              </div>
              <div className="detail-item">
                <Text>Order Date:</Text>
                <Text>
                  {new Date(orderData.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </div>
          </Card>
        )}

        <div className="contact-support">
          <Card>
            <Title level={5}>Need Help?</Title>
            <Text>
              If you continue to experience payment issues, please contact our
              customer support team.
            </Text>
            <div style={{ marginTop: 16 }}>
              <Space>
                <Button type="link" onClick={() => navigate("/contact-us")}>
                  Contact Support
                </Button>
                <Button type="link" onClick={() => navigate("/products")}>
                  Continue Shopping
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
