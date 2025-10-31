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
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import ProductCard from "../../../Common/ProductCard/ProductCard";
import productApi from "../../../../apis/product";
import categoryApi from "../../../../apis/category";
import subcategoryApi from "../../../../apis/subcategory";
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
    sortBy: "createdAt",
    sortOrder: "desc",
    isNewArrival: false,
    isBestSeller: false,
    isFeatured: false,
    page: 1,
    limit: 20,
  });

  // Price range state
  const [priceRange, setPriceRange] = useState([0, 10000]);
  // Local input values for debouncing
  const [priceInput, setPriceInput] = useState([0, 10000]);
  // Search input local debounced state
  const [searchInput, setSearchInput] = useState("");

  // Filter drawer state for mobile/tablet
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // Ref to track if we're in initial load
  const isInitialLoad = useRef(true);
  const hasLoadedProductsOnce = useRef(false);

  // Refs to store current values to avoid dependency issues
  const filtersRef = useRef(filters);
  const priceRangeRef = useRef(priceRange);
  const fetchProductsRef = useRef();

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
    // Only sync when values actually changed to avoid loops
    if (
      !Array.isArray(priceInput) ||
      priceInput[0] !== priceRange[0] ||
      priceInput[1] !== priceRange[1]
    ) {
      setPriceInput(priceRange);
    }
  }, [priceRange, priceInput]);

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

  // Fetch subcategories for selection when category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      // Only fetch if a category is selected
      if (!filters.category) {
        setSubcategories([]);
        return;
      }

      try {
        setSubcategoriesLoading(true);
        const response = await subcategoryApi.getSubCategoriesForSelection({
          category: filters.category,
        });
        if (response.success) {
          setSubcategories(response.data || []);
        } else {
          console.error("Failed to fetch subcategories:", response.msg);
          setSubcategories([]);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubcategories([]);
      } finally {
        setSubcategoriesLoading(false);
      }
    };

    fetchSubCategories();
  }, [filters.category]);

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
    let newPriceRange = [0, 10000];
    if (urlFilters.minPrice || urlFilters.maxPrice) {
      newPriceRange = [urlFilters.minPrice || 0, urlFilters.maxPrice || 10000];
      setPriceRange(newPriceRange);
    }

    // Update filters
    const newFilters = { ...filtersRef.current, ...urlFilters };
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
          else if (key === "maxPrice" && value < 30000) params.set(key, value);
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
      setPriceRange(value);
      const newFilters = {
        ...filters,
        minPrice: value[0] > 0 ? value[0] : "",
        maxPrice: value[1] < 30000 ? value[1] : "",
        page: 1,
      };
      setFilters(newFilters);
      updateURL(newFilters);

      // Reset products when price range changes (don't append)
      setProducts([]);
      // Fetch products with new price range
      if (fetchProductsRef.current) {
        fetchProductsRef.current(newFilters, value);
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
      if (
        Array.isArray(priceInput) &&
        priceInput.length === 2 &&
        (priceInput[0] !== priceRange[0] || priceInput[1] !== priceRange[1])
      ) {
        handlePriceRangeChange(priceInput);
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
      sortBy: "createdAt",
      sortOrder: "desc",
      isNewArrival: false,
      isBestSeller: false,
      isFeatured: false,
      page: 1,
      limit: 20,
    };
    setFilters(defaultFilters);
    setPriceRange([0, 10000]);
    setSearchParams(new URLSearchParams());

    // Fetch products with cleared filters
    if (fetchProductsRef.current) {
      fetchProductsRef.current(defaultFilters, [0, 10000]);
    }
  };

  // Render filters content (reusable for sidebar and drawer)
  const renderFiltersContent = () => (
    <>
      <div className="filters-header">
        <h3>Filters</h3>
        <Button type="link" onClick={clearFilters} size="small">
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div className="filter-section">
        <h4>Search</h4>
        <Input
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          allowClear
        />
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <div
          className="price-range-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <h4 style={{ margin: 0 }}>Price Range</h4>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--brand-primary)",
            }}
          >
            ₹{priceInput[0].toLocaleString()} - ₹
            {priceInput[1].toLocaleString()}
          </span>
        </div>
        <div
          className="price-inputs"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            width: "100%",
          }}
        >
          <input
            type="number"
            min={0}
            max={30000}
            step={100}
            value={priceInput[0]}
            onChange={(e) => {
              const raw = parseInt(e.target.value, 10);
              const clamped = isNaN(raw)
                ? 0
                : Math.max(0, Math.min(30000, raw));
              const newMin = Math.min(clamped, priceInput[1]);
              setPriceInput([newMin, priceInput[1]]);
            }}
            className="price-input min"
            style={{
              width: 120,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
          <span style={{ color: "#666" }}>to</span>
          <input
            type="number"
            min={0}
            max={30000}
            step={100}
            value={priceInput[1]}
            onChange={(e) => {
              const raw = parseInt(e.target.value, 10);
              const clamped = isNaN(raw)
                ? 0
                : Math.max(0, Math.min(30000, raw));
              const newMax = Math.max(clamped, priceInput[0]);
              setPriceInput([priceInput[0], newMax]);
            }}
            className="price-input max"
            style={{
              width: 120,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4>Category</h4>
        <Select
          placeholder="Select Category"
          value={filters.category || null}
          onChange={(value) => handleFilterChange("category", value)}
          allowClear
          loading={categoriesLoading}
          style={{ width: "100%" }}
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Subcategory */}
      {filters.category && (
        <div className="filter-section">
          <h4>Subcategory</h4>
          <Select
            placeholder="Select Subcategory"
            value={filters.subcategory || null}
            onChange={(value) => handleFilterChange("subcategory", value)}
            allowClear
            loading={subcategoriesLoading}
            style={{ width: "100%" }}
          >
            {subcategories.map((subcategory) => (
              <Option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {/* Gender */}
      <div className="filter-section">
        <h4>Gender</h4>
        <Select
          placeholder="Select Gender"
          value={filters.gender || null}
          onChange={(value) => handleFilterChange("gender", value)}
          allowClear
          style={{ width: "100%" }}
        >
          <Option value="Men">Men</Option>
          <Option value="Women">Women</Option>
          <Option value="Unisex">Unisex</Option>
        </Select>
      </div>

      {/* Size */}
      <div className="filter-section">
        <h4>Size</h4>
        <Select
          placeholder="Select Size"
          value={filters.size || null}
          onChange={(value) => handleFilterChange("size", value)}
          allowClear
          loading={sizesLoading}
          style={{ width: "100%" }}
        >
          {sizes.map((size) => (
            <Option key={size} value={size}>
              {size}
            </Option>
          ))}
        </Select>
      </div>

      {/* Color */}
      <div className="filter-section">
        <h4>Color</h4>
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
      </div>

      {/* Product Flags */}
      <div className="filter-section">
        <h4>Product Type</h4>
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
            {/* Products Header */}
            <div className="products-header">
              <div className="products-info">
                <h2>
                  {pagination.total > 0
                    ? `${pagination.total} Products Found`
                    : "No Products Found"}
                </h2>
                {filters.search && <p>Search results for "{filters.search}"</p>}
              </div>

              {/* Sort Options */}
              <div className="sort-options">
                <Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(value) => {
                    const [sortBy, sortOrder] = value.split("-");
                    handleFilterChange("sortBy", sortBy);
                    handleFilterChange("sortOrder", sortOrder);
                  }}
                  style={{ width: 200 }}
                >
                  <Option value="createdAt-desc">
                    <SortDescendingOutlined /> Newest First
                  </Option>
                  <Option value="createdAt-asc">
                    <SortAscendingOutlined /> Oldest First
                  </Option>
                  <Option value="basePricing-asc">
                    <SortAscendingOutlined /> Price: Low to High
                  </Option>
                  <Option value="basePricing-desc">
                    <SortDescendingOutlined /> Price: High to Low
                  </Option>
                  <Option value="productName-asc">
                    <SortAscendingOutlined /> Name: A to Z
                  </Option>
                  <Option value="productName-desc">
                    <SortDescendingOutlined /> Name: Z to A
                  </Option>
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
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      showViewProduct={true}
                    />
                  ))}
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
