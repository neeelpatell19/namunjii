import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Spin,
  Skeleton,
  Alert,
  Select,
  Input,
  Checkbox,
  Button,
  Row,
  Col,
  Card,
  Badge,
  Drawer,
  Slider,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import ProductCard from "../../../Common/ProductCard/ProductCard";
import productApi from "../../../../apis/product";
import categoryApi from "../../../../apis/category";
import subcategoryApi from "../../../../apis/subcategory";
import brandApi from "../../../../apis/brand";
import "./ProductsPage.css";

const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [sizesLoading, setSizesLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [colorsLoading, setColorsLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    subcategory: "",
    gender: "",
    minPrice: "",
    maxPrice: "",
    size: "",
    color: "",
    brand: "",
    availability: "",
    sortBy: "most_popular",
    sortOrder: "desc",
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
    page: 1,
    limit: 20,
  });

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 15000]);
  // Local input values for debouncing (empty string for 0 to show blank)
  const [priceInput, setPriceInput] = useState(["", 15000]);
  // Search input local debounced state
  const [searchInput, setSearchInput] = useState("");

  // Filter drawer state for mobile/tablet
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  
  // Collapsible filter sections state
  const [expandedFilters, setExpandedFilters] = useState({
    size: true,
    brand: true,
    gender: true,
    priceRange: false,
    productType: false,
    colour: false,
    availability: false,
  });
  
  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Ref to track if we're in initial load
  const isInitialLoad = useRef(true);
  const hasLoadedProductsOnce = useRef(false);

  // Refs to store current values to avoid dependency issues
  const filtersRef = useRef(filters);
  const priceRangeRef = useRef(priceRange);
  const fetchProductsRef = useRef();
  const priceSliderTimerRef = useRef(null);

  // Update refs when state changes
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    priceRangeRef.current = priceRange;
  }, [priceRange, priceInput]);

  // Keep local search input in sync with filters.search (e.g., URL changes)
  useEffect(() => {
    const current = filters.search || "";
    if (searchInput !== current) {
      setSearchInput(current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  // Keep local input in sync with external priceRange changes
  useEffect(() => {
    // Only sync when priceRange changes and doesn't match priceInput
    if (Array.isArray(priceRange) && priceRange.length === 2) {
      // Convert 0 to empty string for display, but keep other values
      const normalizedInput = [
        priceRange[0] === 0 ? "" : priceRange[0],
        priceRange[1] === 0 ? "" : priceRange[1],
      ];

      // Only update if values actually changed
    if (
      !Array.isArray(priceInput) ||
        normalizedInput[0] !==
          (priceInput[0] === "" || priceInput[0] === 0 ? "" : priceInput[0]) ||
        normalizedInput[1] !==
          (priceInput[1] === "" || priceInput[1] === 0 ? "" : priceInput[1])
      ) {
        setPriceInput(normalizedInput);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceRange]);

  // Debounce applying price range filters when user edits inputs
  // (initialized later after handlePriceRangeChange definition)

  // Fetch products function
  const fetchProducts = useCallback(
    async (customFilters = null, customPriceRange = null) => {
      try {
        setLoading(true);
        setError(null);

        // Use custom filters or current ref values
        const currentFilters = customFilters || filtersRef.current;
        const currentPriceRange = customPriceRange || priceRangeRef.current;

        // Prepare query parameters
        const queryParams = { ...currentFilters };

        // Add price range
        if (currentPriceRange[0] > 0)
          queryParams.minPrice = currentPriceRange[0];
        if (currentPriceRange[1] < 50000)
          queryParams.maxPrice = currentPriceRange[1];

        // Remove empty values
        Object.keys(queryParams).forEach((key) => {
          if (queryParams[key] === "" || queryParams[key] === false) {
            delete queryParams[key];
          }
        });

        const response = await productApi.getProducts(queryParams);

        if (response.success) {
          setProducts(response.data);
          setPagination(response.pagination);
          hasLoadedProductsOnce.current = true;
        } else {
          setError(response.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load more products for infinite scroll
  const loadMoreProducts = useCallback(async () => {
    // Don't load if already loading, no more pages, or already loading more
    if (
      loading ||
      loadingMore ||
      !pagination.hasNextPage ||
      pagination.page >= pagination.totalPages
    ) {
      return;
    }

    try {
      setLoadingMore(true);
      const nextPage = pagination.page + 1;
      const currentFilters = filtersRef.current;
      const currentPriceRange = priceRangeRef.current;

      // Prepare query parameters
      const queryParams = { ...currentFilters, page: nextPage };

      // Add price range
      if (currentPriceRange[0] > 0) queryParams.minPrice = currentPriceRange[0];
      if (currentPriceRange[1] < 30000)
        queryParams.maxPrice = currentPriceRange[1];

      // Remove empty values
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === "" || queryParams[key] === false) {
          delete queryParams[key];
        }
      });

      const response = await productApi.getProducts(queryParams);

      if (response.success) {
        // Append new products to existing ones
        setProducts((prevProducts) => [...prevProducts, ...response.data]);
        setPagination(response.pagination);
        // Update filters to reflect the new page
        setFilters((prevFilters) => ({ ...prevFilters, page: nextPage }));
      }
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, pagination]);

  // Store fetchProducts in ref
  useEffect(() => {
    fetchProductsRef.current = fetchProducts;
  }, [fetchProducts]);

  // Fetch categories for selection
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryApi.getCategoriesForSelection();
        if (response.success) {
          setCategories(response.data || []);
        } else {
          console.error("Failed to fetch categories:", response.msg);
          setCategories([]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch brands for selection
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const response = await brandApi.getBrandsForSelection();
        if (response.success) {
          setBrands(response.data || []);
        } else {
          console.error("Failed to fetch brands:", response.message);
          setBrands([]);
        }
      } catch (err) {
        console.error("Error fetching brands:", err);
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Fetch sizes for selection
  useEffect(() => {
    const fetchSizes = async () => {
      try {
        setSizesLoading(true);
        const response = await productApi.getSizes();
        if (response.success) {
          setSizes(response.data || []);
        } else {
          console.error("Failed to fetch sizes:", response.message);
          setSizes([]);
        }
      } catch (err) {
        console.error("Error fetching sizes:", err);
        setSizes([]);
      } finally {
        setSizesLoading(false);
      }
    };

    fetchSizes();
  }, []);

  // Fetch colors for selection
  useEffect(() => {
    const fetchColors = async () => {
      try {
        setColorsLoading(true);
        const response = await productApi.getColors();
        if (response.success) {
          setColors(response.data || []);
        } else {
          console.error("Failed to fetch colors:", response.message);
          setColors([]);
        }
      } catch (err) {
        console.error("Error fetching colors:", err);
        setColors([]);
      } finally {
        setColorsLoading(false);
      }
    };

    fetchColors();
  }, []);

  // Initialize filters from URL params and fetch products
  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (
        key === "minPrice" ||
        key === "maxPrice" ||
        key === "page" ||
        key === "limit"
      ) {
        urlFilters[key] =
          parseInt(value) || (key === "page" ? 1 : key === "limit" ? 20 : 0);
      } else if (
        key === "isNewArrival" ||
        key === "isBestSeller" ||
        key === "isFeatured"
      ) {
        urlFilters[key] = value === "true";
      } else {
        urlFilters[key] = value;
      }
    }

    // Set price range from URL
    let newPriceRange = [0, 15000];
    if (urlFilters.minPrice || urlFilters.maxPrice) {
      newPriceRange = [urlFilters.minPrice || 0, urlFilters.maxPrice || 15000];
      setPriceRange(newPriceRange);
      // Convert 0 to empty string for display
      setPriceInput([
        newPriceRange[0] === 0 ? "" : newPriceRange[0],
        newPriceRange[1] === 0 ? "" : newPriceRange[1],
      ]);
    }

    // Update filters
    const newFilters = { ...filtersRef.current, ...urlFilters };
    
    // Normalize sortBy values
    if (newFilters.sortBy) {
      // Handle "popular" as alias for "most_popular"
      if (newFilters.sortBy === "popular") {
        newFilters.sortBy = "most_popular";
      }
      // Normalize createdAt-asc to createdAt-desc (we only support desc for createdAt)
      if (newFilters.sortBy === "createdAt" && newFilters.sortOrder === "asc") {
        newFilters.sortOrder = "desc";
      }
    } else {
      // Set default sortBy if not in URL
      newFilters.sortBy = "most_popular";
      newFilters.sortOrder = "desc";
    }
    
    setFilters(newFilters);

    // Fetch products immediately with the new filters
    if (fetchProductsRef.current) {
      fetchProductsRef.current(newFilters, newPriceRange);
    }

    // Mark that initial load is complete
    isInitialLoad.current = false;
  }, [searchParams]);

  // Note: Filter changes are handled by the updateURL function and individual handlers
  // No separate useEffect needed to avoid infinite loops

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== "" && value !== false && value !== 0) {
          if (key === "minPrice" && value > 0) params.set(key, value);
          else if (key === "maxPrice" && value > 0) params.set(key, value);
          else if (key !== "minPrice" && key !== "maxPrice")
            params.set(key, value);
        }
      });

      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key, value) => {
      // Normalize null/undefined to empty string for string filter fields
      const normalizedValue =
        value === null || value === undefined ? "" : value;
      const newFilters = { ...filters, [key]: normalizedValue, page: 1 }; // Reset to page 1 when filters change

      // If category changes, clear subcategory
      if (key === "category") {
        newFilters.subcategory = "";
      }

      setFilters(newFilters);
      updateURL(newFilters);

      // Reset products when filters change (don't append)
      setProducts([]);
      // Fetch products with new filters
      if (fetchProductsRef.current) {
        fetchProductsRef.current(newFilters, priceRange);
      }
    },
    [filters, updateURL, priceRange]
  );

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (value) => {
      // Convert empty strings to 0 for filter logic, but keep for display
      const minValue = value[0] === "" || value[0] === 0 ? 0 : value[0];
      const maxValue = value[1] === "" || value[1] === 0 ? 15000 : value[1];

      setPriceRange([minValue, maxValue]);
      const newFilters = {
        ...filters,
        minPrice: minValue > 0 ? minValue : "",
        maxPrice: maxValue < 50000 ? maxValue : "",
        page: 1,
      };
      setFilters(newFilters);
      updateURL(newFilters);

      // Reset products when price range changes (don't append)
      setProducts([]);
      // Fetch products with new price range
      if (fetchProductsRef.current) {
        fetchProductsRef.current(newFilters, [minValue, maxValue]);
      }
    },
    [filters, updateURL]
  );

  // Debounce search input -> updates filters.search
  useEffect(() => {
    const t = setTimeout(() => {
      const current = filters.search || "";
      if (searchInput !== current) {
        handleFilterChange("search", searchInput);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput, filters.search, handleFilterChange]);

  // Debounce applying price range filters when user edits inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Array.isArray(priceInput) && priceInput.length === 2) {
        // Normalize empty strings to 0 for comparison
        const normalizedInput = [
          priceInput[0] === "" || priceInput[0] === 0 ? 0 : priceInput[0],
          priceInput[1] === "" || priceInput[1] === 0 ? 15000 : priceInput[1],
        ];

        // Only trigger if values actually changed
        if (
          normalizedInput[0] !== priceRange[0] ||
          normalizedInput[1] !== priceRange[1]
      ) {
        handlePriceRangeChange(priceInput);
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [priceInput, priceRange, handlePriceRangeChange]);

  // Infinite scroll - detect when user scrolls near bottom
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll position
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // Load more when user is within 200px of bottom
      const threshold = 200;
      if (scrollHeight - (scrollTop + clientHeight) < threshold) {
        loadMoreProducts();
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [loadMoreProducts]);

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      category: "",
      subcategory: "",
      gender: "",
      minPrice: "",
      maxPrice: "",
      size: "",
      color: "",
      brand: "",
      availability: "",
      sortBy: "most_popular",
      sortOrder: "desc",
      isNewArrival: false,
      isBestSeller: false,
      isFeatured: false,
      page: 1,
      limit: 20,
    };
    setFilters(defaultFilters);
    setPriceRange([0, 15000]);
    setSearchParams(new URLSearchParams());

    // Fetch products with cleared filters
    if (fetchProductsRef.current) {
      fetchProductsRef.current(defaultFilters, [0, 15000]);
    }
  };

  // Render filters content (reusable for sidebar and drawer)
  const renderFiltersContent = () => (
    <>
      <div className="filters-header">
        <h3>Filters</h3>
      </div>


      {/* Size */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("size")}>
          <h4>SIZE</h4>
          {expandedFilters.size ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.size && (
          <div className="size-buttons">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-button ${filters.size === size ? "active" : ""}`}
                onClick={() => handleFilterChange("size", filters.size === size ? "" : size)}
                disabled={sizesLoading}
              >
              {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("brand")}>
          <h4>BRAND</h4>
          {expandedFilters.brand ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.brand && (
          <div className="checkbox-group">
            {brandsLoading ? (
              <div style={{ padding: "10px 0" }}>
                <Spin size="small" />
              </div>
            ) : brands.length > 0 ? (
              brands.map((brand, index) => (
                <Checkbox
                  key={index}
                  checked={filters.brand === brand}
                  onChange={(e) =>
                    handleFilterChange("brand", e.target.checked ? brand : "")
                  }
                >
                  {brand}
                </Checkbox>
              ))
            ) : (
              <span style={{ fontSize: "14px", color: "#999" }}>No brands available</span>
            )}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("gender")}>
          <h4>GENDER</h4>
          {expandedFilters.gender ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.gender && (
          <div className="checkbox-group">
            <Checkbox
              checked={filters.gender === "Men"}
              onChange={(e) =>
                handleFilterChange("gender", e.target.checked ? "Men" : "")
              }
            >
              Men
            </Checkbox>
            <Checkbox
              checked={filters.gender === "Women"}
              onChange={(e) =>
                handleFilterChange("gender", e.target.checked ? "Women" : "")
              }
            >
              Women
            </Checkbox>
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("priceRange")}>
          <h4>PRICE RANGE</h4>
          {expandedFilters.priceRange ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.priceRange && (
          <>
            <div className="price-range-display">
              <span className="price-range-value">
                ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              range
              min={0}
              max={50000}
              step={100}
              marks={{
                0: '₹0',
                50000: '₹50,000'
              }}
              value={priceRange}
              onChange={(value) => {
                // Ensure we can select exactly 50000
                const clampedValue = [
                  Math.max(0, Math.min(50000, value[0])),
                  Math.max(value[0], Math.min(50000, value[1]))
                ];
                setPriceRange(clampedValue);
                // Clear previous timer
                if (priceSliderTimerRef.current) {
                  clearTimeout(priceSliderTimerRef.current);
                }
                // Debounce the filter update
                priceSliderTimerRef.current = setTimeout(() => {
                  const newFilters = {
                    ...filtersRef.current,
                    minPrice: clampedValue[0] > 0 ? clampedValue[0] : "",
                    maxPrice: clampedValue[1] >= 50000 ? "" : clampedValue[1],
                    page: 1,
                  };
                  setFilters(newFilters);
                  updateURL(newFilters);
                  setProducts([]);
                  if (fetchProductsRef.current) {
                    fetchProductsRef.current(newFilters, clampedValue);
                  }
                }, 300);
              }}
              className="price-range-slider"
            />
          </>
        )}
      </div>

      {/* Color */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("colour")}>
          <h4>COLOUR</h4>
          {expandedFilters.colour ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.colour && (
        <Select
          placeholder="Select Color"
            value={filters.color || null}
          onChange={(value) => handleFilterChange("color", value)}
          allowClear
            loading={colorsLoading}
          style={{ width: "100%" }}
        >
            {colors.map((color) => (
            <Option key={color} value={color}>
              {color}
            </Option>
          ))}
        </Select>
        )}
      </div>

      {/* Product Type */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("productType")}>
          <h4>PRODUCT TYPE</h4>
          {expandedFilters.productType ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.productType && (
        <div className="checkbox-group">
          <Checkbox
            checked={filters.isNewArrival}
            onChange={(e) =>
              handleFilterChange("isNewArrival", e.target.checked)
            }
          >
            New Arrivals
          </Checkbox>
          <Checkbox
            checked={filters.isBestSeller}
            onChange={(e) =>
              handleFilterChange("isBestSeller", e.target.checked)
            }
          >
            Best Sellers
          </Checkbox>
          <Checkbox
            checked={filters.isFeatured}
            onChange={(e) => handleFilterChange("isFeatured", e.target.checked)}
          >
            Featured
          </Checkbox>
        </div>
        )}
      </div>

      {/* Availability */}
      <div className="filter-section">
        <div className="filter-section-header" onClick={() => toggleFilterSection("availability")}>
          <h4>AVAILABILITY</h4>
          {expandedFilters.availability ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.availability && (
          <div className="checkbox-group">
            <Checkbox
              checked={filters.availability === "in_stock"}
              onChange={(e) =>
                handleFilterChange("availability", e.target.checked ? "in_stock" : "")
              }
            >
              In Stock
            </Checkbox>
            <Checkbox
              checked={filters.availability === "out_of_stock"}
              onChange={(e) =>
                handleFilterChange("availability", e.target.checked ? "out_of_stock" : "")
              }
            >
              Out of Stock
            </Checkbox>
          </div>
        )}
      </div>
    </>
  );

  // Render skeleton product cards
  const renderSkeletonProducts = (count = 12) => {
    return (
      <div className="products-grid">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="product-card">
            <div
              className="product-card-image-container"
              style={{ padding: 0 }}
            >
              <Skeleton.Image
                active
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            </div>
            <div className="product-card-content" style={{ padding: "12px" }}>
              <div className="product-card-info">
                <Skeleton
                  active
                  paragraph={{ rows: 1 }}
                  title={{ width: "80%" }}
                />
                <Skeleton active paragraph={{ rows: 1, width: "50%" }} />
              </div>
              <div className="product-card-pricing">
                <Skeleton active paragraph={{ rows: 1, width: "60%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Only show full-page loading on initial load (when no products have been loaded yet)
  if (loading && !hasLoadedProductsOnce.current && products.length === 0) {
    return (
      <div className="products-page">
        <div className="products-page-container">
          <div className="products-page-content">
            {/* Filters Sidebar - Desktop */}
            <div className="filters-sidebar desktop-filters">
              {renderFiltersContent()}
            </div>

            {/* Products Content */}
            <div className="products-content">
              {/* Products Header */}
              <div className="products-header">
                <div className="products-info">
                  <Skeleton.Input active size="large" style={{ width: 200 }} />
                </div>
              </div>

              {/* Skeleton Products Grid */}
              {renderSkeletonProducts()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page-error">
        <Alert
          message="Error Loading Products"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchProducts}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-page-container">
        <div className="products-page-content">
          {/* Filters Sidebar - Desktop */}
          <div className="filters-sidebar desktop-filters">
            {renderFiltersContent()}
          </div>

          {/* Products Content */}
          <div className="products-content">
            {/* Page Title */}
            <div className="page-title-section">
              <h1 className="page-title">Products</h1>
              <p className="page-subtitle">{pagination.total} Items</p>
            </div>

            {/* Products Header */}
            <div className="products-header">
              {/* Search Bar */}
              <div className="search-section">
                <Input
                  size="middle"
                  prefix={<SearchOutlined style={{ color: '#333' }} />}
                  placeholder="Search for products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  allowClear
                  className="products-search-input"
                />
              </div>

              {/* Sort Options */}
              <div className="sort-options">
                <span className="sort-label">Sort by:</span>
                <Select
                  size="middle"
                  value={
                    filters.sortBy === "most_popular" || filters.sortBy === "popular"
                      ? "most_popular-desc"
                      : filters.sortBy === "createdAt" && filters.sortOrder === "asc"
                      ? "createdAt-desc" // Map createdAt-asc to createdAt-desc (Newest First)
                      : `${filters.sortBy}-${filters.sortOrder}`
                  }
                  onChange={(value) => {
                    const [sortBy, sortOrder] = value.split("-");
                    // Update both sortBy and sortOrder in a single filter update
                    const newFilters = { ...filters, sortBy, sortOrder, page: 1 };
                    setFilters(newFilters);
                    updateURL(newFilters);
                    
                    // Reset products when sort changes (don't append)
                    setProducts([]);
                    // Fetch products with new sort
                    if (fetchProductsRef.current) {
                      fetchProductsRef.current(newFilters, priceRangeRef.current);
                    }
                  }}
                  className="sort-select"
                >
                  <Option value="most_popular-desc">Most Popular</Option>
                  <Option value="basePricing-asc">Price: Low to High</Option>
                  <Option value="basePricing-desc">Price: High to Low</Option>
                  <Option value="productName-asc">Name: A to Z</Option>
                  <Option value="productName-desc">Name: Z to A</Option>
                  <Option value="createdAt-desc">Newest First</Option>
                </Select>

                {/* Mobile Filter Button */}
                <div className="mobile-filter-button">
                  <Button
                    type="primary"
                    icon={<FilterOutlined />}
                    onClick={() => setFilterDrawerVisible(true)}
                    size="large"
                  >
                    Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              renderSkeletonProducts()
            ) : products.length > 0 ? (
              <>
                <div className="products-grid">
                  {products.map((product) => {
                    // Use first product from products array if available, otherwise use the main product
                    // Merge main product data with first variant to ensure all fields are available
                    let displayProduct = product;
                    
                    if (product.products && product.products.length > 0) {
                      const firstVariant = product.products[0];
                      // Merge variant data with main product data (variant takes precedence for size/color/image)
                      displayProduct = {
                        ...product,
                        ...firstVariant,
                        // Keep important main product fields
                        category: product.category,
                        subcategory: product.subcategory,
                        vendorId: product.vendorId,
                        details: product.details,
                        productDescription: product.productDescription,
                        status: product.status,
                        isArchived: product.isArchived,
                        isNewArrival: product.isNewArrival,
                        isBestSeller: product.isBestSeller,
                        isFeatured: product.isFeatured,
                        createdAt: product.createdAt,
                        updatedAt: product.updatedAt,
                      };
                    }
                    
                    return (
                      <ProductCard
                        key={displayProduct._id || product._id}
                        product={displayProduct}
                        showViewProduct={true}
                      />
                    );
                  })}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <Spin size="large" />
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <Alert
                  message="No Products Found"
                  description="Try adjusting your filters or search terms to find more products."
                  type="info"
                  showIcon
                  action={<Button onClick={clearFilters}>Clear Filters</Button>}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Filter Drawer */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={320}
        className="mobile-filter-drawer"
      >
        {renderFiltersContent()}
      </Drawer>
    </div>
  );
};

export default ProductsPage;
