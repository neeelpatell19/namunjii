import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import DesignerDummyData from "../../../OthersComponents/Designers/DesignerDummyData";
import "./AllProduct.css";
const AllProduct = () => {
    const allProducts = DesignerDummyData.flatMap(designer => designer.DesignerProducts.map(product => ({
        ...product,
        designerName: designer.DesignerName
    })));
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="MainContainer paddingBottom50 AllProductsPage marginTop50">
            <div className="PaddingTop">
                <div className="Container">
                    <div className="breadCrumbContainer  marginBottom20 marginTop20">
                        <Link to="/">Home</Link>
                        <span> | </span>
                        <Link to="/all-products" >All Products</Link>
                    </div>
                    <div className="CommonFlexGap maxWidth800" style={{ margin: "unset" }}>
                        <h2 style={{ textAlign: "start" }}>Explore All Products</h2>
                        <p style={{ textAlign: "start" }}>Discover a curated collection of products from our diverse designers, each offering unique styles and quality craftsmanship.</p>
                    </div>
                </div>
                <div className="Container marginTop50">
                    <Row gutter={[30, 30]}>
                        {allProducts.map((item) => (
                            <Col lg={6} md={8} sm={12} xs={24} key={item.ProductName + item.price}>
                                <Link to={`/product/${encodeURIComponent(item.ProductName)}`}>
                                    <div className="TrendingDesignsCard">
                                        <div className="ProductCardImageContainer">
                                            <div className="ProductCardImage">
                                                <img src={item.image[0]} alt="" />
                                                <img src={item.image[1]} alt="" />
                                            </div>
                                            <div className="PopUpcategoryBtn">
                                                <button>View Product</button>
                                            </div>
                                        </div>
                                        <div className="CommonFlexGap">
                                            <div className="ProductTitle">
                                                <h3>{item.ProductName}</h3>
                                            </div>
                                            <div className="ProductPrize">
                                                <p>₹&nbsp;{item.price?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default AllProduct;