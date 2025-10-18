import React from "react";
import { Card, Typography, Button, Divider, Row, Col, Tag, Space } from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const OrderConfirmationStep = ({
  orderData,
  customerInfo,
  shippingAddress,
  onConfirmPayment,
  loading,
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateItemTotal = (item) => {
    const basePrice = item.price || 0;
    const discount = item.discount || 0;
    const finalPrice =
      discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
    return finalPrice * item.quantity;
  };

  return (
    <div className="order-confirmation-step">
      <div className="step-header">
        <Title level={3}>Order Confirmation</Title>
        <Text type="secondary">
          Please review your order details before proceeding to payment.
        </Text>
      </div>

      <div className="confirmation-content">
        <Row gutter={[24, 24]}>
          {/* Order Summary */}
          <Col xs={24} lg={16}>
            <Card title="Order Summary" className="order-summary-card">
              <div className="order-items">
                {orderData?.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img
                        src={item.coverImage || "/placeholder-product.jpg"}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      <div className="item-specs">
                        {item.size && <Tag>Size: {item.size}</Tag>}
                        {item.color && <Tag>Color: {item.color}</Tag>}
                        <Tag>Qty: {item.quantity}</Tag>
                      </div>
                      <div className="item-pricing">
                        {item.discount > 0 ? (
                          <div className="discounted-price">
                            <span className="original-price">
                              {formatPrice(item.price)}
                            </span>
                            <span className="final-price">
                              {formatPrice(
                                calculateItemTotal(item) / item.quantity
                              )}
                            </span>
                            <span className="discount-badge">
                              {item.discount}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="final-price">
                            {formatPrice(
                              calculateItemTotal(item) / item.quantity
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="item-total">
                      {formatPrice(calculateItemTotal(item))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Order Details & Payment */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Customer Information */}
              <Card
                title="Customer Information"
                size="small"
                extra={<EditOutlined />}
                className="info-card"
              >
                <div className="info-item">
                  <Text strong>Name:</Text>
                  <Text>{customerInfo?.name}</Text>
                </div>
                <div className="info-item">
                  <Text strong>Email:</Text>
                  <Text>{customerInfo?.email}</Text>
                </div>
                <div className="info-item">
                  <Text strong>Mobile:</Text>
                  <Text>{customerInfo?.mobileNumber}</Text>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card
                title="Shipping Address"
                size="small"
                extra={<EditOutlined />}
                className="info-card"
              >
                <div className="address-details">
                  <Text strong>{shippingAddress?.fullName}</Text>
                  <br />
                  <Text>{shippingAddress?.addressLine1}</Text>
                  {shippingAddress?.addressLine2 && (
                    <>
                      <br />
                      <Text>{shippingAddress.addressLine2}</Text>
                    </>
                  )}
                  <br />
                  <Text>
                    {shippingAddress?.city}, {shippingAddress?.state} -{" "}
                    {shippingAddress?.pincode}
                  </Text>
                  <br />
                  <Text>{shippingAddress?.country}</Text>
                  <br />
                  <Text type="secondary">
                    Mobile: {shippingAddress?.mobileNumber}
                  </Text>
                </div>
              </Card>

              {/* Order Total */}
              <Card title="Order Total" className="order-total-card">
                <div className="total-breakdown">
                  <div className="total-row">
                    <Text>Subtotal:</Text>
                    <Text>{formatPrice(orderData?.subtotal || 0)}</Text>
                  </div>
                  {orderData?.discount > 0 && (
                    <div className="total-row discount">
                      <Text>Discount:</Text>
                      <Text>-{formatPrice(orderData.discount)}</Text>
                    </div>
                  )}
                  <div className="total-row">
                    <Text>Shipping:</Text>
                    <Text>
                      {orderData?.shippingCharges === 0 ? (
                        <Tag color="green">FREE</Tag>
                      ) : (
                        formatPrice(orderData?.shippingCharges || 0)
                      )}
                    </Text>
                  </div>
                  <div className="total-row">
                    <Text>Tax (GST):</Text>
                    <Text>{formatPrice(orderData?.tax || 0)}</Text>
                  </div>
                  <Divider />
                  <div className="total-row final-total">
                    <Text strong>Total:</Text>
                    <Text strong>{formatPrice(orderData?.total || 0)}</Text>
                  </div>
                </div>
              </Card>

              {/* Payment Button */}
              <Card className="payment-card">
                <div className="payment-info">
                  <CheckCircleOutlined className="secure-icon" />
                  <Text type="secondary">
                    Secure payment powered by Razorpay
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={onConfirmPayment}
                  loading={loading}
                  className="payment-button"
                  block
                >
                  Proceed to Payment
                </Button>
                <Text type="secondary" className="payment-note">
                  You will be redirected to a secure payment page
                </Text>
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderConfirmationStep;
