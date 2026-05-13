import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import API from '../../api/axios'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Layout from '../../components/layout/Layout'

const Orders = () => {
  const { user } = useContext(AuthContext)
  const { fetchCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successOrder, setSuccessOrder] = useState(null)

  useEffect(() => {
    console.log('Orders page mounted, user:', user)
    // Check if coming from successful payment
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    
    if (success === 'true' && orderId) {
      setShowSuccessModal(true)
      setSuccessOrder({ _id: orderId })
      // Clear URL params
      window.history.replaceState({}, document.title, '/orders')
    }

    fetchOrders()
  }, [searchParams])

  const fetchOrders = async () => {
    if (!user) {
      console.log('No user, skipping fetch')
      setLoading(false)
      return
    }

    try {
      console.log('Fetching orders...')
      const res = await API.get('/api/orders/my-orders')
      console.log('Orders fetched:', res.data)
      setOrders(res.data?.orders || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = async () => {
    setShowSuccessModal(false)
    // Clear cart after successful order
    if (fetchCart) await fetchCart()
  }

  console.log('Orders render - user:', user, 'loading:', loading, 'orders count:', orders.length)

  if (!user) {
    return (
        <div style={{ minHeight: '100vh', background: '#FFF7FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', paddingTop: '100px' }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 300, color: 'rgba(0,0,0,0.3)' }}>Please log in to view orders</h2>
          <button 
            onClick={() => navigate('/login')}
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff', background: '#191A23', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer' }}
          >
            Go to Login
          </button>
        </div>
    )
  }

  return (
      <div style={{ minHeight: '100vh', background: '#FFF7FF' }} className=" md:pt-2">
        <Breadcrumb crumbs={[{ to: '/', label: 'Home' }, { label: 'Orders' }]} />

        {/* Success Modal */}
        {showSuccessModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              background: '#fff',
              padding: '3rem 2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}>
                <span style={{ color: '#fff', fontSize: '2rem' }}>✓</span>
              </div>

              <h2 style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '2rem',
                fontWeight: 300,
                color: '#191A23',
                marginBottom: '0.5rem',
              }}>
                Order Confirmed!
              </h2>

              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.6)',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}>
                Thank you for your purchase. Your order has been successfully created and you will receive a confirmation email shortly with tracking information.
              </p>

              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                color: 'rgba(0,0,0,0.4)',
                marginBottom: '2rem',
              }}>
                Order ID: {successOrder?._id}
              </p>

              <button
                onClick={handleCloseModal}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: '#191A23',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  cursor: 'pointer',
                  transition: 'background 0.25s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#2a2b35'}
                onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Orders Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '3rem',
            fontWeight: 300,
            color: '#191A23',
            marginBottom: '2rem',
          }}>
            Your Orders
          </h1>

          {loading ? (
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: 'rgba(0,0,0,0.5)' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: 'rgba(0,0,0,0.4)',
                marginBottom: '1.5rem',
              }}>
                No orders yet
              </p>
              <button
                onClick={() => navigate('/products')}
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.65rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: '#191A23',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  cursor: 'pointer',
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
  )
}

const OrderCard = ({ order }) => {
  try {
    const getStatusColor = (status) => {
      const colors = {
        pending: '#FF9800',
        processing: '#2196F3',
        shipped: '#4CAF50',
        delivered: '#4CAF50',
        cancelled: '#F44336',
      }
      return colors[status] || '#999'
    }

    if (!order) {
      console.error('OrderCard received null order')
      return <div>Invalid order data</div>
    }

    const items = order.orderItems || []
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    console.log('Rendering OrderCard for order:', order._id, 'items:', items)

    return (
      <div style={{
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: '8px',
        padding: '1.5rem',
        background: '#fff',
        transition: 'box-shadow 0.25s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              color: 'rgba(0,0,0,0.5)',
              marginBottom: '0.25rem',
            }}>
              ORDER ID
            </p>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.85rem',
              color: '#191A23',
              fontWeight: 500,
            }}>
              {order._id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div style={{
            background: getStatusColor(order.status),
            color: '#fff',
            padding: '0.35rem 0.75rem',
            borderRadius: '4px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>
            {order.status}
          </div>
        </div>

        <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'rgba(0,0,0,0.5)',
            marginBottom: '0.5rem',
          }}>
            ITEMS ({totalItems})
          </p>
          {items.slice(0, 2).map((item, idx) => (
            <p key={idx} style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.8rem',
              color: '#191A23',
              marginBottom: '0.35rem',
            }}>
              {item.name} x {item.quantity}
            </p>
          ))}
          {items.length > 2 && (
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.75rem',
              color: 'rgba(0,0,0,0.5)',
              marginTop: '0.35rem',
            }}>
              +{items.length - 2} more items
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'rgba(0,0,0,0.5)',
            marginBottom: '0.35rem',
          }}>
            TOTAL
          </p>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#191A23',
          }}>
            KSh {order.totalPrice?.toLocaleString() || '0'}
          </p>
        </div>

        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.65rem',
          color: 'rgba(0,0,0,0.4)',
          marginTop: '0.75rem',
        }}>
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>
    )
  } catch (err) {
    console.error('OrderCard error:', err)
    return <div style={{ padding: '1rem', color: 'red' }}>Error rendering order: {err.message}</div>
  }
}

export default Orders