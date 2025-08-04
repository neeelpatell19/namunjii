import React, { useRef } from "react";
import "./Testimonials.css";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules
import { FreeMode, Pagination } from 'swiper/modules';
import TestemonialsData from "./TestemonialsData";
import { Row, Col } from "antd";
const Testimonials = () => {
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
        <div className="MainContainer marginTop50 paddingTop50 paddingBottom50">
            <div>
                <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                    <span>Testimonials</span>
                    {/* <Link to="/">Home</Link>
                    <span> | </span>
                    <span className="ColorBlack">About Namunjii</span> */}
                </div>
                <div className="Container">
                    <div className="CommonFlexGap  TestimonialsHeaderContainer">

                        <h2 style={{ textAlign: "start" }}>Happy Customers</h2>
                        <div className="TrendingDesignsSlideNavigationContainer OnlyDesktopBtn">
                            <button
                                className="swiper-nav-btn prev-btn"
                                onClick={handlePrevClick}
                            >
                                <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/ArrowLeft.png" alt="" />
                            </button>
                            <button
                                className="swiper-nav-btn next-btn"
                                onClick={handleNextClick}
                            >
                                <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/ArrowRight.png" alt="" />
                            </button>
                        </div>
                    </div>
                    <div className="TestimonialsSwiperContainer marginTop50">
                        <div>
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={30}
                                freeMode={true}
                                speed={800}
                                breakpoints={{
                                    768: {
                                        slidesPerView: 1,
                                    },
                                    1024: {
                                        slidesPerView: 2,
                                    },
                                }}  
                                // pagination={{
                                //     clickable: true,
                                // }}
                                modules={[FreeMode, Pagination]}
                                className="mySwiper"
                                ref={swiperRef}
                            >
                                {TestemonialsData.map((item) => (
                                    <SwiperSlide key={item.id}>
                                        <div className="SwiperSlideContainer">
                                            <Row gutter={[16, 16]}>
                                                <Col lg={12} md={12} sm={24} xs={24}>
                                                    <div className="h-100">
                                                        <div className="SwiperSlideContainerContent">

                                                            <div>
                                                                <p>"{item.description}"</p>
                                                            </div>
                                                            <div>
                                                                <h4>{item.name}</h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={12} md={12} sm={24} xs={24}>
                                                    <div>
                                                        <div>
                                                            <img src={item.image} alt={item.name} />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Testimonials;