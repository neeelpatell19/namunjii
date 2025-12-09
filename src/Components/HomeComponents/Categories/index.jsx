import React, { useMemo } from "react";
import "./Categories.css";

export default function Categories({ HomeData }) {
  useEffect(() => {
  if(window.fbq)
window.fbq("track", "CategoriesPageView");
}, [])
  const categoriesData = useMemo(() => {
    console.log("HomeData in Categories:", HomeData);

    // Handle different data structures
    if (!HomeData) return null;

    // If HomeData is an array, look for categories
    if (Array.isArray(HomeData)) {
      const categoriesSection = HomeData.find(
        (item) => item.key === "categories" || item.title === "Categories"
      );
      return categoriesSection || null;
    }

    // If HomeData is an object, check for categories property
    if (typeof HomeData === "object") {
      return HomeData.categories || HomeData.categories_data || null;
    }

    return null;
  }, [HomeData]);

  console.log("Categories data:", categoriesData);

  // Loading state
  if (!HomeData || (Array.isArray(HomeData) && HomeData.length === 0)) {
    return (
      <div className="categories-container">
        <div className="categories-loading">
          <div className="categories-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (
    !categoriesData ||
    !categoriesData.data ||
    categoriesData.data.length === 0
  ) {
    return (
      <div className="categories-container">
        <div className="categories-empty">
          <div className="categories-empty-icon">📂</div>
          <p className="categories-empty-text">No categories available</p>
        </div>
      </div>
    );
  }

  const { title, data } = categoriesData;

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2 className="categories-title">{title || "Categories"}</h2>
      </div>

      <div className="categories-grid">
        {data.map((category) => (
          <div key={category._id} className="category-item">
            <div className="category-image-container">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              {/* Fallback for missing images */}
              <div
                className="category-image-fallback"
                style={{ display: category.image ? "none" : "flex" }}
              >
                <div className="category-fallback-icon">👗</div>
              </div>
            </div>
            <h3 className="category-name">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
