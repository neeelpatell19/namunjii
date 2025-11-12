import React, { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import "./Brands.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Brands({ HomeData }) {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredBrandId, setHoveredBrandId] = useState(null);

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

  // Get brand images from experimental data if available
  const getBrandImages = (brand) => {
    if (
      brand.experimental?.logo_images &&
      brand.experimental.logo_images.length > 0
    ) {
      return {
        defaultImage: brand.experimental.logo_images[0]?.s3_url || null,
        hoverImage:
          brand.experimental.logo_images[1]?.s3_url ||
          brand.experimental.logo_images[0]?.s3_url ||
          null,
      };
    }
    return { defaultImage: null, hoverImage: null };
  };

  console.log("Brands:::", brands);

  const renderBrandCard = (brand) => {
    const { defaultImage, hoverImage } = getBrandImages(brand);
    const isHovered = hoveredBrandId === brand._id;
    const displayImage = isHovered && hoverImage ? hoverImage : defaultImage;

    return (
      <div
        className="brand-card"
        key={brand._id}
        onMouseEnter={() => setHoveredBrandId(brand._id)}
        onMouseLeave={() => setHoveredBrandId(null)}
      >
        <h3 className="brand-name">{brand.brandName}</h3>
        {displayImage && (
          <div className="brand-image-container">
            <img
              src={displayImage}
              alt={brand.brandName}
              className="brand-image brand-image-instant"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            {/* Preload hover image for instant switching */}
            {hoverImage && hoverImage !== defaultImage && (
              <img
                src={hoverImage}
                alt=""
                style={{ display: "none" }}
                aria-hidden="true"
              />
            )}
            <div className="brand-image-fallback">
              <div className="brand-image-fallback-icon">🏷️</div>
            </div>
          </div>
        )}
        <Link
          to={`/products?brand=${encodeURIComponent(brand.brandName)}`}
          className="brand-footer"
        >
          <span className="brand-shop-now-btn">Shop Now</span>
          <span className="brand-shop-arrow">
            <img src="/icons/Arrow.svg" alt="arrow" />
          </span>
        </Link>
      </div>
    );
  };

  return (
    <div className="brands-container">
      <div className="brands-header">
        <h2 className="brands-title">Brands</h2>
      </div>

      <div className="brands-slider-wrapper">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={isMobile ? 12 : 24}
          slidesPerView={isMobile ? 2 : 4}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={brands.length > (isMobile ? 2 : 4)}
          grabCursor={true}
          touchEventsTarget="container"
          simulateTouch={true}
          allowTouchMove={true}
          touchRatio={1}
          touchAngle={45}
          longSwipes={true}
          longSwipesRatio={0.5}
          longSwipesMs={300}
          followFinger={true}
          threshold={5}
          touchMoveStopPropagation={false}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 24,
            },
          }}
          className="brands-swiper"
        >
          {brands.map((brand) => (
            <SwiperSlide key={brand._id}>{renderBrandCard(brand)}</SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
