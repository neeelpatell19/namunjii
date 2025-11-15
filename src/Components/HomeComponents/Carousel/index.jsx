import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "./Carousel.css";

export default function Carousel({ HomeData }) {
  const carousel = useMemo(() => {
    const carousel = HomeData.find((item) => item.type === "carousel");
    return carousel?.data || [];
  }, [HomeData]);

  // Loading state
  if (!HomeData || HomeData.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-loading">
          <div className="carousel-loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!carousel || carousel.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-empty">
          <div className="carousel-empty-icon">📷</div>
          <p className="carousel-empty-text">No carousel images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-container">
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 1200,
            aspectRatio: "16/9",
            maxWidth: "100%",
            padding: "15px",
          }}
        >
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={carousel.length > 1}
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            grabCursor={false}
            keyboard={{
              enabled: true,
            }}
            spaceBetween={0}
            slidesPerView={1}
          >
            {carousel.map((item) => (
              <SwiperSlide key={item.id}>
                <div
                  style={{
                    aspectRatio: "16/9",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "20px",
                    padding: "20px",
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.title || "Carousel image"}
                    loading="lazy"
                    style={{
                      objectFit: "cover",
                      borderRadius: "20px",
                      aspectRatio: "16/9",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback for broken images */}
                  <div
                    style={{
                      display: "none",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(135deg, var(--bg-off-white) 0%, var(--bg-white) 100%)",
                      borderRadius: "20px",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{ fontSize: "48px", color: "var(--brand-600)" }}
                    >
                      🖼️
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--Poppins-font)",
                        color: "var(--BodyTextColor)",
                        margin: 0,
                        textAlign: "center",
                      }}
                    >
                      Image not available
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
