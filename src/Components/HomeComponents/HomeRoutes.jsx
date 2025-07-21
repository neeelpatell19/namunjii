import React from "react";
import HeroHome from "./HeroHome/HeroHome";
import TrendingDesigns from "./TrendingDesigns/TrendingDesigns";
import DesignProductContainer from "./DesignProductContainer/DesignProductContainer";
import ProductForHome from "./ProductForHome/ProductForHome";
import FeaturesAndQuestion from "./FeaturesAndQuestions/FeaturesAndQuestion";

const HomeRoutes = () => {
    return (
        <>
            <HeroHome />
            <TrendingDesigns />
            <DesignProductContainer />
            <ProductForHome />
            <FeaturesAndQuestion />
        </>
    );
};

export default HomeRoutes;