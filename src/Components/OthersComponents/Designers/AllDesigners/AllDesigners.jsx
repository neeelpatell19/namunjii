import React, { useEffect } from "react";
import "./AllDesigners.css";
import { Link } from "react-router-dom";
import { DesignerDummyData } from "../DesignerDummyData";
import { FiHeart } from "react-icons/fi";
import { Row, Col } from "antd";
import BlurImage from "../../../CommonUserInteractions/BlurImage/BlurImage";

const AllDesigners = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="MainContainer marginTop50 paddingBottom50">
            <div className="PaddingTop">
                <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    {/* <Link to="/">Home</Link>
                    <span> | </span>
                    <span className="ColorBlack">About Namunjii</span> */}
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                    <span>Designers</span>
                </div>
                <div className="Container">

                    <div className="CommonFlexGap maxWidth800">
                        <h2 style={{ textAlign: "start" }}>Brands We Support</h2>
                        <p style={{ textAlign: "start" }}>It's a journey marked by repeated visits, a tapestry woven with diverse encounters, discoveries, and the pleasure derived from navigating the ever-evolving retail realms.</p>
                    </div>
                    <div className="marginTop50 DesignerCardContainer">
                        <Row gutter={[30, 30]}>
                            {DesignerDummyData.map((item) => (
                                <Col lg={8} md={8} sm={12} xs={24} key={item.id}>
                                    <Link to={`/designers/${item.slug}`} key={item.slug}>
                                        <div className="TrendingDesignsCard">
                                            <div className="ProductCardImageContainer">
                                                <div className="ProductCardImage">
                                                    <BlurImage 
                                                        src={item.image[0]} 
                                                        alt={item.DesignerName}
                                                        className="designer-image"
                                                    />
                                                    <BlurImage 
                                                        src={item.image[1]} 
                                                        alt={item.DesignerName}
                                                        className="designer-image"
                                                    />
                                                </div>
                                                <div className="PopUpcategoryBtn">
                                                    <button>View Designs</button>
                                                </div>
                                            </div>
                                            <div className="CommonFlexGap">
                                                <div className="ProductTitle">
                                                    <h4>{item.DesignerName}</h4>
                                                    {/* <p>({item.category})</p> */}
                                                </div>
                                                {/* <div className="ProductPrize">
                                                <p>₹&nbsp;{item.price}</p>
                                            </div> */}
                                            </div>
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllDesigners;