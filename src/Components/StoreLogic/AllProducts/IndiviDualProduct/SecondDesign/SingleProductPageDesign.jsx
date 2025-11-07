import React, { useEffect, useState } from "react";
import { Tabs, Spin, Alert, Button, Badge } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  EyeOutlined,
  StarOutlined,
  TruckOutlined,
  SafetyOutlined,
  UndoOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Thumbs } from "swiper/modules";
import productApi from "../../../../../apis/product";
import cartApi from "../../../../../apis/cart";
import wishlistApi from "../../../../../apis/wishlist";
import { useDevice } from "../../../../../hooks/useDevice";
import { useCartWishlist } from "../../../Context/CartWishlistContext";
import { useAppContext } from "../../../Context/AppContext";
import ProductCard from "../../../../Common/ProductCard/ProductCard";
import "./SingleProductPageDesign.css";

const SingleProductPageDesign = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { deviceId } = useDevice();
  const {
    triggerCartDrawer,
    triggerWishlistDrawer,
    isInCart: ctxIsInCart,
    isInWishlist: ctxIsInWishlist,
    refreshCart,
    refreshWishlist,
  } = useCartWishlist();
  const { state } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const isInWishlist = ctxIsInWishlist(product?._id);
  const isInCart = ctxIsInCart(product?._id);

  // Helper function to get color value
  const getColorValue = (colorName) => {
    const colorMap = {
      gold: "#D4AF37",
      silver: "#C0C0C0",
      black: "#000000",
      white: "#FFFFFF",
      red: "#FF0000",
      blue: "#0000FF",
      green: "#008000",
    };
    return colorMap[colorName?.toLowerCase()] || "#D4AF37";
  };

  // Available sizes and colors
  const availableSizes = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = product?.color
    ? Array.isArray(product.color)
      ? product.color
      : [product.color]
    : ["#D4AF37", "#C0C0C0", "#FFD700"]; // Default colors: Gold, Silver, Bright Gold

  // Fetch product data (primary method - try API first, fallback to context)
  const fetchProduct = async () => {
    if (!productId) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First try to find product from app context (faster if available)
      const apiProducts = Array.isArray(state?.products) ? state.products : [];
      console.log("Looking for product ID:", productId);
      console.log("Available products:", apiProducts.length);
      const foundProduct = apiProducts.find((p) => p._id === productId);

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedSize(foundProduct.size || "");
        setSelectedColor(foundProduct.color || "");

        // Set page title
        document.title = `${foundProduct.productName} | Namunjii`;

        // Get related products from the same context
        const related = apiProducts
          .filter((p) => p._id !== productId)
          .slice(0, 6);
        setRelatedProducts(related);
        setLoading(false);
        return;
      }

      // If not found in context, try API call
      const response = await productApi.getProductById(productId);
      console.log("API Response:", response);

      // Handle the API response structure: { success: true, data: {...} }
      if (response && response.success && response.data) {
        const productData = response.data;
        setProduct(productData);
        setSelectedSize(productData.size || "");
        setSelectedColor(productData.color || "");

        // Set page title
        document.title = `${productData.productName} | Namunjii`;

        // Get related products from context
        const related = apiProducts
          .filter((p) => p._id !== productId)
          .slice(0, 6);
        setRelatedProducts(related);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error loading product:", err);
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  // Alternative: Try to fetch product via API (if backend supports it)
  const fetchProductViaAPI = async () => {
    try {
      const response = await productApi.getProductById(productId);

      // Handle the API response structure: { success: true, data: {...} }
      if (response && response.success && response.data) {
        const productData = response.data;
        setProduct(productData);
        setSelectedSize(productData.size || "");
        setSelectedColor(productData.color || "");

        // Set page title
        document.title = `${productData.productName} | Namunjii`;

        // Get related products from context
        const apiProducts = Array.isArray(state?.products)
          ? state.products
          : [];
        const related = apiProducts
          .filter((p) => p._id !== productId)
          .slice(0, 6);
        setRelatedProducts(related);
        setLoading(false);
      } else {
        setError("Product not found via API");
      }
    } catch (err) {
      console.error("API Error:", err);
      // If API fails, fall back to context method
      findProduct();
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!deviceId || !product || isInCart) return;

    try {
      const response = await cartApi.addToCart({
        deviceId,
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });

      if (response.success) {
        triggerCartDrawer();
        refreshCart();
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async () => {
    if (!deviceId || !product) return;
    if (isInWishlist) return;

    try {
      const response = await wishlistApi.addToWishlist({
        deviceId,
        productId: product._id,
      });

      if (response.success) {
        triggerWishlistDrawer();
        refreshWishlist();
      }
    } catch (err) {
      console.error("Failed to add to wishlist:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [productId, state.products]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Status derived from provider; no local checking

  // Calculate final price
  const calculateFinalPrice = () => {
    if (!product) return 0;
    const basePrice = product.basePricing || 0;
    const discount = product.discount || 0;
    return Math.round(basePrice * (1 - discount / 100));
  };

  const finalPrice = calculateFinalPrice();
  const images = product?.coverImage || [];
  const otherImages = product?.otherImages || [];
  const allImages = [...images, ...otherImages];

  // Fallback image if no images are available
  const fallbackImage =
    "https://images.unsplash.com/photo-1523297467724-f6758d7124c5?q=80&w=1019&auto=format&fit=crop&ixlib=rb-4.1.0";
  const displayImages = allImages.length > 0 ? allImages : [fallbackImage];

  if (loading) {
    return (
      <div className="single-product-loading">
        <Spin size="large" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="single-product-error">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <div className="single-product-not-found">
        <Alert
          message="Product Not Found"
          description="The product you're looking for doesn't exist or hasn't loaded yet."
          type="warning"
          showIcon
          action={[
            <Button
              key="retry"
              size="small"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchProduct();
              }}
            >
              Retry
            </Button>,
            <Button key="back" size="small" onClick={() => navigate(-1)}>
              Go Back
            </Button>,
          ]}
        />
      </div>
    );
  }

  // Show loading state while products are being fetched from context
  if (!product && loading && (!state.products || state.products.length === 0)) {
    return (
      <div className="single-product-loading">
        <Spin size="large" />
        <p>Loading product details...</p>
      </div>
    );
  }

  // Navigate images
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : displayImages.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < displayImages.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className="modern-product-page">
      {/* Breadcrumbs */}
      <div className="product-breadcrumbs">
        <Link to="/">HOME</Link>
        <span className="breadcrumb-separator">|</span>
        <Link to="/products">SHOP</Link>
        <span className="breadcrumb-separator">|</span>
        <span className="breadcrumb-current">{product.productName}</span>
      </div>

      <div className="product-page-container">
        {/* Product Images Section */}
        <div className="product-images-section">
          {/* Designer Name */}
          <div className="designer-name">
            {product.vendorId?.name || "Namunjii"}
          </div>

          <div className="main-image-container">
            {displayImages.length > 0 ? (
              <>
                {displayImages.length > 1 && (
                  <>
                    <button
                      className="image-nav-btn prev-btn"
                      onClick={handlePrevImage}
                    >
                   <img className="left-btn" src="/icons/next-btn.svg" alt="" />
                    </button>
                    <button
                      className="image-nav-btn next-btn"
                      onClick={handleNextImage}
                    >
                    <img className="right-btn" src="/icons/next-btn.svg" alt="" />
                    </button>
                    <div className="image-counter">
                      {currentImageIndex + 1}/{displayImages.length}
                    </div>
                  </>
                )}
                <img
                  src={displayImages[currentImageIndex]}
                  alt={product.productName}
                  className="main-product-image"
                />
              </>
            ) : (
              <div className="no-image-placeholder">
                <div className="placeholder-icon">📷</div>
                <p>No image available</p>
              </div>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="thumbnail-container">
              {displayImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    currentImageIndex === index ? "active" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.productName} - ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="product-details-section">
          {/* Brand and Product Name */}
          <div className="product-header">
           
            <h1 className="product-title">{product.productName}</h1>
          </div>

          {/* Pricing */}
          <div className="pricing-section">
            <div className="price-row">
              <span className="current-price">
                ₹ {finalPrice.toLocaleString("en-IN")}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="original-price">
                    ₹{product.basePricing.toLocaleString("en-IN")}
                  </span>
                  <span className="discount-badge">
                    ({product.discount}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="tax-note">incl. local Tax & Shipping</p>
          </div>

          {/* Short Description */}
          {product.productDescription && (
            <div className="short-description">
              <p>{product.productDescription.split(".")[0]}.</p>
            </div>
          )}

          {/* Size Selection */}
          <div className="size-selection-section">
            <div className="size-selection-header">
              <label className="selection-label">
                Select Size {selectedSize}
              </label>
              <Link to="#" className="size-guide-link">
                Size guide
              </Link>
            </div>
            <div className="size-options">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="color-selection-section">
            <label className="selection-label">
              Select Color {selectedColor || "Gold"}
            </label>
            <div className="color-options">
              {availableColors.map((color, index) => {
                const colorValue =
                  typeof color === "string" && color.startsWith("#")
                    ? color
                    : typeof color === "string"
                    ? getColorValue(color)
                    : "#D4AF37";
                const isSelected =
                  selectedColor === color || (!selectedColor && index === 0);

                return (
                  <button
                    key={index}
                    className={`color-swatch ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: colorValue }}
                    title={
                      typeof color === "string" && !color.startsWith("#")
                        ? color
                        : `Color ${index + 1}`
                    }
                  />
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="wishlist-btn" onClick={handleAddToWishlist}>
              {/* {isInWishlist ? (
                <HeartFilled style={{ color: "#000" }} />
              ) : (
                <HeartOutlined />
              )} */}
              Wishlist
            </button>
            <button
              className="add-to-bag-btn"
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {/* <ShoppingCartOutlined /> */}
              {isInCart ? "ADDED TO BAG" : "Add to Bag"}
            </button>
          </div>

          {/* Product Features */}

          {/* Product Details Tabs */}
          <div className="product-details-tabs">
            <Tabs
              defaultActiveKey="description"
              items={[
                {
                  key: "description",
                  label: isMobile ? "Description" : "Product Description",
                  children: (
                    <div className="tab-content">
                      <div className="product-description-full">
                        {product.productDescription ||
                          "A timeless checkered shirt with button-down front and cuffed sleeves. The muted palette and fine checks make it a wardrobe staple for casual as well as office wear."}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "details",
                  label: isMobile ? "Details" : "Product Details",
                  children: (
                    <div className="tab-content">
                      <div className="product-description">
                        {product.productDescription ||
                          "Premium quality product crafted with attention to detail."}
                      </div>
                      <div className="specifications">
                        <div className="spec-row">
                          <span className="spec-label">Sleeve Length:</span>
                          <span className="spec-value">Short Sleeves</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Fit:</span>
                          <span className="spec-value">Regular Fit</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Length:</span>
                          <span className="spec-value">Regular</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Placket:</span>
                          <span className="spec-value">Button Placket</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Collar:</span>
                          <span className="spec-value">Spread Collar</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Brand Fit Name:</span>
                          <span className="spec-value">Comfort</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Hemline:</span>
                          <span className="spec-value">Curved</span>
                        </div>
                        <div className="spec-row">
                          <span className="spec-label">Placket Length:</span>
                          <span className="spec-value">Full</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: "sizeguide",
                  label: isMobile ? "Delivery" : "Delivery & Return",
                  children: (
                    <div className="tab-content">
                      <div className="features-section">
                        <div className="feature-item">
                          <div className="feature-icon">✓</div>
                          <span>100% Original Products</span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">✓</div>
                          <span>Pay on delivery might be available</span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">✓</div>
                          <span>Exchange available within 7 days of delivery.</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPageDesign;
