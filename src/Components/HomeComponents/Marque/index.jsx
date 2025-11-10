import React, { useMemo } from "react";
import "./Marque.css";

export default function BrandMarquee({ HomeData }) {
  // Extract brand names from HomeData
  const brands = useMemo(() => {
    if (!HomeData) return [];

    // If HomeData is an array, look for brands
    if (Array.isArray(HomeData)) {
      const brandsSection = HomeData.find(
        (item) => item.key === "brands"
      );
      if (brandsSection?.data && Array.isArray(brandsSection.data)) {
        return brandsSection.data
          .map((brand) => brand.brandName)
          .filter((name) => name && name.trim() !== "");
      }
    }

    // If HomeData is an object, check for brands property
    if (typeof HomeData === "object" && HomeData.brands) {
      if (Array.isArray(HomeData.brands)) {
        return HomeData.brands
          .map((brand) => brand.brandName)
          .filter((name) => name && name.trim() !== "");
      }
    }

    return [];
  }, [HomeData]);

  // If no brands from API, don't show marquee
  if (!brands || brands.length === 0) {
    return null;
  }

  // To create a seamless effect, repeat the brand list multiple times
  // Repeat enough times to ensure smooth scrolling
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <div className="brand-marquee-container">
      <div className="brand-marquee-track">
        {displayBrands.map((brand, idx) => (
          <span className="brand-marquee-item" key={idx}>
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
