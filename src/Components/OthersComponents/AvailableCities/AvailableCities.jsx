import react from "react";
import { motion } from "framer-motion";
import "./AvailableCities.css";

import { Link } from "react-router-dom";
// Animation variants for staggered animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const cityCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const AvailableCities = () => {
    const cities = [
        "Ahmedabad", "Bengaluru", "Chennai", "Dehradun", "Delhi", "Goa",
        "Hydrabad", "Jodhpur", "Mumbai", "Dubai", "Rishikesh", "Udaipur"
    ];

    const contactInfo = {
        instagram: "@digvijaysingh_artwear",
        email: "digvijaysinghlabel@gmail.com"
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="MainContainer paddingBottom50 AllProductsPage ">
            <div className="PaddingTop">
                <motion.div
                    className="Container"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                >
                    <motion.div
                        className="marginBottom50 text-center"
                        variants={itemVariants}
                    >
                        <h2>Our Presence</h2>
                        <p><b>across luxury retail spaces</b></p>
                    </motion.div>

                    {/* Desktop Grid Layout */}
                    <motion.div
                        className="CitiesGridContainer DesktopOnly"
                        variants={containerVariants}
                    >
                        {cities
                            .slice() // Create a copy to avoid mutating the original array
                            .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
                            .map((city, index) => (
                                <motion.div
                                    key={index}
                                    className="CityNameCard"
                                    variants={cityCardVariants}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className="CityName">{city}</span>
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
                            .sort((a, b) => a.localeCompare(b)) // Sort alphabetically
                            .map((city, index) => (
                                <motion.div
                                    key={index}
                                    className="CityNameCardMobile"
                                    variants={cityCardVariants}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className="CityName">{city}</span>
                                </motion.div>
                            ))}
                    </motion.div>

                    <motion.div
                        className="text-center marginTop50"
                        variants={itemVariants}
                    >

                        <p className="CitiesNote">
                            Don't see your city? <Link to="mailto:design@namunjii.com"><span className="ContactLink">Contact us</span></Link> to bring our luxury atelier services to your area.
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
                    <img src="https://s3.ap-south-1.amazonaws.com/prepseed/prod/ldoc/media/modern-city-skyline.png" alt="" />
                </motion.div>
            </div>
        </div>
    )
}

export default AvailableCities;