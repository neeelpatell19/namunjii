import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<HomeRoutes />} />
          <Route path="/designers" element={<AllDesigners />} />
          <Route path="/designers/:designerSlug" element={<Designer />} />
          <Route path="/product/:productName" element={<IndividualProduct />} />
          <Route path="/all-products" element={<AllProduct />} />
          <Route path="/vendor-verification" element={<VendorVerification />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
        {/* <FeaturesAndQuestion /> */}
        {/* <CommonUserInteractionsPopup /> */}
        <InstagramGrid />
        {/* <Cookies /> */}
      </BrowserRouter>
    </>
  )
}

export default App
