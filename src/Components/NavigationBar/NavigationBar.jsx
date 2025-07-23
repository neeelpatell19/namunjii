import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Drawer } from "antd";
import { NavigationData, LogoFile, LogoFileBlack } from "./NavigationData";
import "./NavigationBar.css";
import { Link, useLocation } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { IoIosArrowDown } from "react-icons/io";
import { CgMenuGridO, CgCloseO } from "react-icons/cg";
import SocialIconsData from "../CommonUserInteractions/SocialIconsData/SocialIconsData";
import DummyData from "../DummyData/DummyData";
import DesignerDummyData from "../OthersComponents/Designers/DesignerDummyData";
import { FiSearch } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
const shopMegaMenuData = [
    {
        label: "Category 1",
        image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
        link: "/shop/watch",
    },
    {
        label: "Category 2",
        image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
        link: "/shop/ring",
    },
    {
        label: "Category 3",
        image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
        link: "/shop/earrings",
    },
    {
        label: "Category 4",
        image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
        link: "/shop/necklace",
    },
    // {
    //     label: "Category 5",
    //     image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
    //     link: "/shop/bracelet",
    // },
    // {
    //     label: "Category 5",
    //     image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
    //     link: "/shop/bracelet",
    // },
    // {
    //     label: "Category 5",
    //     image: "https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/MegamenuDummyImage.jpg",
    //     link: "/shop/bracelet",
    // },
];


