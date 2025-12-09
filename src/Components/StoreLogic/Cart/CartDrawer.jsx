import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { useDevice } from "../../../hooks/useDevice";
import { useCartWishlist } from "../Context/CartWishlistContext";
import cartApi from "../../../apis/cart";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./CartDrawer.css";

const CartDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
  if(window.fbq)
window.fbq("track", "CartDrawerPageView");
}, [])
  const navigate = useNavigate();
  const { deviceId } = useDevice();
  const { refreshCart } = useCartWishlist();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    if (!deviceId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart({ deviceId });

      if (response.success) {
        setCartItems(response.data?.items || []);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      const response = await cartApi.removeFromCart(productId);

      if (response.success) {
        // Remove item from local state
        setCartItems((prev) =>
          prev.filter((item) => item.productId._id !== productId)
        );
        // Refresh cart in context to update all ProductCard components
        refreshCart();
      }
    } catch (err) {
      setError(err.message || "Failed to remove item from cart");
    }
  };

  // Get available stock for a product
  const getAvailableStock = (item) => {
    const product = item.productId || item.product;
    // Check for common stock field names
    return (
      product?.stock ||
      product?.stockQuantity ||
      product?.availableQuantity ||
      product?.quantity ||
      null
    );
  };

  // Check if product is in stock
  const isInStock = (item) => {
    const stock = getAvailableStock(item);
    // If stock is null/undefined, assume it's available (backward compatibility)
    if (stock === null || stock === undefined) {
      return true;
    }
    // If stock is 0 or less, it's not available
    return stock > 0;
  };

  // Check if quantity can be increased
  const canIncreaseQuantity = (item) => {
    if (!isInStock(item)) {
      return false;
    }
    const stock = getAvailableStock(item);
    // If stock is null/undefined, allow increase (backward compatibility)
    if (stock === null || stock === undefined) {
      return true;
    }
    // Allow increase only if current quantity is less than available stock
    return item.quantity < stock;
  };

  // Update item quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }

    // Find the item to check stock
    const item = cartItems.find((item) => item.productId._id === productId);
    if (!item) {
      setError("Item not found in cart");
      return;
    }

    // Check if increasing quantity is allowed
    if (newQuantity > item.quantity) {
      // User is trying to increase quantity
      if (!canIncreaseQuantity(item)) {
        setError("Product is out of stock or stock limit reached");
        return;
      }
    }

    try {
      const response = await cartApi.updateCartItem({
        deviceId,
        productId,
        quantity: newQuantity,
      });

      if (response.success) {
        // Update item in local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId._id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        setError(null); // Clear any previous errors
      } else {
        setError(response.message || "Failed to update item quantity");
      }
    } catch (err) {
      setError(err.message || "Failed to update item quantity");
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      const response = await cartApi.clearCart();

      if (response.success) {
        setCartItems([]);
        // Refresh cart in context to update all ProductCard components
        refreshCart();
      }
    } catch (err) {
      setError(err.message || "Failed to clear cart");
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    onClose(); // Close the cart drawer
    navigate("/checkout"); // Navigate to checkout
  };

  useEffect(() => {
    if (isOpen && deviceId) {
      fetchCartItems();
    }
  }, [isOpen, deviceId, fetchCartItems]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-wrapper">
            <h2 className="cart-drawer-title">Shopping Cart</h2>
            {!loading &&
              !error &&
              cartItems.length > 0 &&
              (() => {
                const validItems = cartItems.filter(
                  (item) => item.productId && item.productId._id
                );
                return (
                  <span className="cart-item-count">
                    ({validItems.length}{" "}
                    {validItems.length !== 1 ? "items" : "item"})
                  </span>
                );
              })()}
          </div>
          <button className="cart-drawer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-drawer-content">
          {loading ? (
            <div className="cart-loading">
              <div className="cart-loading-spinner"></div>
              <p>Loading cart...</p>
            </div>
          ) : error ? (
            <div className="cart-error">
              <p>{error}</p>
              <button onClick={fetchCartItems}>Retry</button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon"><video style={{width: '50vw', height:'30vh'}}  src="/Videos/namunjii_wishlist_page.mp4" autoPlay loop muted ></video></div>
              <p className="heading">Your Cart is Empty</p>
              <p className="sub-heading">Add items to your cart to continue shopping.</p>
              <button className="cart-continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems
                  .filter((item) => item.productId && item.productId._id)
                  .map((item) => (
                    <div
                      key={item.productId?._id || item._id || Math.random()}
                      className="cart-item"
                    >
                      <div className="cart-item-image">
                        <img
                          src={(() => {
                            const coverImage = item.productId?.coverImage;
                            if (!coverImage) return "";
                            if (typeof coverImage === 'string') return coverImage;
                            if (Array.isArray(coverImage) && coverImage.length > 0) return coverImage[0];
                            return "";
                          })()}
                          alt={item.productId?.productName || "Product"}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="cart-item-fallback">👕</div>
                      </div>

                      <div className="cart-item-details">
                        <h3 className="cart-item-name">
                          {item.productId?.productName || "Product"}
                        </h3>
                        <p className="cart-item-size">
                          Size:{" "}
                          {item.size || item.productId?.size || "One Size"}
                        </p>
                        {(item?.color && item?.color !== "N/A") && (
                          <p className="cart-item-color">
                            Color: {item?.color}
                          </p>
                        )}
                        <p className="cart-item-price">
                          ₹
                          {(() => {
                            const basePrice = item.productId?.basePricing || 0;
                            const discount = item.productId?.discount || 0;
                            const finalPrice =
                              discount > 0
                                ? Math.round(basePrice * (1 - discount / 100))
                                : basePrice;
                            return finalPrice.toLocaleString();
                          })()}
                        </p>
                      </div>

                      <div className="cart-item-controls">
                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId._id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.productId._id,
                                item.quantity + 1
                              )
                            }
                            disabled={!canIncreaseQuantity(item)}
                            title={
                              !isInStock(item)
                                ? "Product is out of stock"
                                : !canIncreaseQuantity(item)
                                ? "Maximum stock limit reached"
                                : "Increase quantity"
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.productId._id)}
                          title="Remove item"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <p>
                    Total: ₹
                    {cartItems
                      .filter((item) => item.productId)
                      .reduce((total, item) => {
                        const basePrice = item.productId?.basePricing || 0;
                        const discount = item.productId?.discount || 0;
                        const finalPrice =
                          discount > 0
                            ? Math.round(basePrice * (1 - discount / 100))
                            : basePrice;
                        return total + finalPrice * item.quantity;
                      }, 0)
                      .toLocaleString()}
                  </p>
                </div>

                <div className="cart-actions">
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout
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

export default CartDrawer;
