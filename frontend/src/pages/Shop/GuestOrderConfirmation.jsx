import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import API from "../../api/axios"
import Breadcrumb from "../../components/ui/Breadcrumb"
import { FiCheck, FiMail, FiDownload } from "react-icons/fi"

const GuestOrderConfirmation = () => {
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const orderId = searchParams.get("orderId")
  const email = searchParams.get("email")

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await API.get(`/api/orders/guest/${orderId}`)
        setOrder(res.data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch order:", err)
        setError(err.response?.data?.message || "Failed to load order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF7FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: 'rgba(0,0,0,0.4)' }}>
          Loading your order...
        </p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF7FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#C62828' }}>
          Order Not Found
        </h2>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', color: 'rgba(0,0,0,0.4)', textAlign: 'center' }}>
          {error || "We couldn't find your order. Please check your email or contact support."}
        </p>
        <Link to="/" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#191A23', textDecoration: 'underline' }}>
          Return Home
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7FF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;500&display=swap');`}</style>
      <Breadcrumb crumbs={[{ to: '/', label: 'Home' }, { label: 'Order Confirmation' }]} />

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <FiCheck size={40} color="#fff" />
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '3rem',
            fontWeight: 300,
            color: '#191A23',
            marginBottom: '0.5rem',
          }}>
            Order Confirmed!
          </h1>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(0,0,0,0.5)',
          }}>
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div style={{
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          {/* Order Number */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.3rem' }}>
              Order Number
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 300, color: '#191A23' }}>
              {order.orderId}
            </p>
          </div>

          {/* Guest Information */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.75rem' }}>
              Order Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginBottom: '0.2rem' }}>
                  Name
                </p>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontWeight: 300, color: '#191A23' }}>
                  {order.guestName}
                </p>
              </div>
              <div>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginBottom: '0.2rem' }}>
                  Phone
                </p>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontWeight: 300, color: '#191A23' }}>
                  {order.guestPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.75rem' }}>
              Delivery Address
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23' }}>
              {order.shippingAddress?.address}
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginTop: '0.2rem' }}>
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode} · {order.shippingAddress?.country}
            </p>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.75rem' }}>
              Items ({order.orderItems?.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.orderItems?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23' }}>
                      {item.name}
                    </p>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)' }}>
                      {item.size} · ×{item.quantity}
                    </p>
                  </div>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23' }}>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>
              Total Amount
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.75rem', fontWeight: 300, color: '#191A23' }}>
              KSh {order.totalPrice?.toLocaleString()}
            </p>
          </div>

          {/* Status */}
          <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: '0.25rem' }}>
              Status
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9rem', fontWeight: 500, color: '#4CAF50', textTransform: 'capitalize' }}>
              {order.status}
            </p>
          </div>
        </div>

        {/* Confirmation Email */}
        <div style={{
          background: '#FFF7FF',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
        }}>
          <FiMail style={{ flexShrink: 0, marginTop: '0.2rem', color: 'rgba(0,0,0,0.4)', fontSize: '1.2rem' }} />
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.25rem' }}>
              Confirmation Email Sent
            </p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23', marginBottom: '0.25rem' }}>
              {order.guestEmail}
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)' }}>
              Please check your email for your order confirmation and tracking details.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 300, color: '#191A23', marginBottom: '1rem' }}>
            What's Next?
          </h3>
          <ul style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(0,0,0,0.6)',
            textAlign: 'left',
            display: 'inline-block',
            listStyle: 'none',
            padding: 0,
          }}>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              We'll prepare your order for shipment
            </li>
            <li style={{ marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              You'll receive tracking updates via email
            </li>
            <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0 }}>✓</span>
              Delivery within 2-5 business days
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link
            to="/products"
            style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#fff',
              background: '#191A23',
              textDecoration: 'none',
              padding: '1rem',
              borderRadius: '4px',
              transition: 'background 0.25s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#000'}
            onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
          >
            Continue Shopping →
          </Link>

          <button
            onClick={() => {
              const content = `
Order Confirmation - Guntino Glam
Order #: ${order.orderId}

Dear ${order.guestName},

Thank you for your order!

Items:
${order.orderItems?.map(item => `- ${item.name} (${item.size}) x${item.quantity} - KSh ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

Total: KSh ${order.totalPrice?.toLocaleString()}

Delivery Address:
${order.shippingAddress?.address}
${order.shippingAddress?.city}, ${order.shippingAddress?.postalCode}

Status: ${order.status}

Thank you for shopping with us!
              `
              const element = document.createElement('a')
              element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
              element.setAttribute('download', `order-${order.orderId}.txt`)
              element.style.display = 'none'
              document.body.appendChild(element)
              element.click()
              document.body.removeChild(element)
            }}
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#191A23',
              background: 'transparent',
              border: '1px solid rgba(0,0,0,0.2)',
              padding: '1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.05)'
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'
            }}
          >
            <FiDownload size={14} />
            Download Receipt
          </button>

          <Link
            to="/"
            style={{
              display: 'block',
              textAlign: 'center',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
              textDecoration: 'underline',
              padding: '0.5rem',
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GuestOrderConfirmation
