import React, { useMemo, useState, useEffect } from "react";
import { Row, Col } from "antd";
import ProductCard from "../../Common/ProductCard/ProductCard";
import "./NewArrivals.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function NewArrivals({ HomeData }) {
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

  const newArrivals = useMemo(() => {
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

  console.log("New Arrivals:", newArrivals);

  return (
    <div className="new-arrivals-container">
      <div className="new-arrivals-header">
        <h2 className="new-arrivals-title">New Arrivals</h2>
        <Link
          to="/products?isNewArrival=true"
          className="view-all-btn"
        >
          View All <span className="arrow-icon">→</span>
        </Link>
      </div>

      <div className="new-arrivals-slider-wrapper">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={isMobile ? 12 : 24}
          slidesPerView={isMobile ? 2 : 4}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={newArrivals.length > (isMobile ? 2 : 4)}
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
          className="new-arrivals-swiper"
        >
          {newArrivals.map((product) => (
            <SwiperSlide key={product._id || product.id}>
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
