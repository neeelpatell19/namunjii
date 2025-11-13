import React, { useState, useEffect } from "react";
import "./SizeGuide.css";

const SizeGuide = ({ gender }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const womenSizes = [
    {
      size: "XS",
      bustIn: 32,
      bustCm: 81,
      waistIn: 25,
      waistCm: 64,
      hipIn: 34,
      hipCm: 86,
      shoulderIn: 14.5,
      shoulderCm: 36.5,
      topLengthIn: 24,
      topLengthCm: 61,
    },
    {
      size: "S",
      bustIn: 34,
      bustCm: 86,
      waistIn: 27,
      waistCm: 69,
      hipIn: 36,
      hipCm: 91,
      shoulderIn: 15,
      shoulderCm: 38,
      topLengthIn: 25,
      topLengthCm: 63,
    },
    {
      size: "M",
      bustIn: 36,
      bustCm: 91,
      waistIn: 29,
      waistCm: 74,
      hipIn: 38,
      hipCm: 97,
      shoulderIn: 15.5,
      shoulderCm: 39.5,
      topLengthIn: 26,
      topLengthCm: 66,
    },
    {
      size: "L",
      bustIn: 38,
      bustCm: 97,
      waistIn: 31,
      waistCm: 79,
      hipIn: 40,
      hipCm: 102,
      shoulderIn: 16,
      shoulderCm: 40.5,
      topLengthIn: 27,
      topLengthCm: 68,
    },
    {
      size: "XL",
      bustIn: 40,
      bustCm: 102,
      waistIn: 33,
      waistCm: 84,
      hipIn: 42,
      hipCm: 107,
      shoulderIn: 16.5,
      shoulderCm: 42,
      topLengthIn: 28,
      topLengthCm: 71,
    },
    {
      size: "XXL",
      bustIn: 42,
      bustCm: 107,
      waistIn: 35,
      waistCm: 89,
      hipIn: 44,
      hipCm: 112,
      shoulderIn: 17,
      shoulderCm: 43,
      topLengthIn: 29,
      topLengthCm: 74,
    },
    {
      size: "3XL",
      bustIn: 44,
      bustCm: 112,
      waistIn: 37,
      waistCm: 94,
      hipIn: 46,
      hipCm: 117,
      shoulderIn: 17.5,
      shoulderCm: 44.5,
      topLengthIn: 30,
      topLengthCm: 76,
    },
  ];

  const menSizes = [
    {
      size: "XS",
      chestIn: 34,
      chestCm: 86,
      waistIn: 28,
      waistCm: 71,
      hipIn: 35,
      hipCm: 89,
      shoulderIn: 15,
      shoulderCm: 38,
      trouserIn: 30,
      trouserCm: 76,
    },
    {
      size: "S",
      chestIn: 36,
      chestCm: 91,
      waistIn: 30,
      waistCm: 76,
      hipIn: 37,
      hipCm: 94,
      shoulderIn: 15.5,
      shoulderCm: 39,
      trouserIn: 31,
      trouserCm: 79,
    },
    {
      size: "M",
      chestIn: 38,
      chestCm: 97,
      waistIn: 32,
      waistCm: 81,
      hipIn: 39,
      hipCm: 99,
      shoulderIn: 16,
      shoulderCm: 41,
      trouserIn: 32,
      trouserCm: 81,
    },
    {
      size: "L",
      chestIn: 40,
      chestCm: 102,
      waistIn: 34,
      waistCm: 86,
      hipIn: 41,
      hipCm: 104,
      shoulderIn: 16.5,
      shoulderCm: 42,
      trouserIn: 32.5,
      trouserCm: 83,
    },
    {
      size: "XL",
      chestIn: 42,
      chestCm: 107,
      waistIn: 36,
      waistCm: 91,
      hipIn: 43,
      hipCm: 109,
      shoulderIn: 17,
      shoulderCm: 43,
      trouserIn: 33,
      trouserCm: 84,
    },
    {
      size: "XXL",
      chestIn: 44,
      chestCm: 112,
      waistIn: 38,
      waistCm: 96,
      hipIn: 45,
      hipCm: 114,
      shoulderIn: 17.5,
      shoulderCm: 44.5,
      trouserIn: 33,
      trouserCm: 84,
    },
    {
      size: "3XL",
      chestIn: 46,
      chestCm: 117,
      waistIn: 40,
      waistCm: 101,
      hipIn: 47,
      hipCm: 119,
      shoulderIn: 18,
      shoulderCm: 46,
      trouserIn: 33,
      trouserCm: 84,
    },
  ];

  // Women's measurement rows for transposed table
  const womenMeasurements = [
    { label: "Bust (in)", key: "bustIn" },
    { label: "Bust (cm)", key: "bustCm" },
    { label: "Waist (in)", key: "waistIn" },
    { label: "Waist (cm)", key: "waistCm" },
    { label: "Hip (in)", key: "hipIn" },
    { label: "Hip (cm)", key: "hipCm" },
    { label: "Shoulder (in)", key: "shoulderIn" },
    { label: "Shoulder (cm)", key: "shoulderCm" },
    { label: "Top Length (in)", key: "topLengthIn" },
    { label: "Top Length (cm)", key: "topLengthCm" },
  ];

  // Men's measurement rows for transposed table
  const menMeasurements = [
    { label: "Chest (in)", key: "chestIn" },
    { label: "Chest (cm)", key: "chestCm" },
    { label: "Waist (in)", key: "waistIn" },
    { label: "Waist (cm)", key: "waistCm" },
    { label: "Hip (in)", key: "hipIn" },
    { label: "Hip (cm)", key: "hipCm" },
    { label: "Shoulder (in)", key: "shoulderIn" },
    { label: "Shoulder (cm)", key: "shoulderCm" },
    { label: "Trouser/Inseam (in)", key: "trouserIn" },
    { label: "Trouser/Inseam (cm)", key: "trouserCm" },
  ];

  // Determine which charts to show based on gender
  const showWomenChart = !gender || gender === "Women";
  const showMenChart = !gender || gender === "Men";

  return (
    <div className="size-guide-container">
      {/* Women's Size Chart */}
      {showWomenChart && (
      <div className="size-chart-section">
        <h3 className="size-chart-title">WOMEN'S SIZE CHART</h3>
        <div className="size-chart-table-wrapper">
          {/* Desktop Table */}
          <table className={`size-chart-table ${isMobile ? "mobile-hide" : ""}`}>
            <thead>
              <tr>
                <th>Size Label</th>
                <th>Bust (in)</th>
                <th>Bust (cm)</th>
                <th>Waist (in)</th>
                <th>Waist (cm)</th>
                <th>Hip (in)</th>
                <th>Hip (cm)</th>
                <th>Shoulder (in)</th>
                <th>Shoulder (cm)</th>
                <th>Top Length (in)</th>
                <th>Top Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              {womenSizes.map((item, index) => (
                <tr key={index}>
                  <td className="size-label">{item.size}</td>
                  <td>{item.bustIn}</td>
                  <td>{item.bustCm}</td>
                  <td>{item.waistIn}</td>
                  <td>{item.waistCm}</td>
                  <td>{item.hipIn}</td>
                  <td>{item.hipCm}</td>
                  <td>{item.shoulderIn}</td>
                  <td>{item.shoulderCm}</td>
                  <td>{item.topLengthIn}</td>
                  <td>{item.topLengthCm}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Transposed Table */}
          <table className={`size-chart-table size-chart-table-mobile ${!isMobile ? "mobile-hide" : ""}`}>
            <thead>
              <tr>
                <th>Measurement</th>
                {womenSizes.map((item) => (
                  <th key={item.size} className="size-label">
                    {item.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {womenMeasurements.map((measurement, index) => (
                <tr key={index}>
                  <td className="measurement-label">{measurement.label}</td>
                  {womenSizes.map((item) => (
                    <td key={item.size}>{item[measurement.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Men's Size Chart */}
      {showMenChart && (
      <div className="size-chart-section">
        <h3 className="size-chart-title">MEN'S SIZE CHART</h3>
        <div className="size-chart-table-wrapper">
          {/* Desktop Table */}
          <table className={`size-chart-table ${isMobile ? "mobile-hide" : ""}`}>
            <thead>
              <tr>
                <th>Size Label</th>
                <th>Chest (in)</th>
                <th>Chest (cm)</th>
                <th>Waist (in)</th>
                <th>Waist (cm)</th>
                <th>Hip (in)</th>
                <th>Hip (cm)</th>
                <th>Shoulder (in)</th>
                <th>Shoulder (cm)</th>
                <th>Trouser/Inseam (in)</th>
                <th>Trouser/Inseam (cm)</th>
              </tr>
            </thead>
            <tbody>
              {menSizes.map((item, index) => (
                <tr key={index}>
                  <td className="size-label">{item.size}</td>
                  <td>{item.chestIn}</td>
                  <td>{item.chestCm}</td>
                  <td>{item.waistIn}</td>
                  <td>{item.waistCm}</td>
                  <td>{item.hipIn}</td>
                  <td>{item.hipCm}</td>
                  <td>{item.shoulderIn}</td>
                  <td>{item.shoulderCm}</td>
                  <td>{item.trouserIn}</td>
                  <td>{item.trouserCm}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Transposed Table */}
          <table className={`size-chart-table size-chart-table-mobile ${!isMobile ? "mobile-hide" : ""}`}>
            <thead>
              <tr>
                <th>Measurement</th>
                {menSizes.map((item) => (
                  <th key={item.size} className="size-label">
                    {item.size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menMeasurements.map((measurement, index) => (
                <tr key={index}>
                  <td className="measurement-label">{measurement.label}</td>
                  {menSizes.map((item) => (
                    <td key={item.size}>{item[measurement.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  );
};

export default SizeGuide;

