import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DesignerDummyData from "../DesignerDummyData";
import "./Designer.css";
import { Row, Col, Select, Button, Slider } from "antd";
import FashionClothesData from "../../../DummyData/DummyData";
import { RiResetRightFill } from "react-icons/ri";

const Designers = () => {
    const { designerSlug } = useParams();
    const designer = DesignerDummyData.find(d => d.slug === designerSlug);

    if (!designer) return <div>Designer not found.</div>;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- FILTER LOGIC ---
    const allPrices = designer.DesignerProducts.map(p => p.price);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const allAvailability = Array.from(new Set(designer.DesignerProducts.map(p => p.availability)));
    const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
    const [selectedAvailability, setSelectedAvailability] = useState(undefined);
    const [fade, setFade] = useState(false);

    const handlePriceChange = (value) => {
        setFade(true);
        setPriceRange(value);
        setTimeout(() => setFade(false), 200);
    };
    const handleAvailabilityChange = (value) => {
        setFade(true);
        setSelectedAvailability(value);
        setTimeout(() => setFade(false), 200);
    };
    const resetFilters = () => {
        setFade(true);
        setPriceRange([minPrice, maxPrice]);
        setSelectedAvailability(undefined);
        setTimeout(() => setFade(false), 200);
    };
    const filteredProducts = designer.DesignerProducts.filter(product => {
        let priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
        let availMatch = selectedAvailability ? product.availability === selectedAvailability : true;
        return priceMatch && availMatch;
    });
    // --- END FILTER LOGIC ---

    return (
        <div className="MainContainer paddingBottom50 DesignerPage">
            <div className="PaddingTop">
                <div className="breadCrumbContainer Container marginBottom20 marginTop20">
                    <Link to="/">Home</Link>
                    <span> | </span>
                    <Link to="/designers">Designers</Link>
                    <span> | </span>
                    <span className="ColorBlack">{designer.DesignerName}</span>
                </div>
                <div className="HeighAdjustContainer">
                    <Row className="h-100 w-100">
                        <Col lg={12}>
                            <div className="h-100 w-100">
                                <div className="DesignerInfoContainer">
                                    <div>
                                        <h2 className="white">{designer.DesignerName}</h2>
                                        <p className="white">{designer.DesignerDescription}</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="h-100 w-100">
                                <div className="DesignerPageImageContainer h-100 w-100">
                                    <img src={designer.image} alt="" />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <div className="Container PaddingTop">

                <div className="FiltersDesignerProductsContainer">
                    <div className="FiltersContainer">
                        <Row gutter={[16, 16]} align="middle">
                            <Col lg={14} xs={24}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }} className="w-100">
                                    <div className="minHeight60">
                                        <span style={{ marginRight: 8 }}>Price:</span>
                                        <Slider
                                            range
                                            min={minPrice}
                                            max={maxPrice}
                                            value={priceRange}
                                            onChange={handlePriceChange}
                                            step={100}
                                            tooltip={{ formatter: val => `₹${val}` }}
                                        />
                                        <div style={{ marginLeft: 8, fontWeight: 500, display: "flex", justifyContent: "space-between" }}>
                                            <span>₹{priceRange[0]}</span> - <span>₹{priceRange[1]}</span>
                                        </div>
                                    </div>
                                    <div className="SelectContainerEdit minHeight60">
                                        <Select
                                            allowClear
                                            placeholder="Select Availability"
                                            style={{ minWidth: 120 }}
                                            value={selectedAvailability}
                                            onChange={handleAvailabilityChange}
                                        >
                                            {allAvailability.map(avail => (
                                                <Select.Option key={avail} value={avail}>{avail === 'yes' ? 'Available' : 'Not Available'}</Select.Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={10} xs={24} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
                                <div className="CommonFlexGap DesignerFilterBtnContainer">
                                    <button className="CommonBtn"><span>{filteredProducts.length}</span></button>
                                    <button className="CommonBtn" onClick={resetFilters} type="default"><span>Reset Filters</span> <RiResetRightFill /></button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="DesignerProductsContainer paddingTop50">
                    <div className={`DesignerProductsGrid fade-grid${fade ? ' fade' : ''}`}>
                        <Row gutter={[30, 30]}>
                            {filteredProducts.map((item) => (
                                <Col lg={6} md={8} sm={12} xs={24} key={item.ProductName + item.price}>
                                    <Link to={`/product/${encodeURIComponent(item.ProductName)}`}>
                                        <div className="TrendingDesignsCard">
                                            <div className="ProductCardImageContainer">
                                                <div className="ProductCardImage">
                                                    <img src={item.image} alt="" />
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
                                                    <p>₹&nbsp;{item.price}</p>
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
        </div>
    )
}

export default Designers;