import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./HeroHome.css";
import { HomePageDataCarousalImages, HomePageCrousaltext } from "./HomePageData";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";

// Animation variants for hero animations
const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut"
        }
    }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            delay: 0.5
        }
    }
};

const HeroHome = () => {
    const { carousalImages } = HomePageDataCarousalImages;
    const { CarousalText } = HomePageCrousaltext;
    const [leftIndex, setLeftIndex] = useState(0); // Start with 1st image
    const [rightIndex, setRightIndex] = useState(1); // Start with 2nd image
    const [textIndex, setTextIndex] = useState(0); // Text index for synchronization
    const [isTextTransitioning, setIsTextTransitioning] = useState(false); // Track text transition state
    const [previousTextIndex, setPreviousTextIndex] = useState(0); // Track previous text for fade out

    // Auto-play functionality for both columns with alternating sequence
    useEffect(() => {
        const interval = setInterval(() => {
            // Start text transition
            setIsTextTransitioning(true);
            setPreviousTextIndex(textIndex);
            
            // Wait for fade out to complete, then change text
            setTimeout(() => {
                setLeftIndex((prevIndex) => {
                    // Left shows odd indices: 0, 2, 4, 6...
                    const nextIndex = prevIndex + 2;
                    return nextIndex >= carousalImages.length ? 0 : nextIndex;
                });
                setRightIndex((prevIndex) => {
                    // Right shows even indices: 1, 3, 5, 7...
                    const nextIndex = prevIndex + 2;
                    return nextIndex >= carousalImages.length ? 1 : nextIndex;
                });
                setTextIndex((prevIndex) => {
                    // Text changes with images
                    const nextIndex = prevIndex + 1;
                    return nextIndex >= CarousalText.length ? 0 : nextIndex;
                });
                
                // Wait a bit more, then allow next transition
                setTimeout(() => {
                    setIsTextTransitioning(false);
                }, 100);
            }, 750); // Half of the transition time (1.5s / 2)
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [carousalImages.length, CarousalText.length, textIndex]);

    // Handle dot navigation for left column (odd indices)
    const handleLeftDotClick = (index) => {
        setIsTextTransitioning(true);
        setPreviousTextIndex(textIndex);
        
        setTimeout(() => {
            setLeftIndex(index * 2); // Only allow even indices for left
            setTextIndex(index % CarousalText.length); // Sync text with image
            
            setTimeout(() => {
                setIsTextTransitioning(false);
            }, 100);
        }, 750);
    };

    // Handle dot navigation for right column (even indices)
    const handleRightDotClick = (index) => {
        setIsTextTransitioning(true);
        setPreviousTextIndex(textIndex);
        
        setTimeout(() => {
            setRightIndex(index * 2 + 1); // Only allow odd indices for right
            setTextIndex(index % CarousalText.length); // Sync text with image
            
            setTimeout(() => {
                setIsTextTransitioning(false);
            }, 100);
        }, 750);
    };

    return (
        <div className="HeroHomeContainerWithoutPadding">
            <div className="HeroHomeContainer">
                <motion.div 
                    className="TextChangeContainer"
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                >
                    <div className="TextChangeContent">
                        <div className="carousel-text">
                            {CarousalText.map((textItem, index) => (
                                <div
                                    key={index}
                                    className={`text-item ${
                                        index === textIndex ? 'active' : 
                                        isTextTransitioning && index === previousTextIndex ? 'fade-out' : ''
                                    }`}
                                >
                                  <h2 style={{color:"white"}}>{textItem.text}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
                
                <Row gutter={0}>
                    <Col span={24} className="HeroHomeContainerLeftImages">
                        <motion.div 
                            className="CarousalImages"
                            initial="hidden"
                            animate="visible"
                            variants={imageVariants}
                        >
                            {carousalImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={image.title}
                                    className={`carousel-image ${index === leftIndex ? 'active' : ''
                                        }`}
                                />
                            ))}
                            <motion.div 
                                className="carousel-overlay"
                                variants={overlayVariants}
                            ></motion.div>
                        </motion.div>
                    </Col>
                    <Col span={12} className="HeroHomeContainerRightImages">
                        <motion.div 
                            className="CarousalImages"
                            initial="hidden"
                            animate="visible"
                            variants={imageVariants}
                            transition={{ delay: 0.3 }}
                        >
                            {carousalImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={image.title}
                                    className={`carousel-image ${index === rightIndex ? 'active' : ''
                                        }`}
                                />
                            ))}
                            <motion.div 
                                className="carousel-overlay"
                                variants={overlayVariants}
                            ></motion.div>
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default HeroHome;