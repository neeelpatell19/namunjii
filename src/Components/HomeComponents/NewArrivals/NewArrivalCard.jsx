import React from "react";
import { useDevice } from "../../../hooks/useDevice";
import { useCartWishlist } from "../../StoreLogic/Context/CartWishlistContext";
import cartApi from "../../../apis/cart";
import "./NewArrivalCard.css";

export default function NewArrivalCard({ product }) {
  const { deviceId } = useDevice();
  const { triggerCartDrawer } = useCartWishlist();

  const handleAddToCart = async () => {
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
        console.log("Added to cart:", product.productName);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  return (
    <div className="new-collections-card">
      <p className="new-collections-brand">{product.productName}</p>
      <div className="new-collections-image-container">
        <img 
          src={product.coverImage[0]} 
          alt={product.shopName} 
          className="new-collections-image"
          loading="lazy"
        />
      </div>
      <div className="new-collections-footer" onClick={handleAddToCart}>
        <button
          className="new-collections-shop new-arrivals-buy-link"
          
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Add to Cart
        </button>
        <span className="new-collections-shop-arrow">
          <img src="/icons/Arrow.svg" alt="arrow" />
        </span>
      </div>
    </div>
  );
}
