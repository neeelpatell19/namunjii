import React from "react";
import "./TrendingDesigns.css";
import FashionClothesData from "../../DummyData/DummyData";
import { Row, Col } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { MdArrowOutward } from "react-icons/md";
import { Link } from "react-router-dom";

const TrendingDesigns = () => {
    return (
        <div className="MainContainer TrendingDesigns marginBottom50">
            <div className="PaddingTop">
                <div className="Container">
                    <div className="marginBottom50">
                        <h2>Trending Designs</h2>
                        <p>Explore curated collections from our top designers.</p>
                    </div>
                    <div>
                        {/* <Row gutter={[16, 16]}>
                            {
                                FashionClothesData.products.map((item) => (
                                    <Col lg={8} md={12} sm={24} xs={24} key={item.id}>
                                        <div className="TrendingDesignsCard">
                                            <div>
                                                <div className="ProductCardImage">
                                                    <img src={item.images[0]} alt="" />
                                                </div>
                                                <div className="CommonFlexGap">
                                                    <div className="ProductTitle">

                                                    </div>
                                                    <div className="ProductPrize">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                ))
                            }
                        </Row> */}
                        <Swiper
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
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                            freeMode={true}
                            loop={true}
                            // pagination={{
                            //     clickable: true,
                            // }}
                            modules={[FreeMode, Pagination, Autoplay]}
                            className="mySwiper"

                        >
                            {
                                FashionClothesData.products.map((item) => (
                                    <SwiperSlide key={item.id}>
                                        <div className="TrendingDesignsCard">
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
                                                    <h3>{item.title}</h3>
                                                    <p>({item.category})</p>
                                                </div>
                                                <div className="ProductPrize">
                                                    <p>₹&nbsp;{item.price}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default TrendingDesigns;