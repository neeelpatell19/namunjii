import React, { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import checkoutApi from "../../../apis/checkout";

const { Title, Text } = Typography;

const CustomerInfoStep = ({ orderData, onComplete, onError }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await checkoutApi.addCustomerInfo({
        orderId: orderData.orderId,
        name: values.name,
        email: values.email,
        mobileNumber: values.mobileNumber,
      });

      if (response.success) {
        onComplete({
          user: response.data.user || {
            name: values.name,
            email: values.email,
            mobileNumber: values.mobileNumber,
          },
          customerInfo: response.data.customerInfo,
          status: response.data.status,
        });
      }
    } catch (error) {
      console.error("Error adding customer info:", error);
      onError(
        error.response?.data?.message || "Failed to add customer information"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-info-step">
      <div className="step-header">
        <Title level={3}>Customer Information</Title>
        <Text type="secondary">
          Please provide your contact details for order confirmation
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: orderData?.customerInfo?.name || "",
          email: orderData?.customerInfo?.email || "",
          mobileNumber: orderData?.customerInfo?.mobileNumber || "",
        }}
        className="customer-form"
      >
        <Form.Item
          name="name"
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
            prefix={<PhoneOutlined  className="Flipped"  />}
            placeholder="Enter your 10-digit mobile number"
            size="large"
            maxLength={10}
          />
        </Form.Item>

        <Form.Item className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            block
          >
            Continue to Shipping Address
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomerInfoStep;
