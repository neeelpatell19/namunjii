import React from "react";
import HeroHome from "./HeroHome/HeroHome";
import TrendingDesigns from "./TrendingDesigns/TrendingDesigns";
import DesignProductContainer from "./DesignProductContainer/DesignProductContainer";
import ProductForHome from "./ProductForHome/ProductForHome";
import FeaturesAndQuestion from "./FeaturesAndQuestions/FeaturesAndQuestion";
import AvailableCities from "../OthersComponents/AvailableCities/AvailableCities";

const HomeRoutes = () => {
    return (
        <>
            <HeroHome />
            <TrendingDesigns />
            <DesignProductContainer />
            {/* <ProductForHome /> */}
            <AvailableCities />
            {/* <FeaturesAndQuestion /> */}
        </>
    );
};

export default HomeRoutes;