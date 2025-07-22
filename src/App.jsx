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
import IndiviDualProduct from './Components/StoreLogic/AllProducts/IndividualProduct/IndiviDualProduct';
import AllProduct from './Components/StoreLogic/AllProducts/AllProducts/AllProduct';
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
          <Route path="/product/:productName" element={<IndiviDualProduct />} />
          <Route path="/all-products" element={<AllProduct />} />
        </Routes>
        <FeaturesAndQuestion />
        {/* <CommonUserInteractionsPopup /> */}
        <InstagramGrid />
        {/* <Cookies /> */}
      </BrowserRouter>
    </>
  )
}

export default App
