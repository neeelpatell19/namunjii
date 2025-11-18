import React, { useEffect, useState, useRef, useMemo } from "react";
import { Tabs, Alert, Button, Badge, Modal } from "antd";
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
  CloseCircleFilled,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
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
import SizeGuide from "./SizeGuide";
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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [prevPreviewImageIndex, setPrevPreviewImageIndex] = useState(0);
  const [isImageChanging, setIsImageChanging] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [isPreviewDragging, setIsPreviewDragging] = useState(false);
  const [previewDragStart, setPreviewDragStart] = useState({ x: 0, y: 0 });
  const [mainImageZoom, setMainImageZoom] = useState(1);
  const [mainImagePosition, setMainImagePosition] = useState({ x: 0, y: 0 });
  const [isMainImageDragging, setIsMainImageDragging] = useState(false);
  const [mainImageDragStart, setMainImageDragStart] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const previewImageRef = useRef(null);
  const mainImageRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const mouseStartX = useRef(0);
  const mouseEndX = useRef(0);
  const isMouseDown = useRef(false);
  const productImageTouchStartX = useRef(0);
  const productImageTouchEndX = useRef(0);
  const productImageMouseStartX = useRef(0);
  const productImageMouseEndX = useRef(0);
  const isProductImageMouseDown = useRef(false);
  const productImageWasDragged = useRef(false);
  const thumbnailMouseDown = useRef(false);
  const thumbnailMouseStartX = useRef(0);
  const thumbnailScrollLeft = useRef(0);
  const thumbnailWasDragged = useRef(false);
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

  // Extract unique colors and sizes from products array
  const getAvailableOptions = useMemo(() => {
    if (!product?.products || !Array.isArray(product.products)) {
      return { sizes: [], colors: [], colorCodeMap: new Map() };
    }

    const sizesSet = new Set();
    const colorsSet = new Set();
    const colorCodeMap = new Map();

    product.products.forEach((p) => {
      if (p.size) {
        sizesSet.add(p.size);
      }
      if (p.color) {
        colorsSet.add(p.color);
        // Store color code mapping
        if (p.colorCode) {
          colorCodeMap.set(p.color, p.colorCode);
        }
      }
    });

    // Filter sizes based on isExpressShipping
    let availableSizes = Array.from(sizesSet);
    if (product.isExpressShipping) {
      // If express shipping is enabled, exclude "Free Size"
      availableSizes = availableSizes.filter((size) => size !== "Free Size");
    }

    // Sort sizes in a logical order
    const sizeOrder = [
      "XXS",
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
      "2XL",
      "3XL",
      "4XL",
      "Free Size",
    ];
    availableSizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    const availableColors = Array.from(colorsSet);

    return { sizes: availableSizes, colors: availableColors, colorCodeMap };
  }, [product?.products, product?.isExpressShipping]);

  const {
    sizes: availableSizes,
    colors: availableColors,
    colorCodeMap,
  } = getAvailableOptions;

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

      // Always fetch from API to get product with all variants
      // The API response includes the products array with all size/color combinations
      const apiProducts = Array.isArray(state?.products) ? state.products : [];
      console.log("Looking for product ID:", productId);
      console.log("Available products:", apiProducts.length);

      // Fetch from API to get product with all variants
      const response = await productApi.getProductById(productId);

      // Handle the API response structure: { success: true, data: {...} }
      if (response && response.success && response.data) {
        const productData = response.data;
        setProduct(productData);

        // Set initial selected size and color from the current product
        setSelectedSize(productData.size || "");
        setSelectedColor(productData.color || "");

        // Set page title
        document.title = `${productData.productName}${
          productData.vendorId?.name
            ? ` | ${productData.vendorId.name}`
            : " | Namunjii"
        }`;

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
        document.title = `${productData.productName}${
          productData.vendorId?.name
            ? ` | ${productData.vendorId.name}`
            : " | Namunjii"
        }`;

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

  // Find product variant by size and color
  const findProductVariant = (size, color) => {
    if (!product?.products || !Array.isArray(product.products)) {
      return null;
    }

    // Try to find exact match first (both size and color match)
    let variant = product.products.find(
      (p) => p.size === size && p.color === color
    );

    // If no exact match and we have a size, try to find by size with any color
    if (!variant && size) {
      variant = product.products.find((p) => p.size === size);
    }

    // If still no match and we have a color, try to find by color with any size
    if (!variant && color) {
      variant = product.products.find((p) => p.color === color);
    }

    return variant;
  };

  // Handle size selection
  const handleSizeSelect = (size) => {
    if (!product) return;

    // If we have products array, find the matching variant
    if (product.products && Array.isArray(product.products)) {
      // Use current selected color, or fallback to product color, or undefined
      const colorToUse = selectedColor || product.color || undefined;
      const variant = findProductVariant(size, colorToUse);

      if (variant && variant._id !== productId) {
        // Navigate to the variant's URL
        navigate(`/product/${variant._id}`);
        return;
      }
    }

    // If no variant found or no products array, just update selection
    setSelectedSize(size);
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    if (!product) return;

    // If we have products array, find the matching variant
    if (product.products && Array.isArray(product.products)) {
      // Use current selected size, or fallback to product size, or undefined
      const sizeToUse = selectedSize || product.size || undefined;
      const variant = findProductVariant(sizeToUse, color);

      if (variant && variant._id !== productId) {
        // Navigate to the variant's URL
        navigate(`/product/${variant._id}`);
        return;
      }
    }

    // If no variant found or no products array, just update selection
    setSelectedColor(color);
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

  // Helper function to normalize images (handle both string and array)
  const normalizeImages = (images) => {
    if (!images) return [];
    if (typeof images === "string") return [images];
    if (Array.isArray(images)) return images;
    return [];
  };

  const images = normalizeImages(product?.coverImage);
  const otherImages = normalizeImages(product?.otherImages);
  const allImages = [...images, ...otherImages];

  // Fallback image if no images are available
  const fallbackImage =
    "https://images.unsplash.com/photo-1523297467724-f6758d7124c5?q=80&w=1019&auto=format&fit=crop&ixlib=rb-4.1.0";
  const displayImages = allImages.length > 0 ? allImages : [fallbackImage];

  // Keyboard navigation for preview - must be before conditional returns
  useEffect(() => {
    if (!isPreviewOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        const newIndex =
          previewImageIndex > 0
            ? previewImageIndex - 1
            : displayImages.length - 1;
        setPrevPreviewImageIndex(previewImageIndex);
        setIsImageChanging(true);
        setPreviewImageIndex(newIndex);
        setTimeout(() => {
          setIsImageChanging(false);
        }, 300);
      } else if (e.key === "ArrowRight") {
        const newIndex =
          previewImageIndex < displayImages.length - 1
            ? previewImageIndex + 1
            : 0;
        setPrevPreviewImageIndex(previewImageIndex);
        setIsImageChanging(true);
        setPreviewImageIndex(newIndex);
        setTimeout(() => {
          setIsImageChanging(false);
        }, 300);
      } else if (e.key === "Escape") {
        setIsPreviewOpen(false);
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isPreviewOpen, displayImages.length]);

  // Cleanup mouse events on mouse leave - must be before conditional returns
  useEffect(() => {
    const handleMouseLeave = () => {
      isMouseDown.current = false;
      isProductImageMouseDown.current = false;
      thumbnailMouseDown.current = false;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Scroll thumbnail container to show active thumbnail - must be before conditional returns
  useEffect(() => {
    if (thumbnailContainerRef.current && displayImages.length > 4) {
      const thumbnail =
        thumbnailContainerRef.current.children[currentImageIndex];
      if (thumbnail) {
        const container = thumbnailContainerRef.current;
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;

        // Check if thumbnail is not fully visible
        if (thumbnailLeft < scrollLeft) {
          // Thumbnail is to the left, scroll to show it
          container.scrollTo({
            left: thumbnailLeft - 10, // 10px padding
            behavior: "smooth",
          });
        } else if (
          thumbnailLeft + thumbnailWidth >
          scrollLeft + containerWidth
        ) {
          // Thumbnail is to the right, scroll to show it
          container.scrollTo({
            left: thumbnailLeft + thumbnailWidth - containerWidth + 10, // 10px padding
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentImageIndex, displayImages.length]);

  // Reset zoom when image changes - must be before conditional returns
  useEffect(() => {
    setMainImageZoom(1);
    setMainImagePosition({ x: 0, y: 0 });
  }, [currentImageIndex]);

  // Reset preview zoom when image changes - must be before conditional returns
  useEffect(() => {
    if (isPreviewOpen) {
      setPreviewZoom(1);
      setPreviewPosition({ x: 0, y: 0 });
    }
  }, [previewImageIndex, isPreviewOpen]);

  // Skeleton Loading Component
  const ProductSkeleton = () => (
    <div className="modern-product-page">
      {/* Breadcrumbs Skeleton */}
      <div className="product-breadcrumbs">
        <div
          className="skeleton-line"
          style={{ width: "60px", height: "14px" }}
        ></div>
        <span className="breadcrumb-separator">|</span>
        <div
          className="skeleton-line"
          style={{ width: "80px", height: "14px" }}
        ></div>
        <span className="breadcrumb-separator">|</span>
        <div
          className="skeleton-line"
          style={{ width: "200px", height: "14px" }}
        ></div>
      </div>

      <div className="product-page-container">
        {/* Product Images Section Skeleton */}
        <div className="product-images-section">
          <div className="main-image-container">
            <div
              className="skeleton-image"
              style={{ width: "100%", height: "100%", borderRadius: "8px" }}
            ></div>
          </div>
          {/* Thumbnails Skeleton */}
          <div
            className="thumbnail-container"
            style={{ display: "flex", gap: "10px", marginTop: "20px" }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="skeleton-image"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  flexShrink: 0,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Product Details Section Skeleton */}
        <div className="product-details-section">
          {/* Brand and Product Name Skeleton */}
          <div className="product-header">
            <div
              className="skeleton-line"
              style={{ width: "120px", height: "16px", marginBottom: "10px" }}
            ></div>
            <div
              className="skeleton-line skeleton-title"
              style={{ width: "80%", height: "32px", marginBottom: "20px" }}
            ></div>
          </div>

          {/* Pricing Skeleton */}
          <div className="pricing-section">
            <div
              className="skeleton-line"
              style={{ width: "150px", height: "36px", marginBottom: "8px" }}
            ></div>
            <div
              className="skeleton-line"
              style={{ width: "120px", height: "14px" }}
            ></div>
          </div>

          {/* Description Skeleton */}
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            <div
              className="skeleton-line"
              style={{ width: "100%", height: "16px", marginBottom: "8px" }}
            ></div>
            <div
              className="skeleton-line"
              style={{ width: "90%", height: "16px", marginBottom: "8px" }}
            ></div>
            <div
              className="skeleton-line"
              style={{ width: "70%", height: "16px" }}
            ></div>
          </div>

          {/* Size Selection Skeleton */}
          <div className="size-selection-section">
            <div className="size-selection-header">
              <div
                className="skeleton-line"
                style={{ width: "100px", height: "18px" }}
              ></div>
              <div
                className="skeleton-line"
                style={{ width: "80px", height: "14px" }}
              ></div>
            </div>
            <div
              className="size-options"
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "12px",
                flexWrap: "wrap",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="skeleton-line"
                  style={{ width: "50px", height: "40px", borderRadius: "4px" }}
                ></div>
              ))}
            </div>
          </div>

          {/* Color Selection Skeleton */}
          <div
            className="color-selection-section"
            style={{ marginTop: "24px" }}
          >
            <div
              className="skeleton-line"
              style={{ width: "100px", height: "18px", marginBottom: "12px" }}
            ></div>
            <div style={{ display: "flex", gap: "12px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton-line"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                ></div>
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div
            className="action-buttons"
            style={{ marginTop: "30px", display: "flex", gap: "12px" }}
          >
            <div
              className="skeleton-line"
              style={{ width: "120px", height: "48px", borderRadius: "4px" }}
            ></div>
            <div
              className="skeleton-line"
              style={{ width: "150px", height: "48px", borderRadius: "4px" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <ProductSkeleton />;
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
    setMainImageZoom(1);
    setMainImagePosition({ x: 0, y: 0 });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < displayImages.length - 1 ? prev + 1 : 0
    );
    setMainImageZoom(1);
    setMainImagePosition({ x: 0, y: 0 });
  };

  // Preview functions
  const openPreview = (index) => {
    setPreviewImageIndex(index);
    setIsPreviewOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewZoom(1);
    setPreviewPosition({ x: 0, y: 0 });
    document.body.style.overflow = "";
  };

  // Preview zoom handlers
  const handlePreviewZoomIn = (e) => {
    e.stopPropagation();
    setPreviewZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handlePreviewZoomOut = (e) => {
    e.stopPropagation();
    setPreviewZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setPreviewPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handlePreviewZoomReset = (e) => {
    e.stopPropagation();
    setPreviewZoom(1);
    setPreviewPosition({ x: 0, y: 0 });
  };

  const handlePreviewImageMouseDown = (e) => {
    if (previewZoom > 1) {
      setIsPreviewDragging(true);
      setPreviewDragStart({
        x: e.clientX - previewPosition.x,
        y: e.clientY - previewPosition.y,
      });
      e.preventDefault();
    }
  };

  const handlePreviewImageMouseMove = (e) => {
    if (isPreviewDragging && previewZoom > 1) {
      setPreviewPosition({
        x: e.clientX - previewDragStart.x,
        y: e.clientY - previewDragStart.y,
      });
    }
  };

  const handlePreviewImageMouseUp = () => {
    setIsPreviewDragging(false);
  };

  const handlePreviewImageWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setPreviewZoom((prev) => {
        const newZoom = Math.max(1, Math.min(3, prev + delta));
        if (newZoom === 1) {
          setPreviewPosition({ x: 0, y: 0 });
        }
        return newZoom;
      });
    }
  };

  // Main image zoom handlers
  const handleMainImageZoomIn = () => {
    setMainImageZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleMainImageZoomOut = () => {
    setMainImageZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setMainImagePosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };

  const handleMainImageZoomReset = () => {
    setMainImageZoom(1);
    setMainImagePosition({ x: 0, y: 0 });
  };

  const handleMainImageMouseDown = (e) => {
    if (mainImageZoom > 1) {
      setIsMainImageDragging(true);
      setMainImageDragStart({
        x: e.clientX - mainImagePosition.x,
        y: e.clientY - mainImagePosition.y,
      });
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMainImageMouseMove = (e) => {
    if (isMainImageDragging && mainImageZoom > 1) {
      setMainImagePosition({
        x: e.clientX - mainImageDragStart.x,
        y: e.clientY - mainImageDragStart.y,
      });
    }
  };

  const handleMainImageMouseUp = () => {
    setIsMainImageDragging(false);
  };

  const handleMainImageWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setMainImageZoom((prev) => {
        const newZoom = Math.max(1, Math.min(3, prev + delta));
        if (newZoom === 1) {
          setMainImagePosition({ x: 0, y: 0 });
        }
        return newZoom;
      });
    }
  };

  const handlePreviewPrev = (e) => {
    e.stopPropagation();
    // Reset mouse state to prevent interference from swipe handlers
    isMouseDown.current = false;
    mouseStartX.current = 0;
    mouseEndX.current = 0;
    const newIndex =
      previewImageIndex > 0 ? previewImageIndex - 1 : displayImages.length - 1;
    setPrevPreviewImageIndex(previewImageIndex);
    setIsImageChanging(true);
    setPreviewImageIndex(newIndex);
    setPreviewZoom(1);
    setPreviewPosition({ x: 0, y: 0 });
    setTimeout(() => {
      setIsImageChanging(false);
    }, 300);
  };

  const handlePreviewNext = (e) => {
    e.stopPropagation();
    // Reset mouse state to prevent interference from swipe handlers
    isMouseDown.current = false;
    mouseStartX.current = 0;
    mouseEndX.current = 0;
    const newIndex =
      previewImageIndex < displayImages.length - 1 ? previewImageIndex + 1 : 0;
    setPrevPreviewImageIndex(previewImageIndex);
    setIsImageChanging(true);
    setPreviewImageIndex(newIndex);
    setPreviewZoom(1);
    setPreviewPosition({ x: 0, y: 0 });
    setTimeout(() => {
      setIsImageChanging(false);
    }, 300);
  };

  // Swipe handlers for preview (touch)
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next image
      const newIndex =
        previewImageIndex < displayImages.length - 1
          ? previewImageIndex + 1
          : 0;
      setPrevPreviewImageIndex(previewImageIndex);
      setIsImageChanging(true);
      setPreviewImageIndex(newIndex);
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous image
      const newIndex =
        previewImageIndex > 0
          ? previewImageIndex - 1
          : displayImages.length - 1;
      setPrevPreviewImageIndex(previewImageIndex);
      setIsImageChanging(true);
      setPreviewImageIndex(newIndex);
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Swipe handlers for preview (mouse) - only when not zoomed
  const handleMouseDown = (e) => {
    // Ignore if clicking on a button or inside a button
    if (e.target.closest('button')) {
      isMouseDown.current = false;
      mouseStartX.current = 0;
      mouseEndX.current = 0;
      return;
    }
    if (previewZoom <= 1) {
      isMouseDown.current = true;
      mouseStartX.current = e.clientX;
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    // Ignore if interacting with a button
    if (e.target.closest('button')) {
      return;
    }
    if (!isMouseDown.current || previewZoom > 1) return;
    mouseEndX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    // Ignore if clicking on a button or inside a button
    if (e.target.closest('button')) {
      isMouseDown.current = false;
      mouseStartX.current = 0;
      mouseEndX.current = 0;
      return;
    }
    if (!isMouseDown.current || previewZoom > 1) return;

    const distance = mouseStartX.current - mouseEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next image
      const newIndex =
        previewImageIndex < displayImages.length - 1
          ? previewImageIndex + 1
          : 0;
      setPrevPreviewImageIndex(previewImageIndex);
      setIsImageChanging(true);
      setPreviewImageIndex(newIndex);
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous image
      const newIndex =
        previewImageIndex > 0
          ? previewImageIndex - 1
          : displayImages.length - 1;
      setPrevPreviewImageIndex(previewImageIndex);
      setIsImageChanging(true);
      setPreviewImageIndex(newIndex);
      setTimeout(() => {
        setIsImageChanging(false);
      }, 300);
    }

    isMouseDown.current = false;
    mouseStartX.current = 0;
    mouseEndX.current = 0;
  };

  // Swipe handlers for product image (touch)
  const handleProductImageTouchStart = (e) => {
    if (displayImages.length <= 1) return;
    productImageTouchStartX.current = e.touches[0].clientX;
    productImageTouchEndX.current = e.touches[0].clientX;
  };

  const handleProductImageTouchMove = (e) => {
    if (!productImageTouchStartX.current || displayImages.length <= 1) return;
    productImageTouchEndX.current = e.touches[0].clientX;
  };

  const handleProductImageTouchEnd = (e) => {
    if (displayImages.length <= 1) {
      productImageTouchStartX.current = 0;
      productImageTouchEndX.current = 0;
      return;
    }

    if (!productImageTouchStartX.current || !productImageTouchEndX.current) {
      productImageTouchStartX.current = 0;
      productImageTouchEndX.current = 0;
      return;
    }

    const distance =
      productImageTouchStartX.current - productImageTouchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swipe left - next image
      e.preventDefault();
      e.stopPropagation();
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous image
      e.preventDefault();
      e.stopPropagation();
      handlePrevImage();
    }

    productImageTouchStartX.current = 0;
    productImageTouchEndX.current = 0;
  };

  // Swipe handlers for product image (mouse)
  const handleProductImageMouseDown = (e) => {
    // Prevent default image drag behavior
    e.preventDefault();
    e.stopPropagation();

    isProductImageMouseDown.current = true;
    productImageWasDragged.current = false;
    productImageMouseStartX.current = e.clientX;
    productImageMouseEndX.current = e.clientX;
  };

  const handleProductImageMouseMove = (e) => {
    if (!isProductImageMouseDown.current) return;
    productImageMouseEndX.current = e.clientX;
    const distance = Math.abs(
      productImageMouseStartX.current - productImageMouseEndX.current
    );
    if (distance > 10) {
      productImageWasDragged.current = true;
    }
  };

  const handleProductImageMouseUp = (e) => {
    if (!isProductImageMouseDown.current) return;

    const distance =
      productImageMouseStartX.current - productImageMouseEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      // Prevent click if there was a drag
      e.preventDefault();
      e.stopPropagation();

      if (distance > minSwipeDistance) {
        // Swipe left - next image
        handleNextImage();
      } else if (distance < -minSwipeDistance) {
        // Swipe right - previous image
        handlePrevImage();
      }
    }

    isProductImageMouseDown.current = false;
    productImageMouseStartX.current = 0;
    productImageMouseEndX.current = 0;
  };

  const handleProductImageClick = (e) => {
    // Only open preview if there was no drag
    if (!productImageWasDragged.current) {
      openPreview(currentImageIndex);
    }
    productImageWasDragged.current = false;
  };

  // Thumbnail mouse handlers - defined before mouseDown to avoid reference error
  const handleThumbnailMouseMove = (e) => {
    if (!thumbnailMouseDown.current || !thumbnailContainerRef.current) return;

    const x = e.clientX;
    const distance = thumbnailMouseStartX.current - x;

    // Mark as dragged if moved more than 5px
    if (Math.abs(distance) > 5) {
      thumbnailWasDragged.current = true;
    }

    // Scroll the container - update scrollLeft based on initial position + distance
    const walk = distance * 1.5; // Scroll speed multiplier
    const newScrollLeft = thumbnailScrollLeft.current + walk;
    thumbnailContainerRef.current.scrollLeft = newScrollLeft;

    e.preventDefault();
    e.stopPropagation();
  };

  const handleThumbnailMouseUp = (e) => {
    if (!thumbnailMouseDown.current) return;

    thumbnailMouseDown.current = false;

    // Remove global listeners
    document.removeEventListener("mousemove", handleThumbnailMouseMove);
    document.removeEventListener("mouseup", handleThumbnailMouseUp);

    // Reset drag flag after a short delay to allow click detection
    setTimeout(() => {
      thumbnailWasDragged.current = false;
    }, 50);
  };

  // Thumbnail drag handlers for desktop and touch
  const handleThumbnailMouseDown = (e) => {
    if (!thumbnailContainerRef.current) return;

    // Prevent default image drag behavior
    e.preventDefault();
    e.stopPropagation();

    thumbnailMouseDown.current = true;
    thumbnailWasDragged.current = false;
    thumbnailMouseStartX.current = e.clientX;
    thumbnailScrollLeft.current = thumbnailContainerRef.current.scrollLeft;

    // Add global mouse move and up listeners
    document.addEventListener("mousemove", handleThumbnailMouseMove, {
      passive: false,
    });
    document.addEventListener("mouseup", handleThumbnailMouseUp);
  };

  // Thumbnail touch handlers for mobile swipe
  const handleThumbnailTouchStart = (e) => {
    if (!thumbnailContainerRef.current) return;
    thumbnailMouseDown.current = true;
    thumbnailWasDragged.current = false;
    thumbnailMouseStartX.current = e.touches[0].clientX;
    thumbnailScrollLeft.current = thumbnailContainerRef.current.scrollLeft;
  };

  const handleThumbnailTouchMove = (e) => {
    if (!thumbnailMouseDown.current || !thumbnailContainerRef.current) return;

    const x = e.touches[0].clientX;
    const distance = thumbnailMouseStartX.current - x;

    // Mark as dragged if moved more than 5px
    if (Math.abs(distance) > 5) {
      thumbnailWasDragged.current = true;
    }

    // Scroll the container - update scrollLeft based on initial position + distance
    const walk = distance * 1.5; // Scroll speed multiplier
    const newScrollLeft = thumbnailScrollLeft.current + walk;
    thumbnailContainerRef.current.scrollLeft = newScrollLeft;

    e.preventDefault();
    e.stopPropagation();
  };

  const handleThumbnailTouchEnd = (e) => {
    if (!thumbnailMouseDown.current) return;

    thumbnailMouseDown.current = false;

    // Reset drag flag after a short delay to allow click detection
    setTimeout(() => {
      thumbnailWasDragged.current = false;
    }, 50);
  };

  return (
    <div className="modern-product-page">
      {/* Breadcrumbs */}
      <div className="product-breadcrumbs">
        <Link to="/">HOME</Link>
        <span className="breadcrumb-separator">|</span>
        <Link to="/products">SHOP ALL</Link>
        <span className="breadcrumb-separator">|</span>
        <span className="breadcrumb-current">{product.productName}</span>
      </div>

      <div className="product-page-container">
        {/* Product Images Section */}
        <div className="product-images-section">
          <div className="main-image-container">
            {displayImages.length > 0 ? (
              <>
                {displayImages.length > 1 && (
                  <>
                    <button
                      className="image-nav-btn prev-btn"
                      onClick={handlePrevImage}
                    >
                      <img
                        className="left-btn"
                        src="/icons/next-btn.svg"
                        alt=""
                      />
                    </button>
                    <button
                      className="image-nav-btn next-btn"
                      onClick={handleNextImage}
                    >
                      <img
                        className="right-btn"
                        src="/icons/next-btn.svg"
                        alt=""
                      />
                    </button>
                    <div className="image-counter">
                      {currentImageIndex + 1}/{displayImages.length}
                    </div>
                  </>
                )}
                {/* Zoom Controls */}
                <div className="main-image-zoom-controls">
                  <button
                    className="zoom-btn"
                    onClick={handleMainImageZoomIn}
                    title="Zoom In"
                  >
                    <ZoomInOutlined />
                  </button>
                  <button
                    className="zoom-btn"
                    onClick={handleMainImageZoomOut}
                    title="Zoom Out"
                    disabled={mainImageZoom <= 1}
                  >
                    <ZoomOutOutlined />
                  </button>
                  {mainImageZoom > 1 && (
                    <button
                      className="zoom-btn"
                      onClick={handleMainImageZoomReset}
                      title="Reset Zoom"
                    >
                      <ReloadOutlined />
                    </button>
                  )}
                </div>
                <div
                  className="main-image-wrapper"
                  style={{
                    overflow: mainImageZoom > 1 ? "hidden" : "visible",
                    cursor: mainImageZoom > 1 ? "move" : "grab",
                  }}
                  onMouseDown={(e) => {
                    handleMainImageMouseDown(e);
                    if (mainImageZoom <= 1) {
                      handleProductImageMouseDown(e);
                    }
                  }}
                  onMouseMove={(e) => {
                    handleMainImageMouseMove(e);
                    if (mainImageZoom <= 1) {
                      handleProductImageMouseMove(e);
                    }
                  }}
                  onMouseUp={(e) => {
                    handleMainImageMouseUp();
                    if (mainImageZoom <= 1) {
                      handleProductImageMouseUp(e);
                    }
                  }}
                  onMouseLeave={(e) => {
                    handleMainImageMouseUp();
                    if (mainImageZoom <= 1) {
                      handleProductImageMouseUp(e);
                    }
                  }}
                  onWheel={handleMainImageWheel}
                >
                  <img
                    ref={mainImageRef}
                    src={displayImages[currentImageIndex]}
                    alt={product.productName}
                    className="main-product-image"
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
                    onClick={(e) => {
                      if (mainImageZoom <= 1) {
                        handleProductImageClick(e);
                      }
                    }}
                    onTouchStart={handleProductImageTouchStart}
                    onTouchMove={handleProductImageTouchMove}
                    onTouchEnd={handleProductImageTouchEnd}
                    style={{
                      transform: `scale(${mainImageZoom}) translate(${
                        mainImagePosition.x / mainImageZoom
                      }px, ${mainImagePosition.y / mainImageZoom}px)`,
                      transformOrigin: "center center",
                      transition:
                        mainImageZoom === 1 ? "transform 0.3s ease" : "none",
                      touchAction: "none",
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="no-image-placeholder">
                <div className="placeholder-icon">📷</div>
                <p>No image available</p>
              </div>
            )}
          </div>

          {displayImages.length > 1 && (
            <div
              className="thumbnail-container"
              ref={thumbnailContainerRef}
              onMouseDown={handleThumbnailMouseDown}
              onTouchStart={handleThumbnailTouchStart}
              onTouchMove={handleThumbnailTouchMove}
              onTouchEnd={handleThumbnailTouchEnd}
            >
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${
                    currentImageIndex === index ? "active" : ""
                  }`}
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => {
                    // Only change image if there was no drag
                    if (!thumbnailWasDragged.current) {
                      setCurrentImageIndex(index);
                    }
                    // Reset immediately after click
                    setTimeout(() => {
                      thumbnailWasDragged.current = false;
                    }, 10);
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.productName} - ${index + 1}`}
                    draggable="false"
                    onDragStart={(e) => e.preventDefault()}
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
            {product.vendorId?.name && (
              <div className="brand-name">{product.vendorId.name}</div>
            )}
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
            <p className="tax-note">Inclusive of all taxes.</p>
          </div>

          {/* Short Description */}
          {product.productDescription && (
            <div className="short-description">
              <p>{product.productDescription.split(".")[0]}.</p>
            </div>
          )}

          {/* Size Selection */}
          <div className="size-selection-section">
            {availableSizes.length > 0 && (
              <>
                <div className="size-selection-header">
                  <label className="selection-label">Select Size</label>
                  <button
                    type="button"
                    className="size-guide-link"
                    onClick={() => setIsSizeGuideOpen(true)}
                  >
                    Size guide
                  </button>
                </div>
                <div className="size-options">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Color Selection - Only show if there are multiple colors */}
          <div className="color-selection-section">
            {availableColors.length > 1 && (
              <>
                <label className="selection-label">Select Color</label>
                <div className="color-options">
                  {availableColors.map((color, index) => {
                    // Get color code from map or use default
                    const colorCode = colorCodeMap?.get(color) || color;
                    const colorValue =
                      typeof colorCode === "string" && colorCode.startsWith("#")
                        ? colorCode
                        : typeof color === "string"
                        ? getColorValue(color)
                        : "#D4AF37";
                    const isSelected = selectedColor === color;

                    return (
                      <button
                        key={index}
                        className={`color-swatch ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => handleColorSelect(color)}
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
              </>
            )}
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
              {isInCart ? "Added To Bag" : "Add to Bag"}
            </button>
          </div>

          {/* Product Features */}

          {/* Delivery Information */}
          <div className="delivery-info-section">
            <div className="delivery-info-item">
              <img
                src="/fast-delivery-icon.svg"
                alt="Fast delivery"
                className="delivery-icon"
              />
              <span className="delivery-text">
                Ready to ship items are expected to arrive within{" "}
                <strong>5–7 business days</strong>.
              </span>
            </div>
            <div className="delivery-info-item">
              <img
                src="/made-to-order-icon.svg"
                alt="Made to order"
                className="delivery-icon"
              />
              <span>
                {product?.vendorId?.name === "Flapper6" ||
                product?.vendorId?.name === "Demira" ? (
                  <>
                    Made to order items are dispatched within{" "}
                    <strong>15 to 20 business days</strong>, as there are
                    hand-embroidered pieces.
                  </>
                ) : (
                  <>
                    Made to order items are dispatched within{" "}
                    <strong>10 business days</strong>.
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="product-details-tabs">
            <Tabs
              defaultActiveKey="details"
              items={[
                // {
                //   key: "details",
                //   label: "Product Details",
                //   children: (
                //     <div className="tab-content">
                //       <div className="specifications">
                //         <div className="spec-row">
                //           <span className="spec-label">Sleeve Length:</span>
                //           <span className="spec-value">Short Sleeves</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Fit:</span>
                //           <span className="spec-value">Regular Fit</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Length:</span>
                //           <span className="spec-value">Regular</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Placket:</span>
                //           <span className="spec-value">Button Placket</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Collar:</span>
                //           <span className="spec-value">Spread Collar</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Brand Fit Name:</span>
                //           <span className="spec-value">Comfort</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Hemline:</span>
                //           <span className="spec-value">Curved</span>
                //         </div>
                //         <div className="spec-row">
                //           <span className="spec-label">Placket Length:</span>
                //           <span className="spec-value">Full</span>
                //         </div>
                //       </div>
                //     </div>
                //   ),
                // },
                {
                  key: "sizeguide",
                  label: "Delivery & Return",
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
                          <span>
                            Exchange available within 7 days of delivery.
                          </span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">✓</div>
                          <span>
                            Ready to ship items are expected to arrive within{" "}
                            <strong>5–7 business days</strong>.
                          </span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">✓</div>
                          <span>
                            {product?.vendorId?.name === "Flapper6" ||
                            product?.vendorId?.name === "Demira" ? (
                              <>
                                Made to order items are dispatched within{" "}
                                <strong>15 to 20 business days</strong>, as
                                there are hand-embroidered pieces.
                              </>
                            ) : (
                              <>
                                Made to order items are dispatched within{" "}
                                <strong>10 business days</strong>.
                              </>
                            )}
                          </span>
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

      {/* Custom Image Preview Modal */}
      {isPreviewOpen && (
        <div
          className="custom-image-preview"
          onClick={closePreview}
          ref={previewRef}
        >
          <div
            className="preview-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Top bar with close and counter */}
            <div className="preview-top-bar">
              {displayImages.length > 1 && (
                <div className="preview-counter">
                  {previewImageIndex + 1} / {displayImages.length}
                </div>
              )}
              {/* Zoom Controls */}
              <div className="preview-zoom-controls">
                <button
                  className="preview-zoom-btn"
                  onClick={handlePreviewZoomIn}
                  title="Zoom In"
                >
                  <ZoomInOutlined />
                </button>
                <button
                  className="preview-zoom-btn"
                  onClick={handlePreviewZoomOut}
                  title="Zoom Out"
                  disabled={previewZoom <= 1}
                >
                  <ZoomOutOutlined />
                </button>
                {previewZoom > 1 && (
                  <button
                    className="preview-zoom-btn"
                    onClick={handlePreviewZoomReset}
                    title="Reset Zoom"
                  >
                    <ReloadOutlined />
                  </button>
                )}
              </div>
              <button
                className="preview-close"
                onClick={closePreview}
                aria-label="Close preview"
              >
                <CloseCircleFilled />
              </button>
            </div>

            {/* Navigation arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  className="preview-nav preview-prev"
                  onClick={handlePreviewPrev}
                  aria-label="Previous image"
                >
                  <LeftOutlined />
                </button>
                <button
                  className="preview-nav preview-next"
                  onClick={handlePreviewNext}
                  aria-label="Next image"
                >
                  <RightOutlined />
                </button>
              </>
            )}

            {/* Centered image */}
            <div
              className="preview-image-container"
              style={{
                overflow: previewZoom > 1 ? "hidden" : "visible",
                cursor: previewZoom > 1 ? "move" : "default",
              }}
              onMouseDown={handlePreviewImageMouseDown}
              onMouseMove={handlePreviewImageMouseMove}
              onMouseUp={handlePreviewImageMouseUp}
              onMouseLeave={handlePreviewImageMouseUp}
              onWheel={handlePreviewImageWheel}
            >
              {isImageChanging && (
                <img
                  src={displayImages[prevPreviewImageIndex]}
                  alt={`${product.productName} - ${prevPreviewImageIndex + 1}`}
                  className="preview-image preview-image-old"
                />
              )}
              <img
                ref={previewImageRef}
                src={displayImages[previewImageIndex]}
                alt={`${product.productName} - ${previewImageIndex + 1}`}
                className={`preview-image preview-image-new ${
                  isImageChanging ? "fading-in" : ""
                }`}
                style={{
                  transform: `scale(${previewZoom}) translate(${
                    previewPosition.x / previewZoom
                  }px, ${previewPosition.y / previewZoom}px)`,
                  transformOrigin: "center center",
                  transition:
                    previewZoom === 1 ? "transform 0.3s ease" : "none",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <Modal
        open={isSizeGuideOpen}
        onCancel={() => setIsSizeGuideOpen(false)}
        footer={null}
        width={isMobile ? "95%" : 1200}
        className="size-guide-modal"
        centered
        title="Size Guide"
      >
        <SizeGuide gender={product?.gender} />
      </Modal>
    </div>
  );
};

export default SingleProductPageDesign;
