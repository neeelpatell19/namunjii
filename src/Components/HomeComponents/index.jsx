import React, { useContext } from "react";
import { UserContext } from "../StoreLogic/Context/UserContext";
import "./HomeComponents.css";
import Carousel from "./Carousel";
import Categories from "./Categories";
import BestSellers from "./BestSellers";
import FeaturedProducts from "./FeaturedProducts";
import NewArrivals from "./NewArrivals";
import FeaturedDeals from "./FeaturedDeals";

// Loading Component with Skeleton Animation
const LoadingState = () => {
  return (
    <div className="home-loading-container">
      <div className="loading-content">
        {/* Skeleton Loaders */}
        <div className="skeleton-container">
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text short"></div>
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text short"></div>
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text short"></div>
            </div>
          </div>
          <div className="skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text short"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Error Component with Retry Functionality
const ErrorState = ({ onRetry }) => {
  return (
    <div className="home-error-container">
      <div className="error-content">
        <div className="error-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M15 9L9 15M9 9L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h3 className="error-title">Oops! Something went wrong</h3>
        <p className="error-message">
          We're having trouble loading the content. This might be a temporary
          issue.
        </p>
        <div className="error-actions">
          <button className="retry-button" onClick={onRetry}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4V10H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23 20V14H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try Again
          </button>
          <button
            className="contact-button"
            onClick={() => (window.location.href = "/contact")}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HomeComponents() {
  const {
    Home: HomeData,
    HomeLoading,
    HomeError,
    refetchHome,
  } = useContext(UserContext);

  console.log(HomeData);

  const handleRetry = () => {
    if (refetchHome) {
      refetchHome();
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
  };

  if (HomeLoading) {
    return <LoadingState />;
  }

  if (HomeError) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div>
      {/* <Carousel HomeData={HomeData} /> */}
      {/* <Categories HomeData={HomeData} /> */}
      <BestSellers HomeData={HomeData} />
      <FeaturedProducts HomeData={HomeData} />
      <NewArrivals HomeData={HomeData} />
      <FeaturedDeals HomeData={HomeData} />
    </div>
  );
}
