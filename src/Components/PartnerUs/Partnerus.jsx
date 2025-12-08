import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Partner.css";

const Partnerus = () => {
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

  return (
    <div className="partnerus-container MainContainer Container">
      <div className="partnerus-img">
        <img src="./Images/PartnerUsImage.webp" alt="img" />
      </div>
      <div className="partnerus-content">
        {isMobile ? (
          <>
            <div className="partnerus-title-mobile">
              <p>PARTNER WITH US</p>
              <div className="partnerus-input-button-mobile">
                <Link to={"/vendor-verification"}>
                  <button className="joinus-btn">
                    Join Us{" "}
                    <span>
                      <img src="/icons/TiltedArrow.svg" alt="arrow" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            <div className="partnerus-text">
              <p>
                Showcase your creations with us! Connect, collaborate, and be
                part of a growing homegrown fashion community. Let's bring your
                designs to a wider audience together.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="partnerus-title">
              <p>PARTNER WITH US</p>
            </div>
            <div className="partnerus-text">
              <p>
                Showcase your creations with us! Connect, collaborate, and be
                part of a growing homegrown fashion community. Let's bring your
                designs to a wider audience together.
              </p>
            </div>
            <div className="partnerus-cta">
              <div className="partnerus-input-button">
                <Link to={"/vendor-verification"}>
                  <button>
                    Join Us{" "}
                    <span>
                      <img src="/icons/TiltedArrow.svg" alt="arrow" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Partnerus;
