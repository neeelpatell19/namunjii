import React, { useEffect, useState } from "react";
import { Row, Col, Tabs } from "antd";
import "./IndividualProduct.css";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';
import { Link, useParams } from "react-router-dom";
import DesignerDummyData from "../../../OthersComponents/Designers/DesignerDummyData";
import CommonUnderworkingModal from "../../../CommonUserInteractions/CommonUnderworkingModal";
const IndividualProduct = () => {

    const Images = [
        {
            image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?q=80&w=1065&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            image: "https://images.unsplash.com/photo-1609505849320-29530bcb2d26?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            image: "https://images.unsplash.com/photo-1608312149553-d31a9cbc5224?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ]
    const { productName } = useParams();
    // Find the designer for this product
    const designer = DesignerDummyData.find(d =>
        d.DesignerProducts.some(p => p.ProductName === productName)
    );
    const product = designer?.DesignerProducts.find(p => p.ProductName === productName);

    const SizeBoxes = [
        {
            size: "XXS",

        },
        {
            size: "XS",

        },
        {
            size: "S",

        },
        {
            size: "M",

        },
        {
            size: "L",

        },
        {
            size: "XL",

        },
        {
            size: "XXL",

        },
    ]

    const sizeFullForms = {
        XXS: "Extra Extra Small",
        XS: "Extra Small",
        S: "Small",
        M: "Medium",
        L: "Large",
        XL: "Extra Large",
        XXL: "Double Extra Large"
    };

    const [selectedSize, setSelectedSize] = useState("M"); // Default size
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="MainContainer paddingBottom50 IndividualProductPage">
            <div className="PaddingTop">
                <div className="Container">
                    <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                        <Link to="/">Home</Link>
                        <span> | </span>
                        <Link to="/designers">Designers</Link>
                        <span> | </span>
                        <Link to={`/designers/${designer.slug}`}>{designer.DesignerName}</Link>
                        <span> | </span>
                        <span className="ColorBlack">{product?.ProductName}</span>
                    </div>
                    <div className="SingleProductContainer">
                        <Row gutter={[30, 30]} className="w-100">
                            <Col lg={12} md={24} xs={24}>
                                <div className="IndividualProductPageImageContainer">
                                    <div className="HeightContainer">
                                        <Swiper
                                            direction={'vertical'}
                                            autoplay={{
                                                delay: 2000,
                                                disableOnInteraction: false,
                                                pauseOnMouseEnter: true,
                                            }}
                                            loop={true}
                                            speed={800}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            modules={[Pagination, Autoplay]}
                                            className="mySwiper"
                                        >
                                            {Images.map((item, idx) => (
                                                <SwiperSlide key={idx}>
                                                    <img src={item.image} alt="" />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={12} md={24} xs={24}>
                                <div className="IndividualProductInfoContainer">
                                    <div>
                                        <div className="CommonFlexGap">
                                            <h2>{product?.ProductName}</h2>
                                            <p className="productPrice"><b>₹&nbsp;{product?.price?.toLocaleString('en-IN')}</b></p>
                                            <p><i>incl. local Tax & Shipping.</i></p>
                                        </div>
                                        <div className="marginTop20">
                                            <p>{product?.ProductDescription}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="marginTop50 SizeBoxesContainer">
                                            <p>Select Size: <span style={{ color: "black" }}>{sizeFullForms[selectedSize]}</span></p>

                                            <div className="SizeBoxesContainerEdit">
                                                {SizeBoxes.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={selectedSize === item.size ? "SizeBox selected" : "SizeBox"}
                                                        onClick={() => setSelectedSize(item.size)}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        <p>{item.size}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="BuyingOptionsContainer marginTop20">
                                            <button className="CommonBtn" onClick={() => setModalOpen(true)}><span>Add to Cart</span></button>
                                            <button className="CommonBtn" onClick={() => setModalOpen(true)}><span>Buy Now</span></button>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="ProductBriefDetailsContainer PaddingTop">
                        <Tabs
                            defaultActiveKey="1"
                            items={[
                                {
                                    key: "1",
                                    label: "Description",
                                    children: (
                                        <div>
                                            {product?.ProductBrief}
                                        </div>
                                    ),
                                },
                                {
                                    key: "2",
                                    label: "Shipping",
                                    children: (
                                        <div>
                                            <p>Shipping within India: 3-7 business days.<br />International shipping: 7-15 business days.<br />Free shipping on orders above ₹5,000.</p>
                                        </div>
                                    ),
                                },
                                {
                                    key: "3",
                                    label: "Size Guide",
                                    children: (
                                        <div>
                                            <p>
                                                <b>Size Guide:</b><br />
                                                XXS: 32-34cm<br />
                                                XS: 34-36cm<br />
                                                S: 36-38cm<br />
                                                M: 38-40cm<br />
                                            </p>
                                        </div>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
            <CommonUnderworkingModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    )
}

export default IndividualProduct;