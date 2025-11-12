import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  ThunderboltFilled,
  ClockCircleFilled,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useCartWishlist } from "../../StoreLogic/Context/CartWishlistContext";
import { useDevice } from "../../../hooks/useDevice";
import cartApi from "../../../apis/cart";
import wishlistApi from "../../../apis/wishlist";
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
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
    if (imageRef.current) {
      let targetSrc;

      if ((isHovered || isMobile) && allImages.length > 1) {
        targetSrc = allImages[currentImageIndex] || firstCoverImage;
      } else {
        targetSrc = firstCoverImage;
      }

      // Only update if the src has actually changed (compare the path, not full URL)
      const currentSrc = imageRef.current.getAttribute("src");
      if (currentSrc !== targetSrc && targetSrc) {
        imageRef.current.src = targetSrc;
      }
    }
  }, [currentImageIndex, isHovered, isMobile, allImages, firstCoverImage]);

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

  const handleQuickView = () => {
    setShowQuickViewModal(true);
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!deviceId) return;

    try {
      const response = await cartApi.addToCart({
        deviceId,
        productId: product._id,
        quantity: 1,
      });

      if (response.success) {
        // Trigger cart drawer to open
        triggerCartDrawer();
        refreshCart();

        // Call custom onAddToCart if provided
        if (onAddToCart) {
          onAddToCart(product);
        }
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
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
      console.error("Failed to update wishlist:", error);
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
      // Show second image immediately on hover
      setCurrentImageIndex(1);

      // Preload all images for smooth transitions
      allImages.forEach((imgSrc) => {
        const img = new Image();
        img.src = imgSrc;
      });
    }
  };

  // Handle mouse leave to stop hovering and auto-play
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  // Auto-play effect - slide every 1.5 seconds when hovering (desktop only)
  useEffect(() => {
    // Clear any existing interval first to prevent multiple intervals
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    // Only start auto-play if hovering, has multiple images, and not on mobile
    if (isHovered && allImages.length > 1 && !isMobile) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const images = allImagesRef.current;
          return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        });
      }, 1500);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isHovered, allImages.length, isMobile]);

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

          {/* Left Arrow - Show on hover (desktop) or always (mobile) if there are multiple images */}
          {(isHovered || isMobile) && allImages.length > 1 && (
            <button
              className="product-card-arrow product-card-arrow-left"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
            >
              <LeftOutlined />
            </button>
          )}

          {/* Right Arrow - Show on hover (desktop) or always (mobile) if there are multiple images */}
          {(isHovered || isMobile) && allImages.length > 1 && (
            <button
              className="product-card-arrow product-card-arrow-right"
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
            >
              <RightOutlined />
            </button>
          )}

          {/* Order Type Tag - Ready to Ship */}
          <div className="product-card-order-tag product-card-order-tag-ready">
            <ThunderboltFilled className="product-card-order-tag-icon" />
            <span className="product-card-order-tag-text">Ready to ship</span>
          </div>

          {/* Order Type Tag - Made to Order */}
          <div className="product-card-order-tag product-card-order-tag-made">
            <ClockCircleFilled className="product-card-order-tag-icon" />
            <span className="product-card-order-tag-text">Made to order</span>
          </div>

          {/* Wishlist and Quick View buttons on image */}
          <div className="product-card-image-actions">
            <button
              className="product-card-wishlist-btn product-card-wishlist-btn-image"
              onClick={(e) => handleAddToWishlist(e)}
            >
              {isInWishlist ? (
                <HeartFilled style={{ color: "#000" }} />
              ) : (
                <HeartOutlined />
              )}
            </button>
            {showQuickView && (
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
              {showAddToCart && (
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
              )}
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

      {/* Quick View Modal */}
      {showQuickViewModal && (
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
                  <p className="product-card-modal-description-white">
                    {product.productDescription}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="product-card-modal-actions-white">
                  <button
                    className="product-card-modal-add-to-cart-outline"
                    onClick={() => {
                      handleAddToCart({ stopPropagation: () => {} });
                      setShowQuickViewModal(false);
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="product-card-modal-wishlist-icon-btn"
                    onClick={(e) => {
                      handleAddToWishlist(e);
                      setShowQuickViewModal(false);
                    }}
                    title={
                      isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
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
        </div>
      )}
    </>
  );
}
