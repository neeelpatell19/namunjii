import React, { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./FeaturedProducts.css";
import { Link } from "react-router-dom";

export default function FeaturedProducts({ HomeData }) {
  useEffect(() => {
  if(window.fbq)
window.fbq("track", "FeaturedProductsPageView");
}, [])
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

  const featuredProducts = useMemo(() => {
    // Handle different data structures
    if (!HomeData) return [];

    // If HomeData is an array, look for featuredProducts
    if (Array.isArray(HomeData)) {
      const featuredSection = HomeData.find(
        (item) => item.key === "featuredProducts"
      );
      return featuredSection?.data || [];
    }

    // If HomeData is an object, check for featuredProducts property
    if (typeof HomeData === "object") {
      return (
        HomeData.featuredProducts ||
        HomeData.featured_products ||
        HomeData.featured ||
        []
      );
    }

    return [];
  }, [HomeData]);

  // Loading state
  if (!HomeData || (Array.isArray(HomeData) && HomeData.length === 0)) {
    return (
      <div className="featured-products-container">
        <div className="featured-products-loading">
          <div className="featured-products-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="featured-products-container">
        <div className="featured-products-empty">
          <div className="featured-products-empty-icon">⭐</div>
          <p className="featured-products-empty-text">
            No featured products available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-products-container">
      <div className="featured-products-header">
        <h2 className="featured-products-title">Featured Products</h2>
        <Link to="/products?isFeatured=true" className="view-all-btn">
          View All <span className="arrow-icon">→</span>
        </Link>
      </div>

      {isMobile ? (
        <Row gutter={[12, 12]} className="featured-products-row-mobile">
          {featuredProducts.map((product) => (
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
      <div className="featured-products-grid">
        {featuredProducts.map((product) => (
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
