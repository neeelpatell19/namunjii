import React, { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./BestSellers.css";
import { Link } from "react-router-dom";
import NewArrivalCard from "../NewArrivals/NewArrivalCard";

export default function BestSellers({ HomeData }) {
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

  const bestsellers = useMemo(() => {
    // Handle different data structures
    if (!HomeData) return [];

    // If HomeData is an array, look for bestsellers
    if (Array.isArray(HomeData)) {
      const bestsellersSection = HomeData.find(
        (item) => item.key === "bestsellers"
      );
      return bestsellersSection?.data || [];
    }

    // If HomeData is an object, check for bestsellers property
    if (typeof HomeData === "object") {
      return HomeData.bestsellers || HomeData.bestsellers_data || [];
    }

    return [];
  }, [HomeData]);

  // Loading state
  if (!HomeData || (Array.isArray(HomeData) && HomeData.length === 0)) {
    return (
      <div className="bestsellers-container">
        <div className="bestsellers-loading">
          <div className="bestsellers-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!bestsellers || bestsellers.length === 0) {
    return (
      <div className="bestsellers-container">
        <div className="bestsellers-empty">
          <div className="bestsellers-empty-icon">🏆</div>
          <p className="bestsellers-empty-text">No best sellers available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bestsellers-container">
      <div className="bestsellers-header">
        <h2 className="bestsellers-title">Best Sellers</h2>
        {/* <p className="bestsellers-subtitle">Discover our most loved products</p> */}
        <Link
          to="/products?isBestSeller=true"
          className="view-all-btn"
        >
          View All <span className="arrow-icon">→</span>
        </Link>
      </div>

      {isMobile ? (
        <Row gutter={[12, 12]} className="bestsellers-row-mobile">
          {bestsellers.map((product) => (
            <Col xs={12} sm={12} key={product.id || product._id}>
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
        <div className="bestsellers-grid">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
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
