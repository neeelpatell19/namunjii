import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { DesignerDummyData, CollectionData } from "../../../OthersComponents/Designers/DesignerDummyData";
import "./AllProduct.css";
import { FiSearch } from "react-icons/fi";
import BlurImage from "../../../CommonUserInteractions/BlurImage/BlurImage";

const AllProduct = () => {
    const allProducts = DesignerDummyData.flatMap(designer => designer.DesignerProducts.map(product => ({
        ...product,
        designerName: designer.DesignerName
    })));
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [searchValue, setSearchValue] = React.useState("");
    const [filteredProducts, setFilteredProducts] = React.useState(allProducts);
    const [fade, setFade] = React.useState(false);

    React.useEffect(() => {
        // setFade(true);
        const timeout = setTimeout(() => {
            const value = searchValue.trim().toLowerCase();
            if (!value) {
                setFilteredProducts(allProducts);
            } else {
                setFilteredProducts(
                    allProducts.filter(
                        (item) =>
                            item.ProductName.toLowerCase().includes(value) ||
                            (item.designerName && item.designerName.toLowerCase().includes(value))
                    )
                );
            }
            setFade(false);
        }, 180); // fade duration
        return () => clearTimeout(timeout);
    }, [searchValue, allProducts]);

    return (
        <div className="MainContainer paddingBottom50 AllProductsPage marginTop50">
            <div className="PaddingTop">
                <div className="Container">
                    <div className="breadCrumbContainer  marginBottom20 marginTop20">
                        {/* <Link to="/">Home</Link>
                        <span> | </span>
                        <Link to="/all-products" style={{ color: "black" }}>All Products</Link> */}
                        <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                        <span>Namunjii Store</span>
                    </div>
                    <div className="CommonFlexGap maxWidth800" style={{ margin: "unset" }}>
                        <h2 style={{ textAlign: "start" }}>Our Collections</h2>
                        <p style={{ textAlign: "start" }}>Discover a curated collection of products from our diverse designers, each offering unique styles and quality craftsmanship.</p>
                    </div>
                    {/* Animated Search Bar */}

                </div>
                <div className="marginTop50">
                    <div className="CollectionContainer Container">
                        <Row gutter={[16, 16]}>
                            {CollectionData.map((item) => (
                            <Col lg={6} md={8} sm={12} xs={24} key={item.CollectionTitle}>
                                <div className="CollectionCardContainer">
                                    <BlurImage 
                                        src="https://cdn.prod.website-files.com/67b017470cb9f27876f6a2f1/67b02959c742c6b7cb2c5b1c_categories-07.jpg" 
                                        alt="Collection"
                                        className="collection-image"
                                    />
                                    <span>{item.CollectionTitle}</span>
                                </div>
                            </Col>
                            ))}
                        </Row>
                    </div>
                </div>
                <div className="Container">
                    <Row gutter={[12, 12]}>
                        <Col lg={6}>
                            <div className="marginTop50 FilterSidebarContainer">
                                <div>
                                    <div className="AnimatedSearchBarContainer marginTop30 marginBottom30">
                                        <div className="AnimatedSearchBar">
                                            <FiSearch className="AnimatedSearchBarIcon" />
                                            <input
                                                type="text"
                                                className="AnimatedSearchInput"
                                                placeholder="Search products..."
                                                value={searchValue}
                                                onChange={e => setSearchValue(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={18}>
                            <div className={`marginTop50 fade-grid${fade ? ' fade' : ''}`}>
                                {filteredProducts.length === 0 ? (
                                    <div className="NoProductsFoundScreen">
                                        <div className="NoProductsFoundIcon">
                                            <BlurImage 
                                                src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/NoProductFound.png" 
                                                alt="No products found"
                                                className="no-product-image"
                                            />
                                        </div>
                                        <div className="NoProductsFoundText">

                                            <h3>No products found</h3>
                                            <p>We couldn't find any products matching your search. Try a different keyword!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Row gutter={[30, 30]}>
                                        {filteredProducts.map((item) => (
                                            <Col lg={8} md={8} sm={12} xs={24} key={item.ProductName + item.price}>
                                                <Link to={`/product/${encodeURIComponent(item.ProductName)}`}>
                                                    <div className="TrendingDesignsCard">
                                                        <div className="ProductCardImageContainer">
                                                            <div className="ProductCardImage">
                                                                <BlurImage 
                                                                    src={item.image[0]} 
                                                                    alt={item.ProductName}
                                                                    className="product-image"
                                                                />
                                                                <BlurImage 
                                                                    src={item.image[1]} 
                                                                    alt={item.ProductName}
                                                                    className="product-image"
                                                                />
                                                            </div>
                                                            <div className="PopUpcategoryBtn">
                                                                <button>View Product</button>
                                                            </div>
                                                        </div>
                                                        <div className="CommonFlexGap">
                                                            <div className="ProductTitle">
                                                                <h4>{item.ProductName}</h4>
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
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default AllProduct;