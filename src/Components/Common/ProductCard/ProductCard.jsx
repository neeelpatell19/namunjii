import React, { useState } from "react";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
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
  showViewProduct = true,
  
  onViewProduct,
  className = "",
 

 
  
}) {
  const navigate = useNavigate();
  const { deviceId } = useDevice();
  const { triggerCartDrawer, triggerWishlistDrawer } = useCartWishlist();
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);

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
      const response = await wishlistApi.addToWishlist({
        deviceId,
        productId: product._id,
      });

      if (response.success) {
        // Trigger wishlist drawer to open
        triggerWishlistDrawer();
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
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


  return (
    <>
      <div className={`product-card ${className}`}>
        <div className="product-card-image-container">
          <img
            src={product.coverImage[0]}
            alt={product.productName}
            className="product-card-image"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          {/* Fallback for broken images */}
          <div className="product-card-image-fallback">
            <div className="product-card-fallback-icon">👕</div>
            <p>Image not available</p>
          </div>

          {/* Quick view button */}
          {showQuickView && (
            <div className="product-card-overlay">
              <button
                className="product-card-quick-view-btn"
                onClick={handleQuickView}
              >
                <span><img src="/icons/mingcute_eye-line.svg" alt="eye" /></span>
                Quick View
              </button>
            </div>
          )}
        </div>

        <div className="product-card-content" onClick={handleViewProduct}>
          <div className="product-card-info">
            <div className="product-card-header">
              <h3 className="product-card-name">{product.productName}</h3>
              <button
                className="product-card-wishlist-btn"
                onClick={(e) => handleAddToWishlist(e)}
              >
                <HeartOutlined />
              </button>
            </div>
            <div className="product-card-details">
              <span className="product-card-size">Size: {product.size}</span>
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

            <div className="product-card-action-buttons">
              {showAddToCart && (
                <div 
                  className="product-card-add-to-cart-container"
                  onClick={handleAddToCart}
                >
                  <span className="product-card-add-to-cart-btn"
                  >
                    Add to Cart
                  </span>
                  <span className="product-card-add-to-cart-arrow" onClick={(e) => e.stopPropagation()}>
                    <img src="/icons/Arrow.svg" alt="arrow" />
                  </span>
                </div>
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
          <div className="product-card-modal-content">
            <button
              className="product-card-modal-close"
              onClick={() => setShowQuickViewModal(false)}
            >
              ✕
            </button>
            <img 
              src={product.coverImage[0]} 
              alt={product.productName}
              className="product-card-modal-image"
            />
          </div>
        </div>
      )}
    </>
  );
}
