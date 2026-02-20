import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Form,
  Input,
  Select,
  Tag,
  Space,
  message,
} from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  MailOutlined,
  CreditCardOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";
import cartApi from "../../../apis/cart";
import { useCartWishlist } from "../Context/CartWishlistContext";
import "./CheckoutPage.css";

const { Text } = Typography;
const { Option } = Select;

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const CheckoutPage = ({ orderData, onError }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const { refreshCart } = useCartWishlist();

  const calculateItemTotal = (item) => {
    const basePrice = item.price || 0;
    const discount = item.discount || 0;
    const finalPrice =
      discount > 0 ? Math.round(basePrice * (1 - discount / 100)) : basePrice;
    return finalPrice * item.quantity;
  };

  const calculateGSTBreakdown = () => {
    const subtotal = orderData?.subtotal || 0;
    const gstAmount = Math.round((subtotal * 18) / 118);
    const baseAmount = subtotal - gstAmount;
    return { baseAmount, gstAmount, total: subtotal };
  };

  const gstBreakdown = calculateGSTBreakdown();

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      try {
        setPincodeLoading(true);
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
        );
        const data = await response.json();
        if (data[0].Status === "Success") {
          const { District, State } = data[0].PostOffice[0];
          form.setFieldsValue({ city: District, state: State });
        } else {
          message.warning(
            "Invalid pincode, please enter city and state manually",
          );
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error);
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Step 1: Save customer info
      const customerInfoRes = await checkoutApi.addCustomerInfo({
        orderId: orderData.orderId,
        name: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
      });
      if (!customerInfoRes.success) {
        throw new Error(
          customerInfoRes.message || "Failed to save customer info",
        );
      }

      // Step 2: Save shipping address
      const shippingRes = await checkoutApi.addShippingAddress({
        orderId: orderData.orderId,
        fullName: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2 || "",
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        country: "India",
        addressType: "home",
      });
      if (!shippingRes.success) {
        throw new Error(
          shippingRes.message || "Failed to save shipping address",
        );
      }

      // Step 3: Confirm order & generate payment link
      const paymentRes = await checkoutApi.confirmOrderAndGeneratePayment({
        orderId: orderData.orderId,
      });
      if (paymentRes.success) {
        try {
          await cartApi.clearCart();
          refreshCart();
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
        }
        window.location.replace(paymentRes.data.paymentLink);
      } else {
        throw new Error(
          paymentRes.message || "Failed to generate payment link",
        );
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      onError(error.message || "An error occurred during checkout");
    } finally {
      setLoading(false);
    }
  };

  const normalizeImage = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    if (Array.isArray(image) && image.length > 0) return image[0];
    return "";
  };

  return (
    <div className="checkout-page">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          fullName:
            orderData?.shippingAddress?.fullName || orderData?.user?.name || "",
          email:
            orderData?.shippingAddress?.email || orderData?.user?.email || "",
          mobileNumber:
            orderData?.shippingAddress?.mobileNumber ||
            orderData?.user?.mobileNumber ||
            "",
          addressLine1: orderData?.shippingAddress?.addressLine1 || "",
          addressLine2: orderData?.shippingAddress?.addressLine2 || "",
          city: orderData?.shippingAddress?.city || "",
          state: orderData?.shippingAddress?.state || "",
          pincode: orderData?.shippingAddress?.pincode || "",
        }}
      >
        <Row gutter={[24, 6]}>
          {/* Left: Shipping Form */}
          <Col xs={24} lg={14}>
            <Card title="Shipping Information" className="shipping-info-card">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="red-icons" />}
                      placeholder="Enter your full name"
                      size="large"
                      style={{ fontSize: "13px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="mobileNumber"
                    label="Phone Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined className="red-icons" />}
                      placeholder="Enter 10-digit phone number"
                      size="large"
                      maxLength={10}
                      style={{ fontSize: "13px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="red-icons" />}
                  placeholder="Enter your email address"
                  size="large"
                  style={{ fontSize: "13px" }}
                />
              </Form.Item>

              <Form.Item
                name="addressLine1"
                label="Address Line 1"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input
                  prefix={<HomeOutlined className="red-icons" />}
                  placeholder="House no., Street, Area"
                  size="large"
                  style={{ fontSize: "13px" }}
                />
              </Form.Item>

              <Form.Item name="addressLine2" label="Address Line 2 (Optional)">
                <Input
                  prefix={<HomeOutlined className="red-icons" />}
                  placeholder="Landmark, Colony (optional)"
                  size="large"
                  style={{ fontSize: "13px" }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="pincode"
                    label="Pincode"
                    rules={[
                      { required: true, message: "Please enter your pincode" },
                      {
                        pattern: /^[0-9]{6}$/,
                        message: "Pincode must be 6 digits",
                      },
                    ]}
                  >
                    <Input
                      placeholder="6-digit pincode"
                      size="large"
                      maxLength={6}
                      onChange={handlePincodeChange}
                      suffix={pincodeLoading ? <LoadingOutlined spin /> : null}
                      style={{ fontSize: "13px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[
                      { required: true, message: "Please enter your city" },
                    ]}
                    style={{ fontSize: "13px" }}
                  >
                    <Input
                      prefix={<EnvironmentOutlined className="red-icons" />}
                      placeholder="City"
                      size="large"
                      style={{ fontSize: "13px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[
                      { required: true, message: "Please select your state" },
                    ]}
                  >
                    <Select
                      style={{ fontSize: "13px" }}
                      placeholder="Select state"
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {indianStates.map((state) => (
                        <Option key={state} value={state}>
                          {state}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right: Order Summary */}
          <Col xs={24} lg={10}>
            <div className="order-summary-sticky">
              {/* Order Items */}
              <Card title="Order Items" className="img-card">
                <div style={{ padding: "0px", borderBottom: "none" }}>
                  {orderData?.items?.map((item, index) => {
                    const coverImage = normalizeImage(item.coverImage);
                    return (
                      <div
                        key={index}
                        style={{ padding: "0", borderBottom: "none" }}
                      >
                        <div className="item-image-details-wrapper">
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
                              <span className="item-size">
                                Size: {item.size || "One Size"}
                              </span>
                              <span className="item-quantity">
                                Qty: {item.quantity}
                              </span>
                              {item.color &&
                                item.color !== "N/A" &&
                                item.color !== "Default" && (
                                  <span className="item-color">
                                    Color: {item.color}
                                  </span>
                                )}
                            </div>
                            <div className="item-pricing">
                              <Text strong style={{ color: "#1E1E1E" }}>
                                ₹{calculateItemTotal(item).toLocaleString()}
                              </Text>
                              {item.discount > 0 && (
                                <Space size={2}>
                                  <Text
                                    delete
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                    ₹{item.price?.toLocaleString()}
                                  </Text>
                                  <Tag color="red">{item.discount}% OFF</Tag>
                                </Space>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Price Summary */}
              <Card title="Price Summary" className="order-summary-card">
                <div
                  className="summary-section"
                  style={{ padding: "5px", marginBottom: "0px" }}
                >
                  <div className="summary-item" style={{ padding: "0px" }}>
                    <Text>Subtotal (incl. GST):</Text>
                    <Text>₹{orderData?.subtotal?.toLocaleString()}</Text>
                  </div>
                  <div className="summary-item" style={{ padding: "0px" }}>
                    <Text type="secondary">Base Price:</Text>
                    <Text type="secondary">
                      ₹{gstBreakdown.baseAmount.toLocaleString()}
                    </Text>
                  </div>
                  <div className="summary-item" style={{ padding: "0px" }}>
                    <Text type="secondary">GST (18% included):</Text>
                    <Text type="secondary">
                      ₹{gstBreakdown.gstAmount.toLocaleString()}
                    </Text>
                  </div>
                  {orderData?.discount > 0 && (
                    <div className="summary-item" style={{ padding: "0px" }}>
                      <Text>Discount:</Text>
                      <Text type="success">
                        -₹{orderData?.discount?.toLocaleString()}
                      </Text>
                    </div>
                  )}
                  <div className="summary-item" style={{ padding: "0px" }}>
                    <Text>Shipping:</Text>
                    <Text>
                      {orderData?.shippingCharges === 0 ? (
                        <Tag color="green">FREE</Tag>
                      ) : (
                        `₹${orderData?.shippingCharges?.toLocaleString()}`
                      )}
                    </Text>
                  </div>
                  <div className="summary-item total">
                    <Text strong>Total Amount:</Text>
                    <Text strong>₹{orderData?.total?.toLocaleString()}</Text>
                  </div>
                </div>
              </Card>

              {/* Proceed to Payment Button — below price summary */}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className="proceed-payment-btn"
                style={{ marginTop: 16 , marginBottom: 16 }}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </Col>
        </Row>

        <div className="mobile-sticky-checkout">
          <div className="mobile-total">
            <span className="mobile-total-label">Total Amount: </span>
            <span className="mobile-total-value">₹{orderData?.total?.toLocaleString()}</span>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="mobile-proceed-btn"
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CheckoutPage;
