import React, { useState } from "react";
import { Card, Typography, Button, Divider, Row, Col, Tag, Space } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";

const { Title, Text, Paragraph } = Typography;

const OrderConfirmationStep = ({
  orderData,
  onComplete,
  onPaymentSuccess,
  onPaymentFailure,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const calculateItemTotal = (item) => {
    const basePrice = item.price || 0;
    const discount = item.discount || 0;
    const finalPrice =
      discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
    return finalPrice * item.quantity;
  };

  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      const response = await checkoutApi.confirmOrderAndGeneratePayment({
        orderId: orderData.orderId,
      });

      if (response.success) {
        // Replace current window with payment link
        window.location.replace(response.data.paymentLink);

        // Update order data
        onComplete({
          paymentInfo: {
            paymentLink: response.data.paymentLink,
            paymentStatus: "pending",
          },
          status: response.data.status,
        });
      }
    } catch (error) {
      console.error("Error generating payment link:", error);
      onError(
        error.response?.data?.message || "Failed to generate payment link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-confirmation-step">
      <div className="step-header">
        <Title level={3}>Order Confirmation</Title>
        <Text type="secondary">
          Please review your order details before proceeding to payment
        </Text>
      </div>

      <div className="order-summary">
        <Row gutter={[24, 24]}>
          {/* Order Items */}
          <Col xs={24} lg={16}>
          <div className="Sticky-wrraper">
            <Card title="Order Items" className="order-items-card">
              <div className="order-items">
                {orderData?.items?.map((item, index) => {
                  // Helper function to normalize images (handle both string and array)
                  const normalizeImage = (image) => {
                    if (!image) return "";
                    if (typeof image === 'string') return image;
                    if (Array.isArray(image) && image.length > 0) return image[0];
                    return "";
                  };
                  
                  const coverImage = normalizeImage(item.coverImage);
                  
                  return (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img
                        src={coverImage}
                        alt={item.productName}
                        className="product-image"
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      <div className="item-specs">
                        <Tag color="blue">Size: {item.size || "One Size"}</Tag>
                        <Tag color="green">
                          Color: {item.color || "Default"}
                        </Tag>
                        <Tag color="orange">Qty: {item.quantity}</Tag>
                      </div>
                      <div className="item-pricing">
                        <Text strong>₹{item.finalPrice?.toLocaleString()}</Text>
                        {item.discount > 0 && (
                          <Space>
                            <Text delete type="secondary">
                              ₹{item.price?.toLocaleString()}
                            </Text>
                            <Tag color="red">{item.discount}% OFF</Tag>
                          </Space>
                        )}
                      </div>
                    </div>
                    <div className="item-total">
                      <Text strong>
                        ₹{calculateItemTotal(item).toLocaleString()}
                      </Text>
                    </div>
                  </div>
                  );
                })}
              </div>
      
            </Card>
            <div className="payment-actions">
        <Button
          type="primary"
          size="large"
          icon={<CreditCardOutlined />}
          loading={loading}
          onClick={handleProceedToPayment}
          className="proceed-payment-btn forlgscreen"
        >
          Proceed to Payment
        </Button>
      </div>
            </div>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <Card title="Order Summary" className="order-summary-card">
              <div className="summary-section">
                <div className="summary-item">
                  <Text>Subtotal:</Text>
                  <Text>₹{orderData?.subtotal?.toLocaleString()}</Text>
                </div>
                <div className="summary-item">
                  <Text>Discount:</Text>
                  <Text type="success">
                    -₹{orderData?.discount?.toLocaleString()}
                  </Text>
                </div>
                <div className="summary-item">
                  <Text>Shipping:</Text>
                  <Text>
                    {orderData?.shippingCharges === 0 ? (
                      <Tag color="green">FREE</Tag>
                    ) : (
                      `₹${orderData?.shippingCharges?.toLocaleString()}`
                    )}
                  </Text>
                </div>
                <div className="summary-item">
                  <Text>Tax (GST):</Text>
                  <Text>₹{orderData?.tax?.toLocaleString()}</Text>
                </div>
                <Divider />
                <div className="summary-item total">
                  <Text strong>Total:</Text>
                  <Text strong>₹{orderData?.total?.toLocaleString()}</Text>
                </div>
              </div>
            </Card>

            {/* Customer Info */}
            <Card title="Customer Information" className="customer-info-card">
              <div className="customer-details">
                <div className="detail-item">
                  <Text strong>Name:</Text>
                  <Text>{orderData?.customerInfo?.name}</Text>
                </div>
                <div className="detail-item">
                  <Text strong>Email:</Text>
                  <Text>{orderData?.customerInfo?.email}</Text>
                </div>
                <div className="detail-item">
                  <Text strong>Mobile:</Text>
                  <Text>{orderData?.customerInfo?.mobileNumber}</Text>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card title="Shipping Address" className="shipping-info-card">
              <div className="shipping-details">
                <div className="detail-item">
                  <Text strong>{orderData?.shippingAddress?.fullName}</Text>
                </div>
                <div className="detail-item">
                  <Text>{orderData?.shippingAddress?.addressLine1}</Text>
                </div>
                {orderData?.shippingAddress?.addressLine2 && (
                  <div className="detail-item">
                    <Text>{orderData?.shippingAddress?.addressLine2}</Text>
                  </div>
                )}
                <div className="detail-item">
                  <Text>
                    {orderData?.shippingAddress?.city},{" "}
                    {orderData?.shippingAddress?.state} -{" "}
                    {orderData?.shippingAddress?.pincode}
                  </Text>
                </div>
                <div className="detail-item">
                  <Text>{orderData?.shippingAddress?.country}</Text>
                </div>
                <div className="detail-item">
                  <Text>
                    Mobile: {orderData?.shippingAddress?.mobileNumber}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="payment-actions">
        <Button
          type="primary"
          size="large"
          icon={<CreditCardOutlined />}
          loading={loading}
          onClick={handleProceedToPayment}
          className="proceed-payment-btn forsmscreen"
        >
          Proceed to Payment
        </Button>
      </div>

      <div className="payment-info">
        <Paragraph type="secondary">
          <CheckCircleOutlined /> You will be redirected to a secure payment
          page. Your order will be confirmed once payment is successful.
        </Paragraph>
      </div>
    </div>
  );
};

export default OrderConfirmationStep;
