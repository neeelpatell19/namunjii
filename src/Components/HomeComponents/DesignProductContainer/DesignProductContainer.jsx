import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Row, Col } from "antd";
import "./DesignProductContainer.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

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
                <motion.div 
                    className="Container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.div 
                        className="FashionFadeHeadingContainer"
                        variants={itemVariants}
                    >
                        <h1 ref={headingRef}>Fashion</h1>
                    </motion.div>
                    
                    <Row gutter={[40, 40]}>
                        <Col lg={8} md={12} sm={24} xs={24}>
                            <motion.div
                                variants={itemVariants}
                            >
                                <div className="CommonFlexGap">
                                    <h2>Graceful & Trendy Style</h2>
                                    <p>Join the exploration of a fashion narrative that transcends the ordinary, inviting you to embrace a style that is both elegant and on the pulse of the latest trends.</p>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Link to="/all-products">
                                            <button className="CommonBtn">
                                                <span>Shop Now</span>
                                            </button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </Col>
                        <Col lg={16} md={12} sm={24} xs={24}>
                            <motion.div 
                                className="FLexContainerForImages"
                                variants={containerVariants}
                            >
                                <div className="FlexContainerForImagesFirst">
                                    <motion.div 
                                        className="FirstImageContainer AnimateImage"
                                        variants={imageVariants}
                                    >
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
                                    </motion.div>
                                    <motion.div 
                                        className="SecondImageContainer AnimateImage"
                                        variants={imageVariants}
                                    >
                                        <img src="https://images.unsplash.com/photo-1574454004277-401a31cc564f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                        <div className="OfferLableContainer">
                                            <div>
                                                <p className="white">Sale up to 50 % Offer</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="FlexContainerForImagesSecond">
                                    <motion.div 
                                        className="ThirdImageContainer AnimateImage"
                                        variants={imageVariants}
                                    >
                                        <img src="https://images.unsplash.com/photo-1602800805330-6bab9656ea47?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                    </motion.div>
                                    <motion.div 
                                        className="ForthContainer AnimateImage"
                                        variants={imageVariants}
                                    >
                                        <img src="https://images.unsplash.com/photo-1585914924626-15adac1e6402?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </Col>
                    </Row>
                </motion.div>
            </div>
        </div>
    )
}

export default DesignProductContainer;