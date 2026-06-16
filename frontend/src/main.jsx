import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import { CurrencyProvider } from "./context/CurrencyContext"
import { Toaster } from "react-hot-toast"
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <HelmetProvider>
    <CurrencyProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          <Toaster
           position="top-center"
           containerStyle={{ zIndex: 9999 }}
           toastOptions={{
             duration: 3000,
             style: {
               background: "#FFF7FF",
               color: "#191A23",
               border: "1px solid rgba(0,0,0,0.06)",
               boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
               borderRadius: "0px",
               padding: "1rem",
             }
           }}
         />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </CurrencyProvider>
    </HelmetProvider>
  </React.StrictMode>
);