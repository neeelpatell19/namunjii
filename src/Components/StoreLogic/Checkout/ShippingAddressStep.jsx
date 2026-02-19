import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Row, Col, Typography } from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  MailOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";


const { Title, Text } = Typography;
const { Option } = Select;



const ShippingAddressStep = ({ orderData, onComplete, onError }) => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "ShippingAddressPageView");
  }, []);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false)

  useEffect(() => {
    const name = orderData?.user?.name || orderData?.customerInfo?.name;
    const mobile =
      orderData?.user?.mobileNumber || orderData?.customerInfo?.mobileNumber;

    if (name && !orderData?.shippingAddress?.fullName) {
      form.setFieldsValue({ fullName: name });
    }
    if (mobile && !orderData?.shippingAddress?.mobileNumber) {
      form.setFieldsValue({ mobileNumber: mobile });
    }
  }, [
    orderData?.user?.name,
    orderData?.user?.mobileNumber,
    orderData?.customerInfo?.name,
    orderData?.customerInfo?.mobileNumber,
    form,
  ]);

const handlePincodeChange = async (e) => {
  const pincode = e.target.value;
  
  // Check if pincode is valid (6 digits)
  if (pincode.length === 6 && /^[0-9]{6}$/.test(pincode)) {
    setPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice) {
        const postOffice = data[0].PostOffice[0];
        const city = postOffice.District;
        const state = postOffice.State;
        
        // Auto-fill city and state
        form.setFieldsValue({
          city: city,
          state: state,
        });
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
    } finally {
      setPincodeLoading(false);
    }
  }
};

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
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli",
    "Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const customerInfoResponse = await checkoutApi.addCustomerInfo({
        orderId: orderData.orderId,
        name: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
      })

      if (!customerInfoResponse.success) {
        throw new error("Failed to save customer information")
      }

      const response = await checkoutApi.addShippingAddress({
        orderId: orderData.orderId,
        fullName: values.fullName,
        email: values.email,
        mobileNumber: values.mobileNumber,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        country: values.country || "India",
        addressType: values.addressType || "home",
      });

      if (response.success) {
        onComplete({
          user: customerInfoResponse.data.user || {
            name: values.fullName,
            email: values.email,
            mobileNumber : values.mobileNumber
          },
          customerInfo: customerInfoResponse.data.customerInfo,
          shippingAddress: response.data.shippingAddress,
          status: response.data.status,
        });
      }
    } catch (error) {
      console.error("Error in checkout process:", error);
      onError(
        error.response?.data?.message || error.message || "Failed to add shipping address",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shipping-address-step">
      <div className="step-header">
        <Title level={3}>Checkout</Title>
        <Text type="secondary">
          Please provide your shipping address for delivery
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        key={`shipping-form-${
          orderData?.user?.name || orderData?.customerInfo?.name || "empty"
        }-${
          orderData?.user?.mobileNumber ||
          orderData?.customerInfo?.mobileNumber ||
          "empty"
        }`}
        initialValues={{
          fullName:
            orderData?.shippingAddress?.fullName ||
            orderData?.user?.name ||
            orderData?.customerInfo?.name ||
            "",
          mobileNumber:
            orderData?.shippingAddress?.mobileNumber ||
            orderData?.user?.mobileNumber ||
            orderData?.customerInfo?.mobileNumber ||
            "",
            email: 
            orderData?.shippingAddress?.email ||
            orderData?.user?.email ||
            orderData?.customerInfo?.email ||
            '',
          addressLine1: orderData?.shippingAddress?.addressLine1 || "",
          addressLine2: orderData?.shippingAddress?.addressLine2 || "",
          city: orderData?.shippingAddress?.city || "",
          state: orderData?.shippingAddress?.state || "",
          pincode: orderData?.shippingAddress?.pincode || "",
          country: orderData?.shippingAddress?.country || "India",
          addressType: orderData?.shippingAddress?.addressType || "home",
        }}
        className="shipping-form"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter your full name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="mobileNumber"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter your mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Mobile number must be 10 digits",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="" />}
                placeholder="Enter your 10-digit mobile number"
                size="large"
                maxLength={10}
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
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                size="large"
                type="email"
              />
            </Form.Item>

        <Form.Item
          name="addressLine1"
          label="Address Line 1"
          rules={[
            { required: true, message: "Please enter your address" },
            { min: 10, message: "Address must be at least 10 characters" },
          ]}
        >
          <Input
            prefix={<HomeOutlined />}
            placeholder="House/Flat number, Street name"
            size="large"
          />
        </Form.Item>

        <Form.Item name="addressLine2" label="Address Line 2 (Optional)">
          <Input
            placeholder="Apartment, suite, unit, building, floor, etc."
            size="large"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
             <Form.Item
              name="pincode"
              label="Pincode"
              rules={[
                { required: true, message: "Please enter your pincode" },
                { pattern: /^[0-9]{6}$/, message: "Pincode must be 6 digits" },
              ]}
            >
              <Input
                placeholder="Enter 6-digit pincode"
                size="large"
                maxLength={6}
                onChange={handlePincodeChange}
                suffix={pincodeLoading && <LoadingOutlined spin />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
          <Form.Item
              name="city"
              label="City"
              rules={[
                { required: true, message: "Please enter your city" },
                { min: 2, message: "City must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<EnvironmentOutlined />}
                placeholder="Enter your city"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
          <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select your state" }]}
            >
              <Select
                placeholder="Select your state"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="country" label="Country">
              <Input placeholder="Country" size="large" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="addressType" label="Address Type">
              <Select placeholder="Select address type" size="large">
                <Option value="home">Home</Option>
                <Option value="work">Work</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
          >
            Continue to Order Confirmation
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ShippingAddressStep;
