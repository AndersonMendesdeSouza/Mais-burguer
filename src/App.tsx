import { Route, Routes } from "react-router-dom"
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Checkout/Checkout"
import FoodDetails from "./pages/Food/FoodDetails"
import Main from "./pages/Main/Main"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/sobre" element={<FoodDetails />} />
      <Route path="/foodDetails" element={<FoodDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  )
}

export default App