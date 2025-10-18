import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Spin,
  Alert,
  Pagination,
  Select,
  Input,
  Slider,
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
import { useAppContext } from "../../Context/AppContext";
import "./ProductsPage.css";

const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useAppContext();

  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

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

  // Filter drawer state for mobile/tablet
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // Ref to track if we're in initial load
  const isInitialLoad = useRef(true);

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
  }, [priceRange]);

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
        if (currentPriceRange[1] < 10000)
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

  // Store fetchProducts in ref
  useEffect(() => {
    fetchProductsRef.current = fetchProducts;
  }, [fetchProducts]);

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
          else if (key === "maxPrice" && value < 10000) params.set(key, value);
          else if (key !== "minPrice" && key !== "maxPrice")
            params.set(key, value);
        }
      });

      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset to page 1 when filters change
    setFilters(newFilters);
    updateURL(newFilters);

    // Fetch products with new filters
    if (fetchProductsRef.current) {
      fetchProductsRef.current(newFilters, priceRange);
    }
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
    const newFilters = {
      ...filters,
      minPrice: value[0] > 0 ? value[0] : "",
      maxPrice: value[1] < 10000 ? value[1] : "",
      page: 1,
    };
    setFilters(newFilters);
    updateURL(newFilters);

    // Fetch products with new price range
    if (fetchProductsRef.current) {
      fetchProductsRef.current(newFilters, value);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateURL(newFilters);

    // Fetch products with new page
    if (fetchProductsRef.current) {
      fetchProductsRef.current(newFilters, priceRange);
    }
  };

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
        <FilterOutlined />
        <h3>Filters</h3>
        <Button type="link" onClick={clearFilters} size="small">
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div className="filter-section">
        <h4>Search</h4>
        <Search
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          onSearch={(value) => handleFilterChange("search", value)}
          enterButton={<SearchOutlined />}
        />
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h4>Price Range</h4>
        <Slider
          range
          min={0}
          max={10000}
          step={100}
          value={priceRange}
          onChange={handlePriceRangeChange}
          marks={{
            0: "₹0",
            2500: "₹2.5K",
            5000: "₹5K",
            7500: "₹7.5K",
            10000: "₹10K+",
          }}
        />
        <div className="price-display">
          ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
        </div>
      </div>

      {/* Category */}
      <div className="filter-section">
        <h4>Category</h4>
        <Select
          placeholder="Select Category"
          value={filters.category || undefined}
          onChange={(value) => handleFilterChange("category", value)}
          allowClear
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
            value={filters.subcategory || undefined}
            onChange={(value) => handleFilterChange("subcategory", value)}
            allowClear
            style={{ width: "100%" }}
          >
            {subcategories
              .filter((sub) => sub.category === filters.category)
              .map((subcategory) => (
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
          value={filters.gender || undefined}
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
          value={filters.size || undefined}
          onChange={(value) => handleFilterChange("size", value)}
          allowClear
          style={{ width: "100%" }}
        >
          {getUniqueValues("size").map((size) => (
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
          value={filters.color || undefined}
          onChange={(value) => handleFilterChange("color", value)}
          allowClear
          style={{ width: "100%" }}
        >
          {getUniqueValues("color").map((color) => (
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

  // Get unique values for filter options
  const getUniqueValues = (key) => {
    const values = new Set();
    state.products?.forEach((product) => {
      if (product[key]) values.add(product[key]);
    });
    return Array.from(values).sort();
  };

  // Get categories from context
  const categories = state.categories || [];
  const subcategories = state.subcategories || [];

  if (loading && products.length === 0) {
    return (
      <div className="products-page-loading">
        <Spin size="large" />
        <p>Loading products...</p>
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
              <div className="products-loading">
                <Spin size="large" />
              </div>
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="products-pagination">
                    <Pagination
                      current={pagination.page}
                      total={pagination.total}
                      pageSize={pagination.limit}
                      onChange={handlePageChange}
                      showSizeChanger
                      showQuickJumper
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} products`
                      }
                      onShowSizeChange={(current, size) => {
                        const newFilters = { ...filters, limit: size, page: 1 };
                        setFilters(newFilters);
                        updateURL(newFilters);
                      }}
                    />
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
