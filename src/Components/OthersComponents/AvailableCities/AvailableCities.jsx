import React from "react";
import "./AvailableCities.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// Import all city icons from Cityicon folder
import AhmedabadIcon from "../../../assets/Cityicon/Ahmedabad.svg";
import BengaluruIcon from "../../../assets/Cityicon/Bengaluru.svg";
import ChennaiIcon from "../../../assets/Cityicon/Chennai.svg";
import DehradunIcon from "../../../assets/Cityicon/Dehradun.svg";
import DelhiIcon from "../../../assets/Cityicon/Delhi.svg";
import GoaIcon from "../../../assets/Cityicon/Goa.svg";
import HyderabadIcon from "../../../assets/Cityicon/Hyderabad.svg";
import JodhpurIcon from "../../../assets/Cityicon/Jodhpur.svg";
import MumbaiIcon from "../../../assets/Cityicon/Mumbai.svg";
import DubaiIcon from "../../../assets/Cityicon/Dubai.svg";
import RishikeshIcon from "../../../assets/Cityicon/Rishikesh.svg";
import UdaipurIcon from "../../../assets/Cityicon/Udaipur.svg";

// Animation variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const cityCardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const AvailableCities = () => {
  const cities = [
    // "Ahmedabad",
    // "Bengaluru",
    // "Chennai",
    // "Dehradun",
    // "Delhi",
    // "Goa",
    // "Hydrabad",
    // "Jodhpur",
    // "Mumbai",
    // "Dubai",
    // "Rishikesh",
    // "Udaipur",

    { name: "Ahmedabad", icon: AhmedabadIcon },
    { name: "Bengaluru", icon: BengaluruIcon },
    { name: "Chennai", icon: ChennaiIcon },
    { name: "Dehradun", icon: DehradunIcon },
    { name: "Delhi", icon: DelhiIcon },
    { name: "Goa", icon: GoaIcon },
    { name: "Hyderabad", icon: HyderabadIcon },
    { name: "Jodhpur", icon: JodhpurIcon },
    { name: "Mumbai", icon: MumbaiIcon },
    { name: "Dubai", icon: DubaiIcon },
    { name: "Rishikesh", icon: RishikeshIcon },
    { name: "Udaipur", icon: UdaipurIcon },
  ];

  return (
    <div className="MainContainer paddingBottom20 AllProductsPage ">
      <div className="paddingTop30">
        <motion.div
          className="Container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div
            className="marginBottom20 marginTop20 text-center"
            variants={itemVariants}
          >
            <h2 className="About-heading">Our Presence</h2>
            <p>
             
            </p>
          </motion.div>

          {/* Desktop Grid Layout */}
          <motion.div
            className="CitiesGridContainer DesktopOnly"
            variants={containerVariants}
          >
            {cities
              .slice() // Create a copy to avoid mutating the original array
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
              .map((city, index) => (
                <motion.div
                  key={index}
                  className="CityNameCard"
                  variants={cityCardVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={city.icon}
                    alt={`${city.name} icon`}
                    className="CityIcon"
                  />
                  <span className="CityName">{city.name}</span>
                </motion.div>
              ))}
          </motion.div>

          {/* Mobile Grid Layout - 2 items per row */}
          <motion.div
            className="CitiesGridContainerMobile MobileOnly"
            variants={containerVariants}
          >
            {cities
              .slice() // Create a copy to avoid mutating the original array
              .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
              .map((city, index) => (
                <motion.div
                  key={index}
                  className="CityNameCardMobile"
                  variants={cityCardVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={city.icon}
                    alt={`${city.name} icon`}
                    className="CityIconMobile"
                  />
                  <span className="CityName">{city.name}</span>
                </motion.div>
              ))}
          </motion.div>

          <motion.div
            className="text-center marginTop20"
            variants={itemVariants}
          >
            <p className="CitiesNote">
              Don't see your city?{" "}
              <Link to="mailto:design@namunjii.com">
                <span className="ContactLink">Contact us</span>
              </Link>{" "}
              to bring our luxury atelier services to your area.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className="backgroundFadeCityImage"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <img
            src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/modern-city-skyline.png"
            alt=""
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AvailableCities;
