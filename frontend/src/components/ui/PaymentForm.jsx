import { FiPhone, FiCheck, FiLoader } from "react-icons/fi"

const inputStyle = {
  width: '100%',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.7rem',
  letterSpacing: '0.05em',
  border: 'none',
  borderBottom: '1px solid rgba(0,0,0,0.12)',
  background: 'transparent',
  outline: 'none',
  color: '#191A23',
  padding: '0.65rem 0.5rem 0.65rem 2rem',
}

const PaymentForm = ({ step, total, mpesaPhone, setMpesaPhone, paymentStatus, setPaymentStatus, paymentLoading, polling, onSubmit }) => (
  <div style={{
    background: '#fff',
    border: step === 2 ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.06)',
    overflow: 'hidden',
    transition: 'border-color 0.3s ease',
  }}>
    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{
        width: '1.75rem', height: '1.75rem', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem',
        background: paymentStatus === 'success' ? '#FFECF7' : step === 2 ? '#191A23' : 'rgba(0,0,0,0.06)',
        color: paymentStatus === 'success' ? '#191A23' : step === 2 ? '#fff' : 'rgba(0,0,0,0.3)',
      }}>
        {paymentStatus === 'success' ? <FiCheck size={10} /> : 2}
      </div>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#191A23' }}>
        Payment
      </p>
    </div>

    {step === 2 && (
      <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>

        {/* Mpesa branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', marginTop: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'Montserrat' }}>M</span>
          </div>
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.1em', color: '#166534', textTransform: 'uppercase' }}>Pay via M-Pesa</p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(22,101,52,0.7)', marginTop: '0.1rem' }}>
              You'll receive an STK push on your phone
            </p>
          </div>
        </div>

        {/* Pending */}
        {(paymentStatus === "pending" || paymentStatus === "pending_rate_limited") && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0', textAlign: 'center' }}>
            <FiLoader style={{ fontSize: '2rem', color: '#4ade80', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 300, color: '#191A23' }}>Check your phone</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)', maxWidth: '24ch' }}>
              Enter your M-Pesa PIN to complete payment of <strong>KSh {total.toLocaleString()}</strong>
            </p>
            {polling && <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase' }}>Waiting for confirmation...</p>}
            {paymentStatus === "pending_rate_limited" && (
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase', marginTop: '1rem', fontStyle: 'italic' }}>
                ⏳ Connection throttled. Still checking payment status...
              </p>
            )}
          </div>
        )}

        {/* Pending timeout */}
        {paymentStatus === "pending_timeout" && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 300, color: '#191A23' }}>Payment pending</p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)', maxWidth: '28ch' }}>
              Your payment was sent but we couldn't confirm it yet. It should complete within a few minutes.
            </p>
            <button onClick={() => setPaymentStatus(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', textDecoration: 'underline', marginTop: '0.5rem' }}>
              Try again
            </button>
          </div>
        )}

        {/* Success */}
        {paymentStatus === "success" && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0', textAlign: 'center' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: '#FFECF7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiCheck style={{ color: '#191A23', fontSize: '1.2rem' }} />
            </div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#191A23' }}>Payment Successful</h2>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.4)', textTransform: 'uppercase' }}>Your order has been placed</p>
          </div>
        )}

        {/* Failed */}
        {paymentStatus === "failed" && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 0', textAlign: 'center' }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 300, color: 'rgba(180,0,0,0.6)' }}>Payment failed</p>
            <button onClick={() => setPaymentStatus(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', textDecoration: 'underline' }}>
              Try again
            </button>
          </div>
        )}

        {/* Phone input */}
        {!paymentStatus && (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
              <input type="tel" placeholder="M-Pesa number (e.g. 0712345678)" value={mpesaPhone} onChange={(e) => setMpesaPhone(e.target.value)} required className="checkout-input" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0.5rem 0' }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>Amount to pay</p>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#191A23' }}>KSh {total.toLocaleString()}</p>
            </div>
            <button type="submit" disabled={paymentLoading} style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
              color: '#fff', background: '#4ade80', border: 'none', padding: '1rem',
              cursor: paymentLoading ? 'not-allowed' : 'pointer', opacity: paymentLoading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
              {paymentLoading ? <><FiLoader style={{ animation: 'spin 1s linear infinite' }} size={12} /> Sending prompt...</> : <>Pay KSh {total.toLocaleString()} via M-Pesa</>}
            </button>
          </form>
        )}
      </div>
    )}
  </div>
)

export default PaymentForm