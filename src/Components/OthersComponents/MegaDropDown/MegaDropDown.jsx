import React, { useEffect } from "react";
import "./MegaDropDown.css";

const MegaDropDown = () => {
  useEffect(() => {
    if (window.fbq) window.fbq("track", "MegaDropDownPageView");
  }, []);
  return <div className="mega-dropdown"></div>;
};

export default MegaDropDown;
