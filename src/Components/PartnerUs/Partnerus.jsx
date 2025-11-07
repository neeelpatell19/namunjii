import React from "react";
import { Link } from "react-router-dom";
import "./Partner.css";

const Partnerus = () => {
  return (
    <div className="partnerus-container MainContainer Container">
      <div className="partnerus-img">
        <img src="./Images/PartnerUsImage.svg" alt="img" />
      </div>
      <div className="partnerus-content">
        <div className="partnerus-title">
          <p>PARTNER WITH US</p>
        </div>
        <div className="partnerus-text">
          <p>
            Showcase your creations with us! Connect, collaborate, and be part
            of a growing homegrown fashion community. Let's bring your designs
            to a wider audience together.
          </p>
        </div>
        <div className="partnerus-cta">
          <div className="partnerus-input-button">
            <Link to={"/vendor-verification"}>
              <button>
                Join us <span><img src="/icons/TiltedArrow.svg" alt="arrow" /></span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerus;
