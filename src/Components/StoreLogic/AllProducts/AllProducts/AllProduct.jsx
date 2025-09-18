import React, { useEffect } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { DesignerDummyData, CollectionData } from "../../../OthersComponents/Designers/DesignerDummyData";
import "./AllProduct.css";
import { FiSearch } from "react-icons/fi";
import BlurImage from "../../../CommonUserInteractions/BlurImage/BlurImage";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const AllProduct = () => {
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
    const [priceRange, setPriceRange] = React.useState({ min: 0, max: 100000 });
    const [saleOnly, setSaleOnly] = React.useState(false);

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
                return price >= priceRange.min && price <= priceRange.max;
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
                    <div className="Container">
                        <div className="AllProductsFilterHeaderFlexContainer">

                            <div className="CategoriesNamesContainer">
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
                            <div className="AnimatedButtonContainer">
                                <button
                                    className="AnimatedLineButton"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    Filter
                                </button>
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
                                        <div className="PriceRangeContainer">
                                            <div className="PriceInputGroup">
                                                <label>Min Price</label>
                                                <input
                                                    type="number"
                                                    className="PriceInput"
                                                    placeholder="0"
                                                    value={priceRange.min}
                                                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="PriceInputGroup">
                                                <label>Max Price</label>
                                                <input
                                                    type="number"
                                                    className="PriceInput"
                                                    placeholder="100000"
                                                    value={priceRange.max}
                                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 100000 })}
                                                />
                                            </div>
                                        </div>
                                        <div className="PriceRangeDisplay">
                                            ₹{priceRange.min.toLocaleString('en-IN')} - ₹{priceRange.max.toLocaleString('en-IN')}
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
                                    <Row gutter={[30, 50]} id="AllProductsRow">
                                        {filteredProducts.map((item) => (
                                            <Col lg={8} md={8} sm={12} xs={24} key={item.ProductName + item.price}>
                                                <Link to={`/product/${encodeURIComponent(item.ProductName)}`}>
                                                    <div className="TrendingDesignsCard">
                                                        {item.sale && (
                                                            <div className="BadgeContainer">
                                                                <span className="smallFont">Sale</span>
                                                            </div>
                                                        )}
                                                        <div className="CommonFlexGap">
                                                            <div className="ProductTitle">
                                                                <h4 className="text-center" style={{ fontWeight: "400" }}>{item.ProductName}</h4>
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
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default AllProduct;