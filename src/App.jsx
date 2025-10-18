import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import CartPage from "./Components/StoreLogic/Cart/CartPage";
import AppProvider from "./Components/StoreLogic/Context/AppState";
import ReturnPolicy from "./Components/Policies/ReturnPolicy";
import ShippingPolicy from "./Components/Policies/ShippingPolicy";
import TermsAndConditions from "./Components/Policies/TermsAndConditions";
import SellerPolicy from "./Components/Policies/SellerPolicy";
import TermsOfUse from "./Components/Policies/TermsOfUse";
import HomeComponents from "./Components/HomeComponents";
import { Grid } from "antd";
import { UserProvider } from "./Components/StoreLogic/Context/UserContext";
import { CartWishlistProvider } from "./Components/StoreLogic/Context/CartWishlistContext";
// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4,
};

// Wrapper component for page transitions
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

// Routes component with transitions
const AnimatedRoutes = () => {
  const location = useLocation();

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
          path="/products"
          element={
            <PageTransition>
              <ProductsPage />
            </PageTransition>
          }
        />
        <Route
          path="/cart"
          element={
            <PageTransition>
              <CartPage />
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
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { lg } = Grid.useBreakpoint();
  return (
    <>
      <AppProvider>
        <UserProvider>
          <CartWishlistProvider>
            <BrowserRouter>
              <div
                style={{
                  width: "100vw",
                  overflowX: "hidden",
                  paddingTop: lg ? "120px" : "60px",
                }}
              >
                <Header />
                <AnimatedRoutes />

                {/* <FeaturesAndQuestion /> */}
                {/* <CommonUserInteractionsPopup /> */}
                <Footer />
                {/* <Cookies /> */}
                {/* <WhatsAppBtn /> */}

                {/* Newsletter Signup Modal - Shows 3 seconds after page load */}
                {/* <UserDetailsModal /> */}
                {/* <Cart /> */}
              </div>
            </BrowserRouter>
          </CartWishlistProvider>
        </UserProvider>
      </AppProvider>
    </>
  );
}

export default App;
