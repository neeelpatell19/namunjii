import React, { useState, useEffect, useCallback, useRef } from "react";
import { Row, Col, Dropdown, Input, Spin, Drawer, Popover, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiHeart,
  FiMenu,
  FiX,
  FiUser,
  FiChevronDown,
} from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi2";
import Cookies from "js-cookie";
import {
  LogoutOutlined,
  ProfileOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { updateUserData } from "../../store/actions/ApiActions";
import CartDrawer from "../StoreLogic/Cart/CartDrawer";
import WishlistDrawer from "../StoreLogic/Wishlist/WishlistDrawer";
import { useCartWishlist } from "../StoreLogic/Context/CartWishlistContext";
import { useHomeData } from "../StoreLogic/Context/HomeDataContext";
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
  
  // Check if user is logged in (check token and user data)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  
  // Check login status on mount and when userData changes
  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    const user = userData || JSON.parse(localStorage.getItem("user") || "null");
    
    if (token && user) {
      setIsLoggedIn(true);
      setLoggedInUser(user);
    } else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
  }, [userData]);
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
    cartItems,
    wishlistItems,
  } = useCartWishlist();
  const { getMenCategories, getWomenCategories } = useHomeData();

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
  const mobileMenuToggleRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const isTogglingRef = useRef(false);

  // Check if we're on products page
  const isProductsPage = location.pathname === "/products";

  // Detect mobile and tablet screen size
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024); // iPad range
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get dynamic categories from home API
  const menCategories = getMenCategories();
  const womenCategories = getWomenCategories();

  const categories = [
    { name: "Men", hasDropdown: true, path: "/products?gender=Men" },
    { name: "Women", hasDropdown: true, path: "/products?gender=Women" },
    {
      name: "Accessories",
      hasDropdown: false,
      path: "/products?productType=accessory",
    },
    {
      name: "Namunjii Exclusive",
      hasDropdown: false,
      isSpecial: true,
      path: "/products?isNamunjiiExclusive=true",
    },
    { name: "About Us", hasDropdown: false, path: "/about-us" },
    {
      name: "Join Us",
      hasDropdown: false,
      path: "/vendor-verification",
      isJoinUs: true,
    },
  ];

  // Function to check if a category is active
  const isCategoryActive = (category) => {
    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);

    // For About Us page
    if (category.path === "/about-us") {
      return currentPath === "/about-us";
    }

    // For Join Us page
    if (category.path === "/vendor-verification") {
      return currentPath === "/vendor-verification";
    }

    // For products pages with query parameters
    if (currentPath === "/products") {
      // Men tab
      if (category.name === "Men") {
        return searchParams.get("gender") === "Men";
      }
      // Women tab
      if (category.name === "Women") {
        return searchParams.get("gender") === "Women";
      }
      // Accessories tab
      if (category.name === "Accessories") {
        return searchParams.get("productType") === "accessory";
      }
      // Namunjii Exclusive tab
      if (category.name === "Namunjii Exclusive") {
        return searchParams.get("isNamunjiiExclusive") === "true";
      }
    }

    return false;
  };

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

  // Calculate mega menu top position and arrow position
  useEffect(() => {
    const updateMegaMenuPosition = () => {
      // Skip positioning on mobile - CSS handles it
      if (isMobile || mobileMenuOpen) {
        return;
      }

      if (categoryNavBarRef.current) {
        const navBarRect = categoryNavBarRef.current.getBoundingClientRect();
        const topPosition = navBarRect.bottom - 8; // Move up by 8px

        // Update Women mega menu position and arrow
        if (showWomenMegaMenu && womenMegaMenuRef.current) {
          womenMegaMenuRef.current.style.top = `${topPosition}px`;
          // Find Women category link and position menu + arrow
          const allCategoryItems =
            categoryNavBarRef.current.querySelectorAll(".CategoryItem");
          let womenCategoryItem = null;
          allCategoryItems.forEach((item) => {
            const link = item.querySelector(
              '.category-text-link[href*="gender=Women"]'
            );
            if (link) {
              womenCategoryItem = item;
            }
          });
          if (womenCategoryItem) {
            const linkRect = womenCategoryItem.getBoundingClientRect();
            // Force a reflow to ensure width is calculated
            const menuWidth = womenMegaMenuRef.current.offsetWidth || 250;
            const menuLeft = linkRect.left + linkRect.width / 2 - menuWidth / 2;
            // Ensure menu doesn't go off screen
            const adjustedLeft = Math.max(
              10,
              Math.min(menuLeft, window.innerWidth - menuWidth - 10)
            );
            womenMegaMenuRef.current.style.left = `${adjustedLeft}px`;

            const arrow =
              womenMegaMenuRef.current.querySelector(".women-arrow");
            if (arrow) {
              // Position arrow to point to center of category link
              const arrowOffset =
                linkRect.left + linkRect.width / 2 - adjustedLeft;
              arrow.style.left = `${arrowOffset - 8}px`; // 8px is half of arrow width
            }
          }
        }

        // Update Men mega menu position and arrow
        if (showMenMegaMenu && menMegaMenuRef.current) {
          menMegaMenuRef.current.style.top = `${topPosition}px`;
          // Find Men category link and position menu + arrow
          const allCategoryItems =
            categoryNavBarRef.current.querySelectorAll(".CategoryItem");
          let menCategoryItem = null;
          allCategoryItems.forEach((item) => {
            const link = item.querySelector(
              '.category-text-link[href*="gender=Men"]'
            );
            if (link) {
              menCategoryItem = item;
            }
          });
          if (menCategoryItem) {
            const linkRect = menCategoryItem.getBoundingClientRect();
            // Force a reflow to ensure width is calculated
            const menuWidth = menMegaMenuRef.current.offsetWidth || 250;
            const menuLeft = linkRect.left + linkRect.width / 2 - menuWidth / 2;
            // Ensure menu doesn't go off screen
            const adjustedLeft = Math.max(
              10,
              Math.min(menuLeft, window.innerWidth - menuWidth - 10)
            );
            menMegaMenuRef.current.style.left = `${adjustedLeft}px`;

            const arrow = menMegaMenuRef.current.querySelector(".men-arrow");
            if (arrow) {
              // Position arrow to point to center of category link
              const arrowOffset =
                linkRect.left + linkRect.width / 2 - adjustedLeft;
              arrow.style.left = `${arrowOffset - 8}px`; // 8px is half of arrow width
            }
          }
        }
      }
    };

    if (showWomenMegaMenu || showMenMegaMenu) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        updateMegaMenuPosition();
      }, 0);
      window.addEventListener("scroll", updateMegaMenuPosition);
      window.addEventListener("resize", updateMegaMenuPosition);
    }

    return () => {
      window.removeEventListener("scroll", updateMegaMenuPosition);
      window.removeEventListener("resize", updateMegaMenuPosition);
    };
  }, [showWomenMegaMenu, showMenMegaMenu, isMobile, mobileMenuOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menRef = menMegaMenuRef.current;
      const womenRef = womenMegaMenuRef.current;
      const navBarRef = categoryNavBarRef.current;

      // Check if click is outside both mega menus and the nav bar
      const outsideMen = !menRef || !menRef.contains(event.target);
      const outsideWomen = !womenRef || !womenRef.contains(event.target);
      const outsideNavBar = !navBarRef || !navBarRef.contains(event.target);

      if (outsideMen && outsideWomen && outsideNavBar) {
        setShowMenMegaMenu(false);
        setShowWomenMegaMenu(false);
      }
    };

    if (showMenMegaMenu || showWomenMegaMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenMegaMenu, showWomenMegaMenu]);

  // Close mobile CategoryNavBar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle on mobile
      if (!isMobile) return;

      // Don't handle if we're currently toggling
      if (isTogglingRef.current) {
        return;
      }

      const navBarRef = categoryNavBarRef.current;
      const toggleRef = mobileMenuToggleRef.current;
      const backdropRef = document.querySelector(".mobile-menu-backdrop");
      const menDrawerRef = document.querySelector(".men-mega-menu-drawer");
      const womenDrawerRef = document.querySelector(".women-mega-menu-drawer");

      // If clicking on toggle button, let it handle the toggle - don't interfere
      if (toggleRef && toggleRef.contains(event.target)) {
        return;
      }

      // If clicking on backdrop, close menu
      if (backdropRef && backdropRef.contains(event.target)) {
        setMobileMenuOpen(false);
        return;
      }

      // Check if click is outside the CategoryNavBar, toggle button, and mega menu drawers
      const outsideNavBar = !navBarRef || !navBarRef.contains(event.target);
      const outsideMenDrawer =
        !menDrawerRef || !menDrawerRef.contains(event.target);
      const outsideWomenDrawer =
        !womenDrawerRef || !womenDrawerRef.contains(event.target);

      if (
        outsideNavBar &&
        outsideMenDrawer &&
        outsideWomenDrawer
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen && isMobile) {
      // Use click event instead of mousedown/touchstart to avoid conflicts with toggle button
      document.addEventListener("click", handleClickOutside, true);

      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [mobileMenuOpen, isMobile]);

  // Handle suggestion click - navigate to product page
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSuggestions(false);
    setShowSearchInput(false);
    setShowSearchDrawer(false);
    setSearchInput("");
  };

  // Render mega menu content
  const renderMegaMenuContent = (gender, categories) => (
    <div className="MegaMenuContent">
      <div className="MegaMenuColumn">
        <ul className="MegaMenuList">
          <li>
            <Link
              to={`/products?gender=${gender}`}
              className="MegaMenuLink"
              onClick={() => {
                if (gender === "Women") {
                  setShowWomenMegaMenu(false);
                } else {
                  setShowMenMegaMenu(false);
                }
                setMobileMenuOpen(false);
              }}
            >
              Shop All
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/products?gender=${gender}&category=${cat._id}`}
                className="MegaMenuLink"
                onClick={() => {
                  if (gender === "Women") {
                    setShowWomenMegaMenu(false);
                  } else {
                    setShowMenMegaMenu(false);
                  }
                  setMobileMenuOpen(false);
                }}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Render dropdown menu items for Ant Design Dropdown (for iPad)
  const renderDropdownMenuItems = (gender, categories) => {
    const items = [
      {
        key: 'shop-all',
        label: (
          <Link
            to={`/products?gender=${gender}`}
            onClick={() => {
              if (gender === "Women") {
                setShowWomenMegaMenu(false);
              } else {
                setShowMenMegaMenu(false);
              }
            }}
          >
            Shop All
          </Link>
        ),
      },
      {
        type: 'divider',
      },
      ...categories.map((cat) => ({
        key: cat._id,
        label: (
          <Link
            to={`/products?gender=${gender}&category=${cat._id}`}
            onClick={() => {
              if (gender === "Women") {
                setShowWomenMegaMenu(false);
              } else {
                setShowMenMegaMenu(false);
              }
            }}
          >
            {cat.name}
          </Link>
        ),
      })),
    ];
    return items;
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
    // Set flag to prevent click-outside handler from interfering
    isTogglingRef.current = true;
    setMobileMenuOpen(!mobileMenuOpen);
    // Reset flag after a short delay to allow state update to complete
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 100);
  };

  // Fetch counts when deviceId is available
  useEffect(() => {
    if (deviceId) {
      fetchCounts();
    }
  }, [deviceId, fetchCounts]);

  // Update cart count when cartItems from context change
  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      setCartCount(cartItems.length);
    }
  }, [cartItems]);

  // Update wishlist count when wishlistItems from context change
  useEffect(() => {
    if (wishlistItems && Array.isArray(wishlistItems)) {
      setWishlistCount(wishlistItems.length);
    }
  }, [wishlistItems]);

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
            <Col style={{ display: "flex", alignItems: "center" }}>
              <div className="NavLeft">
                <div
                  className="MobileMenuToggle"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMobileMenu();
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  ref={mobileMenuToggleRef}
                >
                  {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </div>
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
                <Popover
                  content={
                    isLoggedIn && loggedInUser ? (
                      <div className="user-popover-content">
                        <div
                          className="user-popover-link"
                          onClick={() => {
                            navigate("/orders");
                          }}
                        >
                          My Orders
                        </div>
                      </div>
                    ) : (
                      <div className="user-popover-content">
                        <Button
                          type="primary"
                          block
                          onClick={() => {
                            navigate("/login");
                          }}
                          className="user-popover-login-button"
                        >
                          Login
                        </Button>
                      </div>
                    )
                  }
                  title={null}
                  trigger="hover"
                  placement="bottomRight"
                  overlayClassName="user-popover"
                >
                  <div className="UserIcon" style={{ cursor: "pointer" }}>
                    <HiOutlineUser />
                  </div>
                </Popover>
                <div
                  className="WishlistIcon"
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={handleWishlistClick}
                >
                  <FiHeart />
                </div>
                <div className="CartContainer" onClick={handleCartClick}>
                  <ShoppingCartOutlined className="CartIcon" />
                  {cartCount > 0 && !openCartDrawer && !openWishlistDrawer && (
                    <div className="CartBadge">
                      <span>{cartCount}</span>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && isMobile && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

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
                  <div key={index} className="CategoryItem">
                    {category.hasDropdown ? (
                      // Use Ant Design Dropdown for iPad/Tablet, hover-based for desktop
                      isTablet ? (
                        <Dropdown
                          menu={{
                            items:
                              category.name === "Women"
                                ? renderDropdownMenuItems("Women", womenCategories)
                                : renderDropdownMenuItems("Men", menCategories),
                          }}
                          trigger={["click"]}
                          placement="bottom"
                          overlayClassName="category-dropdown-menu"
                        >
                          <div
                            className={`CategoryLink ${
                              category.isSpecial ? "special" : ""
                            } ${category.isJoinUs ? "join-us" : ""} ${
                              isCategoryActive(category) ? "active" : ""
                            } dropdown-link`}
                          >
                            <Link
                              to={category.path}
                              className="category-text-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setMobileMenuOpen(false);
                              }}
                            >
                              {category.name}
                            </Link>
                            <span className="dropdown-icon">
                              <FiChevronDown
                                style={{
                                  fontSize: "14px",
                                  transition: "transform 0.3s ease",
                                }}
                              />
                            </span>
                          </div>
                        </Dropdown>
                      ) : (
                        <div
                          className={`CategoryLink ${
                            category.isSpecial ? "special" : ""
                          } ${category.isJoinUs ? "join-us" : ""} ${
                            isCategoryActive(category) ? "active" : ""
                          } dropdown-link`}
                          onMouseEnter={() => {
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
                            }
                          }}
                          onMouseLeave={() => {
                            // For desktop, close drawer immediately on mouse leave
                            if (!isMobile) {
                              if (hideTimeoutRef.current) {
                                clearTimeout(hideTimeoutRef.current);
                                hideTimeoutRef.current = null;
                              }
                              setShowWomenMegaMenu(false);
                              setShowMenMegaMenu(false);
                            }
                          }}
                        >
                          <Link
                            to={category.path}
                            className="category-text-link"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setShowWomenMegaMenu(false);
                              setShowMenMegaMenu(false);
                            }}
                          >
                            {category.name}
                          </Link>
                          <span
                            className="dropdown-icon"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (category.name === "Women") {
                                setShowWomenMegaMenu(!showWomenMegaMenu);
                                setShowMenMegaMenu(false);
                              } else if (category.name === "Men") {
                                setShowMenMegaMenu(!showMenMegaMenu);
                                setShowWomenMegaMenu(false);
                              }
                            }}
                          >
                            <FiChevronDown
                              style={{
                                fontSize: "14px",
                                transition: "transform 0.3s ease",
                                transform:
                                  (category.name === "Men" && showMenMegaMenu) ||
                                  (category.name === "Women" && showWomenMegaMenu)
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                              }}
                            />
                          </span>
                        </div>
                      )
                    ) : (
                      <Link
                        to={category.path}
                        className={`CategoryLink ${
                          category.isSpecial ? "special" : ""
                        } ${category.isJoinUs ? "join-us" : ""} ${
                          isCategoryActive(category) ? "active" : ""
                        }`}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowWomenMegaMenu(false);
                          setShowMenMegaMenu(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    )}

                    {/* Women Mega Menu - Drawer for mobile, original container for desktop */}
                    {category.name === "Women" && (
                      <>
                        {/* Mobile: Use Drawer */}
                        {isMobile && (
                          <Drawer
                            title="Women"
                            placement="right"
                            onClose={() => setShowWomenMegaMenu(false)}
                            open={showWomenMegaMenu}
                            width="50%"
                            height="100vh"
                            className="mega-menu-drawer women-mega-menu-drawer"
                            mask={true}
                            maskClosable={true}
                            closable={true}
                            zIndex={10001}
                            getContainer={document.body}
                          >
                            {renderMegaMenuContent("Women", womenCategories)}
                          </Drawer>
                        )}
                        {/* Desktop: Use original MegaMenuContainer */}
                        {!isMobile && showWomenMegaMenu && (
                          <div
                            ref={womenMegaMenuRef}
                            className="MegaMenuContainer fade-in women-mega-menu"
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
                            <div className="MegaMenuArrow women-arrow"></div>
                            {renderMegaMenuContent("Women", womenCategories)}
                          </div>
                        )}
                      </>
                    )}

                    {/* Men Mega Menu - Drawer for mobile, original container for desktop */}
                    {category.name === "Men" && (
                      <>
                        {/* Mobile: Use Drawer */}
                        {isMobile && (
                          <Drawer
                            title="Men"
                            placement="right"
                            onClose={() => setShowMenMegaMenu(false)}
                            open={showMenMegaMenu}
                            width="50%"
                            height="100vh"
                            className="mega-menu-drawer men-mega-menu-drawer"
                            mask={true}
                            maskClosable={true}
                            closable={true}
                            zIndex={10001}
                            getContainer={document.body}
                          >
                            {renderMegaMenuContent("Men", menCategories)}
                          </Drawer>
                        )}
                        {/* Desktop: Use original MegaMenuContainer */}
                        {!isMobile && showMenMegaMenu && (
                          <div
                            ref={menMegaMenuRef}
                            className="MegaMenuContainer fade-in men-mega-menu"
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
                            <div className="MegaMenuArrow men-arrow"></div>
                            {renderMegaMenuContent("Men", menCategories)}
                          </div>
                        )}
                      </>
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
