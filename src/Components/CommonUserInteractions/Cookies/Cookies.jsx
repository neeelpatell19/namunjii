import React, { useState, useEffect } from "react";
import "./Cookies.css";
import { Button, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Cookies = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Show cookies banner after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300);
    };

    const handleDecline = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className={`cookies-container ${isClosing ? 'closing' : ''}`}>
            <div className="cookies-content">
                {/* Clothing Icons */}
                <div className="cookies-icons">
                    <svg className="clothing-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H13V7H15V9H21ZM7 11V9H5V11H7ZM9 11V9H7V11H9ZM11 11V9H9V11H11ZM13 11V9H11V11H13ZM15 11V9H13V11H15ZM17 11V9H15V11H17ZM19 11V9H17V11H19ZM21 11V9H19V11H21ZM7 13V11H5V13H7ZM9 13V11H7V13H9ZM11 13V11H9V13H11ZM13 13V11H11V13H13ZM15 13V11H13V13H15ZM17 13V11H15V13H17ZM19 13V11H17V13H19ZM21 13V11H19V13H21ZM7 15V13H5V15H7ZM9 15V13H7V15H9ZM11 15V13H9V15H11ZM13 15V13H11V15H13ZM15 15V13H13V15H15ZM17 15V13H15V15H17ZM19 15V13H17V15H19ZM21 15V13H19V15H21Z"/>
                    </svg>
                    <svg className="clothing-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H13V7H15V9H21ZM7 11V9H5V11H7ZM9 11V9H7V11H9ZM11 11V9H9V11H11ZM13 11V9H11V11H13ZM15 11V9H13V11H15ZM17 11V9H15V11H17ZM19 11V9H17V11H19ZM21 11V9H19V11H21ZM7 13V11H5V13H7ZM9 13V11H7V13H9ZM11 13V11H9V13H11ZM13 13V11H11V13H13ZM15 13V11H13V13H15ZM17 13V11H15V13H17ZM19 13V11H17V13H19ZM21 13V11H19V13H21ZM7 15V13H5V15H7ZM9 15V13H7V15H9ZM11 15V13H9V15H11ZM13 15V13H11V15H13ZM15 15V13H13V15H15ZM17 15V13H15V15H17ZM19 15V13H17V15H19ZM21 15V13H19V15H21Z"/>
                    </svg>
                    <svg className="clothing-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H5V3H13V7H15V9H21ZM7 11V9H5V11H7ZM9 11V9H7V11H9ZM11 11V9H9V11H11ZM13 11V9H11V11H13ZM15 11V9H13V11H15ZM17 11V9H15V11H17ZM19 11V9H17V11H19ZM21 11V9H19V11H21ZM7 13V11H5V13H7ZM9 13V11H7V13H9ZM11 13V11H9V13H11ZM13 13V11H11V13H13ZM15 13V11H13V13H15ZM17 13V11H15V13H17ZM19 13V11H17V13H19ZM21 13V11H19V13H21ZM7 15V13H5V15H7ZM9 15V13H7V15H9ZM11 15V13H9V15H11ZM13 15V13H11V15H13ZM15 15V13H13V15H15ZM17 15V13H15V15H17ZM19 15V13H17V15H19ZM21 15V13H19V15H21Z"/>
                    </svg>
                </div>

                {/* Content */}
                <div className="cookies-text">
                    <Text className="cookies-title">
                        We use cookies to enhance your shopping experience
                    </Text>
                    <Text className="cookies-description">
                        By continuing to browse, you agree to our use of cookies. We use them to provide you with a better experience and to help us improve our website.
                    </Text>
                </div>

                {/* Action Buttons */}
                <div className="cookies-actions">
                    <Button 
                        type="primary" 
                        className="accept-btn"
                        icon={<CheckOutlined />}
                        onClick={handleAccept}
                    >
                        Accept All
                    </Button>
                    <Button 
                        type="text" 
                        className="decline-btn"
                        icon={<CloseOutlined />}
                        onClick={handleDecline}
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cookies; 