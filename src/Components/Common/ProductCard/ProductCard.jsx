import React from "react";
import "./ProductCard.css";

export default function ProductCard({
  product,
  showQuickView = true,
  showAddToCart = true,
  onQuickView,
  onAddToCart,
  className = "",
}) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuickView = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
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
              Quick View
            </button>
          </div>
        )}
      </div>

      <div className="product-card-content">
        <div className="product-card-info">
          <h3 className="product-card-name">{product.productName}</h3>
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
                  {formatPrice(product.finalPrice)}
                </span>
                <span className="product-card-discount-badge">
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span className="product-card-price">
                {formatPrice(product.finalPrice)}
              </span>
            )}
          </div>

          {showAddToCart && (
            <button
              className="product-card-add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
