import React, { useState, useEffect } from "react";
import "./CommonUserInteractionsPopup.css";
import { Button, Typography } from "antd";
import { CloseOutlined, ShoppingOutlined, StarFilled } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import FashionClothesData from "../DummyData/DummyData";

const { Title, Text } = Typography;

const CommonUserInteractionsPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Show popup after 2 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300);
    };

    const featuredProducts = FashionClothesData.products.slice(0, 3);

    if (!isVisible) return null;

    return (
        <div className={`popup-container ${isClosing ? 'closing' : ''}`}>
            <div className="popup-content">
                {/* Close Button */}
                <Button
                    type="text"
                    className="close-btn"
                    icon={<CloseOutlined />}
                    onClick={handleClose}
                />

                {/* Header */}
                <div className="popup-header">
                    {/* <div className="popup-badge">
                        <StarFilled />
                        <span>Limited Time</span>
                    </div> */}
                    <Title level={4} className="popup-title">
                        Discover Our Latest Collection
                    </Title>
                    <Text className="popup-subtitle">
                        Exclusive pieces curated just for you
                    </Text>
                </div>

                {/* Product Swiper */}
                <div className="popup-swiper-container">
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={10}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        modules={[Autoplay, Pagination]}
                        className="popup-swiper"
                    >
                        {featuredProducts.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div className="popup-product-card">
                                    <div className="product-image">
                                        <img src={product.images[0]} alt={product.title} />
                                        <div className="product-overlay">
                                            <ShoppingOutlined />
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <Text className="product-title">{product.title}</Text>
                                        {/* <Text className="product-price">₹{product.price}</Text> */}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Call to Action */}
                <div className="popup-cta">
                    <div style={{ display: "flex", justifyContent: "center" }} >
                        <button className="CommonBtn"><span>Shop Now</span></button>
                    </div>
                    <Text className="popup-offer">
                        Free shipping on orders above ₹999
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default CommonUserInteractionsPopup;