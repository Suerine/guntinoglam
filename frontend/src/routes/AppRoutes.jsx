import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Layout from "../components/layout/Layout";
import Products from "../pages/Products/Products";
import Checkout from "../pages/Shop/Checkout";
import Orders from "../pages/Shop/Orders"
import Profile from "../pages/Profile/Profile"
import ProtectedRoute from "../pages/Auth/ProtectedRoutes"
import Cart from "../pages/Shop/Cart";
import ProductPage from "../pages/Products/ProductPage";
import Wishlist from "../pages/Shop/Wishlist";
import AuthPage from "../pages/Auth/AuthPage";
// import AdminDashboard from "../pages/Admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home — no Layout, it has its own Navbar + snap scroll */}
      <Route path="/" element={<Home />} />

      {/* All other routes — wrapped in Layout */}
      <Route element={<Layout />}>
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<Wishlist />} />
        {/* <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;