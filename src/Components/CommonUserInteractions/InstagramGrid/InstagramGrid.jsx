import React from "react";
import "./InstagramGrid.css";
import InstagramGridData from "./InstagramGridData";
import { Row, Col } from "antd";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const InstagramGrid = () => {
    return (
        <div className="MainContainer ProductForHome ">
            <div className="PaddingTop">
                {/* <Link to="https://www.instagram.com/namunjii/" target="_blank"> */}
                <div className="Container RelativeContainer">
                    {/* Centered Instagram Promo Button */}
                    <div className="InstagramPromoCenter">
                        <div className="InstagramPromoBg">
                            <div className="CommonBtn contact-details">
                                <Link to="https://www.instagram.com/namunjii/" target="_blank" className="contact-link">
                                    <span><FaInstagram style={{ fontSize: "20px" }} />@Namunjii</span>
                                </Link>
                                <Link to="mailto:design@namunjii.com" className="contact-link">
                                    <span>design@namunjii.com</span>
                                </Link>
                                <Link to="tel:+919824037321" className="contact-link">
                                    <span>+91 98240 37321</span>
                                </Link>
                                <span className="text-center">
                                    109, Shivalik Shilp II,
                                    Opposite ITC Narmada,<br />
                                    Keshavbaug, Ahmedabad, 380015
                                </span>
                                {/* <br /> */}
                                {/* <p>Privacy Policy</p> */}
                                <Link to="/privacy-policy" className="contact-link">
                                    <span>Privacy Policy</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Row gutter={[12, 12]}>
                            {InstagramGridData.map((item) => (
                                <Col lg={6} md={6} sm={6} xs={12} key={item.id}>
                                    <div className="InstagramGridImage">
                                        <img src={item.image} alt="" />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
                {/* </Link> */}
            </div>
            <br />
        </div>
    );
};

export default InstagramGrid;