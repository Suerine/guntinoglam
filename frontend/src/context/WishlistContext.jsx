import { createContext, useState, useEffect, useContext } from "react"
import API from "../api/axios"
import { AuthContext } from "./AuthContext"
import toast from "react-hot-toast"
import WishlistToast from "../components/ui/WishlistToast"

export const WishlistContext = createContext()

const GUEST_WISHLIST_KEY = "guest_wishlist"
const getGuestWishlist = () => JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || "[]")
const saveGuestWishlist = (items) => localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(items))
const clearGuestWishlist = () => localStorage.removeItem(GUEST_WISHLIST_KEY)

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState(false)

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const res = await API.get("/api/wishlist")
      setWishlist(res.data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (product) => {
    if (operationInProgress) return
    setOperationInProgress(true)

    try {
      // Guest flow
      if (!user) {
        const guest = getGuestWishlist()
        const exists = guest.find((p) => p._id === product._id)
        if (!exists) {
          const updated = [...guest, product]
          saveGuestWishlist(updated)
          setWishlist(updated)
          toast.custom(() => (
            <div style={{
              background: '#FFF5FF',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              padding: '1rem',
            }}>
              <WishlistToast product={product} removed={false} />
            </div>
          ))
        }
        return
      }

      // Logged-in flow — optimistic
      setWishlist((prev) => {
        const exists = prev.find((p) => p._id === product._id)
        if (exists) return prev
        return [...prev, product]
      })

      toast.custom(() => (
        <div style={{
          background: '#FFF5FF',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          padding: '1rem',
        }}>
          <WishlistToast product={product} removed={false} />
        </div>
      ))

      await API.post("/api/wishlist", { productId: product._id })
    } catch (err) {
      console.error(err)
      fetchWishlist()
    } finally {
      setOperationInProgress(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    if (operationInProgress) return
    setOperationInProgress(true)

    try {
      // Get the product for the toast
      const product = wishlist.find((p) => p._id === productId)

      // Guest flow
      if (!user) {
        const updated = getGuestWishlist().filter((p) => p._id !== productId)
        saveGuestWishlist(updated)
        setWishlist(updated)
        if (product) {
          toast.custom(() => (
            <div style={{
              background: '#FFF5FF',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              padding: '1rem',
            }}>
              <WishlistToast product={product} removed={true} />
            </div>
          ))
        }
        return
      }

      // Logged-in flow — optimistic
      setWishlist((prev) => prev.filter((p) => p._id !== productId))

      if (product) {
        toast.custom(() => (
          <div style={{
            background: '#FFF5FF',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            padding: '1rem',
          }}>
            <WishlistToast product={product} removed={true} />
          </div>
        ))
      }

      await API.delete(`/api/wishlist/${productId}`)
    } catch (err) {
      console.error(err)
      fetchWishlist()
    } finally {
      setOperationInProgress(false)
    }
  }

  // Called by AuthContext after login
  const mergeGuestWishlist = async () => {
    const guestItems = getGuestWishlist()
    if (!guestItems.length) return

    try {
      const productIds = guestItems.map((p) => p._id)
      await API.post("/api/wishlist/merge", { productIds })
      clearGuestWishlist()
      await fetchWishlist()
    } catch (err) {
      console.error("Failed to merge guest wishlist", err)
    }
  }

  useEffect(() => {
    if (user) {
      const guestItems = getGuestWishlist()
      if (!guestItems.length) {
        // No guest items — safe to just fetch DB wishlist
        fetchWishlist()
      }
      // If there ARE guest items, mergeGuestWishlist() will
      // handle fetching after merge — don't fetch here
    } else {
      setWishlist(getGuestWishlist())
    }
  }, [user])

  return (
    <WishlistContext.Provider value={{ wishlist, loading, operationInProgress, addToWishlist, removeFromWishlist, mergeGuestWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}