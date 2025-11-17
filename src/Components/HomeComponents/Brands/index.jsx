import React, { useMemo, useState, useEffect, useRef } from "react";
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
  const swiperRef = useRef(null);
  const mobileTimeoutRef = useRef(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (mobileTimeoutRef.current) {
        clearTimeout(mobileTimeoutRef.current);
      }
    };
  }, []);

  const brands = useMemo(() => {
    // Handle different data structures
    if (!HomeData) return [];

    let allBrands = [];

    // If HomeData is an array, look for brands
    if (Array.isArray(HomeData)) {
      const brandsSection = HomeData.find((item) => item.key === "brands");
      allBrands = brandsSection?.data || [];
    }
    // If HomeData is an object, check for brands property
    else if (typeof HomeData === "object") {
      allBrands = HomeData.brands || HomeData.brands_data || [];
    }

    if (!allBrands || allBrands.length === 0) return [];

    // Define exclusive brands
    const exclusiveBrands = [
      "Grey Horn",
      "The Branch",
      "The Drift Line",
      "The Pure Forms",
    ];

    // Separate brands into exclusive and normal
    const exclusive = allBrands.filter((brand) =>
      exclusiveBrands.includes(brand.brandName)
    );
    const normal = allBrands.filter(
      (brand) => !exclusiveBrands.includes(brand.brandName)
    );

    // Interleave exclusive and normal brands
    const reorderedBrands = [];
    const maxLength = Math.max(exclusive.length, normal.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < exclusive.length) {
        reorderedBrands.push(exclusive[i]);
      }
      if (i < normal.length) {
        reorderedBrands.push(normal[i]);
      }
    }

    return reorderedBrands;
  }, [HomeData]);

  // Handle mobile slide change - show 2nd photo after 1 second
  const handleSlideChange = (swiper) => {
    // Clear any existing timeout
    if (mobileTimeoutRef.current) {
      clearTimeout(mobileTimeoutRef.current);
      mobileTimeoutRef.current = null;
    }

    // Reset hovered brand when slide changes
    setHoveredBrandId(null);

    // Only apply mobile behavior on mobile devices
    if (!isMobile || !swiper || !brands || brands.length === 0) return;

    // Get visible slides
    const activeIndex = swiper.activeIndex;
    const slidesPerView = swiper.params.slidesPerView || 2;
    const visibleBrandIds = [];

    // Calculate which brands are currently visible
    for (let i = 0; i < slidesPerView; i++) {
      const slideIndex = swiper.params.loop
        ? swiper.realIndex + i
        : activeIndex + i;
      if (slideIndex < brands.length) {
        const brandIndex = swiper.params.loop
          ? slideIndex % brands.length
          : slideIndex;
        if (brands[brandIndex]) {
          visibleBrandIds.push(brands[brandIndex]._id);
        }
      }
    }

    // After 1 second, show 2nd photo for visible brands
    mobileTimeoutRef.current = setTimeout(() => {
      // Show 2nd photo for the first visible brand
      if (visibleBrandIds.length > 0) {
        setHoveredBrandId(visibleBrandIds[0]);
      }
    }, 1000);
  };

  // Handle initial load on mobile - show 2nd photo after 1 second
  useEffect(() => {
    if (isMobile && brands && brands.length > 0 && swiperRef.current) {
      // Clear any existing timeout
      if (mobileTimeoutRef.current) {
        clearTimeout(mobileTimeoutRef.current);
      }

      // Reset hovered brand
      setHoveredBrandId(null);

      // After 1 second, show 2nd photo for first visible brand
      mobileTimeoutRef.current = setTimeout(() => {
        if (brands.length > 0) {
          setHoveredBrandId(brands[0]._id);
        }
      }, 1000);
    }

    return () => {
      if (mobileTimeoutRef.current) {
        clearTimeout(mobileTimeoutRef.current);
      }
    };
  }, [isMobile, brands]);

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
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={brands.length > (isMobile ? 2 : 4)}
          grabCursor={false}
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
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            // Trigger initial slide change for mobile
            if (isMobile) {
              handleSlideChange(swiper);
            }
          }}
          onSlideChange={handleSlideChange}
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
