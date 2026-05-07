import { createContext, useState, useEffect } from "react"
import API from "../api/axios"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (email, password, onAfterAuth) => {
    const res = await API.post("api/auth/login", { email, password })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data))
    setUser(res.data)

    await onAfterAuth?.() // merge guest cart/wishlist
  }

  const register = async (name, email, password, onAfterAuth) => {
    const res = await API.post("api/auth/register", { name, email, password })

    localStorage.setItem("token", res.data.token)
    localStorage.setItem("user", JSON.stringify(res.data))
    setUser(res.data)

    await onAfterAuth?.()
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}