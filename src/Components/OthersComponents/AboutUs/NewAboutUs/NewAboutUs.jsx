import React, { useState, useEffect } from "react";
import "./NewAboutUs.css";

const NewAboutUs = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showHoverImage, setShowHoverImage] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-switch images on mobile
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setShowHoverImage((prev) => !prev);
    }, 3000); // Switch every 3 seconds

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="sectionPaddingTop MainContainer Container">
      <div className="grid grid-two--cols">
        <div className="left">
          <h1 className="about-title">
            Independent by Design. United by Craft.
          </h1>
          <p className="about-description">
            Namunjii connects you with curated designers across styles, price
            points, and categories — bringing you fashion that's personal,
            purposeful, and distinctly yours.
          </p>
          <button className="about-btn">
            About Us
            <span>
              <img src="/icons/Vector.svg" alt="" />
            </span>{" "}
          </button>
        </div>
        <div className="right about-image-container">
          <div
            className={`about-image-wrapper ${
              isMobile && showHoverImage ? "mobile-show-hover" : ""
            }`}
          >
            <img
              src="/Images/modern-muse1.webp"
              alt=""
              className="about-image about-image-default"
            />
            <img
              src="/Images/modern-muse2.webp"
              alt=""
              className="about-image about-image-hover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAboutUs;
