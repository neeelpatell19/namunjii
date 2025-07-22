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
                                <button className="CommonBtn"><span><FaInstagram style={{ fontSize: "20px" }} />@Namunjii</span></button>
                            </div>
                        </div>
                        <Row gutter={[12, 12]}>
                            {InstagramGridData.map((item) => (
                                <Col lg={6} md={8} sm={12} xs={24} key={item.id}>
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