import React, { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import "./DesignProductContainer.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";


const DesignProductContainer = () => {
    const headingRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (headingRef.current && containerRef.current) {
                const scrollY = window.scrollY;
                const containerTop = containerRef.current.offsetTop;
                const containerHeight = containerRef.current.offsetHeight;
                const windowHeight = window.innerHeight;

                // Calculate when the container enters and exits the viewport
                const containerBottom = containerTop + containerHeight;
                const scrollBottom = scrollY + windowHeight;

                // Check if container is in view
                if (scrollY < containerBottom && scrollBottom > containerTop) {
                    // Calculate progress within the container
                    const elementStart = containerTop - windowHeight;
                    const elementEnd = containerBottom;
                    const scrollProgress = (scrollY - elementStart) / (elementEnd - elementStart);

                    // Clamp progress between 0 and 1
                    const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

                    // Apply parallax movement (0px to 200px)
                    const parallaxDistance = clampedProgress * 200;
                    headingRef.current.style.transform = `translateY(${parallaxDistance}px)`;
                } else {
                    // Reset when out of view
                    headingRef.current.style.transform = 'translateY(0px)';
                }
            }
        };

        // Set initial position
        if (headingRef.current) {
            headingRef.current.style.transform = 'translateY(0px)';
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="MainContainer DesignProductContainer PaddingBottom" ref={containerRef}>
            <div className="PaddingTop">
                <div className="Container">
                    <div className="FashionFadeHeadingContainer">
                        <h1 ref={headingRef}>Fashion</h1>
                    </div>
                    <Row gutter={[40, 40]}>
                        <Col lg={8} md={12} sm={24} xs={24}>
                            <div>
                                <div className="CommonFlexGap">
                                    <h2>Graceful & Trendy Style</h2>
                                    <p>Join the exploration of a fashion narrative that transcends the ordinary, inviting you to embrace a style that is both elegant and on the pulse of the latest trends.</p>
                                    <button className="CommonBtn"><span>Shop Now</span></button>
                                </div>
                            </div>
                        </Col>
                        <Col lg={16} md={12} sm={24} xs={24}>
                            <div className="FLexContainerForImages">
                                <div className="FlexContainerForImagesFirst">
                                    <div className="FirstImageContainer AnimateImage">
                                        <Swiper
                                            slidesPerView={1}
                                            spaceBetween={30}
                                            freeMode={true}
                                            speed={800}
                                            autoplay={{
                                                delay: 2000,
                                                disableOnInteraction: true,
                                            }}
                                            loop={true}
                                            // pagination={{
                                            //     clickable: true,
                                            // }}
                                            modules={[FreeMode, Pagination, Autoplay]}
                                            className="mySwiper"
                                        >
                                            <SwiperSlide>
                                                <div className="ImageContainer">
                                                    <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                                </div>
                                            </SwiperSlide>
                                            <SwiperSlide>
                                                <div className="ImageContainer">
                                                    <img src="https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                                </div>
                                            </SwiperSlide>
                                        </Swiper>
                                    </div>
                                    <div className="SecondImageContainer AnimateImage">
                                        <img src="https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                        <div className="OfferLableContainer">
                                            <div>
                                                <p>Sale up to 50 % Offer</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="FlexContainerForImagesSecond">
                                    <div className="ThirdImageContainer AnimateImage">
                                        <img src="https://images.unsplash.com/photo-1602800805330-6bab9656ea47?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                    </div>
                                    <div className="ForthContainer AnimateImage">
                                        <img src="https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default DesignProductContainer;