import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Select, Row, Col } from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ShippingAddressStep = ({
  onSubmit,
  loading,
  initialData,
  customerInfo,
}) => {
  const [form] = Form.useForm();

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

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else if (customerInfo) {
      // Pre-fill with customer info
      form.setFieldsValue({
        fullName: customerInfo.name,
        mobileNumber: customerInfo.mobileNumber,
      });
    }
  }, [initialData, customerInfo, form]);

  const handleSubmit = (values) => {
    onSubmit(values);
  };

  return (
    <div className="shipping-address-step">
      <div className="step-header">
        <Title level={3}>Shipping Address</Title>
        <Text type="secondary">
          Please provide the delivery address where you want to receive your
          order.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="shipping-address-form"
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter the recipient name" },
                { min: 2, message: "Name must be at least 2 characters" },
                { max: 50, message: "Name must not exceed 50 characters" },
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Recipient's full name"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="mobileNumber"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter mobile number" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Mobile number must be 10 digits",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="10-digit mobile number"
                size="large"
                maxLength={10}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="addressLine1"
          label="Address Line 1"
          rules={[
            { required: true, message: "Please enter your address" },
            { min: 10, message: "Please enter a complete address" },
            { max: 100, message: "Address must not exceed 100 characters" },
          ]}
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="House/Flat number, Building name, Street"
            size="large"
          />
        </Form.Item>

        <Form.Item name="addressLine2" label="Address Line 2 (Optional)">
          <Input placeholder="Area, Landmark, Locality" size="large" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[
                { required: true, message: "Please enter city" },
                { min: 2, message: "City name must be at least 2 characters" },
                { max: 30, message: "City name must not exceed 30 characters" },
              ]}
            >
              <Input placeholder="City" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please select state" }]}
            >
              <Select
                placeholder="Select State"
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
          <Col xs={24} sm={8}>
            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[
                { required: true, message: "Please enter pincode" },
                { pattern: /^[0-9]{6}$/, message: "Pincode must be 6 digits" },
              ]}
            >
              <Input placeholder="6-digit pincode" size="large" maxLength={6} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="addressType" label="Address Type" initialValue="home">
          <Select size="large">
            <Option value="home">Home</Option>
            <Option value="work">Work</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <div className="form-actions">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="submit-button"
          >
            Continue to Order Confirmation
          </Button>
        </div>
      </Form>

      <div className="step-info">
        <Card size="small" className="info-card">
          <Text type="secondary">
            <strong>Delivery Information:</strong>
            <br />
            • Free shipping on orders above ₹1,000
            <br />
            • Standard delivery: 3-5 business days
            <br />
            • Express delivery available for select areas
            <br />• We'll send SMS updates to the provided mobile number
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default ShippingAddressStep;
