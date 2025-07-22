import React from "react";
import "./ProductForHome.css";
import { Row, Col } from "antd";
import FashionClothesData from "../../DummyData/DummyData";

const ProductForHome = () => {
    return (
        <div className="MainContainer ProductForHome paddingBottom50">
            <div className="PaddingTop">
                <div className="Container">
                    <div className="CommonFlexGap maxWidth800">
                        <h2>Perfect Your Style</h2>
                        <p>It's a journey marked by repeated visits, a tapestry woven with diverse encounters, discoveries, and the pleasure derived from navigating the ever-evolving retail realms.</p>
                    </div>
                    <div className="marginTop50">
                        <Row gutter={[30, 30]}>
                            {FashionClothesData.products.slice(0, 8).map((item) => (
                                <Col lg={6} md={8} sm={12} xs={24} key={item.id}>
                                    <div className="TrendingDesignsCard">
                                        <div className="ProductCardImageContainer">
                                            <div className="ProductCardImage">
                                                <img src={item.images[0]} alt="" />
                                                <img src={item.images[1]} alt="" />
                                            </div>
                                            <div className="PopUpcategoryBtn">
                                                <button>Add to Cart +</button>
                                            </div>
                                        </div>
                                        <div className="CommonFlexGap">
                                            <div className="ProductTitle">
                                                <h3>{item.title}</h3>
                                                {/* <p>({item.category})</p> */}
                                            </div>
                                            <div className="ProductPrize">
                                                <p>₹&nbsp;{item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }} className="paddingTop50">
                        <button className="CommonBtn"><span>Shop Now</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductForHome;