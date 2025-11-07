import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Dropdown, Input, Spin, Drawer } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch, FiHeart, FiMenu, FiX, FiUser } from "react-icons/fi";
import {
  LogoutOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store/actions/ApiActions";
import CartDrawer from "../StoreLogic/Cart/CartDrawer";
import WishlistDrawer from "../StoreLogic/Wishlist/WishlistDrawer";
import { useCartWishlist } from "../StoreLogic/Context/CartWishlistContext";
import { useDevice } from "../../hooks/useDevice";
import cartApi from "../../apis/cart";
import wishlistApi from "../../apis/wishlist";
import productApi from "../../apis/product";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Search state
  const [searchInput, setSearchInput] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [showWomenMegaMenu, setShowWomenMegaMenu] = useState(false);
  const [showMenMegaMenu, setShowMenMegaMenu] = useState(false);
  const womenMegaMenuRef = useRef(null);
  const menMegaMenuRef = useRef(null);
  const categoryNavBarRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // Check if we're on products page
  const isProductsPage = location.pathname === "/products";

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mega dropdown data for Women - 2 columns only
  const womenMegaMenuData = {
    category: [
      { label: "Shop All", link: "/products?gender=Women" },
      { label: "Blouses & Top", link: "/products?gender=Women&category=Tops" },
      { label: "Pants", link: "/products?gender=Women&category=Pants" },
      { label: "Dresses & Jumpsuits", link: "/products?gender=Women&category=Dresses" },
      { label: "Outwear & Jackets", link: "/products?gender=Women&category=Outerwear" },
      { label: "Pullovers", link: "/products?gender=Women&category=Pullovers" },
      { label: "Tees", link: "/products?gender=Women&category=Tees" },
      { label: "Shorts & Skirts", link: "/products?gender=Women&category=Shorts" },
    ],
    featured: [
      { label: "Deewan-E-Khaas", link: "/products?gender=Women&brand=Deewan-E-Khaas" },
      { label: "Kaaya Collective", link: "/products?gender=Women&brand=Kaaya-Collective" },
      { label: "Pehnava Studio", link: "/products?gender=Women&brand=Pehnava-Studio" },
      { label: "Vastra By Design", link: "/products?gender=Women&brand=Vastra-By-Design" },
    ],
  };

  // Mega dropdown data for Men - 2 columns only
  const menMegaMenuData = {
    category: [
      { label: "Shop All", link: "/products?gender=Men" },
      { label: "Shirts", link: "/products?gender=Men&category=Shirts" },
      { label: "T-Shirts", link: "/products?gender=Men&category=T-Shirts" },
      { label: "Pants", link: "/products?gender=Men&category=Pants" },
      { label: "Jackets", link: "/products?gender=Men&category=Jackets" },
      { label: "Sweaters", link: "/products?gender=Men&category=Sweaters" },
      { label: "Shorts", link: "/products?gender=Men&category=Shorts" },
      { label: "Accessories", link: "/products?gender=Men&category=Accessories" },
         { label: "Shop All", link: "/products?gender=Men" },
      { label: "Shirts", link: "/products?gender=Men&category=Shirts" },
      { label: "T-Shirts", link: "/products?gender=Men&category=T-Shirts" },
      { label: "Pants", link: "/products?gender=Men&category=Pants" },
      { label: "Jackets", link: "/products?gender=Men&category=Jackets" },
      { label: "Sweaters", link: "/products?gender=Men&category=Sweaters" },
      { label: "Shorts", link: "/products?gender=Men&category=Shorts" },
      { label: "Accessories", link: "/products?gender=Men&category=Accessories" }
    ],
    featured: [
      { label: "Deewan-E-Khaas", link: "/products?gender=Men&brand=Deewan-E-Khaas" },
      { label: "Kaaya Collective", link: "/products?gender=Men&brand=Kaaya-Collective" },
      { label: "Pehnava Studio", link: "/products?gender=Men&brand=Pehnava-Studio" },
      { label: "Vastra By Design", link: "/products?gender=Men&brand=Vastra-By-Design" },
    ],
  };

  const categories = [
    { name: "Women", hasDropdown: true, path: "/products?gender=Women" },
    { name: "Men", hasDropdown: true, path: "/products?gender=Men" },
    {
      name: "Namunjii Exclusive",
      hasDropdown: false,
      isSpecial: true,
      path: "/products",
    },
    { name: "About Us", hasDropdown: false, path: "/about-us" },
    { name: "Join Us", hasDropdown: false, path: "/vendor-verification" },
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
    if (isMobile) {
      setShowSearchDrawer(true);
    } else {
      setShowSearchInput(true);
    }
  };

  // Fetch search suggestions with debouncing
  useEffect(() => {
    // Clear suggestions if query is empty
    if (!searchInput || searchInput.trim().length === 0) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const response = await productApi.getSearchSuggestions(
          searchInput.trim(),
          10
        );
        if (response.success) {
          setSearchSuggestions(response.data || []);
        } else {
          setSearchSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching search suggestions:", err);
        setSearchSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Handle click outside to close suggestions and search input
  useEffect(() => {
    const handleClickOutside = (event) => {
      const desktopRef = searchRef.current;
      const mobileRef = mobileSearchRef.current;

      // Check if click is outside desktop search (if it exists)
      const outsideDesktop = !desktopRef || !desktopRef.contains(event.target);
      // Check if click is outside mobile search (if it exists)
      const outsideMobile = !mobileRef || !mobileRef.contains(event.target);

      // Close if click is outside both search containers
      if (outsideDesktop && outsideMobile) {
        setShowSuggestions(false);
        if (!isMobile) {
          setShowSearchInput(false);
        }
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        setShowSearchInput(false);
        setShowSearchDrawer(false);
        setSearchInput("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobile]);

  // Close search when navigating away
  useEffect(() => {
    setShowSearchInput(false);
    setShowSearchDrawer(false);
    setShowSuggestions(false);
    setSearchInput("");
  }, [location.pathname]);

  // Calculate mega menu top position
  useEffect(() => {
    const updateMegaMenuPosition = () => {
      if (categoryNavBarRef.current) {
        const navBarRect = categoryNavBarRef.current.getBoundingClientRect();
        const topPosition = navBarRect.bottom;
        
        if (womenMegaMenuRef.current) {
          womenMegaMenuRef.current.style.top = `${topPosition}px`;
        }
        if (menMegaMenuRef.current) {
          menMegaMenuRef.current.style.top = `${topPosition}px`;
        }
      }
    };

    if (showWomenMegaMenu || showMenMegaMenu) {
      updateMegaMenuPosition();
      window.addEventListener("scroll", updateMegaMenuPosition);
      window.addEventListener("resize", updateMegaMenuPosition);
    }

    return () => {
      window.removeEventListener("scroll", updateMegaMenuPosition);
      window.removeEventListener("resize", updateMegaMenuPosition);
    };
  }, [showWomenMegaMenu, showMenMegaMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Handle suggestion click - navigate to product page
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setShowSearchInput(false);
    setShowSearchDrawer(false);
    setSearchInput("");
  };

  // Render search suggestions dropdown
  const renderSearchSuggestions = () => {
    if (!showSuggestions || !searchInput.trim()) return null;

    return (
      <div className="header-search-suggestions-dropdown">
        {suggestionsLoading ? (
          <div className="header-search-suggestion-item">
            <Spin size="small" />{" "}
            <span style={{ marginLeft: "8px" }}>Searching...</span>
          </div>
        ) : searchSuggestions.length > 0 ? (
          <ul className="header-search-suggestions-list">
            {searchSuggestions.map((suggestion) => {
              const discountedPrice =
                suggestion.basePricing -
                (suggestion.basePricing * (suggestion.discount || 0)) / 100;
              const coverImage =
                Array.isArray(suggestion.coverImage) &&
                suggestion.coverImage.length > 0
                  ? suggestion.coverImage[0]
                  : suggestion.coverImage || "";

              return (
                <li
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion._id)}
                  className="header-search-suggestion-item"
                >
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={suggestion.productName}
                      className="header-search-suggestion-image"
                    />
                  )}
                  <div className="header-search-suggestion-content">
                    <p className="header-search-suggestion-name">
                      {suggestion.productName}
                    </p>
                    <div className="header-search-suggestion-price">
                      <span className="header-search-suggestion-price-current">
                        ₹{discountedPrice.toFixed(0)}
                      </span>
                      {suggestion.discount > 0 && (
                        <>
                          <span className="header-search-suggestion-price-original">
                            ₹{suggestion.basePricing.toFixed(0)}
                          </span>
                          <span className="header-search-suggestion-discount">
                            {suggestion.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                    <p className="header-search-suggestion-meta">
                      {suggestion.category?.name || ""}
                      {suggestion.category?.name &&
                        suggestion.vendorId?.brandName &&
                        " • "}
                      {suggestion.vendorId?.brandName || ""}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="header-search-suggestion-item">
            No products found for "{searchInput}"
          </div>
        )}
      </div>
    );
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
                {!isProductsPage && (
                  <>
                    {!isMobile && showSearchInput ? (
                      <div className="HeaderSearchContainer" ref={searchRef}>
                        <Input
                          size="small"
                          prefix={<SearchOutlined style={{ color: "#333" }} />}
                          placeholder="Search for products..."
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            setShowSuggestions(true);
                          }}
                          onFocus={() => {
                            if (searchSuggestions.length > 0) {
                              setShowSuggestions(true);
                            }
                          }}
                          onPressEnter={() => {
                            if (searchInput.trim()) {
                              navigate(
                                `/products?search=${encodeURIComponent(
                                  searchInput.trim()
                                )}`
                              );
                              setShowSuggestions(false);
                              setShowSearchInput(false);
                              setSearchInput("");
                            }
                          }}
                          allowClear
                          onClear={() => {
                            setSearchInput("");
                            setShowSuggestions(false);
                          }}
                          autoFocus
                          className="header-search-input"
                        />
                        {renderSearchSuggestions()}
                      </div>
                    ) : (
                      <div className="SearchIcon" onClick={handleSearchClick}>
                        <FiSearch />
                      </div>
                    )}
                  </>
                )}
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
      <div 
        ref={categoryNavBarRef}
        className={`CategoryNavBar ${mobileMenuOpen ? "mobile-open" : ""}`}
      >
        <div className="Container">
          <Row justify="center">
            <Col>
              <div className="CategoryLinks">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="CategoryItem"
                  >
                    <Link
                      to={category.path}
                      className={`CategoryLink ${
                        category.isSpecial ? "special" : ""
                      }`}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowWomenMegaMenu(false);
                        setShowMenMegaMenu(false);
                      }}
                      onMouseEnter={() => {
                        // Clear any pending hide timeout
                        if (hideTimeoutRef.current) {
                          clearTimeout(hideTimeoutRef.current);
                          hideTimeoutRef.current = null;
                        }
                        
                        if (category.name === "Women") {
                          setShowWomenMegaMenu(true);
                          setShowMenMegaMenu(false);
                        } else if (category.name === "Men") {
                          setShowMenMegaMenu(true);
                          setShowWomenMegaMenu(false);
                        } else {
                          setShowWomenMegaMenu(false);
                          setShowMenMegaMenu(false);
                        }
                      }}
                      onMouseLeave={() => {
                        if (category.name === "Women" || category.name === "Men") {
                          hideTimeoutRef.current = setTimeout(() => {
                            setShowWomenMegaMenu(false);
                            setShowMenMegaMenu(false);
                          }, 300);
                        }
                      }}
                    >
                      {category.name}
                    </Link>
                    {/* Women Mega Menu */}
                    {category.name === "Women" && showWomenMegaMenu && (
                      <div
                        ref={womenMegaMenuRef}
                        className="MegaMenuContainer fade-in"
                        onMouseEnter={() => {
                          if (hideTimeoutRef.current) {
                            clearTimeout(hideTimeoutRef.current);
                            hideTimeoutRef.current = null;
                          }
                          setShowWomenMegaMenu(true);
                        }}
                        onMouseLeave={() => {
                          hideTimeoutRef.current = setTimeout(() => {
                            setShowWomenMegaMenu(false);
                          }, 300);
                        }}
                      >
                        <div className="MegaMenuContent">
                          {/* Category Column */}
                          <div className="MegaMenuColumn">
                            <h4 className="MegaMenuColumnTitle">CATEGORY</h4>
                            <ul className="MegaMenuList">
                              {womenMegaMenuData.category.map((item, idx) => (
                                <li key={idx}>
                                  <Link
                                    to={item.link}
                                    className="MegaMenuLink"
                                    onClick={() => {
                                      setShowWomenMegaMenu(false);
                                      setMobileMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Featured Column */}
                          <div className="MegaMenuColumn">
                            <h4 className="MegaMenuColumnTitle">BRAND NAME</h4>
                            <ul className="MegaMenuList">
                              {womenMegaMenuData.featured.map((item, idx) => (
                                <li key={idx}>
                                  <Link
                                    to={item.link}
                                    className="MegaMenuLink"
                                    onClick={() => {
                                      setShowWomenMegaMenu(false);
                                      setMobileMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Men Mega Menu */}
                    {category.name === "Men" && showMenMegaMenu && (
                      <div
                        ref={menMegaMenuRef}
                        className="MegaMenuContainer fade-in"
                        onMouseEnter={() => {
                          if (hideTimeoutRef.current) {
                            clearTimeout(hideTimeoutRef.current);
                            hideTimeoutRef.current = null;
                          }
                          setShowMenMegaMenu(true);
                        }}
                        onMouseLeave={() => {
                          hideTimeoutRef.current = setTimeout(() => {
                            setShowMenMegaMenu(false);
                          }, 300);
                        }}
                      >
                        <div className="MegaMenuContent">
                          {/* Category Column */}
                          <div className="MegaMenuColumn">
                            <h4 className="MegaMenuColumnTitle">CATEGORY</h4>
                            <ul className="MegaMenuList">
                              {menMegaMenuData.category.map((item, idx) => (
                                <li key={idx}>
                                  <Link
                                    to={item.link}
                                    className="MegaMenuLink"
                                    onClick={() => {
                                      setShowMenMegaMenu(false);
                                      setMobileMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Featured Column */}
                          <div className="MegaMenuColumn">
                            <h4 className="MegaMenuColumnTitle">BRAND NAME</h4>
                            <ul className="MegaMenuList">
                              {menMegaMenuData.featured.map((item, idx) => (
                                <li key={idx}>
                                  <Link
                                    to={item.link}
                                    className="MegaMenuLink"
                                    onClick={() => {
                                      setShowMenMegaMenu(false);
                                      setMobileMenuOpen(false);
                                    }}
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
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

      {/* Mobile Search Drawer */}
      <Drawer
        title="Search Products"
        placement="top"
        onClose={() => {
          setShowSearchDrawer(false);
          setShowSuggestions(false);
          setSearchInput("");
        }}
        open={showSearchDrawer}
        height="auto"
        className="mobile-search-drawer"
        styles={{
          body: { padding: "16px" },
        }}
      >
        <div className="mobile-search-container" ref={mobileSearchRef}>
          <Input
            size="large"
            prefix={<SearchOutlined style={{ color: "#333" }} />}
            placeholder="Search for products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (searchSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onPressEnter={() => {
              if (searchInput.trim()) {
                navigate(
                  `/products?search=${encodeURIComponent(searchInput.trim())}`
                );
                setShowSearchDrawer(false);
                setShowSuggestions(false);
                setSearchInput("");
              }
            }}
            allowClear
            onClear={() => {
              setSearchInput("");
              setShowSuggestions(false);
            }}
            autoFocus
            className="mobile-search-input"
          />
          {renderSearchSuggestions()}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
