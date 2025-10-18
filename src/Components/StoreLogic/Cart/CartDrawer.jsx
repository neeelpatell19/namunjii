import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { useDevice } from "../../../hooks/useDevice";
import cartApi from "../../../apis/cart";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./CartDrawer.css";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { deviceId } = useDevice();
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
      }
    } catch (err) {
      setError(err.message || "Failed to remove item from cart");
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
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
          <h2 className="cart-drawer-title">Shopping Cart</h2>
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
              <div className="cart-empty-icon">🛒</div>
              <p>Your cart is empty</p>
              <button className="cart-continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.productId._id} className="cart-item">
                    <div className="cart-item-image">
                      <img
                        src={item.productId.coverImage?.[0] || ""}
                        alt={item.productId.productName}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="cart-item-fallback">👕</div>
                    </div>

                    <div className="cart-item-details">
                      <h3 className="cart-item-name">
                        {item.productId.productName}
                      </h3>
                      <p className="cart-item-price">
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
                      <p className="cart-item-size">
                        Size: {item.size || item.productId.size || "One Size"}
                      </p>
                      {(item.color || item.productId.color) && (
                        <p className="cart-item-color">
                          Color: {item.color || item.productId.color}
                        </p>
                      )}
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
                      .reduce(
                        (total, item) =>
                          total + item.productId.finalPrice * item.quantity,
                        0
                      )
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
