import React, { useState } from "react";
import { ShoppingCartOutlined, CloseOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import "./Cart.css";

const Cart = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "CLASSIC PETITE STERLING",
            size: "28",
            price: 32.70,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            name: "CLASSIC PETITE SHEFFIELD",
            size: "32",
            price: 32.70,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 3,
            name: "CLASSIC PETITE SHEFFIELD",
            size: "32",
            price: 32.70,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 4,
            name: "CLASSIC PETITE SHEFFIELD",
            size: "32",
            price: 32.70,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 5,
            name: "CLASSIC PETITE SHEFFIELD",
            size: "32",
            price: 32.70,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ]);

    const toggleCart = () => {
        if (isCartOpen) {
            // Start closing animation
            setIsClosing(true);
            // Wait for animation to complete before hiding
            setTimeout(() => {
                setIsCartOpen(false);
                setIsClosing(false);
            }, 300); // Match animation duration
        } else {
            setIsCartOpen(true);
        }
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const getSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.basePricing * item.quantity), 0);
    };

    return (
        <>
            {/* Sticky Cart Button */}
            <div className="cart-button-container">
                <button className="cart-button" onClick={toggleCart}>
                    <ShoppingCartOutlined />
                    <span className="cart-count">{cartItems.length}</span>
                </button>
            </div>

            {/* Cart Container */}
            {isCartOpen && (
                <div className={`cart-overlay ${isClosing ? 'closing' : ''}`} onClick={toggleCart}>
                    <div className={`cart-container ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                        {/* Cart Header */}
                        <div className="cart-header">
                            <h4>Your Cart</h4>
                            <button className="cart-close-btn" onClick={toggleCart}>
                                <CloseOutlined />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="cart-items">
                            {cartItems.length === 0 ? (
                                <div className="empty-cart">
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="item-details">
                                            <p>{item.name}</p>
                                            <p>Size: {item.size}</p>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                        <div className="item-quantity">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                min="1"
                                            />
                                            <button
                                                className="quantity-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <PlusOutlined />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Cart Footer */}
                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-subtotal">
                                    <span>SUBTOTAL</span>
                                    <span>₹ {getSubtotal().toFixed(2)}</span>
                                </div>
                                <button className="CommonBtn">
                                    <span>CONTINUE TO CHECKOUT</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;