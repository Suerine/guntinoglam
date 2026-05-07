import { useEffect, useRef, useState, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { CartContext } from "../../context/CartContext"
import { WishlistContext } from "../../context/WishlistContext"
import { FiUser, FiMail, FiLock, FiLogOut, FiLoader } from "react-icons/fi"

function LoginCard({ isOpen, setIsOpen }) {
  const cardRef = useRef()
  const [mode, setMode] = useState("login")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { user, login, register, logout } = useContext(AuthContext)
  const { mergeGuestCart } = useContext(CartContext)
  const { mergeGuestWishlist } = useContext(WishlistContext)

  const mergeAll = async () => {
    await Promise.all([mergeGuestCart(), mergeGuestWishlist()])
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (mode === "login") {
        await login(email, password, mergeAll)
      } else {
        await register(fullName, email, password, mergeAll)
      }
      setFullName(""); setEmail(""); setPassword(""); setError("")
      setIsOpen(false)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.65rem 0.75rem 0.65rem 2.25rem',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    background: 'transparent',
    outline: 'none',
    color: '#191A23',
  }

  const iconStyle = {
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(0,0,0,0.2)',
    fontSize: '0.8rem',
  }

  return (
    <div
      ref={cardRef}
      style={{
        position: 'absolute',
        right: '1.5rem',
        top: '4rem',
        width: '18rem',
        zIndex: 100,
      }}
      className="hidden md:block"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400&display=swap');`}</style>

      <div style={{
        background: 'rgba(255,245,255,0.98)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>

        {/* Logged in */}
        {user ? (
          <div>
            <div style={{ background: '#0a0a0a', padding: '1.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: '#FFECF7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', fontWeight: 500, color: '#191A23' }}>
                  {user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 300, color: '#fff', lineHeight: 1.2 }}>
                  {user.name}
                </p>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>
                  {user.email}
                </p>
              </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: '#191A23',
                  textDecoration: 'none',
                  padding: '0.75rem',
                  transition: 'background 0.25s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#000'}
                onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
              >
                View Profile
              </Link>
              <button
                onClick={() => { logout(); setIsOpen(false) }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(200,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'color 0.2s ease',
                  padding: '0.25rem',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,0,0,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,0,0,0.5)'}
              >
                <FiLogOut size={12} /> Sign out
              </button>
            </div>
          </div>

        ) : (
          <div>
            {/* Header */}
            <div style={{ background: '#0a0a0a', padding: '1.5rem 1.25rem' }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,236,247,0.35)', marginBottom: '0.5rem' }}>
                {mode === "login" ? "Welcome back" : "Join us"}
              </p>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#fff', lineHeight: 1 }}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </h2>
            </div>

            {/* Form */}
            <div style={{ padding: '1.5rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {mode === "signup" && (
                <div style={{ position: 'relative' }}>
                  <FiUser style={iconStyle} />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <FiMail style={iconStyle} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <FiLock style={iconStyle} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={inputStyle}
                />
              </div>

              {error && (
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(200,0,0,0.7)',
                  background: 'rgba(200,0,0,0.05)',
                  padding: '0.5rem 0.75rem',
                  textAlign: 'center',
                }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: '#191A23',
                  border: 'none',
                  padding: '0.85rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background 0.25s ease',
                  marginTop: '0.25rem',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#000' }}
                onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
              >
                {loading ? (
                  <><FiLoader style={{ animation: 'spin 1s linear infinite' }} size={12} />
                    {mode === "login" ? "Signing in..." : "Creating account..."}</>
                ) : (
                  mode === "login" ? "Sign In" : "Create Account"
                )}
              </button>

              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.05em', color: 'rgba(0,0,0,0.35)', textAlign: 'center' }}>
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError("") }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: '#191A23', textDecoration: 'underline', letterSpacing: '0.05em' }}
                >
                  {mode === "login" ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginCard