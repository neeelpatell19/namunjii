import React, { useState, useEffect } from "react";
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

    return (
        <div className={`NavigationBarContainer ${navScrolled ? "nav-scrolled" : ""}`}>
            <div className={`Container ${navScrolled ? "nav-scrolled" : ""}`}>
                <Row>
                    <Col lg={8}>
                        <div className="NavigationBarLogoContainer">
                            <div>
                                <Link to="/">
                                    <img src={useWhite ? LogoFile : LogoFileBlack} alt="" />
                                </Link>
                            </div>
                        </div>
                    </Col>
                    <Col lg={8}>
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
                    <Col lg={8}>
                        <div className="FunctionlityButtonsContainer">
                            <div className="MenuDrawerBtn" onClick={() => setDrawerOpen(true)}>
                                <CgMenuGridO style={{ color: useWhite ? "white" : "black" }} />
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
                                    <div>
                                        <button className="CommonBtn"><span>Shop Now</span></button>
                                    </div>
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
        </div>
    );
};

export default NavigationBar;   