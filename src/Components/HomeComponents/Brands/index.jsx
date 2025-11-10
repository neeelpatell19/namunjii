import React, { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import "./Brands.css";
import { Link } from "react-router-dom";

export default function Brands({ HomeData }) {
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

  const brands = useMemo(() => {
    // Handle different data structures
    if (!HomeData) return [];

    // If HomeData is an array, look for brands
    if (Array.isArray(HomeData)) {
      const brandsSection = HomeData.find((item) => item.key === "brands");
      return brandsSection?.data || [];
    }

    // If HomeData is an object, check for brands property
    if (typeof HomeData === "object") {
      return HomeData.brands || HomeData.brands_data || [];
    }

    return [];
  }, [HomeData]);

  // Loading state
  if (!HomeData || (Array.isArray(HomeData) && HomeData.length === 0)) {
    return (
      <div className="brands-container">
        <div className="brands-loading">
          <div className="brands-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!brands || brands.length === 0) {
    return null; // Don't show anything if no brands
  }

  // Get brand image from experimental data if available
  const getBrandImage = (brand) => {
    if (
      brand.experimental?.logo_images &&
      brand.experimental.logo_images.length > 0
    ) {
      return brand.experimental.logo_images[0].s3_url;
    }
    return null;
  };

  return (
    <div className="brands-container">
      <div className="brands-header">
        <h2 className="brands-title">Brands</h2>
      </div>

      {isMobile ? (
        <Row gutter={[12, 12]} className="brands-row-mobile">
          {brands.slice(0, 4).map((brand) => {
            const brandImage = getBrandImage(brand);
            return (
              <Col xs={12} sm={12} key={brand._id}>
                <div className="brand-card">
                  <h3 className="brand-name">{brand.brandName}</h3>
                  {brandImage && (
                    <div className="brand-image-container">
                      <img
                        src={brandImage}
                        alt={brand.brandName}
                        className="brand-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="brand-image-fallback">
                        <div className="brand-image-fallback-icon">🏷️</div>
                      </div>
                    </div>
                  )}
                  <div className="brand-footer">
                    <Link
                      to={`/products?brand=${encodeURIComponent(
                        brand.brandName
                      )}`}
                      className="brand-shop-now-btn"
                    >
                      Shop Now
                    </Link>
                    <span className="brand-shop-arrow">
                      <img src="/icons/Arrow.svg" alt="arrow" />
                    </span>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : (
        <div className="brands-grid">
          {brands.slice(0, 4).map((brand) => {
            const brandImage = getBrandImage(brand);
            return (
              <div className="brand-card" key={brand._id}>
                <h3 className="brand-name">{brand.brandName}</h3>
                {brandImage && (
                  <div className="brand-image-container">
                    <img
                      src={brandImage}
                      alt={brand.brandName}
                      className="brand-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="brand-image-fallback">
                      <div className="brand-image-fallback-icon">🏷️</div>
                    </div>
                  </div>
                )}
                <div className="brand-footer">
                  <Link
                    to={`/products?brand=${encodeURIComponent(
                      brand.brandName
                    )}`}
                    className="brand-shop-now-btn"
                  >
                    Shop Now
                  </Link>
                  <span className="brand-shop-arrow">
                    <img src="/icons/Arrow.svg" alt="arrow" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
