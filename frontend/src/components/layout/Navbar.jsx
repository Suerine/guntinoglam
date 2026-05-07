import API from "../../api/axios"
import { useState, useContext, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import Guntino_Logo from "../../assets/images/GuntinoGlam.jpg"
import LoginCard from "../ui/LoginCard"
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch, FiHeart } from "react-icons/fi"
import { CartContext } from "../../context/CartContext"
import { AuthContext } from "../../context/AuthContext"
import { WishlistContext } from "../../context/WishlistContext"
import { useLocation } from "react-router-dom"
import CartCard from "../ui/CartCard"
import CurvedLoop from "../ui/CurvedLoop"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()
  const isHome = location.pathname === "/"

  const { user, logout } = useContext(AuthContext)
  const { cartCount } = useContext(CartContext)
  const { wishlist } = useContext(WishlistContext)

  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  const [showMiniCart, setShowMiniCart] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const miniCartRef = useRef(null)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)

  useEffect(() => {
  const hero = document.getElementById("hero-section")
  if (!hero) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      // pastHero = true when hero is no longer visible
      setPastHero(!entry.isIntersecting)
    },
    {
      root: document.getElementById("snap-container"),
      threshold: 0.15, // goes dark when 85% of hero has scrolled away
    }
  )

  observer.observe(hero)
  return () => observer.disconnect()
  }, [])

  // Track screen size for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (miniCartRef.current && !miniCartRef.current.contains(e.target)) {
        setShowMiniCart(false)
      }
    }
    if (showMiniCart) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showMiniCart])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLoginClick = () => setIsLoginOpen((prev) => !prev)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/products?search=${encodeURIComponent(query)}`)
    setShowDropdown(false)
    setQuery("")
  }

  const fetchResults = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/api/products/search?search=${encodeURIComponent(query)}`)
      setResults(res.data.products?.slice(0, 5) || [])
      setShowDropdown(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!query) { setResults([]); setShowDropdown(false); return }
    const debounce = setTimeout(() => fetchResults(), 300)
    return () => clearTimeout(debounce)
  }, [query])

  useEffect(() => {
    if (!isHome) return // skip scroll listener on other pages

    const timeout = setTimeout(() => {
      const container = document.getElementById("snap-container")
      if (!container) return

      const handleScroll = () => {
        const y = container.scrollTop
        setPastHero(y > window.innerHeight * 0.95)
      }

      container.addEventListener("scroll", handleScroll, { passive: true })
      return () => container.removeEventListener("scroll", handleScroll)
    }, 100)

    return () => clearTimeout(timeout)
  }, [isHome])

  // Nav style — transparent only on home hero (desktop only), solid on mobile
  const navBackground = isMobile
    ? "#FFF5FF"                        // solid on mobile
    : !isHome
      ? "#FFF5FF"                      // solid on other pages (desktop)
      : pastHero
        ? "rgba(255,236,247,0)"        // past hero on home (desktop)
        : "transparent"                // over hero on home (desktop)

  const navBlur = isMobile ? "blur(0px)" : !isHome ? "blur(0px)" : pastHero ? "blur(0px)" : "none"

  const textColor = isMobile ? "rgba(0,0,0,0.8)" : !isHome || pastHero ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.9)"

  return (
    <>
    
      <div
        className={`fixed top-0 left-0 right-0 z-50`}
      >
       {/* Marquee — yellow accent bar */}
        <div className="w-full bg-pink-300 relative z-0 font-montserrat">
          <CurvedLoop
            marqueeText={`· We sell and rent dirac · Ships worldwide`}
            speed={1}
            curveAmount={0}
            className="fill-black"
          />
        </div>
      <nav
        className="px-4 sm:px-6 lg:px-10 py-3 md:py-4 relative border-b transition-all duration-500 overflow-visible"
        style={{
          background: navBackground,
          backdropFilter: navBlur,
          borderColor: isMobile || !isHome || pastHero ? "rgba(0,0,0,0.06)" : "transparent",
        }}
      >
          <div className="flex items-center justify-between">

             {/* Desktop nav links — left */}
           <ul className="hidden md:flex gap-8 lg:gap-10 flex-1">
            {[
              { to: "/products?collection=Maqbal", label: "Maqbal" },
              { to: "/products?collection=Stones", label: "Stones" },
              { to: "/products?collection=Faransawi", label: "Faransawi" },
              { to: "/products?collection=Guntino", label: "Guntino" },
            ].map(({ to, label }) => (
              <li key={label}>
                <Link to={to} className="nav-link-item">{label}</Link>
              </li>
            ))}
          </ul>

            {/* Logo — center */}
             <Link to="/" className="flex items-center justify-center flex-shrink-0">
               <img
                 className="w-12 md:w-16 object-contain"
                 src={Guntino_Logo}
                 alt="Guntino Glam Logo"
               />
             </Link>

            {/* Right side */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 justify-end">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative transition-colors duration-200 nav-link-item">
                Wishlist
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-[10px] min-w-[16px] h-4 w-4 px-[4px] flex items-center justify-center rounded-full leading-none font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <div className="relative" ref={miniCartRef}>
                <button
                  onClick={() => setShowMiniCart((prev) => !prev)}
                  className="relativetransition-colors duration-200 nav-link-item"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
                {showMiniCart && <CartCard onClose={() => setShowMiniCart(false)} />}
              </div>

              {/* Search */}
              <div className="relative hidden md:block " ref={searchRef}>
                   <button onClick={handleSubmit}>
                     <FiSearch className="text-black/50 hover:text-black text-base shrink-0" />
                   </button>

                {showDropdown && (
                  <div className="absolute top-11 left-0 w-64 bg-black border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {loading && (
                      <div className="flex items-center gap-2 p-4">
                        <div className="w-3 h-3 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
                        <p className="nav-dm text-xs text-white/40">Searching...</p>
                      </div>
                    )}
                    {!loading && results.length === 0 && (
                      <div className="p-4 text-center">
                        <p className="nav-dm text-xs text-white/30">No products found</p>
                      </div>
                    )}
                    {!loading && results.map((product, i) => (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-150 ${i !== results.length - 1 ? "border-b border-white/5" : ""}`}
                        onClick={() => { setShowDropdown(false); setQuery("") }}
                      >
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="nav-dm text-white text-xs font-medium truncate">{product.name}</p>
                          <p className="nav-bebas text-pink-400 text-xs mt-0.5 tracking-wide">KSh {product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

           

              {/* User */}
              <button
                onClick={handleLoginClick}
                className="hidden md:flex items-center text-black/50 hover:text-black transition-colors duration-200"
              >
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-pink-300 flex items-center justify-center">
                    <span className="text-black text-xs font-bold nav-dm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                ) : (
                  <FiUser className="text-xl" />
                )}
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xl text-black/50 hover:text-black transition-colors md:hidden"
              >
                {isOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>

          <LoginCard isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />

          {/* Mobile menu */}
          {isOpen && (
            <div className="mobile-menu-enter mt-4 md:hidden flex flex-col items-center gap-5 pb-6 border-t border-white/5 pt-5">

              <form
                onSubmit={(e) => { handleSubmit(e); setIsOpen(false) }}
                className="flex items-center bg-pink/5 border border-pink-400 rounded-full px-3 py-2 w-full max-w-xs"
              >
                <FiSearch className="text-white/30 text-sm" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="ml-2 outline-none text-sm bg-transparent w-full text-black placeholder-black/25 nav-dm"
                />
              </form>

              {[{ to: "/", label: "Home" }, { to: "/products", label: "Products" }, { to: "/stats", label: "Stats" }].map(({ to, label }) => (
                <Link key={to} onClick={() => setIsOpen(false)} to={to}
                  className="nav-dm text-black/50 hover:text-black text-xs tracking-widest uppercase transition-colors">
                  {label}
                </Link>
              ))}

              <div className="w-full max-w-xs h-px bg-white/5" />

              <Link onClick={() => setIsOpen(false)} to="/wishlist" className="nav-dm flex items-center gap-2 text-black/50 hover:text-black text-sm transition-colors">
                <FiHeart className="text-base" /> Wishlist
                {wishlist.length > 0 && <span className="bg-pink-400 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlist.length}</span>}
              </Link>

              <Link onClick={() => setIsOpen(false)} to="/cart" className="nav-dm flex items-center gap-2 text-black/50 hover:text-black text-sm transition-colors">
                <FiShoppingCart className="text-base" /> Cart
                {cartCount > 0 && <span className="bg-pink-400 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
              </Link>

              <div className="w-full max-w-xs h-px bg-white/5" />

              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center">
                      <span className="text-black text-sm font-bold nav-dm">{user.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="nav-dm text-black text-sm">{user.name}</span>
                  </div>
                  <Link onClick={() => setIsOpen(false)} to="/profile"
                    className="nav-dm text-black/50 hover:text-black text-xs tracking-widest uppercase transition-colors flex items-center gap-2">
                    <FiUser className="text-base" /> Profile
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false) }}
                    className="nav-dm text-red-400 hover:text-red-300 text-sm transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className="nav-dm px-8 py-2.5 bg-pink-300 text-black/50 hover:text-black text-sm font-medium hover:bg-pink-400 transition-colors w-full text-center">
                  Login
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </>
  )
}

export default Navbar