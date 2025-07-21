import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeRoutes from './Components/HomeComponents/HomeRoutes'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoutes />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
