import React, { useMemo } from "react";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./NewArrivals.css";
import { Link } from "react-router-dom";

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
        <Link to="/collections" className="view-all-btn">
          View All <span className="arrow-icon">→</span>
        </Link>
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
       

        {/* ===== NEW COLLECTIONS CARDS - STAGGERED LAYOUT ===== */}
        {/* {[
          {
            id: 1,
            brandName: "Brand Name",
            shopName: "SHOP CHOKER",
            image: "https://images.pexels.com/photos/34433617/pexels-photo-34433617.jpeg"
          },
          {
            id: 2,
            brandName: "Brand Name",
            shopName: "SHOP CHOKER",
            image: "https://images.pexels.com/photos/34433617/pexels-photo-34433617.jpeg"

          },
          {
            id: 3,
            brandName: "Brand Name",
            shopName: "SHOP CHOKER",
            image: "https://images.pexels.com/photos/34433617/pexels-photo-34433617.jpeg"

          },
          {
            id: 4,
            brandName: "Brand Name",
            shopName: "SHOP CHOKER",
            image: "https://images.pexels.com/photos/34433617/pexels-photo-34433617.jpeg"
          }
        ].map((product) => (
          <div key={product.id} className="new-collections-card">
            <p className="new-collections-brand">{product.brandName}</p>
            <div className="new-collections-image-container">
              <img src={product.image} alt={product.shopName} className="new-collections-image" />
            </div>
            <div className="new-collections-footer">
              <span className="new-collections-shop">{product.shopName}</span>
              <span className="new-collections-shop-arrow"><img src="/icons/Arrow.svg" alt="" /></span>
            </div>
          </div>
        ))} */}
        {/* ===== END NEW COLLECTIONS CARDS ===== */}
      </div>
    </div>
  );
}
