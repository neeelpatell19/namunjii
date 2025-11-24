import React, { useState, useEffect } from "react";
import { Spin, Empty, Tag, Card, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import orderApi from "../../apis/order";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (!token || !userData) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    setUser(userData);
    fetchOrders(userData.mobileNumber);
  }, [navigate]);

  const fetchOrders = async (mobileNumber) => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrdersByMobileNumber(mobileNumber);
      if (response.success && response.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const statusMap = {
      payment_completed: "green",
      pending: "orange",
      cancelled: "red",
      delivered: "blue",
      shipped: "cyan",
    };
    return statusMap[status] || "default";
  };

  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-loading">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-wrapper">
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <Empty
              description="No orders found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <Card key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-header-left">
                    <div className="order-number">
                      Order #{order.orderNumber}
                    </div>
                    <div className="order-date">
                      Placed on {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="order-header-right">
                    <Tag color={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Tag>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-image">
                        <img
                          src={
                            item.coverImage || item.productId?.coverImage?.[0]
                          }
                          alt={item.productName}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100?text=No+Image";
                          }}
                        />
                      </div>
                      <div className="order-item-details">
                        {(item.vendorName || item.productId?.vendorId?.name) && (
                          <div className="order-item-brand">
                            {item.vendorName || item.productId?.vendorId?.name}
                          </div>
                        )}
                        <h3 className="order-item-name">{item.productName}</h3>
                        <div className="order-item-meta">
                          <span className="order-item-size">
                            Size: {item.size}
                          </span>
                          <span className="order-item-separator">|</span>
                          <span className="order-item-color">
                            Color: {item.color}
                          </span>
                          <span className="order-item-separator">|</span>
                          <span className="order-item-quantity">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="order-item-pricing">
                        <div className="order-item-price-row">
                          <span className="order-item-price-label">
                            Price per unit:
                          </span>
                          <span className="order-item-price-value">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="order-item-price-row total">
                          <span className="order-item-price-label">Total:</span>
                          <span className="order-item-price-value final">
                            ₹{item.finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <Row gutter={16}>
                    {order.discount > 0 && (
                      <Col xs={24} sm={12} md={8}>
                        <div className="order-summary-item">
                          <span className="order-summary-label">Discount:</span>
                          <span className="order-summary-value discount">
                            -₹{order.discount.toFixed(2)}
                          </span>
                        </div>
                      </Col>
                    )}
                    {order.shippingCharges > 0 && (
                      <Col xs={24} sm={12} md={8}>
                        <div className="order-summary-item">
                          <span className="order-summary-label">Shipping:</span>
                          <span className="order-summary-value">
                            ₹{order.shippingCharges.toFixed(2)}
                          </span>
                        </div>
                      </Col>
                    )}
                    <Col xs={24} sm={24} md={24}>
                      <div className="order-summary-item total">
                        <span className="order-summary-label">
                          Order Total:
                        </span>
                        <span className="order-summary-value total">
                          ₹{order.total.toFixed(2)}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>

                {order.shippingAddress && (
                  <div className="order-shipping">
                    <div className="order-shipping-content">
                      <span className="order-shipping-label">
                        Shipping Address:
                      </span>
                      <span className="order-shipping-address">
                        {order.shippingAddress.fullName},{" "}
                        {order.shippingAddress.addressLine1}
                        {order.shippingAddress.addressLine2 &&
                          `, ${order.shippingAddress.addressLine2}`}
                        , {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.pincode},{" "}
                        {order.shippingAddress.country} | Phone:{" "}
                        {order.shippingAddress.mobileNumber}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
