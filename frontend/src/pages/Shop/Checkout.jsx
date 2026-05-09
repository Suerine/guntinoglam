import { useState, useContext } from "react"
import { CartContext } from "../../context/CartContext"
import { AuthContext } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import API from "../../api/axios"
import CheckoutHeader from "../../components/ui/CheckoutHeader"
import Breadcrumb from "../../components/ui/Breadcrumb"
import ShippingForm from "../../components/ui/ShippingForm"
import PaymentForm from "../../components/ui/PaymentForm"
import OrderSummary from "../../components/ui/OrderSummary"

const CheckoutPage = () => {
  const { cart } = useContext(CartContext)
  const { user } = useContext(AuthContext)

  const [step, setStep] = useState(1)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [mpesaPhone, setMpesaPhone] = useState("")
  const [polling, setPolling] = useState(false)
  const [shipping, setShipping] = useState({
    fullName: user?.name || "", phone: "", address: "", city: "", county: "",
  })

  const normalizeItem = (item) => {
    const isPopulated = item.product && typeof item.product === "object"
    if (!isPopulated) return null
    return { id: item._id, name: item.product.name, image: item.product.images?.[0], size: item.size, price: item.price, quantity: item.quantity }
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

      <CheckoutHeader step={step} />
      <Breadcrumb crumbs={[{ to: '/', label: 'Home' }, { to: '/cart', label: 'Cart' }, { label: 'Checkout' }]} />


      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ShippingForm step={step} shipping={shipping} setShipping={setShipping} onSubmit={handleShippingSubmit} />
            <PaymentForm step={step} total={total} mpesaPhone={mpesaPhone} setMpesaPhone={setMpesaPhone} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} paymentLoading={paymentLoading} polling={polling} onSubmit={handleMpesaPayment} />
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