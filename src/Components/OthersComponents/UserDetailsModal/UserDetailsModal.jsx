import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, message, Row, Col } from "antd";
import { UserOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";
import "./UserDetailsModal.css";

const UserDetailsModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Show modal 3 seconds after component mounts (website reload)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsModalVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.log('Form values:', values);
        message.success('Thank you for joining our newsletter!');
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <Modal
            title={null}
            open={isModalVisible}
            onCancel={handleClose}
            footer={null}
            closable={false}
            centered
            width={800}
            className="newsletter-modal"
            maskClosable={false}
        >
            <div>
                <Row gutter={[16, 16]}>
                    <Col lg={12} md={24} xs={24}>
                        <div className="newsletter-modal-image">
                            <img src="https://images.unsplash.com/photo-1554412893-166e997f6c88?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                        </div>
                    </Col>
                    <Col lg={12} md={24} xs={24}>
                        <div className="newsletter-modal-content">
                            {/* Close Button */}
                            <button className="newsletter-close-btn" onClick={handleClose}>
                                <CloseOutlined />
                            </button>

                            <div className="AdjustFlexContainer">
                            <div>
                                {/* Header */}
                                <div className="newsletter-header">
                                    <h3>Join Our Newsletter</h3>
                                    <p>Get exclusive offers and updates!</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div>
                                <Form
                                    form={form}
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                    className="newsletter-form"
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email!' },
                                            { type: 'email', message: 'Please enter a valid email!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Email Address"
                                            size="large"
                                            style={{ borderRadius: '0px' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            { required: true, message: 'Please enter your password!' },
                                            { min: 6, message: 'Password must be at least 6 characters!' }
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={<LockOutlined />}
                                            placeholder="Password"
                                            size="large"
                                        />
                                    </Form.Item>

                                    <Form.Item>
                                        <button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            className="CommonBtn"
                                            block
                                        >
                                           <span> Join Now</span>
                                        </button>
                                    </Form.Item>
                                </Form>

                                {/* Footer Text */}
                                <div>
                                    <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
                                </div>
                            </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Modal>
    );
};

export default UserDetailsModal;