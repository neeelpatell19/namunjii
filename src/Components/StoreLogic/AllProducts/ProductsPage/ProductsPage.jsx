import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
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
  Dropdown,
  Menu,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
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
  const navigate = useNavigate();

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
    gender: "", // Added for Men/Women filtering
    productType: "", // Added for Accessories filtering
    minPrice: "",
    maxPrice: "",
    size: [], // Changed to array for multi-select
    color: [], // Changed to array for multi-select
    brand: [], // Changed to array for multi-select
    orderType: "",
    sortBy: "most_popular",
    sortOrder: "desc",
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
    isNamunjiiExclusive: false,
    page: 1,
    limit: 20,
  });

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 100000]);
  // Local input values for debouncing (empty string for 0 to show blank)
  const [priceInput, setPriceInput] = useState(["", 100000]);
  // Search input local debounced state
  const [searchInput, setSearchInput] = useState("");

  // Search suggestions state
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const searchDesktopRef = useRef(null);

  // Filter drawer state for mobile/tablet
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false);

  // Sort select ref
  const sortSelectRef = useRef(null);

  // Grid layout state (mobile, tablet, desktop)
  const [gridLayout, setGridLayout] = useState({
    mobile: 2, // default: 2 per row
    tablet: 2, // default: 2 per row
    desktop: 3, // default: 3 per row
  });

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Grid layout icons component - shows double the boxes (2x columns) - outlined style
  const GridIcon = ({ columns }) => {
    const size = 16;
    const gap = 2; // Increased gap between boxes
    const strokeWidth = 1;
    const totalBoxes = columns * 2; // Double the number of boxes

    // Determine grid arrangement based on number of boxes
    let rows, cols;
    if (totalBoxes === 2) {
      // 1 per row → 2 horizontal bars stacked vertically (one after the other)
      rows = 2;
      cols = 1;
    } else if (totalBoxes === 4) {
      // 2 per row → 4 boxes total
      rows = 2;
      cols = 2;
    } else if (totalBoxes === 6) {
      // 3 per row → 6 boxes total
      rows = 2;
      cols = 3;
    } else {
      // 8 boxes (4 per row)
      rows = 2;
      cols = 4;
    }

    // Calculate box dimensions accounting for stroke width
    let boxWidth, boxHeight;
    if (totalBoxes === 2) {
      // 1 per row → 2 horizontal bars (wider than tall, stacked vertically)
      boxWidth = size * 0.8; // Make boxes horizontal (wider than tall)
      boxHeight = (size - gap) / 2; // Two bars with gap between them
    } else {
      boxWidth = (size - gap * (cols - 1)) / cols;
      boxHeight = (size - gap * (rows - 1)) / rows;
    }

    const strokeOffset = strokeWidth / 2; // Half stroke width to prevent overlap

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: totalBoxes }).map((_, index) => {
          const rowIndex = Math.floor(index / cols);
          const colIndex = index % cols;

          // For 1 per row (2 boxes), center them horizontally
          let x, y;
          if (totalBoxes === 2) {
            x = (size - boxWidth) / 2 + strokeOffset; // Center horizontally
            y = rowIndex * (boxHeight + gap) + strokeOffset;
          } else {
            x = colIndex * (boxWidth + gap) + strokeOffset;
            y = rowIndex * (boxHeight + gap) + strokeOffset;
          }

          const width = boxWidth - strokeWidth;
          const height = boxHeight - strokeWidth;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={width}
              height={height}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinejoin="miter"
              rx="0.5"
            />
          );
        })}
      </svg>
    );
  };

  // Collapsible filter sections state
  const [expandedFilters, setExpandedFilters] = useState({
    gender: true,
    size: true,
    brand: true,
    priceRange: false,
    colour: false,
    orderType: false,
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
  const lastFilterTypeRef = useRef(null);

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
        if (currentPriceRange[1] < 100000)
          queryParams.maxPrice = currentPriceRange[1];

        // Remove empty values (handle arrays and simple values)
        Object.keys(queryParams).forEach((key) => {
          const value = queryParams[key];
          // Remove if: empty string, false, empty array
          if (
            value === "" ||
            value === false ||
            (Array.isArray(value) && value.length === 0)
          ) {
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
  // This respects all active filters including multi-select filters
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
      if (currentPriceRange[1] < 100000)
        queryParams.maxPrice = currentPriceRange[1];

      // Remove empty values (handle arrays and simple values)
      Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key];
        // Remove if: empty string, false, empty array
        if (
          value === "" ||
          value === false ||
          (Array.isArray(value) && value.length === 0)
        ) {
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

  // Helper function to determine filter type based on active tab
  const getFilterType = useCallback(() => {
    if (filters.isNamunjiiExclusive) {
      return "Exclusive";
    } else if (filters.productType === "accessory") {
      return "Accessories";
    } else if (filters.gender === "Men") {
      return "Men";
    } else if (filters.gender === "Women") {
      return "Women";
    }
    return null;
  }, [filters.isNamunjiiExclusive, filters.productType, filters.gender]);

  // Fetch brands, sizes, and colors for selection (dynamic based on active tab)
  // Combined into one useEffect to prevent multiple calls
  useEffect(() => {
    // Determine the current filter type
    const currentType = getFilterType();
    
    // Only fetch if the type has changed (prevent duplicate calls)
    if (currentType === lastFilterTypeRef.current) {
      return;
    }
    
    // Update the ref to track the current type
    lastFilterTypeRef.current = currentType;

    // Fetch all three in parallel
    const fetchAll = async () => {
      try {
        setBrandsLoading(true);
        setSizesLoading(true);
        setColorsLoading(true);

        const [brandsResponse, sizesResponse, colorsResponse] = await Promise.all([
          brandApi.getBrandsForSelection(currentType),
          productApi.getSizes(currentType),
          productApi.getColors(currentType),
        ]);

        if (brandsResponse.success) {
          setBrands(brandsResponse.data || []);
        } else {
          console.error("Failed to fetch brands:", brandsResponse.message);
          setBrands([]);
        }

        if (sizesResponse.success) {
          setSizes(sizesResponse.data || []);
        } else {
          console.error("Failed to fetch sizes:", sizesResponse.message);
          setSizes([]);
        }

        if (colorsResponse.success) {
          setColors(colorsResponse.data || []);
        } else {
          console.error("Failed to fetch colors:", colorsResponse.message);
          setColors([]);
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setBrands([]);
        setSizes([]);
        setColors([]);
      } finally {
        setBrandsLoading(false);
        setSizesLoading(false);
        setColorsLoading(false);
      }
    };

    fetchAll();
  }, [filters.gender, filters.productType, filters.isNamunjiiExclusive]);

  // Fetch subcategories when category or gender changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!filters.category && !filters.gender) {
        setSubcategories([]);
        return;
      }

      try {
        setSubcategoriesLoading(true);
        const params = {};
        if (filters.category) {
          params.category = filters.category;
        }
        if (filters.gender) {
          params.gender = filters.gender;
        }
        const response = await subcategoryApi.getSubCategoriesForSelection(
          params
        );
        if (response.success) {
          setSubcategories(response.data || []);
        } else {
          console.error("Failed to fetch subcategories:", response.message);
          setSubcategories([]);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubcategories([]);
      } finally {
        setSubcategoriesLoading(false);
      }
    };

    fetchSubcategories();
  }, [filters.category, filters.gender]);

  // Initialize filters from URL params and fetch products
  // This ensures filters are properly applied from URL, including multi-select filters
  useEffect(() => {
    const urlFilters = {};

    // Handle multi-value params (size, brand, color)
    const multiSelectKeys = ["size", "brand", "color"];
    multiSelectKeys.forEach((key) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        urlFilters[key] = values;
      }
    });

    // Handle all other single-value params
    for (const [key, value] of searchParams.entries()) {
      // Skip if already handled in multi-select
      if (multiSelectKeys.includes(key)) {
        continue;
      }

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
        key === "isFeatured" ||
        key === "isNamunjiiExclusive"
      ) {
        urlFilters[key] = value === "true";
      } else {
        // Handle all other filters
        urlFilters[key] = value;
      }
    }

    // Set price range from URL
    let newPriceRange = [0, 100000];
    if (urlFilters.minPrice || urlFilters.maxPrice) {
      newPriceRange = [urlFilters.minPrice || 0, urlFilters.maxPrice || 100000];
      setPriceRange(newPriceRange);
      // Convert 0 to empty string for display
      setPriceInput([
        newPriceRange[0] === 0 ? "" : newPriceRange[0],
        newPriceRange[1] === 0 ? "" : newPriceRange[1],
      ]);
    }

    // Update filters
    const newFilters = { ...filtersRef.current, ...urlFilters };

    // Reset boolean filters to false if they're not present in the URL
    // This ensures that when navigating away from pages with these filters,
    // they don't persist incorrectly
    if (!searchParams.has("isNamunjiiExclusive")) {
      newFilters.isNamunjiiExclusive = false;
    }
    if (!searchParams.has("isNewArrival")) {
      newFilters.isNewArrival = false;
    }
    if (!searchParams.has("isBestSeller")) {
      newFilters.isBestSeller = false;
    }
    if (!searchParams.has("isFeatured")) {
      newFilters.isFeatured = false;
    }

    // Reset multi-select filters to empty arrays if not present in URL
    if (!searchParams.has("size")) {
      newFilters.size = [];
    }
    if (!searchParams.has("brand")) {
      newFilters.brand = [];
    }
    if (!searchParams.has("color")) {
      newFilters.color = [];
    }

    // Reset string filters to empty if not present in URL - CRITICAL for tab switching
    if (!searchParams.has("gender")) {
      newFilters.gender = "";
    }
    if (!searchParams.has("productType")) {
      newFilters.productType = "";
    }
    if (!searchParams.has("category")) {
      newFilters.category = "";
    }
    if (!searchParams.has("subcategory")) {
      newFilters.subcategory = "";
    }
    if (!searchParams.has("orderType")) {
      newFilters.orderType = "";
    }
    if (!searchParams.has("search")) {
      newFilters.search = "";
    }

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
        // Handle arrays (multi-select filters)
        if (Array.isArray(value)) {
          if (value.length > 0) {
            // Add each value as a separate param: ?size=XS&size=S&size=L
            value.forEach((v) => params.append(key, v));
          }
        } else if (value !== "" && value !== false && value !== 0) {
          // Handle single values
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
      // Scroll to top when filter changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
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

  // Handle multi-select filter changes (for size, brand, color)
  const handleMultiSelectFilterChange = useCallback(
    (key, value, checked) => {
      // Scroll to top when filter changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      let newValues;
      const currentValues = Array.isArray(filters[key]) ? filters[key] : [];

      if (checked) {
        // Add value if checked
        newValues = [...currentValues, value];
      } else {
        // Remove value if unchecked
        newValues = currentValues.filter((v) => v !== value);
      }

      const newFilters = { ...filters, [key]: newValues, page: 1 }; // Reset to page 1 when filters change

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
      // Scroll to top when filter changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Convert empty strings to 0 for filter logic, but keep for display
      const minValue = value[0] === "" || value[0] === 0 ? 0 : value[0];
      const maxValue = value[1] === "" || value[1] === 0 ? 100000 : value[1];

      setPriceRange([minValue, maxValue]);
      const newFilters = {
        ...filters,
        minPrice: minValue > 0 ? minValue : "",
        maxPrice: maxValue < 100000 ? maxValue : "",
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

  // Fetch search suggestions with debouncing
  useEffect(() => {
    // Clear suggestions if query is empty
    if (!searchInput || searchInput.trim().length === 0) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the API call
    const timeoutId = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const response = await productApi.getSearchSuggestions(
          searchInput.trim(),
          10
        );
        if (response.success) {
          setSearchSuggestions(response.data || []);
        } else {
          setSearchSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching search suggestions:", err);
        setSearchSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isMobileSearch =
        searchRef.current && searchRef.current.contains(event.target);
      const isDesktopSearch =
        searchDesktopRef.current &&
        searchDesktopRef.current.contains(event.target);
      if (!isMobileSearch && !isDesktopSearch) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          priceInput[1] === "" || priceInput[1] === 0 ? 100000 : priceInput[1],
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

  // Clear all filters (but preserve gender, productType, and isNamunjiiExclusive)
  const clearFilters = () => {
    // Scroll to top when clearing filters
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Preserve these filters from current state
    const preservedGender = filters.gender || "";
    const preservedProductType = filters.productType || "";
    const preservedIsNamunjiiExclusive = filters.isNamunjiiExclusive || false;

    const defaultFilters = {
      search: "",
      category: "",
      subcategory: "",
      gender: preservedGender, // Preserve gender filter
      productType: preservedProductType, // Preserve productType filter
      minPrice: "",
      maxPrice: "",
      size: [],
      color: [],
      brand: [],
      orderType: "",
      sortBy: "most_popular",
      sortOrder: "desc",
      isNewArrival: false,
      isBestSeller: false,
      isFeatured: false,
      isNamunjiiExclusive: preservedIsNamunjiiExclusive, // Preserve isNamunjiiExclusive filter
      page: 1,
      limit: 20,
    };
    setFilters(defaultFilters);
    setPriceRange([0, 100000]);

    // Create new URL params preserving the important filters
    const newParams = new URLSearchParams();
    if (preservedGender) {
      newParams.set("gender", preservedGender);
    }
    if (preservedProductType) {
      newParams.set("productType", preservedProductType);
    }
    if (preservedIsNamunjiiExclusive) {
      newParams.set("isNamunjiiExclusive", "true");
    }
    setSearchParams(newParams);

    // Fetch products with cleared filters
    if (fetchProductsRef.current) {
      fetchProductsRef.current(defaultFilters, [0, 100000]);
    }
  };

  // Get category and subcategory names for breadcrumb
  const getCategoryName = (categoryId) => {
    if (!categoryId) return null;
    const category = categories.find((cat) => cat._id === categoryId);
    return category?.name || null;
  };

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return null;
    const subcategory = subcategories.find((sub) => sub._id === subcategoryId);
    return subcategory?.name || null;
  };

  const getCategoryIdFromSubcategory = (subcategoryId) => {
    if (!subcategoryId) return null;
    const subcategory = subcategories.find((sub) => sub._id === subcategoryId);
    return subcategory?.category || subcategory?.categoryId || null;
  };

  // Render breadcrumb navigation
  const renderBreadcrumb = () => {
    const breadcrumbItems = [];

    // Always show Home
    breadcrumbItems.push(
      <Link key="home" to="/" className="breadcrumb-item">
        HOME
      </Link>
    );

    // Show Namunjii Exclusive if selected
    if (filters.isNamunjiiExclusive) {
      breadcrumbItems.push(
        <span key="separator-namunjii" className="breadcrumb-separator">
          |
        </span>
      );
      breadcrumbItems.push(
        <Link
          key="namunjii"
          to="/products?isNamunjiiExclusive=true"
          className="breadcrumb-item"
        >
          Namunjii Exclusive
        </Link>
      );
      return breadcrumbItems.length > 1 ? (
        <div className="breadcrumb-navigation">{breadcrumbItems}</div>
      ) : null;
    }

    // Show Accessories if selected
    if (filters.productType === "accessory") {
      breadcrumbItems.push(
        <span key="separator-accessories" className="breadcrumb-separator">
          |
        </span>
      );
      breadcrumbItems.push(
        <Link
          key="accessories"
          to="/products?productType=accessory"
          className="breadcrumb-item"
        >
          Accessories
        </Link>
      );
      return breadcrumbItems.length > 1 ? (
        <div className="breadcrumb-navigation">{breadcrumbItems}</div>
      ) : null;
    }

    // Show gender if selected (Men/Women)
    if (filters.gender === "Men" || filters.gender === "Women") {
      breadcrumbItems.push(
        <span key="separator-gender" className="breadcrumb-separator">
          |
        </span>
      );
      breadcrumbItems.push(
        <Link
          key="gender"
          to={`/products?gender=${filters.gender}`}
          className="breadcrumb-item"
        >
          {filters.gender}
        </Link>
      );
    }

    // Determine category to show - use filters.category or get from subcategory
    let categoryIdToShow = filters.category;
    if (!categoryIdToShow && filters.subcategory) {
      categoryIdToShow = getCategoryIdFromSubcategory(filters.subcategory);
    }

    // Show category if available (always show if subcategory exists)
    if (categoryIdToShow) {
      const categoryName = getCategoryName(categoryIdToShow);
      if (categoryName) {
        breadcrumbItems.push(
          <span key="separator1" className="breadcrumb-separator">
            |
          </span>
        );
        breadcrumbItems.push(
          <span key="category" className="breadcrumb-item active">
            {categoryName}
          </span>
        );
      }
    }

    // Show subcategory if Men/Women is selected and subcategory exists
    if (
      (filters.gender === "Men" || filters.gender === "Women") &&
      filters.subcategory
    ) {
      const subcategoryName = getSubcategoryName(filters.subcategory);
      if (subcategoryName) {
        breadcrumbItems.push(
          <span key="separator2" className="breadcrumb-separator">
            |
          </span>
        );
        breadcrumbItems.push(
          <span key="subcategory" className="breadcrumb-item active">
            {subcategoryName}
          </span>
        );
      }
    }

    return breadcrumbItems.length > 1 ? (
      <div className="breadcrumb-navigation">{breadcrumbItems}</div>
    ) : null;
  };

  // Render filters content (reusable for sidebar and drawer)
  const renderFiltersContent = () => (
    <>
      {renderBreadcrumb()}
      <div className="filters-header">
        <h3>Filters</h3>
        <span
          onClick={clearFilters}
          className="reset-filters-btn"
          title="Clear all filters"
        >
          Clear All
        </span>
      </div>

      {/* Gender Filter - Only show for Namunjii Exclusive */}
      {filters.isNamunjiiExclusive && (
        <div className="filter-section">
          <div
            className="filter-section-header"
            onClick={() => toggleFilterSection("gender")}
          >
            <h4>GENDER</h4>
            {expandedFilters.gender ? <UpOutlined /> : <DownOutlined />}
          </div>
          {expandedFilters.gender && (
            <div className="gender-buttons">
              <button
                className={`gender-button ${filters.gender === "Men" ? "active" : ""}`}
                onClick={() =>
                  handleFilterChange("gender", filters.gender === "Men" ? "" : "Men")
                }
              >
                Men
              </button>
              <button
                className={`gender-button ${filters.gender === "Women" ? "active" : ""}`}
                onClick={() =>
                  handleFilterChange("gender", filters.gender === "Women" ? "" : "Women")
                }
              >
                Women
              </button>
            </div>
          )}
        </div>
      )}

      {/* Size */}
      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleFilterSection("size")}
        >
          <h4>SIZE</h4>
          {expandedFilters.size ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.size && (
          <div className="size-buttons">
            {sizesLoading ? (
              <div style={{ padding: "10px 0" }}>
                <Spin size="small" />
              </div>
            ) : sizes.length > 0 ? (
              sizes.map((size) => {
                const isSelected =
                  Array.isArray(filters.size) && filters.size.includes(size);
                return (
                  <button
                    key={size}
                    className={`size-button ${isSelected ? "active" : ""}`}
                    onClick={() =>
                      handleMultiSelectFilterChange("size", size, !isSelected)
                    }
                    disabled={sizesLoading}
                  >
                    {size}
                  </button>
                );
              })
            ) : (
              <span style={{ fontSize: "14px", color: "#999" }}>
                No sizes available
              </span>
            )}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleFilterSection("brand")}
        >
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
              (() => {
                // Filter brands based on isNamunjiiExclusive
                // Only filter to exclusive brands when isNamunjiiExclusive is explicitly true
                // Otherwise, show all brands
                const namunjiiExclusiveBrands = [
                  "Grey Horn",
                  "The Branch",
                  "The Drift Line",
                  "The Pure Forms",
                ];
                const filteredBrands =
                  filters.isNamunjiiExclusive === true
                    ? brands.filter((brand) =>
                        namunjiiExclusiveBrands.includes(brand)
                      )
                    : brands;

                return filteredBrands.length > 0 ? (
                  filteredBrands.map((brand, index) => {
                    const isSelected =
                      Array.isArray(filters.brand) &&
                      filters.brand.includes(brand);
                    return (
                      <Checkbox
                        key={index}
                        checked={isSelected}
                        onChange={(e) =>
                          handleMultiSelectFilterChange(
                            "brand",
                            brand,
                            e.target.checked
                          )
                        }
                      >
                        {brand}
                      </Checkbox>
                    );
                  })
                ) : (
                  <span style={{ fontSize: "14px", color: "#999" }}>
                    {filters.isNamunjiiExclusive
                      ? "No Namunjii Exclusive brands available"
                      : "No brands available"}
                  </span>
                );
              })()
            ) : (
              <span style={{ fontSize: "14px", color: "#999" }}>
                No brands available
              </span>
            )}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleFilterSection("priceRange")}
        >
          <h4>PRICE RANGE</h4>
          {expandedFilters.priceRange ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.priceRange && (
          <>
            <div className="price-range-display">
              <span className="price-range-value">
                ₹{priceRange[0].toLocaleString()} - ₹
                {priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              range
              min={0}
              max={100000}
              step={100}
              marks={{
                0: "₹0",
                50000: "₹50,000",
                100000: "₹1,00,000",
              }}
              value={priceRange}
              onChange={(value) => {
                // Ensure we can select exactly 100000
                const clampedValue = [
                  Math.max(0, Math.min(100000, value[0])),
                  Math.max(value[0], Math.min(100000, value[1])),
                ];
                setPriceRange(clampedValue);
                // Clear previous timer
                if (priceSliderTimerRef.current) {
                  clearTimeout(priceSliderTimerRef.current);
                }
                // Debounce the filter update
                priceSliderTimerRef.current = setTimeout(() => {
                  // Scroll to top when price slider changes
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  
                  const newFilters = {
                    ...filtersRef.current,
                    minPrice: clampedValue[0] > 0 ? clampedValue[0] : "",
                    maxPrice: clampedValue[1] >= 100000 ? "" : clampedValue[1],
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
        <div
          className="filter-section-header"
          onClick={() => toggleFilterSection("colour")}
        >
          <h4>COLOUR</h4>
          {expandedFilters.colour ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.colour && (
          <div className="checkbox-group">
            {colorsLoading ? (
              <div style={{ padding: "10px 0" }}>
                <Spin size="small" />
              </div>
            ) : colors.length > 0 ? (
              colors.map((color, index) => {
                const isSelected =
                  Array.isArray(filters.color) && filters.color.includes(color);
                return (
                  <Checkbox
                    key={index}
                    checked={isSelected}
                    onChange={(e) =>
                      handleMultiSelectFilterChange(
                        "color",
                        color,
                        e.target.checked
                      )
                    }
                  >
                    {color}
                  </Checkbox>
                );
              })
            ) : (
              <span style={{ fontSize: "14px", color: "#999" }}>
                No colors available
              </span>
            )}
          </div>
        )}
      </div>

      {/* Order Type */}
      <div className="filter-section">
        <div
          className="filter-section-header"
          onClick={() => toggleFilterSection("orderType")}
        >
          <h4>ORDER TYPE</h4>
          {expandedFilters.orderType ? <UpOutlined /> : <DownOutlined />}
        </div>
        {expandedFilters.orderType && (
          <div className="checkbox-group">
            {/* <Checkbox
              checked={filters.orderType === "made_to_order"}
              onChange={(e) =>
                handleFilterChange(
                  "orderType",
                  e.target.checked ? "made_to_order" : ""
                )
              }
            >
              Made to Order
            </Checkbox> */}
            <Checkbox
              checked={filters.orderType === "ready_to_ship"}
              onChange={(e) =>
                handleFilterChange(
                  "orderType",
                  e.target.checked ? "ready_to_ship" : ""
                )
              }
            >
              Ready to Ship
            </Checkbox>
          </div>
        )}
      </div>
    </>
  );

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.gender) count++; // Added for Men/Women filtering
    if (filters.productType) count++; // Added for Accessories filtering
    if (filters.minPrice || filters.maxPrice) count++;
    if (Array.isArray(filters.size) && filters.size.length > 0) count++;
    if (Array.isArray(filters.color) && filters.color.length > 0) count++;
    if (Array.isArray(filters.brand) && filters.brand.length > 0) count++;
    if (filters.orderType) count++;
    if (filters.isNewArrival) count++;
    if (filters.isBestSeller) count++;
    if (filters.isFeatured) count++;
    if (filters.isNamunjiiExclusive) count++;
    return count;
  };

  // Render skeleton product cards
  const renderSkeletonProducts = (count = 12) => {
    return (
      <div
        className="products-grid"
        data-grid-mobile={gridLayout.mobile}
        data-grid-tablet={gridLayout.tablet}
        data-grid-desktop={gridLayout.desktop}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="product-card product-card-skeleton">
            <div className="product-card-image-container">
              <div className="skeleton-image"></div>
            </div>
            <div className="product-card-content">
              <div className="product-card-info">
                <div
                  className="skeleton-line skeleton-brand"
                  style={{ width: "80px", height: "14px", marginBottom: "8px" }}
                ></div>
                <div
                  className="skeleton-line skeleton-title"
                  style={{ width: "90%", height: "18px", marginBottom: "8px" }}
                ></div>
                <div
                  className="skeleton-line skeleton-text"
                  style={{ width: "60%", height: "14px" }}
                ></div>
              </div>
              <div className="product-card-pricing">
                <div
                  className="skeleton-line skeleton-price"
                  style={{ width: "100px", height: "20px" }}
                ></div>
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
              <h2 className="page-title">
                {filters.isNamunjiiExclusive
                  ? "The Exclusive Collection"
                  : filters.productType === "accessory"
                  ? "Accessories"
                  : filters.gender === "Men"
                  ? "Menswear"
                  : filters.gender === "Women"
                  ? "Womenswear"
                  : "Products"}{" "}
                <span className="page-subtitle">
                  ({pagination.total} Items)
                </span>
              </h2>
            </div>

            {/* Search Bar - Mobile Only (above controls) */}
            <div className="search-section-mobile" ref={searchRef}>
              <Input
                size="middle"
                prefix={<SearchOutlined style={{ color: "#333" }} />}
                placeholder="Search for products..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onPressEnter={() => {
                  if (searchInput.trim()) {
                    handleFilterChange("search", searchInput.trim());
                    setShowSuggestions(false);
                  }
                }}
                allowClear
                onClear={() => {
                  setSearchInput("");
                  setShowSuggestions(false);
                  handleFilterChange("search", "");
                }}
                className="products-search-input"
              />

              {/* Autocomplete Dropdown
              {showSuggestions && searchInput.trim() && (
                <div className="search-suggestions-dropdown">
                  {suggestionsLoading ? (
                    <div className="search-suggestion-item">
                      <Spin size="small" />{" "}
                      <span style={{ marginLeft: "8px" }}>Searching...</span>
                    </div>
                  ) : searchSuggestions.length > 0 ? (
                    <ul className="search-suggestions-list">
                      {searchSuggestions.map((suggestion) => {
                        const discountedPrice =
                          suggestion.basePricing -
                          (suggestion.basePricing *
                            (suggestion.discount || 0)) /
                            100;
                        const coverImage =
                          Array.isArray(suggestion.coverImage) &&
                          suggestion.coverImage.length > 0
                            ? suggestion.coverImage[0]
                            : suggestion.coverImage || "";

                        return (
                          <li
                            key={suggestion._id}
                            onClick={() => {
                              setSearchInput(suggestion.productName);
                              handleFilterChange(
                                "search",
                                suggestion.productName
                              );
                              setShowSuggestions(false);
                            }}
                            className="search-suggestion-item"
                          >
                            {coverImage && (
                              <img
                                src={coverImage}
                                alt={suggestion.productName}
                                className="search-suggestion-image"
                              />
                            )}
                            <div className="search-suggestion-content">
                              <p className="search-suggestion-name">
                                {suggestion.productName}
                              </p>
                              <div className="search-suggestion-price">
                                <span className="search-suggestion-price-current">
                                  ₹{discountedPrice.toFixed(0)}
                                </span>
                                {suggestion.discount > 0 && (
                                  <>
                                    <span className="search-suggestion-price-original">
                                      ₹{suggestion.basePricing.toFixed(0)}
                                    </span>
                                    <span className="search-suggestion-discount">
                                      {suggestion.discount}% off
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="search-suggestion-meta">
                                {suggestion.category?.name || ""}
                                {suggestion.category?.name &&
                                  suggestion.vendorId?.brandName &&
                                  " • "}
                                {suggestion.vendorId?.brandName || ""}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="search-suggestion-item">
                      No products found for "{searchInput}"
                    </div>
                  )}
                </div>
              )} */}
            </div>

            {/* Products Header - Controls Bar */}
            <div className="products-header">
              {/* Search Bar - Desktop (in grid) */}
              <div className="search-section-desktop" ref={searchDesktopRef}>
                <Input
                  size="middle"
                  prefix={<SearchOutlined style={{ color: "#333" }} />}
                  placeholder="Search for products..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (searchSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onPressEnter={() => {
                    if (searchInput.trim()) {
                      handleFilterChange("search", searchInput.trim());
                      setShowSuggestions(false);
                    }
                  }}
                  allowClear
                  onClear={() => {
                    setSearchInput("");
                    setShowSuggestions(false);
                    handleFilterChange("search", "");
                  }}
                  className="products-search-input"
                />

                {/* Autocomplete Dropdown
                {showSuggestions && searchInput.trim() && (
                  <div className="search-suggestions-dropdown">
                    {suggestionsLoading ? (
                      <div className="search-suggestion-item">
                        <Spin size="small" />{" "}
                        <span style={{ marginLeft: "8px" }}>Searching...</span>
                      </div>
                    ) : searchSuggestions.length > 0 ? (
                      <ul className="search-suggestions-list">
                        {searchSuggestions.map((suggestion) => {
                          const discountedPrice =
                            suggestion.basePricing -
                            (suggestion.basePricing *
                              (suggestion.discount || 0)) /
                              100;
                          const coverImage =
                            Array.isArray(suggestion.coverImage) &&
                            suggestion.coverImage.length > 0
                              ? suggestion.coverImage[0]
                              : suggestion.coverImage || "";

                          return (
                            <li
                              key={suggestion._id}
                              onClick={() => {
                                setSearchInput(suggestion.productName);
                                handleFilterChange(
                                  "search",
                                  suggestion.productName
                                );
                                setShowSuggestions(false);
                              }}
                              className="search-suggestion-item"
                            >
                              {coverImage && (
                                <img
                                  src={coverImage}
                                  alt={suggestion.productName}
                                  className="search-suggestion-image"
                                />
                              )}
                              <div className="search-suggestion-content">
                                <p className="search-suggestion-name">
                                  {suggestion.productName}
                                </p>
                                <div className="search-suggestion-price">
                                  <span className="search-suggestion-price-current">
                                    ₹{discountedPrice.toFixed(0)}
                                  </span>
                                  {suggestion.discount > 0 && (
                                    <>
                                      <span className="search-suggestion-price-original">
                                        ₹{suggestion.basePricing.toFixed(0)}
                                      </span>
                                      <span className="search-suggestion-discount">
                                        {suggestion.discount}% off
                                      </span>
                                    </>
                                  )}
                                </div>
                                <p className="search-suggestion-meta">
                                  {suggestion.category?.name || ""}
                                  {suggestion.category?.name &&
                                    suggestion.vendorId?.brandName &&
                                    " • "}
                                  {suggestion.vendorId?.brandName || ""}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="search-suggestion-item">
                        No products found for "{searchInput}"
                      </div>
                    )}
                  </div>
                )} */}
              </div>
              {/* Filters Button with Badge */}
              <div className="filters-button-wrapper">
                <Button
                  type="text"
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  className="filters-button"
                >
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge
                      count={getActiveFilterCount()}
                      className="filter-badge"
                    />
                  )}
                </Button>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-wrapper">
                {isMobile ? (
                  <Dropdown
                    overlay={
                      <Menu
                        selectedKeys={[
                          filters.sortBy === "most_popular" ||
                          filters.sortBy === "popular"
                            ? "most_popular-desc"
                            : filters.sortBy === "createdAt" &&
                              filters.sortOrder === "asc"
                            ? "createdAt-desc"
                            : `${filters.sortBy}-${filters.sortOrder}`,
                        ]}
                        onClick={({ key }) => {
                          // Scroll to top when sort changes
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          
                          const [sortBy, sortOrder] = key.split("-");
                          const newFilters = {
                            ...filters,
                            sortBy,
                            sortOrder,
                            page: 1,
                          };
                          setFilters(newFilters);
                          updateURL(newFilters);
                          setProducts([]);
                          if (fetchProductsRef.current) {
                            fetchProductsRef.current(
                              newFilters,
                              priceRangeRef.current
                            );
                          }
                        }}
                      >
                        <Menu.Item key="most_popular-desc">
                          Most Popular
                        </Menu.Item>
                        <Menu.Item key="basePricing-asc">
                          Price: Low to High
                        </Menu.Item>
                        <Menu.Item key="basePricing-desc">
                          Price: High to Low
                        </Menu.Item>
                        <Menu.Item key="productName-asc">
                          Name: A to Z
                        </Menu.Item>
                        <Menu.Item key="productName-desc">
                          Name: Z to A
                        </Menu.Item>
                        <Menu.Item key="createdAt-desc">Newest First</Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <span className="sort-label" style={{ cursor: "pointer" }}>
                      Sort{" "}
                      <span className="sort-arrows">
                        <UpOutlined />
                        <DownOutlined />
                      </span>
                    </span>
                  </Dropdown>
                ) : (
                  <>
                    <span className="sort-label">Sort</span>
                    <Select
                      ref={sortSelectRef}
                      size="middle"
                      value={
                        filters.sortBy === "most_popular" ||
                        filters.sortBy === "popular"
                          ? "most_popular-desc"
                          : filters.sortBy === "createdAt" &&
                            filters.sortOrder === "asc"
                          ? "createdAt-desc"
                          : `${filters.sortBy}-${filters.sortOrder}`
                      }
                      onChange={(value) => {
                        // Scroll to top when sort changes
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        
                        const [sortBy, sortOrder] = value.split("-");
                        const newFilters = {
                          ...filters,
                          sortBy,
                          sortOrder,
                          page: 1,
                        };
                        setFilters(newFilters);
                        updateURL(newFilters);
                        setProducts([]);
                        if (fetchProductsRef.current) {
                          fetchProductsRef.current(
                            newFilters,
                            priceRangeRef.current
                          );
                        }
                      }}
                      className="sort-select"
                    >
                      <Option value="most_popular-desc">Most Popular</Option>
                      <Option value="basePricing-asc">
                        Price: Low to High
                      </Option>
                      <Option value="basePricing-desc">
                        Price: High to Low
                      </Option>
                      <Option value="productName-asc">Name: A to Z</Option>
                      <Option value="productName-desc">Name: Z to A</Option>
                      <Option value="createdAt-desc">Newest First</Option>
                    </Select>
                  </>
                )}
              </div>

              {/* Grid Layout Controls */}
              <div className="grid-layout-controls">
                {/* Desktop Grid Controls */}
                <div className="grid-layout-desktop">
                  <button
                    className={`grid-layout-btn ${
                      gridLayout.desktop === 3 ? "active" : ""
                    }`}
                    onClick={() => setGridLayout({ ...gridLayout, desktop: 3 })}
                    title="3 per row"
                  >
                    <GridIcon columns={3} />
                  </button>
                  <button
                    className={`grid-layout-btn ${
                      gridLayout.desktop === 4 ? "active" : ""
                    }`}
                    onClick={() => setGridLayout({ ...gridLayout, desktop: 4 })}
                    title="4 per row"
                  >
                    <GridIcon columns={4} />
                  </button>
                </div>
                {/* Tablet Grid Controls */}
                <div className="grid-layout-tablet">
                  <button
                    className={`grid-layout-btn ${
                      gridLayout.tablet === 2 ? "active" : ""
                    }`}
                    onClick={() => setGridLayout({ ...gridLayout, tablet: 2 })}
                    title="2 per row"
                  >
                    <GridIcon columns={2} />
                  </button>
                  <button
                    className={`grid-layout-btn ${
                      gridLayout.tablet === 3 ? "active" : ""
                    }`}
                    onClick={() => setGridLayout({ ...gridLayout, tablet: 3 })}
                    title="3 per row"
                  >
                    <GridIcon columns={3} />
                  </button>
                </div>
                {/* Mobile Grid Controls */}
                <div className="grid-layout-mobile">
                  <button
                    className={`grid-layout-btn ${
                      gridLayout.mobile === 1 ? "active" : ""
                    }`}
                    onClick={() => setGridLayout({ ...gridLayout, mobile: 1 })}
                    title="1 per row"
                  >
                    <GridIcon columns={1} />
                  </button>
                  <button
                    className={`grid-layout-btn ${
                      gridLayout.mobile === 2 ? "active" : ""
                    }`}
                    onClick={() => setGridLayout({ ...gridLayout, mobile: 2 })}
                    title="2 per row"
                  >
                    <GridIcon columns={2} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              renderSkeletonProducts()
            ) : products.length > 0 ? (
              <>
                <div
                  className="products-grid"
                  data-grid-mobile={gridLayout.mobile}
                  data-grid-tablet={gridLayout.tablet}
                  data-grid-desktop={gridLayout.desktop}
                >
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
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>Filters</span>
            <span
              onClick={clearFilters}
              className="mobile-drawer-clear-all"
              title="Clear all filters"
              style={{ cursor: 'pointer' }}
            >
              Clear All
            </span>
          </div>
        }
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

