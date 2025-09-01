import React, { useState } from "react";
import { motion } from "framer-motion";
import "./FeaturesAndQuestion.css";
import { Row, Col, Card, Typography, Button, Collapse } from "antd";
import {
    CarOutlined,
    TagsOutlined,
    ShoppingOutlined,
    GiftOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const FeaturesAndQuestion = () => {
    const [activeKeys, setActiveKeys] = useState([]);
    const [animatingKeys, setAnimatingKeys] = useState([]);

    const features = [
        {
            icon: <CarOutlined />,
            title: "Speedy Shipping",
            description: "Join us in experiencing the convenience and efficiency of our rapid delivery services."
        },
        {
            icon: <TagsOutlined />,
            title: "Brand Tags",
            description: "Gateway to understanding the character and uniqueness of a brand in a glance."
        },
        {
            icon: <ShoppingOutlined />,
            title: "Online Retail",
            description: "Converge to transform the way you shop and engage with the world of commerce."
        },
        {
            icon: <GiftOutlined />,
            title: "Offer Gift Voucher",
            description: "Convenience and endless possibilities through our Gift Voucher program."
        }
    ];

    const questions = [
        {
            key: "1",
            title: "Approach in Action",
            content: "If for any reason you're not completely satisfied with your purchase, simply initiate the return within 30 days of receiving your order. Our customer service team is here to help you with a smooth and hassle-free return process. We understand that sometimes products don't meet expectations, and we want to ensure your complete satisfaction with every purchase."
        },
        {
            key: "2",
            title: "Return Process",
            content: "Our return process is designed to be simple and customer-friendly. Start by logging into your account and navigating to your order history. Select the item you wish to return and provide a reason for the return. Print the prepaid shipping label and package your item securely. Drop it off at any authorized shipping location, and we'll process your refund within 5-7 business days."
        },
        {
            key: "3",
            title: "Maximize Your Savings",
            content: "Take advantage of our loyalty program to earn points on every purchase. Sign up for our newsletter to receive exclusive discounts and early access to sales. Use our price match guarantee to ensure you're getting the best deals. Combine multiple promotions and use our seasonal discount codes for maximum savings on your favorite products."
        },
        {
            key: "4",
            title: "Smart Spending",
            content: "Make informed purchasing decisions by reading customer reviews and checking product ratings. Compare prices across different categories and take advantage of bundle deals. Set up price alerts for items you're interested in and wait for the best time to buy. Use our wishlist feature to track items and get notified when they go on sale."
        }
    ];

    const handlePanelChange = (keys) => {
        setActiveKeys(keys);

        // Add animation state for smooth text transition
        const newAnimatingKeys = [...keys];
        setAnimatingKeys(newAnimatingKeys);

        // Clear animation state after animation completes
        setTimeout(() => {
            setAnimatingKeys([]);
        }, 200);
    };

    const isPanelActive = (key) => {
        return activeKeys.includes(key);
    };

    const getButtonText = (key) => {
        const isActive = activeKeys.includes(key);
        const isAnimating = animatingKeys.includes(key);

        if (isAnimating) {
            return isActive ? "" : "CLOSING...";
        }

        return isActive ? "CLOSE" : "VIEW";
    };

    return (
        <div className="MainContainer FeaturesAndQuestion paddingBottom50">
            <div className="PaddingTop">
                <motion.div 
                    className="Container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <Row>
                        {/* Features Column */}
                        <Col lg={12} md={24} sm={24} xs={24}>
                            <motion.div 
                                className="FeaturesSection"
                                variants={itemVariants}
                            >
                                <h2 className="godber-heading">Features & Facility</h2>
                                <motion.div 
                                    className="FeaturesGrid"
                                    variants={containerVariants}
                                >
                                    <Row gutter={[30, 30]}>
                                        {features.map((feature, index) => (
                                            <Col lg={12} md={24} sm={24} xs={24} key={index}>
                                                <motion.div
                                                    variants={cardVariants}
                                                    whileHover={{ y: -5 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Card className="FeatureCard">
                                                        <div className="FeatureContent">
                                                            <div className="FeatureIcon">
                                                                {feature.icon}
                                                            </div>
                                                            <div className="FeatureText">
                                                                <h4 className="FeatureTitle">
                                                                    {feature.title}
                                                                </h4>
                                                                <p className="FeatureDescription">
                                                                    {feature.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            </Col>
                                        ))}
                                    </Row>
                                </motion.div>
                            </motion.div>
                        </Col>

                        {/* Questions Column */}
                        <Col lg={12} md={24} sm={24} xs={24}>
                            <motion.div 
                                className="QuestionsSection"
                                variants={itemVariants}
                            >
                                <h2 className="godber-heading">Question</h2>
                                <motion.div 
                                    className="QuestionsList"
                                    variants={containerVariants}
                                >
                                    <Collapse
                                        activeKey={activeKeys}
                                        onChange={handlePanelChange}
                                        className="CustomAccordion"
                                        expandIcon={false}
                                    >
                                        {questions.map((question, index) => (
                                            <motion.div
                                                key={question.key}
                                                variants={cardVariants}
                                                whileHover={{ x: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Collapse.Panel
                                                    header={
                                                        <div className="QuestionHeader">
                                                            <h4 className="QuestionTitle">
                                                                {question.title}
                                                            </h4>
                                                            <Button
                                                                type="text"
                                                                className="QuestionAction"
                                                                size="small"
                                                            >
                                                                {getButtonText(question.key)}
                                                            </Button>
                                                        </div>
                                                    }
                                                    showArrow={false}
                                                >
                                                    <p className="QuestionText">
                                                        {question.content}
                                                    </p>
                                                </Collapse.Panel>
                                            </motion.div>
                                        ))}
                                    </Collapse>
                                </motion.div>
                            </motion.div>
                        </Col>
                    </Row>
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturesAndQuestion;