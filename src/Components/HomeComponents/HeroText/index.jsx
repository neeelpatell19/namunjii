import React from "react";
import "./SectionHeading.css";

export default function SectionHeading() {
  // Wrap each letter in Namunjii with the 'letter' class for animation
  const brandText = "Namunjii";
  const brandLetters = brandText.split("").map((char, i) => (
    <span key={i} className="letter">
      {char}
    </span>
  ));

  return (
    <div className="section-heading">
      <h2 className="section-title">Independent by Design. United by Craft.</h2>
      <div className="section-description">
        <h2 className="jt">
          <span className="section-brand">{brandLetters}</span> connects you
          with curated designers across
        </h2>
        <h2 className="jt1">
          styles, price points, and categories — bringing you fashion
        </h2>
        <h2 className="jt2">
          that's personal, purposeful, and distinctly yours.
        </h2>
      </div>
    </div>
  );
}
