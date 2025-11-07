import React from "react";
import "./Maintenance.css";

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        <div className="maintenance-logo">
          <img
            src="/LogoImages/BrandColorIconLogo.svg"
            alt="Namunjii"
            className="logo-image"
          />
        </div>
        <h1 className="maintenance-title">
          We're currently updating our website
        </h1>
        <p className="maintenance-message">
          We apologize for any inconvenience. Our website will be available soon.
          Thank you for your patience.
        </p>
        <div className="maintenance-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

