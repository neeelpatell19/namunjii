import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  ThunderboltFilled,
  ClockCircleFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Tooltip, Modal, App } from "antd";
import { useNavigate } from "react-router-dom";
import { useCartWishlist } from "../../StoreLogic/Context/CartWishlistContext";
import { useDevice } from "../../../hooks/useDevice";
import cartApi from "../../../apis/cart";
import wishlistApi from "../../../apis/wishlist";
import productApi from "../../../apis/product";
import "./ProductCard.css";

export default function ProductCard({
  product,
  showQuickView = true,
  showAddToCart = true,
  onQuickView,
  onAddToCart,
  // showViewProduct = true,
  onViewProduct,
  className = "",
}) {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "ProductCardPageView");
  }, []);
  const { message, notification } = App.useApp();
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
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [fullProductData, setFullProductData] = useState(null);
  const [isLoadingFullProduct, setIsLoadingFullProduct] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isInWishlist = ctxIsInWishlist(product?._id);
  const isInCart = ctxIsInCart(product?._id);
  const autoPlayRef = useRef(null);
  const imageRef = useRef(null);
  const allImagesRef = useRef([]);

  // Helper function to normalize images (handle both string and array)
  const normalizeImages = (images) => {
    if (!images) return [];
    if (typeof images === "string") return [images];
    if (Array.isArray(images)) return images;
    return [];
  };

  // Memoize image arrays to prevent recreation on every render
  const coverImages = useMemo(
    () => normalizeImages(product?.coverImage),
    [product?.coverImage]
  );
  const otherImages = useMemo(
    () => normalizeImages(product?.otherImages),
    [product?.otherImages]
  );

  // Combine all images for the slider - memoized to ensure stable reference
  const allImages = useMemo(
    () => [...coverImages, ...otherImages],
    [coverImages, otherImages]
  );
  const firstCoverImage = useMemo(() => coverImages[0] || "", [coverImages]);

  // Keep ref updated with latest images
  useEffect(() => {
    allImagesRef.current = allImages;
  }, [allImages]);

  // Detect mobile and tablet screen sizes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      // Include all tablets (iPad Mini, iPad Air, iPad Pro up to 1440px)
      setIsTablet(width > 768 && width <= 1440);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Reset image index when product images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?._id]);

  // Ensure currentImageIndex is always valid
  useEffect(() => {
    if (currentImageIndex >= allImages.length && allImages.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [currentImageIndex, allImages.length]);

  // Update displayed image when index or hover state changes - using direct ref update for immediate effect
  useEffect(() => {
    if (!imageRef.current) return;

    let targetSrc;

    if ((isHovered || isMobile || isTablet) && allImages.length > 1) {
      // Ensure currentImageIndex is within bounds
      const validIndex = Math.max(
        0,
        Math.min(currentImageIndex, allImages.length - 1)
      );
      targetSrc = allImages[validIndex] || firstCoverImage;
    } else {
      targetSrc = firstCoverImage;
    }

    // Only update if the src has actually changed
    const currentSrc = imageRef.current.getAttribute("src");
    if (currentSrc !== targetSrc && targetSrc) {
      // Use direct assignment for instant update without flicker
      imageRef.current.src = targetSrc;
    }
  }, [
    currentImageIndex,
    isHovered,
    isMobile,
    isTablet,
    allImages,
    firstCoverImage,
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateFinalPrice = (basePricing, discount) => {
    if (!basePricing) return 0;
    const discountAmount = discount ? (basePricing * discount) / 100 : 0;
    return Math.round(basePricing - discountAmount);
  };

  // Extract available sizes from products array or direct size property
  const getAvailableSizes = useMemo(() => {
    const sizesSet = new Set();

    // Debug: Log product structure

    // Check if product has a products array (multiple variants)
    if (
      product?.products &&
      Array.isArray(product.products) &&
      product.products.length > 0
    ) {
      product.products.forEach((p) => {
        if (p.size) {
          sizesSet.add(p.size);
        }
      });
    }
    // If no products array, check for direct size property (single variant)
    else if (product?.size) {
      sizesSet.add(product.size);
    }

    // Filter sizes based on isExpressShipping
    let availableSizes = Array.from(sizesSet);

    // console.log('ProductCard - Available sizes before filtering:', availableSizes);

    if (product?.isExpressShipping) {
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

    // console.log('ProductCard - Final available sizes:', availableSizes);

    return availableSizes;
  }, [
    product?.products,
    product?.size,
    product?.isExpressShipping,
    product?._id,
  ]);

  const availableSizes = getAvailableSizes;

  // Get sizes from full product data (used in QuickView)
  const getFullProductSizes = useMemo(() => {
    if (!fullProductData) return [];

    const sizesSet = new Set();

    console.log("Getting sizes from full product:", {
      id: fullProductData?._id,
      hasProducts: !!fullProductData?.products,
      productsLength: fullProductData?.products?.length,
      products: fullProductData?.products,
    });

    // Check if product has a products array (multiple variants)
    if (
      fullProductData?.products &&
      Array.isArray(fullProductData.products) &&
      fullProductData.products.length > 0
    ) {
      fullProductData.products.forEach((p) => {
        if (p.size) {
          sizesSet.add(p.size);
        }
      });
    }
    // If no products array, check for direct size property (single variant)
    else if (fullProductData?.size) {
      sizesSet.add(fullProductData.size);
    }

    let sizes = Array.from(sizesSet);

    if (fullProductData?.isExpressShipping) {
      sizes = sizes.filter((size) => size !== "Free Size");
    }

    // Sort sizes
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
    sizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    console.log("Full product sizes:", sizes);
    return sizes;
  }, [fullProductData]);

  const handleQuickView = async () => {
    setShowQuickViewModal(true);
    setIsLoadingFullProduct(true);

    try {
      // Fetch full product details with all variants
      const response = await productApi.getProductById(product._id);
      console.log("Full product API response:", response);

      // Handle API response structure: { success: true, data: {...} }
      if (response?.success && response?.data) {
        const fullProduct = response.data;
        console.log("Full product with all variants:", {
          id: fullProduct._id,
          name: fullProduct.productName,
          hasProducts: !!fullProduct.products,
          productsLength: fullProduct.products?.length,
          allVariants: fullProduct.products,
        });
        setFullProductData(fullProduct);
      } else {
        console.log("Using fallback product data");
        setFullProductData(product);
      }
    } catch (error) {
      console.error("Error fetching full product:", error);
      setFullProductData(product);
    } finally {
      setIsLoadingFullProduct(false);
    }

    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!deviceId) return;

    // Always show size selection modal if there are available sizes
    if (availableSizes.length > 0) {
      setShowSizeModal(true);
      return;
    }

    // If no sizes available, show message
    message.warning("No sizes available for this product");
  };

  const addToCartWithSize = async (size) => {
    setIsAddingToCart(true);

    if (!deviceId) {
      setIsAddingToCart(false);
      message.error("Device ID not found. Please refresh the page.");
      return;
    }

    if (!size) {
      setIsAddingToCart(false);
      message.warning("Please select a size");
      return;
    }

    try {
      // Use full product data if available (from QuickView), otherwise use regular product
      const productToUse = fullProductData || product;

      // Find the product variant with the selected size
      let productIdToAdd = productToUse._id;
      let colorToAdd = productToUse.color || "";

      console.log("Adding to cart with product:", {
        productToUse,
        size,
        hasProducts: !!productToUse?.products,
        productsLength: productToUse?.products?.length,
      });

      if (
        productToUse?.products &&
        Array.isArray(productToUse.products) &&
        size
      ) {
        const variant = productToUse.products.find((p) => p.size === size);
        console.log("Found variant:", variant);
        if (variant) {
          productIdToAdd = variant._id;
          colorToAdd = variant.color || colorToAdd;
        }
      }

      const cartPayload = {
        deviceId,
        productId: productIdToAdd,
        quantity: 1,
        size: size,
        color: colorToAdd,
      };

      const response = await cartApi.addToCart(cartPayload);

      if (response?.success === true) {
        setIsAddingToCart(false);
        setShowSizeModal(false);
        setSelectedSize("");

        message.success(response.message || "Item added to cart");
        triggerCartDrawer();
        refreshCart();

        if (onAddToCart) {
          onAddToCart(product);
        }
      } else {
        setIsAddingToCart(false);
        const errorMsg =
          response?.message || response?.error || "Failed to add item to cart";
        notification.error({
          message: errorMsg,
          placement: "topRight",
          duration: 5,
        });
      }
    } catch (error) {
      setIsAddingToCart(false);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to add item to cart. Please try again.";
      notification.error({
        message: errorMsg,
        placement: "topRight",
        duration: 5,
      });
    }
  };

  const handleAddToWishlist = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!deviceId) return;

    try {
      if (isInWishlist) {
        // Remove from wishlist if already in wishlist
        const response = await wishlistApi.removeFromWishlist(product._id);
        if (response.success) {
          refreshWishlist();
        }
      } else {
        // Add to wishlist if not in wishlist
        const response = await wishlistApi.addToWishlist({
          deviceId,
          productId: product._id,
        });

        if (response.success) {
          // Trigger wishlist drawer to open
          triggerWishlistDrawer();
          refreshWishlist();
        }
      }
    } catch (error) {
      // Silent fail
    }
  };
  const handleViewProduct = () => {
    if (onViewProduct) {
      onViewProduct(product);
    } else {
      // Navigate to product detail page
      navigate(`/product/${product._id}`);
    }
  };

  // Navigate to next image
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Navigate to previous image
  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  // Navigate to specific image
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Handle mouse enter to start hovering and auto-play
  const handleMouseEnter = () => {
    if (allImages.length > 1) {
      setIsHovered(true);
      // Reset to first image for consistent behavior
      setCurrentImageIndex(0);

      // Preload all images for smooth transitions
      allImages.forEach((imgSrc) => {
        const img = new Image();
        img.src = imgSrc;
      });

      // Transition to second image after 500ms
      setTimeout(() => {
        setCurrentImageIndex(1);
      }, 100);
    }
  };

  // Handle mouse leave to stop hovering and auto-play
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
    // Clear interval immediately
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  // Auto-play effect - slide every 2 seconds when hovering (desktop only)
  useEffect(() => {
    // Clear any existing interval first to prevent multiple intervals
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    // Only start auto-play if hovering, has multiple images, and not on mobile
    if (isHovered && allImages.length > 1 && !isMobile) {
      // Start interval immediately with consistent timing
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const images = allImagesRef.current;
          const nextIndex = prevIndex >= images.length - 1 ? 0 : prevIndex + 1;
          return nextIndex;
        });
      }, 2000); // 2 seconds interval
    }

    // Cleanup function
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isHovered, allImages.length, isMobile]);

  // Check if ANY product variant has stock > 0
  const hasStock = useMemo(() => {
    if (
      product?.products &&
      Array.isArray(product.products) &&
      product.products.length > 0
    ) {
      // Any product with stock > 0
      return product.products.some((p) => p.stock > 0);
    }
    // If no products array, check direct stock property
    return product?.stock > 0;
  }, [product?.products, product?.stock]);

  // membership derived from context; no local fetching here

  return (
    <>
      <div className={`product-card ${className}`}>
        <div
          className="product-card-image-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            ref={imageRef}
            src={firstCoverImage}
            alt={product.productName}
            className="product-card-image"
            loading={!isHovered ? "lazy" : "eager"}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
            onClick={handleViewProduct}
          />
          {/* Fallback for broken images */}
          <div className="product-card-image-fallback">
            <div className="product-card-fallback-icon">👕</div>
            <p>Image not available</p>
          </div>

          {/* Left Arrow - Show on mobile and tablet if there are multiple images */}
          {(isMobile || isTablet) && allImages.length > 1 && (
            <button
              className="product-card-arrow product-card-arrow-left"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
            >
              <RightOutlined />
            </button>
          )}

          {/* Right Arrow - Show on mobile and tablet if there are multiple images */}
          {(isMobile || isTablet) && allImages.length > 1 && (
            <button
              className="product-card-arrow product-card-arrow-right"
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
            >
              <LeftOutlined />
            </button>
          )}

          {/* Order Type Tag - Ready to Ship - Only show if stock > 0 */}
          {hasStock && (
            <div className="product-card-order-tag product-card-order-tag-ready">
              <ThunderboltFilled className="product-card-order-tag-icon" />
              <span className="product-card-order-tag-text">Ready to ship</span>
            </div>
          )}

          {/* Order Type Tag - Made to Order */}
          {/* <div className="product-card-order-tag product-card-order-tag-made">
            <ClockCircleFilled className="product-card-order-tag-icon" />
            <span className="product-card-order-tag-text">Made to order</span>
          </div> */}

          {/* Wishlist and Quick View buttons on image */}
          <div className="product-card-image-actions">
            <button
              className="product-card-wishlist-btn product-card-wishlist-btn-image"
              onClick={(e) => handleAddToWishlist(e)}
            >
              {isInWishlist ? (
                <HeartFilled
                  style={{ color: "#000", outline: "none", border: "none" }}
                />
              ) : (
                <HeartOutlined
                  style={{ outline: "none", border: "none", color: "#333" }}
                />
              )}
            </button>
            {showQuickView && !isMobile && (
              <button
                className="product-card-quick-view-btn-image"
                onClick={(e) => handleQuickView(e)}
              >
                <EyeOutlined />
              </button>
            )}
          </div>
        </div>

        <div className="product-card-content" onClick={handleViewProduct}>
          <div className="product-card-info">
            {product.vendorId?.name && (
              <h3 className="product-card-brandname">
                {product.vendorId.name}
              </h3>
            )}
            <div className="product-card-header">
              <Tooltip
                title={product.productName}
                placement="top"
                overlayInnerStyle={{
                  fontSize: "10px",
                  fontFamily: "var(--fira-sans)",
                  padding: "4px 8px",
                  height: "auto",
                }}
              >
                <h3 className="product-card-name">{product.productName}</h3>
              </Tooltip>
              {/* {showAddToCart && (
                <button
                  className="product-card-cart-btn"
                  onClick={(e) => handleAddToCart(e)}
                >
                  <img
                    src="/shopping-cart.svg"
                    alt="Add to cart"
                    className="product-card-cart-icon"
                  />
                </button>
              )} */}
            </div>
          </div>

          <div className="product-card-pricing">
            <div className="product-card-price-container">
              {product.discount > 0 ? (
                <>
                  <span className="product-card-original-price">
                    {formatPrice(product.basePricing)}
                  </span>
                  <span className="product-card-discounted-price">
                    {formatPrice(
                      calculateFinalPrice(product.basePricing, product.discount)
                    )}
                  </span>
                  <span className="product-card-discount-badge">
                    {product.discount}% OFF
                  </span>
                </>
              ) : (
                <span className="product-card-price">
                  {formatPrice(product.basePricing)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal (rendered via portal to avoid being clipped by sliders) */}
      {showQuickViewModal &&
        ReactDOM.createPortal(
          <div
            className="product-card-modal"
            onClick={() => setShowQuickViewModal(false)}
          >
            <div
              className="product-card-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="product-card-modal-close"
                onClick={() => setShowQuickViewModal(false)}
              >
                ✕
              </button>

              <div className="product-card-modal-wrapper">
                {/* Image Section - LEFT with Gradient */}
                <div className="product-card-modal-image-section">
                  <img
                    src={firstCoverImage}
                    alt={product.productName}
                    className="product-card-modal-image"
                  />

                  {/* Image Carousel Dots */}
                  {coverImages.length > 1 && (
                    <div className="product-card-modal-carousel-dots">
                      {coverImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${product.productName} ${index + 1}`}
                          className={`carousel-dot ${
                            index === 0 ? "active" : ""
                          }`}
                          onClick={() => {
                            const mainImage = document.querySelector(
                              ".product-card-modal-image"
                            );
                            if (mainImage) mainImage.src = image;
                            // Update active dot
                            document
                              .querySelectorAll(".carousel-dot")
                              .forEach((dot, i) => {
                                dot.classList.toggle("active", i === index);
                              });
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Details - RIGHT (White Background) */}
                <div className="product-card-modal-details-white">
                  <p className="brand-name">{product.vendorId.name}</p>

                  <h2>{product.productName}</h2>

                  {/* Price and Rating */}
                  <div className="product-card-modal-price-rating">
                    <div className="product-card-modal-price">
                      {product.discount > 0 ? (
                        <>
                          <span className="discounted-price">
                            {formatPrice(
                              calculateFinalPrice(
                                product.basePricing,
                                product.discount
                              )
                            )}
                          </span>
                          <span className="original-price">
                            {formatPrice(product.basePricing)}
                          </span>
                        </>
                      ) : (
                        <span className="final-price">
                          {formatPrice(product.basePricing)}
                        </span>
                      )}
                    </div>

                    {/* Star Rating */}
                  </div>

                  {/* Description */}
                  {product.productDescription && (
                    <div className="product-card-modal-description-container">
                      <p
                        className={`product-card-modal-description-white ${
                          !isDescriptionExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        {product.productDescription}
                      </p>
                      {product.productDescription.length > 150 && (
                        <button
                          className="description-read-more-btn"
                          onClick={() =>
                            setIsDescriptionExpanded(!isDescriptionExpanded)
                          }
                        >
                          {isDescriptionExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Size Selection in QuickView */}
                  {isLoadingFullProduct ? (
                    <div className="product-card-modal-size-selection">
                      <label className="size-selection-label">
                        Loading sizes...
                      </label>
                    </div>
                  ) : getFullProductSizes.length > 0 ? (
                    <div className="product-card-modal-size-selection">
                      <label className="size-selection-label">
                        Select Size:
                      </label>
                      <div className="product-card-modal-size-options">
                        {getFullProductSizes.map((size) => (
                          <button
                            key={size}
                            className={`product-card-modal-size-btn ${
                              selectedSize === size ? "selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedSize(size);
                              setSizeError("");
                            }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                      {sizeError && (
                        <p className="product-card-size-error">{sizeError}</p>
                      )}
                    </div>
                  ) : null}

                  {/* Action Buttons */}
                  <div className="product-card-modal-actions-white">
                    <button
                      className="product-card-modal-add-to-cart-outline"
                      onClick={() => {
                        if (getFullProductSizes.length > 0 && !selectedSize) {
                          setSizeError("Please select a size");
                          return;
                        }
                        setSizeError("");
                        setShowQuickViewModal(false);
                        if (getFullProductSizes.length > 0) {
                          addToCartWithSize(selectedSize);
                          setSelectedSize("");
                        } else {
                          message.warning(
                            "No sizes available for this product"
                          );
                        }
                      }}
                      disabled={isAddingToCart || isLoadingFullProduct}
                    >
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </button>
                    <button
                      className="product-card-modal-wishlist-icon-btn"
                      onClick={(e) => {
                        handleAddToWishlist(e);
                        setShowQuickViewModal(false);
                      }}
                      title={
                        isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      {isInWishlist ? (
                        <HeartFilled
                          style={{ color: "#dc2626", fontSize: "24px" }}
                        />
                      ) : (
                        <HeartOutlined style={{ fontSize: "24px" }} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Size Selection Modal */}
      <Modal
        open={showSizeModal}
        onCancel={() => {
          setShowSizeModal(false);
          setSelectedSize("");
        }}
        footer={null}
        title="Select Size"
        centered
        width={400}
        className="product-card-size-modal"
      >
        <div className="product-card-size-modal-content">
          <div className="product-card-size-options">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`product-card-size-btn ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="product-card-size-modal-actions">
            <button
              className="product-card-size-modal-cancel"
              onClick={() => {
                setShowSizeModal(false);
                setSelectedSize("");
              }}
            >
              Cancel
            </button>
            <button
              className="product-card-size-modal-add"
              onClick={() => {
                if (selectedSize) {
                  addToCartWithSize(selectedSize);
                }
              }}
              disabled={!selectedSize || isAddingToCart}
              loading={isAddingToCart}
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
