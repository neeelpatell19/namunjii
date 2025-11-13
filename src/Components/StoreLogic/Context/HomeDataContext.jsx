import React, { createContext, useContext, useState, useEffect } from "react";
import homeApi from "../../../apis/home";

const HomeDataContext = createContext();

export const useHomeData = () => {
  const context = useContext(HomeDataContext);
  if (!context) {
    throw new Error("useHomeData must be used within a HomeDataProvider");
  }
  return context;
};

export const HomeDataProvider = ({ children }) => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await homeApi.getHome();

      if (response.success) {
        setHomeData(response.data);
      } else {
        setError("Failed to fetch home data");
      }
    } catch (err) {
      console.error("Error fetching home data:", err);
      setError(err.message || "Failed to fetch home data");
    } finally {
      setLoading(false);
    }
  };

  const getSectionData = (sectionKey) => {
    if (!homeData) return null;
    return homeData.find(
      (section) => section.key === sectionKey || section.type === sectionKey
    );
  };

  const getCategories = () => {
    const categoriesSection = getSectionData("cicular");
    return categoriesSection?.data || [];
  };

  const getCarousel = () => {
    const carouselSection = getSectionData("carousel");
    return carouselSection?.data || [];
  };

  const getBestsellers = () => {
    const bestsellersSection = getSectionData("bestsellers");
    return bestsellersSection?.data || [];
  };

  const getFeaturedProducts = () => {
    const featuredSection = getSectionData("featuredProducts");
    return featuredSection?.data || [];
  };

  const getNewArrivals = () => {
    const newArrivalsSection = getSectionData("newArrivals");
    return newArrivalsSection?.data || [];
  };

  const getBrands = () => {
    const brandsSection = getSectionData("brands");
    return brandsSection?.data || [];
  };

  const getFeaturedDeals = () => {
    const dealsSection = getSectionData("featuredDeals");
    return dealsSection?.data || [];
  };

  const getProducts = () => {
    const productsSection = getSectionData("products");
    return productsSection?.data || [];
  };

  const getMenCategories = () => {
    const menCategoriesSection = getSectionData("menCategories");
    return menCategoriesSection?.data || [];
  };

  const getWomenCategories = () => {
    const womenCategoriesSection = getSectionData("womenCategories");
    return womenCategoriesSection?.data || [];
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const value = {
    homeData,
    loading,
    error,
    fetchHomeData,
    getSectionData,
    getCategories,
    getCarousel,
    getBestsellers,
    getFeaturedProducts,
    getNewArrivals,
    getBrands,
    getFeaturedDeals,
    getProducts,
    getMenCategories,
    getWomenCategories,
  };

  return (
    <HomeDataContext.Provider value={value}>
      {children}
    </HomeDataContext.Provider>
  );
};

export default HomeDataContext;
