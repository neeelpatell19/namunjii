import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Card } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import CartDrawer from "./CartDrawer";
import { useCartWishlist } from "../Context/CartWishlistContext";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { triggerCartDrawer } = useCartWishlist();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          className="back-button"
        >
          Back
        </Button>
        <h1>Shopping Cart</h1>
      </div>

      <div className="cart-page-content">
        <Card className="cart-page-card">
          <Empty
            image={
              <ShoppingCartOutlined
                style={{ fontSize: 64, color: "#d9d9d9" }}
              />
            }
            description={
              <div className="empty-cart-content">
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              onClick={handleContinueShopping}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </Button>
          </Empty>
        </Card>
      </div>

      {/* Cart Drawer for when items are added */}
      <CartDrawer isOpen={false} onClose={() => {}} />
    </div>
  );
};

export default CartPage;
