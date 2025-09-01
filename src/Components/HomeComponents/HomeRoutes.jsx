import React, { useEffect } from "react";
import { motion } from "framer-motion";
import HeroHome from "./HeroHome/HeroHome";
import TrendingDesigns from "./TrendingDesigns/TrendingDesigns";
import DesignProductContainer from "./DesignProductContainer/DesignProductContainer";
import ProductForHome from "./ProductForHome/ProductForHome";
import FeaturesAndQuestion from "./FeaturesAndQuestions/FeaturesAndQuestion";
import AvailableCities from "../OthersComponents/AvailableCities/AvailableCities";
import AboutUs from "../OthersComponents/AboutUs/AboutUs";

// Animation variants for different effects
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const HomeRoutes = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <>
            {/* Hero Section - No animation needed as it's the first view */}
            <HeroHome />
            
            {/* About Us Section - Fade in from left */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInLeft}
            >
                <AboutUs />
            </motion.div>
            
            {/* Available Cities Section - Fade in from right */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInRight}
            >
                <AvailableCities />
            </motion.div>
            
            {/* Commented out components with animations for future use */}
            {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={scaleIn}
            >
                <TrendingDesigns />
            </motion.div> */}
            
            {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
            >
                <DesignProductContainer />
            </motion.div> */}
            
            {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
            >
                <ProductForHome />
            </motion.div> */}

            {/* <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
            >
                <FeaturesAndQuestion />
            </motion.div> */}
        </>
    );
};

export default HomeRoutes;