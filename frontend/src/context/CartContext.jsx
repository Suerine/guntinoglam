import { createContext, useState, useEffect, useContext } from "react"
import API from "../api/axios"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"
import CartToast from "../components/ui/CartToast"

export const CartContext = createContext()

const GUEST_CART_KEY = "guest_cart"

const getGuestCart = () => JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]")
const saveGuestCart = (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
const clearGuestCart = () => localStorage.removeItem(GUEST_CART_KEY)

// Safely extract product ID regardless of whether it's populated or a raw string
const getProductId = (product) =>
  product && typeof product === "object" ? product._id : product

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [cart, setCart] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const fetchCart = async () => {
    if (user) {
      try {
        const res = await API.get("/api/cart")
        setCart(res.data)
        const items = res.data?.items || []
        setCartCount(items.reduce((total, item) => total + item.quantity, 0))
      } catch (err) {
        console.error(err)
      }
    } else {
      const guestItems = getGuestCart()
      setCart({ items: guestItems })
      setCartCount(guestItems.reduce((sum, item) => sum + item.quantity, 0))
    }
  }

const addToCart = async (product, selectedSize, selectedColor) => {
  const size = selectedSize || product.sizes?.[0]?.size
  const color = selectedColor || null

  const showToast = () => {
    toast.custom(() => (
      <div style={{
        background: '#FFF7FF',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '1rem',
      }}>
        <CartToast product={product} selectedSize={size} selectedColor={color} />
      </div>
    ))
  }

  if (!user) {
    const guestCart = getGuestCart()
    const existing = guestCart.find(
      (item) => item.productId === product._id && item.size === size && item.color === color
    )
    if (existing) {
      existing.quantity += 1
    } else {
      guestCart.push({
        productId: product._id,
        size,
        color,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
      })
    }
    saveGuestCart(guestCart)
    fetchCart()
    showToast()
    return
  }

  try {
     console.log("Adding to cart:", { productId: product._id, size, color, quantity: 1 })
     const res = await API.post("/api/cart", {
       productId: product._id,
       size,
       color,
       quantity: 1,
     })
     console.log("Cart response:", res.data)
     await fetchCart()
     showToast()
   } catch (err) {
     console.error("Cart error status:", err.response?.status)
     console.error("Cart error message:", err.response?.data)
     toast.error(err.response?.data?.message || "Failed to add product")
   }
}

  const mergeGuestCart = async () => {
    const guestItems = getGuestCart()
    if (!guestItems.length) return

    try {
      await API.post("/api/cart/merge", { items: guestItems })
      clearGuestCart()
      await fetchCart()
    } catch (err) {
      console.error("Failed to merge guest cart", err)
    }
  }

  const removeItem = async (productId, size, color) => {
    if (!user) {
      const updated = getGuestCart().filter(
        (item) => !(item.productId === productId && item.size === size && item.color === color)
      )
      saveGuestCart(updated)
      fetchCart()
      return
    }

    try {
      await API.delete("/api/cart", { data: { productId, size, color } })
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (item) => !(getProductId(item.product) === productId && item.size === size && item.color === color)
        ),
      }))
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  const updateQuantity = async (productId, size, color, quantity) => {
    if (quantity < 1) return

    if (!user) {
      const updated = getGuestCart().map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
      saveGuestCart(updated)
      setCart({ items: updated })
      setCartCount(updated.reduce((sum, item) => sum + item.quantity, 0))
      return
    }

    try {
      await API.put("/api/cart", { productId, size, color, quantity })
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) =>
          getProductId(item.product) === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        ),
      }))
      fetchCart()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user) {
      const guestItems = getGuestCart()
      if (!guestItems.length) {
        fetchCart()
      }
    } else {
      const guestItems = getGuestCart()
      setCartCount(guestItems.reduce((sum, item) => sum + item.quantity, 0))
      setCart({ items: guestItems })
    }
  }, [user])

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeItem, updateQuantity, mergeGuestCart }}>
      {children}
    </CartContext.Provider>
  )
}