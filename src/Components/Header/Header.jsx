import React, { useState, useEffect, useCallback } from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import { FiSearch, FiHeart, FiMenu, FiX } from "react-icons/fi";
import CartDrawer from "../StoreLogic/Cart/CartDrawer";
import WishlistDrawer from "../StoreLogic/Wishlist/WishlistDrawer";
import { useCartWishlist } from "../StoreLogic/Context/CartWishlistContext";
import { useDevice } from "../../hooks/useDevice";
import cartApi from "../../apis/cart";
import wishlistApi from "../../apis/wishlist";
import "./Header.css";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [, setWishlistCount] = useState(0);
  const { deviceId } = useDevice();
  const {
    openCartDrawer,
    openWishlistDrawer,
    closeCartDrawer,
    closeWishlistDrawer,
    triggerCartDrawer,
    triggerWishlistDrawer,
  } = useCartWishlist();

  const categories = [
    { name: "Women", hasDropdown: false, path: "/products?gender=Women" },
    { name: "Men", hasDropdown: false, path: "/products?gender=Men" },
    {
      name: "Namunjii Exclusive",
      hasDropdown: false,
      isSpecial: true,
      path: "/products",
    },
  ];

  // Fetch cart and wishlist counts
  const fetchCounts = useCallback(async () => {
    if (!deviceId) return;

    try {
      const [cartResponse, wishlistResponse] = await Promise.all([
        cartApi.getCartCount(),
        wishlistApi.getWishlistCount(),
      ]);

      if (cartResponse.success) {
        setCartCount(cartResponse.count || 0);
      }

      if (wishlistResponse.success) {
        setWishlistCount(wishlistResponse.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  }, [deviceId]);

  const handleSearchClick = () => {
    // Add search functionality here
    console.log("Search clicked");
  };

  const handleWishlistClick = () => {
    triggerWishlistDrawer();
    setMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    triggerCartDrawer();
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Fetch counts when deviceId is available
  useEffect(() => {
    if (deviceId) {
      fetchCounts();
    }
  }, [deviceId, fetchCounts]);

  // Refresh counts when drawers are closed
  const handleCartClose = () => {
    closeCartDrawer();
    fetchCounts();
  };

  const handleWishlistClose = () => {
    closeWishlistDrawer();
    fetchCounts();
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
                    <span>{cartCount}</span>
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
                    </Link>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Cart and Wishlist Drawers */}
      <CartDrawer isOpen={openCartDrawer} onClose={handleCartClose} />
      <WishlistDrawer
        isOpen={openWishlistDrawer}
        onClose={handleWishlistClose}
      />
    </div>
  );
};

export default Header;
