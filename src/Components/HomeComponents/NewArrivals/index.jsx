import React, { useMemo } from "react";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./NewArrivals.css";

export default function NewArrivals({ HomeData }) {
  const newArrivals = useMemo(() => {
    console.log("HomeData in NewArrivals:", HomeData);

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

  console.log("NewArrivals data:", newArrivals);

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
        <p className="new-arrivals-subtitle">Fresh styles just landed</p>
      </div>

      <div className="new-arrivals-grid">
        {newArrivals.map((product) => (
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
    </div>
  );
}
