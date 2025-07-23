import React, { useState, useEffect } from "react";
import "./HeroHome.css";
import { HomePageDataCarousalImages, HomePageCrousaltext } from "./HomePageData";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
const HeroHome = () => {
    const { carousalImages } = HomePageDataCarousalImages;
    const { CarousalText } = HomePageCrousaltext;
    const [leftIndex, setLeftIndex] = useState(0); // Start with 1st image
    const [rightIndex, setRightIndex] = useState(1); // Start with 2nd image
    const [textIndex, setTextIndex] = useState(0); // Text index for synchronization

    // Auto-play functionality for both columns with alternating sequence
    useEffect(() => {
        const interval = setInterval(() => {
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
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, [carousalImages.length, CarousalText.length]);

    // Handle dot navigation for left column (odd indices)
    const handleLeftDotClick = (index) => {
        setLeftIndex(index * 2); // Only allow even indices for left
        setTextIndex(index % CarousalText.length); // Sync text with image
    };

    // Handle dot navigation for right column (even indices)
    const handleRightDotClick = (index) => {
        setRightIndex(index * 2 + 1); // Only allow odd indices for right
        setTextIndex(index % CarousalText.length); // Sync text with image
    };

    return (
        <div className="HeroHomeContainerWithoutPadding">
            <div className="HeroHomeContainer">
                <div className="TextChangeContainer">
                    <div className="TextChangeContent">
                        <div className="carousel-text">
                            {CarousalText.map((textItem, index) => (
                                <div
                                    key={index}
                                    className={`text-item ${index === textIndex ? 'active' : ''}`}
                                >
                                  <h2 style={{color:"white"}}>  {textItem.text}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="ShopCollectionBtnContainerFullWidth">
                    <div className="ShopCollectionBtnContainer">
                        <Link to="/all-products" className="w-100"><button className="ShopCollectionBtnFullWidth">Shop Collection</button></Link>
                    </div>
                </div>
                <Row gutter={0}>
                    <Col span={12} className="HeroHomeContainerLeftImages">
                        <div className="CarousalImages">
                            {carousalImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={image.title}
                                    className={`carousel-image ${index === leftIndex ? 'active' : ''
                                        }`}
                                />
                            ))}
                            <div className="carousel-overlay"></div>
                            {/* <div className="carousel-content">
                                <h1 className="carousel-title">
                                    {carousalImages[leftIndex].title}
                                </h1>
                                <p className="carousel-subtitle">
                                    Discover amazing landscapes and breathtaking views
                                </p>
                            </div> */}
                        </div>
                    </Col>
                    <Col span={12} className="HeroHomeContainerRightImages">
                        <div className="CarousalImages">
                            {carousalImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={image.title}
                                    className={`carousel-image ${index === rightIndex ? 'active' : ''
                                        }`}
                                />
                            ))}
                            <div className="carousel-overlay"></div>
                            {/* <div className="carousel-content">
                                <h1 className="carousel-title">
                                    {carousalImages[rightIndex].title}
                                </h1>
                                <p className="carousel-subtitle">
                                    Experience the beauty of nature in every frame
                                </p>
                            </div> */}
                        </div>
                    </Col>
                </Row>

                {/* Navigation dots for left column (odd sequence) */}
                {/* <div className="carousel-dots left-dots">
                    {Array.from({ length: Math.ceil(carousalImages.length / 2) }, (_, i) => (
                        <div
                            key={i}
                            className={`dot ${i * 2 === leftIndex ? 'active' : ''}`}
                            onClick={() => handleLeftDotClick(i)}
                        ></div>
                    ))}
                </div>

                {/* Navigation dots for right column (even sequence) */}
                {/* <div className="carousel-dots right-dots">
                    {Array.from({ length: Math.floor(carousalImages.length / 2) }, (_, i) => (
                        <div
                            key={i}
                            className={`dot ${i * 2 + 1 === rightIndex ? 'active' : ''}`}
                            onClick={() => handleRightDotClick(i)}
                        ></div>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default HeroHome;