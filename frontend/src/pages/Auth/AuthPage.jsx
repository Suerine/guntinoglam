import { useState, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { CartContext } from "../../context/CartContext"
import { WishlistContext } from "../../context/WishlistContext"
import { useNavigate } from "react-router-dom"
import { FiMail, FiLock, FiUser, FiLoader } from "react-icons/fi"
import GuntinoGlam from "../../assets/images/GuntinoGlam.jpg"
import AuthBackground from "../../assets/images/1S0A6496.jpg"

function AuthPage() {
  const { login, register } = useContext(AuthContext)
  const { mergeGuestCart } = useContext(CartContext)
  const { mergeGuestWishlist } = useContext(WishlistContext)

  const mergeAll = async () => {
    await Promise.all([mergeGuestCart(), mergeGuestWishlist()])
  }

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password, mergeAll)
      } else {
        await register(name, email, password, mergeAll)
      }
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.25rem',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    border: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    background: 'transparent',
    outline: 'none',
    color: '#191A23',
    transition: 'border-color 0.2s ease',
  }

  const iconStyle = {
    position: 'absolute',
    left: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(0,0,0,0.2)',
    fontSize: '0.85rem',
  }

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#FFF7FF' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');
        .auth-input:focus { border-bottom-color: rgba(0,0,0,0.5) !important; }
      `}</style>

      {/* Left — full image panel */}
      <div className="hidden lg:block" style={{ width: '55%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={AuthBackground}
          alt="Guntino Glam"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Dark gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%), linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
        }} />

        {/* Branding overlay */}
        <div style={{ position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem' }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '0.75rem',
          }}>
            Tradition draped in glamour
          </p>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(2.5rem, 4vw, 4rem)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '0.05em',
          }}>
            Guntino Glam
          </h2>
        </div>

        {/* Logo top left */}
        <img
          src={GuntinoGlam}
          alt="logo"
          style={{ position: 'absolute', top: '2rem', left: '2rem', width: '3rem', borderRadius: '50%' }}
        />
      </div>

      {/* Right — form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
      }}>

        {/* Mobile logo */}
        <img src={GuntinoGlam} alt="logo" className="lg:hidden" style={{ width: '3rem', borderRadius: '50%', marginBottom: '2rem' }} />

        <div style={{ width: '100%', maxWidth: '22rem' }}>

          {/* Title */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.3)',
              marginBottom: '0.75rem',
            }}>
              {isLogin ? "Welcome back" : "Join us"}
            </p>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: 300,
              color: '#191A23',
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}>
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <div style={{ width: '2rem', height: '1px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <FiUser style={iconStyle} />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="auth-input"
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
                required
                className="auth-input"
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
                required
                className="auth-input"
                style={inputStyle}
              />
            </div>

            {error && (
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                color: 'rgba(180,0,0,0.7)',
                background: 'rgba(180,0,0,0.05)',
                padding: '0.5rem 0.75rem',
                textAlign: 'center',
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#fff',
                background: '#191A23',
                border: 'none',
                padding: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                transition: 'background 0.25s ease',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#000' }}
              onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
            >
              {loading ? (
                <><FiLoader style={{ animation: 'spin 1s linear infinite' }} size={12} />
                  {isLogin ? "Signing in..." : "Creating account..."}</>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>

          </form>

          {/* Switch */}
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.05em',
            color: 'rgba(0,0,0,0.35)',
            textAlign: 'center',
            marginTop: '1.5rem',
          }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.05em',
                color: '#191A23',
                textDecoration: 'underline',
              }}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

          {/* Footer note */}
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            color: 'rgba(0,0,0,0.15)',
            textAlign: 'center',
            marginTop: '3rem',
            textTransform: 'uppercase',
          }}>
            © 2025 Guntino Glam · Nairobi, Kenya
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage