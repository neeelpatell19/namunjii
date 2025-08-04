import React, { useEffect } from "react";
import HeroHome from "./HeroHome/HeroHome";
import TrendingDesigns from "./TrendingDesigns/TrendingDesigns";
import DesignProductContainer from "./DesignProductContainer/DesignProductContainer";
import ProductForHome from "./ProductForHome/ProductForHome";
import FeaturesAndQuestion from "./FeaturesAndQuestions/FeaturesAndQuestion";
import AvailableCities from "../OthersComponents/AvailableCities/AvailableCities";

const HomeRoutes = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <HeroHome />
            <TrendingDesigns />
            <AvailableCities />
            <DesignProductContainer />
            {/* <ProductForHome /> */}

            {/* <FeaturesAndQuestion /> */}
        </>
    );
};

export default HomeRoutes;