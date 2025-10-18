import React, { useState } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "Women", hasDropdown: true, path: "/women" },
    { name: "Men", hasDropdown: true, path: "/men" },
    { name: "Brands", hasDropdown: true, path: "/brands" },
    { name: "Products", hasDropdown: true, path: "/products" },
    {
      name: "Namunjii Exclusive",
      hasDropdown: false,
      isSpecial: true,
      path: "/exclusive",
    },
  ];

  const handleSearchClick = () => {
    // Add search functionality here
    console.log("Search clicked");
  };

  const handleWishlistClick = () => {
    // Add wishlist functionality here
    console.log("Wishlist clicked");
  };

  const handleCartClick = () => {
    // Add cart functionality here
    console.log("Cart clicked");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="HeaderContainer">
      {/* Main Navigation Bar */}
      <div className="MainNavBar">
        <div className="Container">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="NavLeft">
                <div className="SearchIcon" onClick={handleSearchClick}>
                  <FiSearch />
                </div>
                <div className="MobileMenuToggle" onClick={toggleMobileMenu}>
                  {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </div>
              </div>
            </Col>
            <Col>
              <div className="LogoContainer">
                <Link to="/">
                  <div className="Logo">
                    <div className="LogoIcon">
                      <img
                        src="/LogoImages/BrandColorIconLogo.svg"
                        alt="Namunjii"
                      />
                    </div>
                    <span className="LogoText">NAMUNJII</span>
                  </div>
                </Link>
              </div>
            </Col>
            <Col>
              <div className="NavActions">
                <div
                  className="WishlistIcon"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={handleWishlistClick}
                >
                  <FiHeart />
                </div>
                <div className="CartContainer" onClick={handleCartClick}>
                  <span className="CartText">CART</span>
                  <div className="CartBadge">
                    <span>0</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Brand Separator Line */}
      <div className="SeparatorLine"></div>

      {/* Secondary Navigation Bar */}
      <div className={`CategoryNavBar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="Container">
          <Row justify="center">
            <Col>
              <div className="CategoryLinks">
                {categories.map((category, index) => (
                  <div key={index} className="CategoryItem">
                    <Link
                      to={category.path}
                      className={`CategoryLink ${
                        category.isSpecial ? "special" : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                      {category.hasDropdown && (
                        <IoIosArrowDown className="DropdownArrow" />
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Header;
