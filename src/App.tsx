import { Route, Routes } from "react-router-dom"
import Cart from "./pages/cart/Cart";
import FoodDetails from "./pages/food/FoodDetails";
import Main from "./pages/main/Main";
import Checkout from "./pages/checkout/checkout";

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