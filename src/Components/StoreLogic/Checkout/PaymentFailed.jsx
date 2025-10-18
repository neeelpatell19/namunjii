import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Result, Button, Card, Typography, Space, Alert } from "antd";
import {
  CloseCircleOutlined,
  ReloadOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./PaymentPages.css";

const { Title, Text } = Typography;

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const reason = searchParams.get("reason");

  const handleRetryPayment = () => {
    // Navigate back to checkout or retry payment
    if (orderId) {
      navigate(`/checkout?orderId=${orderId}`);
    } else {
      navigate("/checkout");
    }
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const getFailureMessage = (reason) => {
    switch (reason) {
      case "cancelled":
        return "Payment was cancelled by you.";
      case "failed":
        return "Payment failed due to technical issues.";
      case "timeout":
        return "Payment session timed out.";
      case "insufficient_funds":
        return "Insufficient funds in your account.";
      case "card_declined":
        return "Your card was declined by the bank.";
      default:
        return "Payment could not be processed. Please try again.";
    }
  };

  const getFailureSuggestions = (reason) => {
    switch (reason) {
      case "cancelled":
        return [
          "Check your payment details and try again",
          "Ensure you have sufficient funds",
          "Contact your bank if the issue persists",
        ];
      case "failed":
        return [
          "Check your internet connection",
          "Try using a different payment method",
          "Contact support if the problem continues",
        ];
      case "timeout":
        return [
          "Complete the payment process quickly",
          "Ensure stable internet connection",
          "Try again with a different browser",
        ];
      case "insufficient_funds":
        return [
          "Add money to your account",
          "Use a different payment method",
          "Check with your bank about available balance",
        ];
      case "card_declined":
        return [
          "Verify your card details",
          "Check with your bank about card status",
          "Try using a different card",
        ];
      default:
        return [
          "Check your payment details",
          "Ensure stable internet connection",
          "Try a different payment method",
          "Contact support for assistance",
        ];
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <Result
          icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
          title="Payment Failed"
          subTitle={
            <div className="failure-message">
              <Text type="secondary">{getFailureMessage(reason)}</Text>
              {orderId && (
                <div className="order-info">
                  <Text type="secondary">Order ID: {orderId}</Text>
                </div>
              )}
            </div>
          }
          extra={
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={handleRetryPayment}
                  size="large"
                >
                  Try Again
                </Button>
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={handleGoToCart}
                  size="large"
                >
                  Back to Cart
                </Button>
                <Button
                  icon={<HomeOutlined />}
                  onClick={handleGoHome}
                  size="large"
                >
                  Go to Home
                </Button>
              </Space>

              <Card className="help-card" size="small">
                <Title level={5}>What you can do:</Title>
                <ul className="suggestions-list">
                  {getFailureSuggestions(reason).map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </Card>

              <Alert
                message="Need Help?"
                description={
                  <div>
                    <Text>
                      If you continue to experience issues, please contact our
                      support team:
                    </Text>
                    <br />
                    <Text strong>Email:</Text> support@namunjii.com
                    <br />
                    <Text strong>Phone:</Text> +91-XXXX-XXXX
                    <br />
                    <Text strong>Hours:</Text> 9 AM - 6 PM (Mon-Sat)
                  </div>
                }
                type="info"
                showIcon
              />

              <div className="payment-methods">
                <Title level={5}>Available Payment Methods:</Title>
                <div className="payment-options">
                  <Text>• Credit/Debit Cards (Visa, Mastercard, RuPay)</Text>
                  <br />
                  <Text>• Net Banking</Text>
                  <br />
                  <Text>• UPI (Google Pay, PhonePe, Paytm)</Text>
                  <br />
                  <Text>• Wallets (Paytm, Mobikwik)</Text>
                </div>
              </div>
            </Space>
          }
        />
      </div>
    </div>
  );
};

export default PaymentFailed;
