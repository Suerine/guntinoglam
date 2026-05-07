import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { CartContext } from "../../context/CartContext"
import { Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi"
import Breadcrumb from "../../components/ui/Breadcrumb"

const CartPage = () => {
  const { user } = useContext(AuthContext)
  const { cart, removeItem, updateQuantity } = useContext(CartContext)

  const normalizeItem = (item) => {
    if (user) {
      const isPopulated = item.product && typeof item.product === "object"
      return {
        id: item._id,
        productId: isPopulated ? item.product._id : item.product,
        name: isPopulated ? item.product.name : "",
        image: isPopulated ? item.product.images?.[0] : "",
        size: item.size,
        color: item.color || null,
        price: item.price,
        quantity: item.quantity,
      }
    }
    return {
      id: `${item.productId}-${item.size}-${item.color}`,
      productId: item.productId,
      name: item.name,
      image: item.image,
      size: item.size,
      color: item.color || null,
      price: item.price,
      quantity: item.quantity,
    }
  }

  // Empty state
  if (!cart || cart.items?.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF5FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400&display=swap');`}</style>
        <FiShoppingCart style={{ fontSize: '2rem', color: 'rgba(0,0,0,0.15)' }} />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 300, color: 'rgba(0,0,0,0.3)' }}>
            Your cart is empty
          </h2>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.3)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
            Nothing here yet
          </p>
        </div>
        <Link
          to="/products"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#fff',
            background: '#191A23',
            textDecoration: 'none',
            padding: '0.75rem 2rem',
          }}
        >
          Explore Collection
        </Link>
      </div>
    )
  }

  const normalizedItems = cart.items.map(normalizeItem)
  const totalPrice = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5FF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400&display=swap');`}</style>

      {/* Header */}
      {/* Hero header */}
      <div style={{
        background: '#FFF5FF',
        padding: '8.5rem 2.5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)' }} ></div>
        <div style={{ position: 'absolute', bottom: '-6rem', left: '10rem', width: '25rem', height: '25rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)' }} ></div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#191A23',
            marginBottom: '1rem',
          }}>
            Purchase Items
          </p>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(3.5rem, 8vw, 5rem)',
            fontWeight: 300,
            color: '#191A23',
            lineHeight: 1,
            letterSpacing: '0.05em',
            marginBottom: '1.5rem',
          }}>
            Cart
          </h1>

          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,0,0,0.4)',
            textTransform: 'uppercase',
          }}>
            {cart.items.length} item{cart.items.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <Breadcrumb crumbs={[{ to: '/', label: 'Home' }, { label: 'Cart' }]} />

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
        className="lg:grid-cols-3-custom"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Items */}
          <div className="lg:col-span-2 space-y-px">
            {normalizedItems.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  padding: '1.5rem 0',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  alignItems: 'flex-start',
                }}
              >
                {/* Image */}
                <div style={{ width: '5rem', height: '6.5rem', flexShrink: 0, overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '0.3rem' }}>
                    Size: {item.size}{item.color && ` · Color: ${item.color}`}
                  </p>
                  <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 300, color: '#191A23', lineHeight: 1.2, marginBottom: '0.5rem' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', fontWeight: 300, color: '#191A23' }}>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>

                  {/* Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        width: '1.75rem', height: '1.75rem',
                        border: '1px solid rgba(0,0,0,0.15)',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.8rem',
                        color: '#191A23',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: item.quantity <= 1 ? 0.3 : 1,
                      }}
                    >−</button>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#191A23', minWidth: '1rem', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      style={{
                        width: '1.75rem', height: '1.75rem',
                        border: '1px solid rgba(0,0,0,0.15)',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.8rem',
                        color: '#191A23',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >+</button>
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>
                      × KSh {item.price?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.productId, item.size, item.color)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.2)', padding: '0.25rem', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(200,0,0,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.2)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '2rem',
              position: 'sticky',
              top: '6rem',
            }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '1.5rem' }}>
                Order Summary
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {normalizedItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: 'rgba(0,0,0,0.5)', maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name} <span style={{ color: 'rgba(0,0,0,0.3)', fontSize: '0.8rem' }}>×{item.quantity}</span>
                    </p>
                    <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23' }}>
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', marginBottom: '1.5rem' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>
                  Total
                </p>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#191A23' }}>
                  KSh {totalPrice.toLocaleString()}
                </p>
              </div>

              {!user && (
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)', textAlign: 'center', marginBottom: '1rem' }}>
                  <Link to="/login" style={{ color: '#191A23', textDecoration: 'underline' }}>Log in</Link> to save your cart and checkout
                </p>
              )}

              {user ? (
                <Link
                  to="/checkout"
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
                    padding: '1rem',
                    transition: 'background 0.25s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#000'}
                  onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
                >
                  Proceed to Checkout →
                </Link>
              ) : (
                <button disabled style={{
                  display: 'block',
                  width: '100%',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: '#191A23',
                  border: 'none',
                  padding: '1rem',
                  opacity: 0.4,
                  cursor: 'not-allowed',
                }}>
                  Proceed to Checkout
                </button>
              )}

              <Link
                to="/products"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.3)',
                  textDecoration: 'none',
                  marginTop: '1rem',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#191A23'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.3)'}
              >
                Continue Shopping →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CartPage