const NavigationBar = () => {
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [navScrolled, setNavScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileNavDrawerOpen, setMobileNavDrawerOpen] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === "/";
    const useWhite = isHome && !navScrolled;

    useEffect(() => {
        window.addEventListener("scroll", () => {
            setNavScrolled(window.scrollY > 100);
        });
    }, []);

    const drawerContentData = [
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },
        {
            image: "https://cdn.prod.website-files.com/6548826a7a4896c258f7cb63/658121274b431bddbc2f507e_Popup-collection-03.jpg",
        },

    ];

    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const inputRef = useRef(null);

    const openSearchModal = () => {
        setSearchModalOpen(true);
        setTimeout(() => inputRef.current && inputRef.current.focus(), 200);
    };
    const closeSearchModal = () => {
        setSearchModalOpen(false);
        setSearch("");
        setSearchResults([]);
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") closeSearchModal();
        };
        if (searchModalOpen) {
            window.addEventListener("keydown", handleEsc);
        } else {
            window.removeEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [searchModalOpen]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        const results = [];
        DesignerDummyData.forEach(designer => {
            // Match designer name
            if (designer.DesignerName.toLowerCase().includes(value.toLowerCase())) {
                results.push({
                    type: "designer",
                    name: designer.DesignerName,
                    slug: designer.slug,
                    image: designer.image
                });
            }
            // Match products
            designer.DesignerProducts.forEach(product => {
                if (product.ProductName.toLowerCase().includes(value.toLowerCase())) {
                    results.push({
                        type: "product",
                        name: product.ProductName,
                        designer: designer.DesignerName,
                        productSlug: product.ProductName,
                        image: product.image,
                        designerSlug: designer.slug
                    });
                }
            });
        });
        setSearchResults(results);
    };

    return (
        <div className={`NavigationBarContainer ${navScrolled ? "nav-scrolled" : ""}`}>
            <div className={`Container ${navScrolled ? "nav-scrolled" : ""}`}>
                <Row>
                    <Col lg={8} xs={12} sm={12}>
                        <div className="NavigationBarLogoContainer">
                            <div>
                                <Link to="/">
                                    <img src={useWhite ? LogoFile : LogoFileBlack} alt="" />
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col lg={8} xs={12} sm={12}>
                        <div className="NavigationBarMenuContainer">
                            {NavigationData.map((item) => {
                                return item.name === "Shop" ? (
                                    <div
                                        key={item.id}
                                        className="NavigationBarMenuItem nav-shop-menu-item"
                                        onMouseEnter={() => setShowMegaMenu(true)}
                                        onMouseLeave={() => setShowMegaMenu(false)}
                                        style={{ position: "relative" }}
                                    >
                                        <Link to={item.path} style={{ color: useWhite ? "white" : "#222" }}>{item.name}<IoIosArrowDown /></Link>

                                    </div>
                                ) : (
                                    <div key={item.id} className="NavigationBarMenuItem">
                                        <Link to={item.path} style={{ color: useWhite ? "white" : "#222" }}>{item.name}</Link>
                                    </div>
                                );
                            }
                            )}
                        </div>
                    </Col>
                    <Col lg={8} xs={12} sm={12}>
                        <div className="FunctionlityButtonsContainer" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                            {/* Search Icon for fullscreen modal */}
                            <div className="SearchIconNav" onClick={openSearchModal} style={{ cursor: "pointer", fontSize: 22, color: "#b79a80", marginRight: 8 }}>
                                <FiSearch />
                            </div>
                            {/* Fullscreen Search Modal */}
                            {searchModalOpen && (
                                <div
                                    className="FullscreenSearchModal"
                                    style={{
                                        position: "fixed",
                                        top: 0, left: 0, right: 0, bottom: 0,
                                        zIndex: 2000,
                                        background: "rgba(255,255,255,0.7)",
                                        backdropFilter: "blur(12px)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        transition: "opacity 0.4s",
                                        animation: "fadeIn 0.4s"
                                    }}
                                    onClick={closeSearchModal}
                                >
                                    {/* Close button top right */}
                                    {/* <button
                                        onClick={closeSearchModal}
                                        style={{
                                            position: "absolute",
                                            top: 24,
                                            right: 24,
                                            background: "rgba(255,255,255,0.8)",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 40,
                                            height: 40,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 26,
                                            color: "#b79a80",
                                            cursor: "pointer",
                                            zIndex: 10,
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                                        }}
                                    >
                                        <CgCloseO />
                                    </button> */}
                                    <div
                                        style={{
                                            marginTop: 80,
                                            background: "#fff",
                                            borderRadius: 16,
                                            boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                                            padding: 32,
                                            minWidth: 340,
                                            maxWidth: 480,
                                            width: "90%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            position: "relative"
                                        }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", width: "100%", borderRadius: 8, border: "1.5px solid #b79a80", background: "#faf9f7", padding: "8px 16px", marginBottom: 18 }}>
                                            <FiSearch style={{ fontSize: 20, color: "#b79a80", marginRight: 8 }} />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={search}
                                                onChange={handleSearch}
                                                placeholder="Search products or designers..."
                                                style={{
                                                    width: "100%",
                                                    border: "none",
                                                    outline: "none",
                                                    fontSize: 18,
                                                    background: "transparent"
                                                }}
                                            />
                                        </div>
                                        <div style={{ width: "100%", maxHeight: 320, minHeight: 60, overflowY: "auto", borderRadius: 12, background: "#fff" }}>
                                            {search && searchResults.length === 0 && (
                                                <div style={{ color: "#aaa", textAlign: "center", padding: 24 }}>No results found.</div>
                                            )}
                                            {searchResults.map((result, idx) =>
                                                result.type === "designer" ? (
                                                    <a
                                                        key={idx}
                                                        href={`/designers/${result.slug}`}
                                                        style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0", textDecoration: "none" }}
                                                        onClick={closeSearchModal}
                                                    >
                                                        <img src={result.image} alt={result.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, marginRight: 16, border: "1.5px solid #eee" }} />
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: "#b79a80", fontSize: 17 }}>Designer: {result.name}</div>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <a
                                                        key={idx}
                                                        href={`/product/${encodeURIComponent(result.productSlug)}`}
                                                        style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0", textDecoration: "none" }}
                                                        onClick={closeSearchModal}
                                                    >
                                                        <img src={result.image} alt={result.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, marginRight: 16, border: "1.5px solid #eee" }} />
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: "#222", fontSize: 17 }}>{result.name}</div>
                                                            <div style={{ color: "#b79a80", fontSize: 15 }}>{result.designer}</div>
                                                        </div>
                                                    </a>
                                                )
                                            )}
                                        </div>
                                        <button
                                            onClick={closeSearchModal}
                                            style={{
                                                marginTop: 18,
                                                background: "#b79a80",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 8,
                                                padding: "8px 24px",
                                                fontWeight: 500,
                                                fontSize: 16,
                                                cursor: "pointer"
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                            {/* ...existing menu drawer button... */}
                            <div className="MenuDrawerBtn" style={{ fontSize: 22, color: "#b79a80" }} onClick={() => setDrawerOpen(true)}>
                                <CgMenuGridO style={{ color: useWhite ? "white" : "black" }} />
                            </div>
                            {/* Mobile Hamburger Icon (only visible on mobile) */}
                            <div className="MobileNavDrawerBtn" onClick={() => setMobileNavDrawerOpen(true)} style={{ display: 'none', fontSize: 26, color: "#b79a80", marginLeft: 8 }}>
                                <FiMenu />
                            </div>
                        </div>
                    </Col>
                </Row>
                {showMegaMenu && (
                    <div
                        className="MegaMenuGridContainer fade-in"
                        onMouseEnter={() => setShowMegaMenu(true)}
                        onMouseLeave={() => setShowMegaMenu(false)}
                    >
                        <div className="MegaMenuGrid">
                            <div className="MegaMenuGridRow">
                                {DesignerDummyData.slice(0, 5).map((menu, idx) => (
                                    <div>
                                        <Link to={`/designers/${menu.slug}`} className="MegaMenuGridItem" key={idx}>
                                            <div className="MegaMenuGridItemImage">
                                                <img src={menu.image} alt={menu.label} />
                                            </div>
                                            <div className="MegaMenuLabelRow">
                                                <span className="MegaMenuLabel">{menu.DesignerName}</span>
                                                <RightOutlined className="MegaMenuArrow" />
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Drawer
                title={null}
                placement="right"
                headerStyle={{ display: "none" }}
                open={drawerOpen}
                width={600}
                onClose={() => setDrawerOpen(false)}
            >
                <div className="DrawerContentContainer">
                    <div className="DrawerContent">
                        <div className="DrawerContentHeader">
                            <div className="DrawerContentHeaderCloseBtn">
                                <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/icons8-cancel-50.png" onClick={() => setDrawerOpen(false)} />
                            </div>
                            <div className="DrawerContentHeaderTitle">
                                <div>
                                    <h2>Namunjii</h2>
                                    <p>Fashion is a multifaceted realm that extends beyond clothing, embracing diverse styles, trends, and cultural influences.</p>
                                    <Link to="/vendor-verification">
                                        <div>
                                            <button className="CommonBtn" onClick={()=>{
                                                setDrawerOpen(false);
                                            }}><span>Become a Vendor</span></button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="ProductsImagesContainer">
                                <Row gutter={[20, 20]}>
                                    {DummyData.products.slice(0, 8).map((item, idx) => (
                                        <Col lg={6} key={idx}>
                                            <div className="ProductImage">
                                                <img src={item.images[0]} alt="" style={{ width: "100%" }} />
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                            <div className="paddingTop50">
                                <h2>Follow Us</h2>
                                <div className="SocialIconsContainer">
                                    <ul>
                                        {SocialIconsData.map((item, idx) => (
                                            <li key={idx}>
                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                    {item.icon}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>
            {/* Mobile Navigation Drawer */}
            <Drawer
                title={null}
                placement="right"
                open={mobileNavDrawerOpen}
                onClose={() => setMobileNavDrawerOpen(false)}
                width={260}
                bodyStyle={{ padding: 0 }}
                className="MobileNavLinksDrawer"
            >
                <div style={{ padding: 24 }}>
                    <a href="/" style={{ display: "block", marginBottom: 18, fontWeight: 600, color: "#222" }}>Home</a>
                    <a href="/designers" style={{ display: "block", marginBottom: 18, fontWeight: 600, color: "#222" }}>Designers</a>
                    <a href="/all-products" style={{ display: "block", marginBottom: 18, fontWeight: 600, color: "#222" }}>All Products</a>
                    {/* Add more links as needed */}
                </div>
            </Drawer>
        </div>
    );
};

export default NavigationBar;   