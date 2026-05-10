import { useContext } from "react"
import { WishlistContext } from "../../context/WishlistContext"
import { CartContext } from "../../context/CartContext"
import { Link } from "react-router-dom"
import { FiHeart } from "react-icons/fi"
import ProductCard from "../Products/ProductCard"
import Breadcrumb from "../../components/ui/Breadcrumb"

function Wishlist() {
  const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext)
  const { addToCart } = useContext(CartContext)

  const styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

      .wl-cormorant { font-family: 'Cormorant Garamond', serif; }
      .wl-montserrat { font-family: 'Montserrat', sans-serif; }

      .skeleton {
        background: linear-gradient(90deg, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
      }
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      .product-card-link {
        text-decoration: none;
        display: block;
      }
      .product-card-link:hover .card-img {
        transform: scale(1.04);
      }
      .card-img {
        transition: transform 0.5s ease;
      }
    `}</style>
  )

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'rgb(252, 240, 252)' }}>
        {styles}
        <div style={{
          background: '#FFF7FF',
          padding: '8.5rem 2.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)' }} ></div>
          <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#191A23',
              marginBottom: '1rem',
            }}>
              Saved Items
            </p>
            <div className="skeleton" style={{ width: '300px', height: '80px' }} />
          </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '3/4', width: '100%', borderRadius: '4px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (wishlist.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: 'rgb(252, 240, 252)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', textAlign: 'center', padding: '2rem' }}>
        {styles}
        <FiHeart style={{ fontSize: '3rem', color: 'rgba(0,0,0,0.15)' }} />
        <div>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2.5rem',
            fontWeight: 300,
            color: 'rgba(0,0,0,0.3)',
          }}>
            Your Wishlist is Empty
          </h2>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            color: 'rgba(0,0,0,0.3)',
            marginTop: '0.5rem',
          }}>
            Save items you love for later
          </p>
        </div>
        <Link
          to="/products"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            background: '#0a0a0a',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 2rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7FF' }}>
      {styles}
      <Breadcrumb crumbs={[{ to: '/', label: 'Home' }, { label: 'Wishlist' }]} />

      {/* Body */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '4rem',}}>
        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
          {wishlist.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`} className="product-card-link">
              <ProductCard product={product} />
            </Link>
          ))}
        </div>

        {/* Continue shopping */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3.5rem', marginBottom: '2rem' }}>
          <Link className="bg-black/90 hover:bg-black text-sm hover:text-black text-white  transition-colors"
            to="/products"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease',
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Wishlist