import { Route, Routes } from "react-router-dom"
import Cart from "./pages/cart/Cart"
import Checkout from "./pages/checkout/Checkout"
import FoodDetails from "./pages/food/FoodDetails"
import Main from "./pages/main/Main"

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