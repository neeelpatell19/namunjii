import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./Components/Header/Header";
import AllDesigners from "./Components/OthersComponents/Designers/AllDesigners/AllDesigners";
import Designer from "./Components/OthersComponents/Designers/Designer/Designer";
import AllProduct from "./Components/StoreLogic/AllProducts/AllProducts/AllProduct";
import VendorVerification from "./Components/OthersComponents/VendorVerification/VendorVerification";
import AboutUs from "./Components/OthersComponents/AboutUs/AboutUs";
import ContactUs from "./Components/OthersComponents/ContactUs/ContactUs";
import PrivacyPolicy from "./Components/Policies/PrivacyPolicy";
import Footer from "./Components/Footer/Footer";
import AllCollections from "./Components/StoreLogic/AllCollections/AllCollections";
import SingleProductPageDesign from "./Components/StoreLogic/AllProducts/IndiviDualProduct/SecondDesign/SingleProductPageDesign";
import ProductsPage from "./Components/StoreLogic/AllProducts/ProductsPage/ProductsPage";
import CollectionsViaProducts from "./Components/StoreLogic/AllCollections/CollectionsViaProducts/CollectionsViaProducts";
import CheckoutFlow from "./Components/StoreLogic/Checkout/CheckoutFlow";
import PaymentSuccess from "./Components/StoreLogic/Checkout/PaymentSuccess";
import PaymentFailed from "./Components/StoreLogic/Checkout/PaymentFailed";
import AppProvider from "./Components/StoreLogic/Context/AppState";
import ReturnPolicy from "./Components/Policies/ReturnPolicy";
import ShippingPolicy from "./Components/Policies/ShippingPolicy";
import TermsAndConditions from "./Components/Policies/TermsAndConditions";
import SellerPolicy from "./Components/Policies/SellerPolicy";
import TermsOfUse from "./Components/Policies/TermsOfUse";
import HomeComponents from "./Components/HomeComponents";
import Login from "./Components/Auth/Login/Login";
import Orders from "./Components/Orders/Orders";
import WhatsAppBtn from "./Components/WhatsAppBtn/WhatsAppBtn";
// import Maintenance from "./Components/Maintenance/Maintenance";
import { Grid, App as AntdApp } from "antd";
import { UserProvider } from "./Components/StoreLogic/Context/UserContext";
import { CartWishlistProvider } from "./Components/StoreLogic/Context/CartWishlistContext";
import { HomeDataProvider } from "./Components/StoreLogic/Context/HomeDataContext";
import { Provider } from "react-redux";
import store from "./store";
import { useEffect } from "react";
// Wrapper component for page transitions
const PageTransition = ({ children }) => {
  return <div style={{ marginTop: -10 }}>{children}</div>;
};

// Routes component with transitions
const AnimatedRoutes = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    // Track Facebook Pixel PageView on route change
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomeComponents />
            </PageTransition>
          }
        />
        <Route
          path="/designers"
          element={
            <PageTransition>
              <AllDesigners />
            </PageTransition>
          }
        />
        <Route
          path="/designers/:designerSlug"
          element={
            <PageTransition>
              <Designer />
            </PageTransition>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <PageTransition>
              <SingleProductPageDesign />
            </PageTransition>
          }
        />
        <Route
          path="/checkout"
          element={
            <PageTransition>
              <CheckoutFlow />
            </PageTransition>
          }
        />
        <Route
          path="/checkout/:orderNumber"
          element={
            <PageTransition>
              <CheckoutFlow />
            </PageTransition>
          }
        />
        <Route
          path="/checkout/payment-success"
          element={
            <PageTransition>
              <PaymentSuccess />
            </PageTransition>
          }
        />
        <Route
          path="/checkout/payment-failed"
          element={
            <PageTransition>
              <PaymentFailed />
            </PageTransition>
          }
        />
        <Route
          path="/vendor-verification"
          element={
            <PageTransition>
              <VendorVerification />
            </PageTransition>
          }
        />
        <Route
          path="/about-us"
          element={
            <PageTransition>
              <AboutUs />
            </PageTransition>
          }
        />
        <Route
          path="/contact-us"
          element={
            <PageTransition>
              <ContactUs />
            </PageTransition>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageTransition>
              <PrivacyPolicy />
            </PageTransition>
          }
        />
        <Route
          path="/return-policy"
          element={
            <PageTransition>
              <ReturnPolicy />
            </PageTransition>
          }
        />
        <Route
          path="/shipping-policy"
          element={
            <PageTransition>
              <ShippingPolicy />
            </PageTransition>
          }
        />
        <Route
          path="/terms-and-conditions"
          element={
            <PageTransition>
              <TermsAndConditions />
            </PageTransition>
          }
        />
        <Route
          path="/seller-policy"
          element={
            <PageTransition>
              <SellerPolicy />
            </PageTransition>
          }
        />
        <Route
          path="/terms-of-use"
          element={
            <PageTransition>
              <TermsOfUse />
            </PageTransition>
          }
        />
        <Route
          path="/all-collections"
          element={
            <PageTransition>
              <AllCollections />
            </PageTransition>
          }
        />
        <Route
          path="/single-product-design"
          element={
            <PageTransition>
              <SingleProductPageDesign />
            </PageTransition>
          }
        />
        <Route
          path="/collections-via-products"
          element={
            <PageTransition>
              <CollectionsViaProducts />
            </PageTransition>
          }
        />
        <Route
          path="/products"
          element={
            <PageTransition>
              <ProductsPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/orders"
          element={
            <PageTransition>
              <Orders />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { lg } = Grid.useBreakpoint();

  // Initialize Facebook Pixel
  useEffect(() => {
    // Check if fbq is already initialized
    if (window.fbq) {
      return;
    }

    // Initialize Facebook Pixel
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    // Initialize and track PageView
    window.fbq("init", "1940045939875054");
    window.fbq("track", "PageView");
  }, []);

  return (
    <>
      <Provider store={store}>
        <AppProvider>
          <UserProvider>
            <HomeDataProvider>
              <CartWishlistProvider>
                <AntdApp>
                  <BrowserRouter>
                    <div
                      style={{
                        width: "100vw",
                        // overflowX: "hidden",
                        paddingTop: lg ? "120px" : "60px",
                      }}
                    >
                      <Header />
                      {/* <Maintenance /> */}
                      <AnimatedRoutes />

                      {/* <FeaturesAndQuestion /> */}
                      {/* <CommonUserInteractionsPopup /> */}
                      <Footer />
                      {/* <Cookies /> */}
                      <WhatsAppBtn />

                      {/* Newsletter Signup Modal - Shows 3 seconds after page load */}
                      {/* <UserDetailsModal /> */}
                      {/* <Cart /> */}
                    </div>
                  </BrowserRouter>
                </AntdApp>
              </CartWishlistProvider>
            </HomeDataProvider>
          </UserProvider>
        </AppProvider>
      </Provider>
    </>
  );
}

export default App;
