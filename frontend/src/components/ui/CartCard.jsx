import { useContext } from "react"
import { CartContext } from "../../context/CartContext"
import { AuthContext } from "../../context/AuthContext"
import { CurrencyContext } from "../../context/CurrencyContext"
import { Link } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi"

const CartCard = () => {
  const { cart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const { formatPrice } = useContext(CurrencyContext)

  const normalizeItem = (item) => {
    if (!user) {
      return {
        id: `${item.productId}-${item.size}-${item.color}`,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }
    }
    const isPopulated = item.product && typeof item.product === "object"
    return {
      id: item._id,
      name: isPopulated ? item.product.name : item.name,
      image: isPopulated ? item.product.images?.[0] : item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{
        position: 'absolute',
        right: 0,
        top: '3rem',
        width: '18rem',
        background: 'rgba(255,245,255,0.97)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        zIndex: 50,
        padding: '2rem 1.5rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <FiShoppingCart style={{ fontSize: '1.5rem', color: 'rgba(0,0,0,0.15)' }} />
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.3)',
          }}>
            Your cart is empty
          </p>
          <Link
            to="/products"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.5)',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(0,0,0,0.2)',
              paddingBottom: '0.1rem',
            }}
          >
            Explore collection →
          </Link>
        </div>
      </div>
    )
  }

  const normalizedItems = cart.items.map(normalizeItem)
  const total = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div style={{
      position: 'absolute',
      right: 0,
      top: '3rem',
      width: '20rem',
      background: 'rgba(255,245,255,0.97)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
      zIndex: 50,
      overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.55rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
        }}>
          Your Cart
        </p>
        <span style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.55rem',
          letterSpacing: '0.2em',
          color: 'rgba(0,0,0,0.25)',
        }}>
          {normalizedItems.length} piece{normalizedItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Items */}
      <div style={{ maxHeight: '16rem', overflowY: 'auto' }}>
        {normalizedItems.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.25rem',
              borderBottom: i !== normalizedItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
            }}
          >
            {/* Image */}
            <div style={{ width: '3rem', height: '3.5rem', overflow: 'hidden', flexShrink: 0 }}>
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '0.95rem',
                fontWeight: 300,
                color: '#191A23',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {item.name}
              </p>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.5rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.3)',
                marginTop: '0.2rem',
              }}>
                {item.size} · ×{item.quantity}
              </p>
            </div>

            {/* Price */}
            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '0.95rem',
              fontWeight: 400,
              color: '#191A23',
              flexShrink: 0,
            }}>
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(0,0,0,0.05)',
      }}>
        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.3)',
          }}>
            Total
          </p>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.4rem',
            fontWeight: 300,
            color: '#191A23',
          }}>
            {formatPrice(total)}
          </p>
        </div>

        {/* CTA */}
        <Link
          to="/cart"
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
          View Cart →
        </Link>
      </div>

    </div>
  )
}

export default CartCard