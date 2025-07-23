import React from "react";
import "./InstagramGrid.css";
import InstagramGridData from "./InstagramGridData";
import { Row, Col } from "antd";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const InstagramGrid = () => {
    return (
        <div className="MainContainer ProductForHome paddingBottom50">
            <div className="PaddingTop">
                <Link to="https://www.instagram.com/namunjii/" target="_blank">
                    <div className="Container RelativeContainer">
                        {/* Centered Instagram Promo Button */}
                        <div className="InstagramPromoCenter">
                            <div className="InstagramPromoBg">
                                <button className="CommonBtn">
                                    <span><FaInstagram style={{ fontSize: "20px" }} />@Namunjii</span>
                                    <span>design@namunjii.com</span>
                                    <span>+91 98240 37321</span></button>

                            </div>
                        </div>
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
                </Link>
            </div>
        </div>
    );
};

export default InstagramGrid;