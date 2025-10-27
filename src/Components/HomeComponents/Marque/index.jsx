import React from "react";
import "./Marque.css";

const brands = [
  "Kara by Ishita",
  "Kaiva Designs",
  "Saanvi Threads",
  "Rooh & Raag",
  "Avira Studio",
  "Tavisha",
  // add more brands here
];

export default function BrandMarquee() {
  // To create a seamless effect, repeat the brand list twice
  const displayBrands = [...brands, ...brands];

  return (
    <div className="brand-marquee-container">
      <div className="brand-marquee-track">
        {displayBrands.map((brand, idx) => (
          <span className="brand-marquee-item" key={idx}>
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
