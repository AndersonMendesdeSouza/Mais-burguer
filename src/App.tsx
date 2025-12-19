import { Routes, Route } from 'react-router-dom'
import { Main } from './pages/main/Main'
import { FoodDetails } from './pages/FoodDetails'
import ProductDetails from './pages/product/Productdetails'
import Cart from './pages/cart/Cart'
import Checkout from './pages/checkout/checkout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/sobre" element={<FoodDetails />} />
      <Route path="/productDetails" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  )
}

export default App