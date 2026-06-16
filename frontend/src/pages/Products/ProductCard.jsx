import { FiHeart } from "react-icons/fi"
import { useState, useContext } from "react"
import { CartContext } from "../../context/CartContext"
import { WishlistContext } from "../../context/WishlistContext"
import { CurrencyContext } from "../../context/CurrencyContext"


function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  const image1 = product.images?.[0]
  const image2 = product.images?.[1] || image1

  const isOutOfStock = product.sizes?.length > 0 && product.sizes.every(s => s.stock === 0)

  const { addToCart } = useContext(CartContext)
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext)
  const { formatPrice } = useContext(CurrencyContext)
  const isInWishlist = wishlist.some(item => item._id === product._id)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@300;400&display=swap');
        .card-text-desktop { display: flex; }
        .card-text-mobile { display: none; }
        @media (max-width: 767px) {
          .card-text-desktop { display: none !important; }
          .card-text-mobile { display: block !important; }
        }
      `}</style>

      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image container */}
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
          <img
            src={hovered ? image2 : image1}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              display: 'block',
            }}
          />

          {/* Gradient — desktop only */}
          <div className="card-text-desktop" style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
          }} />

          {/* Out of stock badge */}
          {isOutOfStock && (
            <div style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'rgba(220,38,38,0.9)',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.45rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              zIndex: 10,
            }}>
              Out of stock
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              if (loading) return
              setLoading(true)
              try {
                if (isInWishlist) {
                  await removeFromWishlist(product._id)
                } else {
                  await addToWishlist(product)
                }
              } finally {
                setLoading(false)
              }
            }}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: isInWishlist ? 'rgba(255,100,100,0.85)' : 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              opacity: hovered ? 1 : 0.6,
            }}
          >
            <FiHeart style={{ color: '#fff', fontSize: '0.8rem', fill: isInWishlist ? '#fff' : 'none' }} />
          </button>

          {/* Desktop text — inside image */}
          <div className="card-text-desktop" style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1.25rem',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
            <div>
              {product.collections && (
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.45rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '0.3rem',
                }}>
                  {product.collections}
                </p>
              )}
              <h3 style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.2rem',
                fontWeight: 300,
                color: '#fff',
                lineHeight: 1.2,
                marginBottom: '0.25rem',
              }}>
                {product.name}
              </h3>
              <p style={{
                 fontFamily: 'Montserrat, sans-serif',
                 fontSize: '0.65rem',
                 color: 'rgba(255,255,255,0.7)',
               }}>
                 {formatPrice(product.price)}
                 {product.isRentable && product.rentalPrice && (
                   <span style={{ marginLeft: '0.5rem', color: 'rgba(255,236,247,0.6)', fontStyle: 'italic' }}>
                     · Rent {formatPrice(product.rentalPrice)}
                   </span>
                 )}
               </p>
            </div>

            <button
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isOutOfStock || cartLoading) return
                setCartLoading(true)
                try { await addToCart(product); }
                finally { setCartLoading(false) }
              }}
              disabled={isOutOfStock}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: isOutOfStock ? 'rgba(255,255,255,0.5)' : '#fff',
                border: '1px solid rgba(255,255,255,0.35)',
                background: isOutOfStock ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.25s ease',
                opacity: hovered || isOutOfStock ? 1 : 0,
                transform: hovered || isOutOfStock ? 'translateY(0)' : 'translateY(6px)',
              }}
            >
              {isOutOfStock ? 'Out of stock' : (cartLoading ? '...' : 'Add to cart')}
            </button>
          </div>
        </div>

        {/* Mobile text — below image */}
        <div className="card-text-mobile w-full h-20" style={{ padding: '0.6rem 0.25rem 1rem', background:"#f9f9f7"}}>
          {product.collections && (
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.45rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.35)',
              marginBottom: '0.2rem',
            }}>
              {product.collections}
            </p>
          )}
          <h3 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1rem',
            fontWeight: 300,
            color: '#191A23',
            lineHeight: 1.2,
            marginBottom: '0.2rem',
          }}>
            {product.name}
          </h3>
          <div className="flex flex-row items-center gap-2">
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              color: 'rgba(0,0,0,0.8)',
              letterSpacing: '0.05em',
            }}>
              {formatPrice(product.price)}
            </p>

            {product.isRentable && product.rentalPrice && (
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.55rem',
                color: 'rgba(0,0,0,0.4)',
                letterSpacing: '0.05em',
                fontStyle: 'italic',
              }}>
                · Rent {formatPrice(product.rentalPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard