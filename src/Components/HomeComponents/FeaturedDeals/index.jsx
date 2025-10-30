import React, { useMemo } from "react";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./FeaturedDeals.css";
import { Link } from "react-router-dom";

export default function FeaturedDeals({ HomeData }) {
  const featuredDeals = useMemo(() => {
    console.log("HomeData in FeaturedDeals:", HomeData);

    // Handle different data structures
    if (!HomeData) return [];

    // If HomeData is an array, look for featuredDeals
    if (Array.isArray(HomeData)) {
      const featuredDealsSection = HomeData.find(
        (item) => item.key === "featuredDeals"
      );
      return featuredDealsSection?.data || [];
    }

    // If HomeData is an object, check for featuredDeals property
    if (typeof HomeData === "object") {
      return (
        HomeData.featuredDeals ||
        HomeData.featured_deals ||
        HomeData.featuredDeals_data ||
        []
      );
    }

    return [];
  }, [HomeData]);

  console.log("FeaturedDeals data:", featuredDeals);

  // Loading state
  if (!HomeData || (Array.isArray(HomeData) && HomeData.length === 0)) {
    return (
      <div className="featured-deals-container">
        <div className="featured-deals-loading">
          <div className="featured-deals-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!featuredDeals || featuredDeals.length === 0) {
    return (
      <div className="featured-deals-container">
        <div className="featured-deals-empty">
          <div className="featured-deals-empty-icon">🔥</div>
          <p className="featured-deals-empty-text">
            No featured deals available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="featured-deals-container">
      <div className="featured-deals-header">
        <h2 className="featured-deals-title">Featured Deals</h2>
        <Link to="/collections" className="view-all-btn">
          View All <span className="arrow-icon">→</span>
        </Link>
      </div>

      <div className="featured-deals-grid">
        {featuredDeals.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showQuickView={true}
            showAddToCart={true}
            onQuickView={(product) => {
              console.log("Quick view deal:", product);
            }}
            onAddToCart={(product) => {
              console.log("Add to cart deal:", product);
            }}
          />
        ))}
      </div>
    </div>
  );
}
