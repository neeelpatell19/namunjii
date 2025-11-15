import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./HeroHome.css";
import { HomePageCrousaltext } from "./HomePageData";

// Animation variants for hero animations
const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

const videoVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut"
        }
    }
};

const HeroHome = () => {
    const { CarousalText } = HomePageCrousaltext;
    const location = useLocation();
    const isAboutUsPage = location.pathname.includes('/about-us');
    
    // Determine video source based on current route
    const videoSource = isAboutUsPage
        ? '/Videos/namunjii_landing_page.mp4'
        : '/Videos/namunjii_aboutUs_page.mp4';

    return (
        <div className="HeroHomeContainerWithoutPadding">
            <div className="HeroHomeContainer">
                {/* Video Background */}
                <motion.div 
                    className="VideoContainer"
                    initial="hidden"
                    animate="visible"
                    variants={videoVariants}
                >
                    <video
                        className="hero-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                        key={videoSource}
                    >
                        <source src={videoSource} type="video/mp4" />
                    </video>
                    {/* Dark translucent overlay */}
                    <div className={`video-overlay ${isAboutUsPage ? 'video-overlay-darker' : ''}`}></div>
                </motion.div>

                {/* Text Overlay */}
                <motion.div 
                    className="TextChangeContainer"
                    initial="hidden"
                    animate="visible"
                    variants={textVariants}
                >
                    <div className="TextChangeContent">
                        <div className="carousel-text">
                            {CarousalText.map((textItem, index) => (
                                <div
                                    key={index}
                                    className="text-item active"
                                >
                                    <h2 style={{color:"white"}}>{textItem.text}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HeroHome;