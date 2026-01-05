import React, { useState, useEffect } from "react";
import {
  Spin,
  Empty,
  Tag,
  Card,
  Row,
  Col,
  Modal,
  Timeline,
  Button,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import orderApi from "../../apis/order";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackOrderModalVisible, setTrackOrderModalVisible] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (!token || !userData) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

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

  const handleTrackOrder = async (orderId) => {
    setTrackOrderModalVisible(true);
    setTrackingLoading(true);
    setTrackingData(null);

    try {
      const response = await orderApi.trackOrder(orderId);

      if (response.success && response.data) {
        setTrackingData(response.data);
      } else {
        message.error(
          response.message || "Failed to fetch tracking information"
        );
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      message.error("Failed to fetch tracking information");
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleTrackOrderCancel = () => {
    setTrackOrderModalVisible(false);
    setTrackingData(null);
  };

  const formatTrackingDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
                    {order.status === "payment_completed" ? (
                      <Button
                        color="primary"
                        variant="outlined"
                        onClick={() => handleTrackOrder(order._id)}
                      >
                        Track Order
                      </Button>
                    ) : (
                      <Tag color={getStatusColor(order.status)}>
                        {formatStatus(order.status)}
                      </Tag>
                    )}
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
                        {(item.vendorName ||
                          item.productId?.vendorId?.name) && (
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

      {/* Track Order Modal */}
      <Modal
        title="Track Order"
        open={trackOrderModalVisible}
        onCancel={handleTrackOrderCancel}
        footer={[
          <Button key="close" onClick={handleTrackOrderCancel}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {trackingLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : trackingData ? (
          <div>
            {trackingData.currentStatus && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "16px",
                  backgroundColor: "#f0f7ff",
                  borderRadius: "8px",
                  border: "1px solid #91d5ff",
                }}
              >
                <div style={{ marginBottom: "8px", fontSize: "13px" }}>
                  <strong>Current Status: </strong>
                  <Tag
                    color="blue"
                    style={{ fontSize: "12px", padding: "3px 10px" }}
                  >
                    {trackingData.currentStatus.status}
                  </Tag>
                </div>
                {trackingData.waybill && (
                  <div style={{ marginBottom: "4px", fontSize: "13px" }}>
                    <strong>AWB: </strong>
                    {trackingData.waybill}
                  </div>
                )}
                {trackingData.currentStatus.statusLocation && (
                  <div style={{ marginBottom: "4px", fontSize: "13px" }}>
                    <strong>Location: </strong>
                    {trackingData.currentStatus.statusLocation}
                  </div>
                )}
                {trackingData.currentStatus.statusDateTime && (
                  <div style={{ fontSize: "13px" }}>
                    <strong>Last updated date: </strong>
                    {formatTrackingDate(
                      trackingData.currentStatus.statusDateTime
                    )}
                  </div>
                )}
              </div>
            )}
            <h4
              style={{
                marginBottom: "16px",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Timeline
            </h4>
            {trackingData.timeline &&
            Array.isArray(trackingData.timeline) &&
            trackingData.timeline.length > 0 ? (
              <div
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  paddingRight: "8px",
                  paddingTop: "8px",
                  paddingBottom: "16px",
                }}
              >
                <Timeline>
                  {trackingData.timeline
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <Timeline.Item
                        key={`timeline-${index}`}
                        color={index === 0 ? "green" : "blue"}
                      >
                        <div
                          style={{
                            paddingBottom: "12px",
                            padding: index === 0 ? "12px" : "0 0 12px 0",
                            backgroundColor:
                              index === 0 ? "#f0f9ff" : "transparent",
                            borderRadius: index === 0 ? "8px" : "0",
                            border: index === 0 ? "1px solid #91d5ff" : "none",
                            marginBottom: index === 0 ? "8px" : "0",
                          }}
                        >
                          <div
                            style={{
                              marginBottom: "8px",
                              fontSize: "13px",
                              fontWeight: "600",
                            }}
                          >
                            <span>{item?.scan || "N/A"}</span>
                            {item?.statusDateTime && (
                              <span
                                style={{
                                  color: "#999",
                                  fontSize: "11px",
                                  fontWeight: "400",
                                  marginLeft: "4px",
                                }}
                              >
                                ({formatTrackingDate(item.statusDateTime)})
                              </span>
                            )}
                          </div>
                          {item?.instructions && (
                            <div
                              style={{
                                marginBottom: "1px",
                                color: "#666",
                                fontSize: "12px",
                              }}
                            >
                              {item.instructions}
                            </div>
                          )}
                          {item?.location && (
                            <div
                              style={{
                                marginBottom: "3px",
                                color: "#666",
                                fontSize: "12px",
                              }}
                            >
                              <strong>Location: </strong>
                              {item.location}
                            </div>
                          )}
                        </div>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </div>
            ) : (
              <div
                style={{ padding: "20px", textAlign: "center", color: "#999" }}
              >
                No timeline data available
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            No tracking information available
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
