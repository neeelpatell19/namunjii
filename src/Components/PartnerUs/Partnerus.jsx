import React from "react";
import "./Partner.css";

const Partnerus = () => {
  return (
    <div className="partnerus-container MainContainer Container ">
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
            <input
              type="email"
              placeholder="Enter Your Email Here"
              className="input-field"
            />
            <button>
              Connect with us
             
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerus;
