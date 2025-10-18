import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const CustomerInfoStep = ({ onSubmit, loading, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <div className="customer-info-step">
      <div className="step-header">
        <Title level={3}>Customer Information</Title>
        <Text type="secondary">
          Please provide your contact details for order confirmation and
          delivery updates.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="customer-info-form"
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter your full name" },
            { min: 2, message: "Name must be at least 2 characters" },
            { max: 50, message: "Name must not exceed 50 characters" },
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
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
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
            prefix={<PhoneOutlined />}
            placeholder="Enter your 10-digit mobile number"
            size="large"
            maxLength={10}
          />
        </Form.Item>

        <div className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="submit-button"
          >
            Continue to Shipping Address
          </Button>
        </div>
      </Form>

      <div className="step-info">
        <Card size="small" className="info-card">
          <Text type="secondary">
            <strong>Why we need this information:</strong>
            <br />
            • Email: For order confirmation and tracking updates
            <br />
            • Mobile: For delivery coordination and SMS updates
            <br />• Name: For delivery verification and documentation
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default CustomerInfoStep;
