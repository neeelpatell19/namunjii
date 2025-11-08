import React, { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./NewArrivals.css";
import { Link } from "react-router-dom";

export default function NewArrivals({ HomeData }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const newArrivals = useMemo(() => {
    // Handle different data structures
    if (!HomeData) return [];

    // If HomeData is an array, look for newArrivals
    if (Array.isArray(HomeData)) {
      const newArrivalsSection = HomeData.find(
        (item) => item.key === "newArrivals"
      );
      return newArrivalsSection?.data || [];
    }

    // If HomeData is an object, check for newArrivals property
    if (typeof HomeData === "object") {
      return (
        HomeData.newArrivals ||
        HomeData.new_arrivals ||
        HomeData.newArrivals_data ||
        []
      );
    }

    return [];
  }, [HomeData]);

  // Loading state
  if (!HomeData || (Array.isArray(HomeData) && HomeData.length === 0)) {
    return (
      <div className="new-arrivals-container">
        <div className="new-arrivals-loading">
          <div className="new-arrivals-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!newArrivals || newArrivals.length === 0) {
    return (
      <div className="new-arrivals-container">
        <div className="new-arrivals-empty">
          <div className="new-arrivals-empty-icon">🆕</div>
          <p className="new-arrivals-empty-text">No new arrivals available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="new-arrivals-container">
      <div className="new-arrivals-header">
        <h2 className="new-arrivals-title">New Arrivals</h2>
        <Link
          to="/products?isNewArrival=true"
          className="view-all-btn"
        >
          View All <span className="arrow-icon">→</span>
        </Link>
      </div>

      {isMobile ? (
        <Row gutter={[12, 12]} className="new-arrivals-row-mobile">
          {newArrivals.map((product) => (
            <Col xs={12} sm={12} key={product._id || product.id}>
              <ProductCard
                product={product}
                showQuickView={true}
                showAddToCart={true}
                onQuickView={(product) => {
                  console.log("Quick view:", product);
                  // Add your quick view logic here
                }}
                onAddToCart={(product) => {
                  console.log("Add to cart:", product);
                  // Add your add to cart logic here
                }}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="new-arrivals-grid">
          {newArrivals.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              showQuickView={true}
              showAddToCart={true}
              onQuickView={(product) => {
                console.log("Quick view:", product);
                // Add your quick view logic here
              }}
              onAddToCart={(product) => {
                console.log("Add to cart:", product);
                // Add your add to cart logic here
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
