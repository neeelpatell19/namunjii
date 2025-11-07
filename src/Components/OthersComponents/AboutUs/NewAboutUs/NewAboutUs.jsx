import React from "react";
import "./NewAboutUs.css";

const NewAboutUs = () => {
  return (
    <div className="sectionPaddingTop MainContainer Container">
      <div className="grid grid-two--cols">
        <div className="left">
          <h1 className="about-title">
            The Designer Collective for the Modern Muse
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
          <img src="/Images/DemoImage3.jpg" alt="" className="about-image" />
        </div>
      </div>
    </div>
  );
};

export default NewAboutUs;
