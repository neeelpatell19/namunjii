import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiHeart, FiMenu, FiX, FiUser } from "react-icons/fi";
import {
  LogoutOutlined,
  ProfileOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store/actions/ApiActions";
import CartDrawer from "../StoreLogic/Cart/CartDrawer";
import WishlistDrawer from "../StoreLogic/Wishlist/WishlistDrawer";
import { useCartWishlist } from "../StoreLogic/Context/CartWishlistContext";
import { useDevice } from "../../hooks/useDevice";
import cartApi from "../../apis/cart";
import wishlistApi from "../../apis/wishlist";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.api.userData);
  const isLoggedIn = !!userData;
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

  // Handle user menu actions
  const handleLoginSignup = () => {
    // Navigate to login/signup page
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleMyOrders = () => {
    navigate("/orders");
  };

  const handleLogout = () => {
    dispatch(updateUserData(null));
    // Optionally navigate to home or login page
    navigate("/");
  };

  // User menu dropdown items for logged in users
  const userMenuItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Profile",
      onClick: handleProfile,
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: "My Orders",
      onClick: handleMyOrders,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Login/Signup menu dropdown items for logged out users
  const loginMenuItems = [
    {
      key: "login",
      label: "Login/Signup",
      onClick: handleLoginSignup,
    },
  ];

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
                <Dropdown
                  menu={{ items: isLoggedIn ? userMenuItems : loginMenuItems }}
                  placement="bottomCenter"
                  trigger={["click"]}
                  arrow={{ pointAtCenter: true }}
                >
                  <div
                    className="UserIcon"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      gap: "8px",
                    }}
                  >
                    <FiUser />
                  </div>
                </Dropdown>
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
