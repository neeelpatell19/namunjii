import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./TrendingDesigns.css";
import FashionClothesData from "../../DummyData/DummyData";
import { Row, Col } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

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

const TrendingDesigns = () => {
    const swiperRef = useRef(null);

    const handlePrevClick = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slidePrev();
        }
    };

    const handleNextClick = () => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideNext();
        }
    };

    return (
        <div className="MainContainer TrendingDesigns marginBottom50">
            <div className="PaddingTop">
                <motion.div 
                    className="Container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.div 
                        className="FlexContainerRepair"
                        variants={itemVariants}
                    >
                        <div className="CommonFlexGap marginBottom50">
                            <h2>Trending Designs</h2>
                            <p>Explore curated collections from our top designers.</p>
                        </div>
                        <div className="TrendingDesignsSlideNavigationContainer OnlyDesktopBtn">
                            <motion.button
                                className="swiper-nav-btn prev-btn"
                                onClick={handlePrevClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/ArrowLeft.png" alt="" />
                            </motion.button>
                            <motion.button
                                className="swiper-nav-btn next-btn"
                                onClick={handleNextClick}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/ArrowRight.png" alt="" />
                            </motion.button>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        variants={itemVariants}
                    >
                        <Swiper
                            ref={swiperRef}
                            slidesPerView={3}
                            spaceBetween={30}
                            speed={800}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 25,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                },
                            }}
                            freeMode={true}
                            loop={true}
                            modules={[FreeMode, Pagination, Autoplay, Navigation]}
                            className="mySwiper"
                        >
                            {
                                FashionClothesData.products.map((item) => (
                                    <SwiperSlide key={item.id}>
                                        <motion.div 
                                            className="TrendingDesignsCard"
                                            variants={cardVariants}
                                            whileHover={{ y: -10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="ProductCardImageContainer">
                                                <div className="ProductCardImage">
                                                    <img src={item.images[0]} alt="" />
                                                    <img src={item.images[1]} alt="" />
                                                </div>
                                                <Link to={`/designers`} className="PopUpcategoryBtn">
                                                    <div className="PopUpcategoryBtn">
                                                        <button>View Designs <MdArrowOutward /></button>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="CommonFlexGap">
                                                <div className="ProductTitle">
                                                    <h4>{item.title}</h4>
                                                </div>
                                                <div className="ProductPrize">
                                                    <p>₹&nbsp;{item.price}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                        
                        <motion.div 
                            className="TrendingDesignsSlideNavigationContainer marginTop50 OnlyMobileBtn"
                            variants={itemVariants}
                        >
                            <div>
                                <motion.button
                                    className="swiper-nav-btn prev-btn"
                                    onClick={handlePrevClick}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/ArrowLeft.png" alt="" />
                                </motion.button>
                                <motion.button
                                    className="swiper-nav-btn next-btn"
                                    onClick={handleNextClick}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/ArrowRight.png" alt="" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default TrendingDesigns;