import { useState, useContext } from "react"
import { CartContext } from "../../context/CartContext"
import { AuthContext } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import API from "../../api/axios"
import CheckoutHeader from "../../components/ui/CheckoutHeader"
import Breadcrumb from "../../components/ui/Breadcrumb"
import ShippingForm from "../../components/ui/ShippingForm"
import GuestCheckoutForm from "../../components/ui/GuestCheckoutForm"
import OrderSummary from "../../components/ui/OrderSummary"
import PaystackPayment from "./PaystackPayment"


const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [paymentError, setPaymentError] = useState(null)
  const [mpesaPhone, setMpesaPhone] = useState("")
  const [polling, setPolling] = useState(false)
  
  // User checkout state
  const [shipping, setShipping] = useState({
    fullName: user?.name || "", phone: "", address: "", city: "", county: "",
  })
  
  // Guest checkout state
  const [guestInfo, setGuestInfo] = useState({
    fullName: "", email: "", phone: "", address: "", city: "", county: "",
  })

  const normalizeItem = (item) => {
    // Logged-in user: cart items come from API with populated `product` object
    if (item.product && typeof item.product === "object") {
      return {
        id: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0],
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      }
    }
    // Guest user: cart items are flat objects from localStorage
    if (item.productId) {
      return {
        id: item.productId,
        name: item.name,
        image: item.image,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      }
    }
    return null
  }

  const items = (cart?.items || []).map(normalizeItem).filter(Boolean)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping_fee = subtotal >= 5000 ? 0 : 0
  const total = subtotal + shipping_fee

  const handleShippingSubmit = (e, goBack) => {
    if (goBack) { setStep(1); return }
    e.preventDefault()
    setStep(2)
  }

  const handleGuestCheckoutSubmit = (e, goBack) => {
    if (goBack) { setStep(1); return }
    e.preventDefault()
    setStep(2)
  }

  const handlePayOnDelivery = async (e) => {
    e.preventDefault()
    
    if (!shipping.address || !shipping.city) {
      alert('Please complete your shipping address first')
      return
    }

    setPaymentLoading(true)
    setPaymentStatus("pending")

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.county,
          country: 'Kenya',
        },
        paymentMethod: 'cash_on_delivery',
        itemsPrice: subtotal,
        shippingPrice: shipping_fee,
        totalPrice: total,
      }

      const res = await API.post('/api/orders', orderData)
      console.log('COD Order created:', res.data)
      setPaymentStatus('success')
      await clearCart()
      const orderId = res.data?.order?._id
      setTimeout(() => {
        navigate(`/orders?success=true${orderId ? `&orderId=${orderId}` : ''}`)
      }, 1500)
    } catch (err) {
      console.error('Order creation error:', err.response?.data || err.message)
      setPaymentError(err.response?.data?.message || err.message || 'Failed to create order')
      setPaymentStatus('failed')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleGuestPayOnDelivery = async (e) => {
    e.preventDefault()

    if (!guestInfo.address || !guestInfo.city) {
      alert('Please complete your shipping address first')
      return
    }

    setPaymentLoading(true)
    setPaymentStatus("pending")

    try {
      const guestOrderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          image: item.image,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        guestEmail: guestInfo.email,
        guestName: guestInfo.fullName,
        guestPhone: guestInfo.phone,
        shippingAddress: {
          address: guestInfo.address,
          city: guestInfo.city,
          postalCode: guestInfo.county,
          country: 'Kenya',
        },
        paymentMethod: 'cash_on_delivery',
        itemsPrice: subtotal,
        shippingPrice: shipping_fee,
        totalPrice: total,
      }

      console.log("📮 Sending Guest COD Order Data:", guestOrderData)
      const res = await API.post('/api/orders/guest', guestOrderData)
      console.log('Guest COD Order created:', res.data)
      setPaymentStatus('success')
      localStorage.removeItem('guest_cart')
      const orderId = res.data?.orderId
      setTimeout(() => {
        navigate(`/guest-order-confirmation?orderId=${orderId}&email=${encodeURIComponent(guestInfo.email)}`)
      }, 1500)
    } catch (err) {
      console.error('Order creation error:', err.response?.data || err.message)
      setPaymentError(err.response?.data?.message || err.message || 'Failed to create order')
      setPaymentStatus('failed')
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleMpesaPayment = async (e) => {
    e.preventDefault()
    if (!mpesaPhone) return
    setPaymentLoading(true)
    setPaymentStatus("pending")
    try {
      const res = await API.post("/api/payments/mpesa/stkpush", { phone: mpesaPhone, amount: total, orderId: `GG-${Date.now()}`, shipping })
      const checkoutRequestId = res.data.CheckoutRequestID
      setPolling(true)
      
      let attempts = 0
      const maxAttempts = 5 // 5 attempts * 12 seconds = 60 seconds max polling
      let rateLimited = false
      
      const pollInterval = setInterval(async () => {
        // Stop polling if rate limited
        if (rateLimited) {
          clearInterval(pollInterval)
          setPolling(false)
          setPaymentStatus("pending_rate_limited")
          return
        }
        
        attempts++
        try {
          const statusRes = await API.post("/api/payments/mpesa/query", { checkoutRequestId })
          const resultCode = statusRes.data.ResultCode
          const isRateLimited = statusRes.data.rateLimited
          
          if (isRateLimited) {
            rateLimited = true
            console.warn("Rate limited by M-Pesa API - backing off")
            return
          }
          
          if (resultCode === "0") {
            // Payment successful
            clearInterval(pollInterval)
            setPolling(false)
            setPaymentStatus("success")
          } else if (resultCode !== undefined && resultCode !== null) {
            // Payment failed (not 0 and not pending)
            clearInterval(pollInterval)
            setPolling(false)
            setPaymentStatus("failed")
          }
          // If resultCode is null/undefined, payment still pending — keep polling
        } catch (err) {
          // Handle HTTP 429 rate limit from backend
          if (err.response?.status === 429) {
            rateLimited = true
            console.warn("HTTP 429: Rate limited - backing off")
            return
          }
          console.error("Poll error:", err.response?.data || err.message)
        }
        
        // Stop after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          setPolling(false)
          setPaymentStatus("pending_timeout")
        }
      }, 12000) // 12-second interval (respects M-Pesa 5/min rate limit)
    } catch (err) {
      console.error(err)
      setPaymentStatus("failed")
    } finally {
      setPaymentLoading(false)
    }
  }

  if (!cart || items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF7FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 300, color: 'rgba(0,0,0,0.3)' }}>Nothing to checkout</h2>
        <Link to="/products" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#191A23', textDecoration: 'underline' }}>Browse collection</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7FF' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;500&display=swap'); .checkout-input:focus { border-bottom-color: rgba(0,0,0,0.5) !important; }`}</style>
      <Breadcrumb crumbs={[{ to: '/', label: 'Home' }, { to: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />


      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Success Message */}
            {paymentStatus === 'success' && (
              <div style={{
                background: '#E8F5E9',
                border: '1px solid #4CAF50',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: '#4CAF50',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <span style={{ color: '#fff', fontSize: '1.5rem' }}>✓</span>
                </div>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.75rem',
                  fontWeight: 300,
                  color: '#2E7D32',
                  marginBottom: '0.5rem',
                }}>
                  Payment Successful!
                </h3>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#2E7D32',
                  marginBottom: '1rem',
                }}>
                  Your order has been confirmed. Redirecting to orders page...
                </p>
              </div>
            )}

            {/* Failed Message */}
            {paymentStatus === 'failed' && (
              <div style={{
                background: '#FFEBEE',
                border: '1px solid #F44336',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
              }}>
                <h3 style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.75rem',
                  fontWeight: 300,
                  color: '#C62828',
                  marginBottom: '0.5rem',
                }}>
                  Payment Failed
                </h3>
                <p style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.85rem',
                  color: '#C62828',
                  marginBottom: '1rem',
                }}>
                  {paymentError || 'Something went wrong. Please try again or contact support.'}
                </p>
                <button
                  onClick={() => {
                    setPaymentStatus(null)
                    setPaymentError(null)
                  }}
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: '#fff',
                    background: '#F44336',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* User or Guest Form */}
            {user ? (
              <ShippingForm step={step} shipping={shipping} setShipping={setShipping} onSubmit={handleShippingSubmit} />
            ) : (
              <GuestCheckoutForm step={step} guestInfo={guestInfo} setGuestInfo={setGuestInfo} onSubmit={handleGuestCheckoutSubmit} />
            )}
            
            {!paymentStatus && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.5rem 0' }}>
                 <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>
                   Amount to pay
                 </p>
                 <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#191A23' }}>
                   KSh {total.toLocaleString()}
                 </p>
               </div>

               {/* Payment Options */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {/* Paystack Payment */}
                 <div>
                   <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '0.75rem' }}>
                     Pay Online with Card
                   </p>
                   <PaystackPayment
                     email={user?.email || guestInfo.email}
                     amount={total}
                     metadata={{ shipping: user ? shipping : guestInfo, items: items.map(i => ({ name: i.name, quantity: i.quantity })) }}
                     onSuccess={async (response) => {
                       setPaymentStatus('pending')
                       setPaymentError(null)
                       try {
                         console.log('Payment response:', response)

                         // Prepare order data
                         const orderData = {
                           reference: response.reference,
                           items: items.map(item => ({
                             productId: item.id,
                             name: item.name,
                             image: item.image,
                             size: item.size,
                             quantity: item.quantity,
                             price: item.price,
                           })),
                           shippingAddress: user ? {
                             address: shipping.address,
                             city: shipping.city,
                             postalCode: shipping.county,
                             country: 'Kenya',
                           } : {
                             address: guestInfo.address,
                             city: guestInfo.city,
                             postalCode: guestInfo.county,
                             country: 'Kenya',
                           },
                           itemsPrice: subtotal,
                           shippingPrice: shipping_fee,
                           totalPrice: total,
                         }

                         // Guest checkout flow
                         if (!user) {
                           const guestOrderData = {
                             items: items.map(item => ({
                               productId: item.id,
                               name: item.name,
                               image: item.image,
                               size: item.size,
                               quantity: item.quantity,
                               price: item.price,
                             })),
                             guestEmail: guestInfo.email,
                             guestName: guestInfo.fullName,
                             guestPhone: guestInfo.phone,
                             shippingAddress: {
                               address: guestInfo.address,
                               city: guestInfo.city,
                               postalCode: guestInfo.county,
                               country: 'Kenya',
                             },
                             paymentReference: response.reference,
                             itemsPrice: subtotal,
                             shippingPrice: shipping_fee,
                             totalPrice: total,
                           }

                           const res = await API.post('/api/orders/guest', guestOrderData)
                           console.log('Guest order created:', res.data)
                           setPaymentStatus('success')
                           // Clear guest cart from localStorage
                           localStorage.removeItem('guest_cart')
                           const orderId = res.data?.orderId
                           setTimeout(() => {
                             navigate(`/guest-order-confirmation?orderId=${orderId}&email=${encodeURIComponent(guestInfo.email)}`)
                           }, 1500)
                           return
                         }

                         // User checkout flow
                         const res = await API.post('/api/payments/paystack/create-order', orderData)
                         console.log('Order created:', res.data)
                         setPaymentStatus('success')
                         // Clear cart and redirect to orders page
                         await clearCart()
                         const orderId = res.data?.order?._id
                         setTimeout(() => {
                           navigate(`/orders?success=true${orderId ? `&orderId=${orderId}` : ''}`)
                         }, 1500)
                       } catch (err) {
                         console.error('Order creation error:', err.response?.data || err.message)
                         setPaymentError(err.response?.data?.message || err.message || 'Failed to create order')
                         setPaymentStatus('failed')
                       }
                     }}
                     onClose={() => console.log('Payment closed')}
                   />
                 </div>

                 {/* Divider */}
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                   <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)' }}>OR</p>
                   <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
                 </div>

                 {/* Pay on Delivery Button */}
                 <button
                   onClick={user ? handlePayOnDelivery : handleGuestPayOnDelivery}
                   disabled={paymentLoading}
                   style={{
                     fontFamily: 'Montserrat, sans-serif',
                     fontSize: '0.65rem',
                     letterSpacing: '0.3em',
                     textTransform: 'uppercase',
                     color: '#fff',
                     background: '#191A23',
                     border: '1px solid #191A23',
                     padding: '0.85rem 1.5rem',
                     cursor: paymentLoading ? 'not-allowed' : 'pointer',
                     transition: 'all 0.25s ease',
                     opacity: paymentLoading ? 0.6 : 1,
                     width: '100%',
                   }}
                   onMouseEnter={(e) => {
                     if (!paymentLoading) {
                       e.target.style.background = '#000'
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (!paymentLoading) {
                       e.target.style.background = '#191A23'
                     }
                   }}
                 >
                   {paymentLoading ? 'Processing...' : 'Pay on Delivery'}
                 </button>
                 <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', textAlign: 'center' }}>
                   Pay when you receive your order
                 </p>
               </div>
             </div>
           )}
          </div>
          <div className="lg:col-span-1">
            <OrderSummary items={items} subtotal={subtotal} shipping_fee={shipping_fee} total={total} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage