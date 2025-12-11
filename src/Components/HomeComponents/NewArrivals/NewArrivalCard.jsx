import React from "react";
import { useDevice } from "../../../hooks/useDevice";
import { useCartWishlist } from "../../StoreLogic/Context/CartWishlistContext";
import cartApi from "../../../apis/cart";
import "./NewArrivalCard.css";

export default function NewArrivalCard({ product, isMobile = false }) {
  const { deviceId } = useDevice();
  const { triggerCartDrawer, refreshCart } = useCartWishlist();

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
        // ✅ Meta Pixel AddToCart event
        if (window.fbq) {
          const price = productToUse?.salePrice || productToUse?.price || 0;
          console.log(
            "Triggering FB Pixel NewArrival AddToCart event for product:"
          );

          window.fbq("track", "AddToCart", {
            deviceId,
            productId: product._id,
            quantity: 1,
          });
        }
        // Trigger cart drawer to open
        triggerCartDrawer();
        refreshCart();
        console.log("Added to cart:", product.productName);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // Helper function to normalize images (handle both string and array)
  const normalizeImages = (images) => {
    if (!images) return [];
    if (typeof images === "string") return [images];
    if (Array.isArray(images)) return images;
    return [];
  };

  const coverImages = normalizeImages(product?.coverImage);
  const firstCoverImage = coverImages[0] || "";

  return (
    <div
      className={`new-collections-card ${
        isMobile ? "new-collections-card-mobile" : ""
      }`}
    >
      <p className="new-collections-brand">{product.productName}</p>
      <div className="new-collections-image-container">
        <img
          src={firstCoverImage}
          alt={product.shopName}
          className="new-collections-image"
          loading="lazy"
        />
      </div>
      <div className="new-collections-footer" onClick={handleAddToCart}>
        <button
          className="new-collections-shop new-arrivals-buy-link"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Add to Cart
        </button>
        <span
          className="new-collections-shop-arrow"
          onClick={(e) => e.stopPropagation()}
        >
          <img src="/icons/Arrow.svg" alt="arrow" />
        </span>
      </div>
    </div>
  );
}
