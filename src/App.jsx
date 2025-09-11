import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import HomeRoutes from './Components/HomeComponents/HomeRoutes'
import FeaturesAndQuestion from './Components/HomeComponents/FeaturesAndQuestions/FeaturesAndQuestion'
import CommonUserInteractionsPopup from './Components/CommonUserInteractions/CommonUserInteractionsPopup'
import Cookies from './Components/CommonUserInteractions/Cookies/Cookies'
import InstagramGrid from './Components/CommonUserInteractions/InstagramGrid/InstagramGrid'
import NavigationBar from './Components/NavigationBar/NavigationBar';
import AllDesigners from "./Components/OthersComponents/Designers/AllDesigners/AllDesigners";
import Designer from "./Components/OthersComponents/Designers/Designer/Designer";
import IndividualProduct from './Components/StoreLogic/AllProducts/IndiviDualProduct/IndividualProductPage';
import AllProduct from './Components/StoreLogic/AllProducts/AllProducts/AllProduct';
import VendorVerification from './Components/OthersComponents/VendorVerification/VendorVerification';
import AboutUs from './Components/OthersComponents/AboutUs/AboutUs';
import ContactUs from './Components/OthersComponents/ContactUs/ContactUs';
import WhatsAppBtn from './Components/WhatsAppBtn';
import PrivacyPolicy from './Components/PrivacyPolicy/PrivacyPolicy';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 0.98
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
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
        <Route path="/" element={
          <PageTransition>
            <HomeRoutes />
          </PageTransition>
        } />
        <Route path="/designers" element={
          <PageTransition>
            <AllDesigners />
          </PageTransition>
        } />
        <Route path="/designers/:designerSlug" element={
          <PageTransition>
            <Designer />
          </PageTransition>
        } />
        <Route path="/product/:productName" element={
          <PageTransition>
            <IndividualProduct />
          </PageTransition>
        } />
        <Route path="/all-products" element={
          <PageTransition>
            <AllProduct />
          </PageTransition>
        } />
        <Route path="/vendor-verification" element={
          <PageTransition>
            <VendorVerification />
          </PageTransition>
        } />
        <Route path="/about-us" element={
          <PageTransition>
            <AboutUs />
          </PageTransition>
        } />
        <Route path="/contact-us" element={
          <PageTransition>
            <ContactUs />
          </PageTransition>
        } />
        <Route path="/privacy-policy" element={
          <PageTransition>
            <PrivacyPolicy />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <AnimatedRoutes />
        {/* <FeaturesAndQuestion /> */}
        {/* <CommonUserInteractionsPopup /> */}
        <InstagramGrid />
        {/* <Cookies /> */}
        {/* <WhatsAppBtn /> */}
      </BrowserRouter>
    </>
  )
}

export default App
