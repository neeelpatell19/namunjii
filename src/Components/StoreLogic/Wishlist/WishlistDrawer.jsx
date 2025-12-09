import React, { useState, useEffect } from "react";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useDevice } from "../../../hooks/useDevice";
import { useCartWishlist } from "../Context/CartWishlistContext";
import wishlistApi from "../../../apis/wishlist";
import cartApi from "../../../apis/cart";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./WishlistDrawer.css";

const WishlistDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "WishlistPageView");
  }, []);
  const { deviceId } = useDevice();
  const { refreshWishlist, refreshCart } = useCartWishlist();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist items
  const fetchWishlistItems = async () => {
    if (!deviceId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await wishlistApi.getWishlist({ deviceId });

      if (response.success) {
        setWishlistItems(response.data?.items || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch wishlist items");
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const handleRemoveItem = async (productId) => {
    try {
      const response = await wishlistApi.removeFromWishlist(productId);

      if (response.success) {
        // Remove item from local state
        setWishlistItems((prev) =>
          prev.filter((item) => item.productId._id !== productId)
        );
        // Refresh wishlist in context to update all ProductCard components
        refreshWishlist();
      }
    } catch (err) {
      setError(err.message || "Failed to remove item from wishlist");
    }
  };

  // Add item to cart from wishlist
  const handleAddToCart = async (product) => {
    try {
      const response = await cartApi.addToCart({
        deviceId,
        productId: product._id,
        quantity: 1,
      });

      if (response.success) {

               console.log("Triggering FB Pixel AddToCart event for product:")

      // ✅ Meta Pixel AddToCart event
      if (window.fbq) {
        // const price =
        //   productToUse?.salePrice || productToUse?.price || 0;

        window.fbq("track", "AddToCart", {
        deviceId,
        productId: product._id,
        quantity: 1,
      });
      } 
        // Remove item from wishlist
        await handleRemoveItem(product._id);
        // Refresh cart in context to update all ProductCard components
        refreshCart();
        console.log("Added to cart successfully and removed from wishlist");
      }
    } catch (err) {
      setError(err.message || "Failed to add item to cart");
    }
  };

  // Clear wishlist
  const handleClearWishlist = async () => {
    try {
      const response = await wishlistApi.clearWishlist();

      if (response.success) {
        setWishlistItems([]);
        // Refresh wishlist in context to update all ProductCard components
        refreshWishlist();
      }
    } catch (err) {
      setError(err.message || "Failed to clear wishlist");
    }
  };

  useEffect(() => {
    if (isOpen && deviceId) {
      fetchWishlistItems();
    }
  }, [isOpen, deviceId]);

  if (!isOpen) return null;

  return (
    <div className="wishlist-drawer-overlay" onClick={onClose}>
      <div className="wishlist-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-drawer-header">
          <div className="wishlist-drawer-title-wrapper">
            <h2 className="wishlist-drawer-title">Wishlist</h2>
            {!loading && !error && wishlistItems.length > 0 && (
              <span className="wishlist-item-count">
                ({wishlistItems.length}{" "}
                {wishlistItems.length !== 1 ? "items" : "item"})
              </span>
            )}
          </div>
          <button className="wishlist-drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="wishlist-drawer-content">
          {loading ? (
            <div className="wishlist-loading">
              <div className="wishlist-loading-spinner"></div>
              <p>Loading wishlist...</p>
            </div>
          ) : error ? (
            <div className="wishlist-error">
              <p>{error}</p>
              <button onClick={fetchWishlistItems}>Retry</button>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <video
                  style={{ width: "50vw", height: "30vh" }}
                  src="/Videos/namunjii_wishlist_page.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  disablePictureInPicture
                  disableRemotePlayback
                  controls={false}
                  preload="auto"
                ></video>
              </div>
              <p className="heading">Your Wishlist is Empty</p>
              <p className="sub-heading">
                Save the pieces you love and find them here anytime.
              </p>
              <button className="wishlist-continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="wishlist-items">
                {wishlistItems.map((item) => (
                  <div key={item.productId._id} className="wishlist-item">
                    <div className="wishlist-item-image">
                      <img
                        src={(() => {
                          const coverImage = item.productId?.coverImage;
                          if (!coverImage) return "";
                          if (typeof coverImage === "string") return coverImage;
                          if (
                            Array.isArray(coverImage) &&
                            coverImage.length > 0
                          )
                            return coverImage[0];
                          return "";
                        })()}
                        alt={item.productId.productName}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="wishlist-item-fallback">👕</div>
                    </div>

                    <div className="wishlist-item-details">
                      <h3 className="wishlist-item-name">
                        {item.productId.productName}
                      </h3>
                      <p className="wishlist-item-price">
                        ₹
                        {(() => {
                          const basePrice = item.productId.basePricing || 0;
                          const discount = item.productId.discount || 0;
                          const finalPrice =
                            discount > 0
                              ? Math.round(basePrice * (1 - discount / 100))
                              : basePrice;
                          return finalPrice.toLocaleString();
                        })()}
                      </p>
                    </div>

                    <div className="wishlist-item-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(item.productId)}
                        title="Add to cart"
                      >
                        <ShoppingCartOutlined />
                      </button>
                      <button
                        className="remove-from-wishlist-btn"
                        onClick={() => handleRemoveItem(item.productId._id)}
                        title="Remove from wishlist"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wishlist-footer">
                <div className="wishlist-actions">
                  <button
                    className="clear-wishlist-btn"
                    onClick={handleClearWishlist}
                  >
                    Clear Wishlist
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
