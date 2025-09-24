import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { DesignerDummyData, CollectionData } from "../../../OthersComponents/Designers/DesignerDummyData";
import "./AllProduct.css";
import { FiSearch } from "react-icons/fi";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import BlurImage from "../../../CommonUserInteractions/BlurImage/BlurImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Custom hook for responsive screen detection
const useResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check on mount
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { isMobile };
};

const AllProduct = () => {
    const { isMobile } = useResponsive();
    const DISCOUNT_PERCENT = 10; // configure discount percent
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
    const [activeCategory, setActiveCategory] = React.useState("All");
    const [showFilters, setShowFilters] = React.useState(false);
    const [filterSearchValue, setFilterSearchValue] = React.useState("");
    const [priceRange, setPriceRange] = React.useState({ min: 0, max: 50000 });
    const [saleOnly, setSaleOnly] = React.useState(false);
    const [showMobileFilter, setShowMobileFilter] = React.useState(false);

    // Reset all filters function
    const resetFilters = () => {
        setSearchValue("");
        setFilterSearchValue("");
        setActiveCategory("All");
        setPriceRange({ min: 0, max: 50000 });
        setSaleOnly(false);
    };

    React.useEffect(() => {
        // setFade(true);
        const timeout = setTimeout(() => {
            const value = searchValue.trim().toLowerCase();
            const filterValue = filterSearchValue.trim().toLowerCase();
            let filtered = allProducts;

            // Filter by category first
            if (activeCategory !== "All") {
                filtered = filtered.filter(item => {
                    // Add your category filtering logic here based on product properties
                    // For now, we'll use a simple keyword match
                    const categoryKeywords = {
                        "Mens Wear": ["suit", "blazer", "trousers", "overcoat", "tuxedo"],
                        "Womens Wear": ["dress", "gown", "blouse", "skirt", "evening", "cocktail"],
                        "Kids Wear": ["kids", "child", "baby"],
                        "Home Decor": ["decor", "home", "furniture"],
                        "Jewelry": ["jewelry", "necklace", "ring", "bracelet"],
                        "Accessories": ["scarf", "bag", "hat", "belt"],
                        "Shoes": ["shoes", "boots", "sneakers", "heels", "sandals", "loafers"]
                    };

                    const keywords = categoryKeywords[activeCategory] || [];
                    return keywords.some(keyword =>
                        item.ProductName.toLowerCase().includes(keyword)
                    );
                });
            }

            // Filter by price range
            filtered = filtered.filter(item => {
                const price = Number(item.price) || 0;
                const minPrice = Number(priceRange.min) || 0;
                const maxPrice = Number(priceRange.max) || 50000;
                const isInRange = price >= minPrice && price <= maxPrice;
                // Debug logging
                if (priceRange.min !== 0 || priceRange.max !== 50000) {
                    console.log(`Product: ${item.ProductName}, Price: ${price}, Range: ${minPrice}-${maxPrice}, InRange: ${isInRange}`);
                }
                return isInRange;
            });

            // Filter by sale only
            if (saleOnly) {
                filtered = filtered.filter(item => item.sale === true);
            }

            // Filter by search value (main search)
            if (value) {
                filtered = filtered.filter(
                    (item) =>
                        item.ProductName.toLowerCase().includes(value) ||
                        (item.designerName && item.designerName.toLowerCase().includes(value))
                );
            }

            // Filter by filter search value
            if (filterValue) {
                filtered = filtered.filter(
                    (item) =>
                        item.ProductName.toLowerCase().includes(filterValue) ||
                        (item.designerName && item.designerName.toLowerCase().includes(filterValue))
                );
            }

            setFilteredProducts(filtered);
            setFade(false);
        }, 180); // fade duration
        return () => clearTimeout(timeout);
    }, [searchValue, allProducts, activeCategory, filterSearchValue, priceRange, saleOnly]);


    const CategoriesNames = [
        "All",
        "Mens Wear",
        "Womens Wear",
        "Kids Wear",
        "Home Decor",
        "Jewelry",
        "Accessories",
        "Shoes",
    ]
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="MainContainer marginTop50 paddingBottom50 newRouteSectionPadding AllProductsPage">
            <div className="PaddingTop">
                <div className="Container">
                    {/* <div className="breadCrumbContainer  marginBottom20 marginTop20">
                        <Link to="/">Home</Link>
                        <span> | </span>
                        <Link to="/all-products" style={{ color: "black" }}>All Products</Link>
                        <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/WebsiteIdentityIcon.png" alt="" />
                        <span>Namunjii Store</span>
                    </div> */}
                    <div className="CommonFlexGap maxWidth800" style={{ margin: "0px auto" }}>
                        <h2 className="text-center">Our Products</h2>
                        <p className="text-center">Discover a curated collection of products from our diverse designers, each offering unique styles and quality craftsmanship.</p>
                    </div>
                    {/* Animated Search Bar */}

                </div>
                <div className="FiltersAndCategoriesContainer marginTop50">
                {isMobile && (
                <div className="mobile-filter-section">
                    <h4>Search Products</h4>
                    <div className="mobile-search-wrapper">
                        <FiSearch className="mobile-search-icon" />
                        <input
                            type="text"
                            className="mobile-search-input"
                            placeholder="Search products..."
                            value={filterSearchValue}
                            onChange={(e) => setFilterSearchValue(e.target.value)}
                        />
                        {filterSearchValue && (
                            <button
                                className="mobile-search-clear"
                                onClick={() => setFilterSearchValue("")}
                                type="button"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            )}
                    <div className="Container">
                        <div className="AllProductsFilterHeaderFlexContainer">

                            <div className="CategoriesNamesContainer desktop-only">
                                <ul>
                                    {CategoriesNames.map((item) => (
                                        <li
                                            key={item}
                                            className={activeCategory === item ? "active" : ""}
                                            onClick={() => setActiveCategory(item)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="AnimatedButtonContainer desktop-only">
                                <button
                                    className="AnimatedLineButton"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    Filter
                                </button>
                                <Button
                                    type="default"
                                    icon={<ReloadOutlined />}
                                    onClick={resetFilters}
                                    className="ResetFilterButton"
                                    title="Reset all filters"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                        {showFilters && (
                            <div className="AllProductFiltersContainer">
                                <div className="FiltersGrid">
                                    {/* Search Filter */}
                                    <div className="FilterItem">
                                        <h4>Search Products</h4>
                                        <div className="FilterSearchWrapper">
                                            <FiSearch className="FilterSearchIcon" />
                                            <input
                                                type="text"
                                                className="FilterSearchInput"
                                                placeholder="Search products..."
                                                value={filterSearchValue}
                                                onChange={(e) => setFilterSearchValue(e.target.value)}
                                            />
                                            {filterSearchValue && (
                                                <button
                                                    className="FilterClearBtn"
                                                    onClick={() => setFilterSearchValue("")}
                                                    type="button"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Price Range Filter */}
                                    <div className="FilterItem">
                                        <h4>Price Range</h4>
                                        <div className="PriceRangeSliderContainer">
                                            <div className="PriceRangeSlider">
                                                <div className="PriceRangeTrack"></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50000"
                                                    step="100"
                                                    value={priceRange.min}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (value <= priceRange.max) {
                                                            setPriceRange({ ...priceRange, min: value });
                                                        }
                                                    }}
                                                    className="PriceRangeSliderInput min"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50000"
                                                    step="100"
                                                    value={priceRange.max}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (value >= priceRange.min) {
                                                            setPriceRange({ ...priceRange, max: value });
                                                        }
                                                    }}
                                                    className="PriceRangeSliderInput max"
                                                />
                                            </div>
                                            <div className="PriceRangeValues">
                                                <span className="PriceValue">₹{priceRange.min.toLocaleString('en-IN')}</span>
                                                <span className="PriceValue">₹{priceRange.max.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sale Filter */}
                                    <div className="FilterItem">
                                        <h4>Special Offers</h4>
                                        <div className="SaleFilterContainer">
                                            <label className="SaleCheckboxLabel">
                                                <input
                                                    type="checkbox"
                                                    className="SaleCheckbox"
                                                    checked={saleOnly}
                                                    onChange={(e) => setSaleOnly(e.target.checked)}
                                                />
                                                <span className="CheckboxCustom"></span>
                                                Show only sale items
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="FiltersShowConta">

                </div>
                {/* <div className="marginTop50">
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
                </div> */}
                <div className="Container marginTop50">
                    <Row gutter={[12, 12]}>
                        {/* <Col lg={6}>
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
                        </Col> */}
                        <Col lg={24}>
                            <div className={`marginTop50 fade-grid${fade ? ' fade' : ''} AdjustRowOnMobile`}>
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
                                    <Row gutter={[30, 50]} id="AllProductsRow">
                                        {filteredProducts.map((item) => (
                                            <Col lg={8} md={8} sm={12} xs={12} key={item.ProductName + item.price}>
                                                <Link to={`/product/${encodeURIComponent(item.ProductName)}`}>
                                                    <div className="TrendingDesignsCard">
                                                        {item.sale && (
                                                            <div className="BadgeContainer">
                                                                <span className="smallFont">Sale</span>
                                                            </div>
                                                        )}
                                                        <div className="CommonFlexGap">
                                                            <div className="ProductTitle">
                                                                {isMobile ? (
                                                                    <h5 className="text-center">{item.ProductName}</h5>
                                                                ) : (
                                                                    <h4 className="text-center">{item.ProductName}</h4>
                                                                )}
                                                            </div>
                                                            <div className="ProductPrize">
                                                                {item.sale ? (
                                                                    (() => {
                                                                        const original = Number(item.price) || 0;
                                                                        const discounted = Math.round(original * (1 - DISCOUNT_PERCENT / 100));
                                                                        return (
                                                                            <p className="text-center smallFont">

                                                                                <span className="smallFont" style={{ textDecoration: 'line-through', opacity: 0.7 }}>₹&nbsp;{original.toLocaleString('en-IN')}</span>
                                                                                &nbsp;&nbsp;
                                                                                <span className="smallFont">₹&nbsp;{discounted.toLocaleString('en-IN')}</span>
                                                                                &nbsp;
                                                                                {/* <span className="DiscountPercent">{DISCOUNT_PERCENT}% off</span> */}
                                                                            </p>
                                                                        );
                                                                    })()
                                                                ) : (
                                                                    <p className="text-center smallFont">₹&nbsp;{item.price?.toLocaleString('en-IN')}</p>
                                                                )}
                                                            </div>
                                                            <br />
                                                        </div>
                                                        <div className="ProductCardImageContainer">
                                                            <div className="ProductCardImage AllProductSwiperContainer">
                                                                <Swiper
                                                                    slidesPerView={1}
                                                                    loop={true}
                                                                    navigation={true}
                                                                    // autoplay={{ delay: 2000, disableOnInteraction: false }}
                                                                    modules={[Autoplay, Navigation]}
                                                                >
                                                                    {item.image?.map((imgSrc, idx) => (
                                                                        <SwiperSlide key={idx}>
                                                                            <BlurImage
                                                                                src={imgSrc}
                                                                                alt={item.ProductName}
                                                                                className="product-image"
                                                                            />
                                                                        </SwiperSlide>
                                                                    ))}
                                                                </Swiper>
                                                            </div>
                                                            <div className="PopUpcategoryBtn">
                                                                <button>View Product</button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Link>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </div>

                            {/* Search Bar */}
                            <div className="products-search-container">
                                <div className="products-search-wrapper">
                                    <FiSearch className="products-search-icon" />
                                    <input
                                        type="text"
                                        className="products-search-input"
                                        placeholder="Search products..."
                                        value={filterSearchValue}
                                        onChange={(e) => setFilterSearchValue(e.target.value)}
                                    />
                                    {filterSearchValue && (
                                        <button
                                            className="products-search-clear"
                                            onClick={() => setFilterSearchValue("")}
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
           
            {/* Mobile Filter Button */}
            {isMobile && (
                <div className="mobile-filter-container">
                    <button
                        className="mobile-filter-btn"
                        onClick={() => setShowMobileFilter(!showMobileFilter)}
                    >
                        <FilterOutlined />
                        <span>Filter</span>
                    </button>

                    {/* Mobile Filter Modal */}
                    {showMobileFilter && (
                        <div className="mobile-filter-overlay" onClick={() => setShowMobileFilter(false)}>
                            <div className="mobile-filter-content" onClick={(e) => e.stopPropagation()}>
                                <div className="mobile-filter-header">
                                    <h3>Filter Products</h3>
                                    <button
                                        className="mobile-filter-close"
                                        onClick={() => setShowMobileFilter(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="mobile-filter-body">
                                    {/* Search Filter */}
                                    {/* <div className="mobile-filter-section">
                                        <h4>Search Products</h4>
                                        <div className="mobile-search-wrapper">
                                            <FiSearch className="mobile-search-icon" />
                                            <input
                                                type="text"
                                                className="mobile-search-input"
                                                placeholder="Search products..."
                                                value={filterSearchValue}
                                                onChange={(e) => setFilterSearchValue(e.target.value)}
                                            />
                                            {filterSearchValue && (
                                                <button
                                                    className="mobile-search-clear"
                                                    onClick={() => setFilterSearchValue("")}
                                                    type="button"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div> */}

                                    {/* Categories */}
                                    <div className="mobile-filter-section">
                                        <h4>Categories</h4>
                                        <div className="mobile-categories-list">
                                            {CategoriesNames.map((item) => (
                                                <button
                                                    key={item}
                                                    className={`mobile-category-btn ${activeCategory === item ? "active" : ""}`}
                                                    onClick={() => setActiveCategory(item)}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Range Filter */}
                                    <div className="mobile-filter-section">
                                        <h4>Price Range</h4>
                                        <div className="mobile-price-range-container">
                                            <div className="mobile-price-range-slider">
                                                <div className="mobile-price-range-track"></div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50000"
                                                    step="100"
                                                    value={priceRange.min}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (value <= priceRange.max) {
                                                            setPriceRange({ ...priceRange, min: value });
                                                        }
                                                    }}
                                                    className="mobile-price-range-input min"
                                                />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="50000"
                                                    step="100"
                                                    value={priceRange.max}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (value >= priceRange.min) {
                                                            setPriceRange({ ...priceRange, max: value });
                                                        }
                                                    }}
                                                    className="mobile-price-range-input max"
                                                />
                                            </div>
                                            <div className="mobile-price-range-values">
                                                <span className="mobile-price-value">₹{priceRange.min.toLocaleString('en-IN')}</span>
                                                <span className="mobile-price-value">₹{priceRange.max.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sale Filter */}
                                    <div className="mobile-filter-section">
                                        <h4>Special Offers</h4>
                                        <div className="mobile-sale-filter">
                                            <label className="mobile-sale-checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    className="mobile-sale-checkbox"
                                                    checked={saleOnly}
                                                    onChange={(e) => setSaleOnly(e.target.checked)}
                                                />
                                                <span className="mobile-checkbox-custom"></span>
                                                Show only sale items
                                            </label>
                                        </div>
                                    </div>

                                    {/* Reset Button */}
                                    <div className="mobile-reset-section">
                                        <button
                                            className="mobile-reset-btn"
                                            onClick={() => {
                                                resetFilters();
                                                setShowMobileFilter(false);
                                            }}
                                        >
                                            <ReloadOutlined />
                                            Reset All Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AllProduct;