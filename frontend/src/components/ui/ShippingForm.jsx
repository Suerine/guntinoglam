import { FiUser, FiPhone, FiMapPin, FiCheck } from "react-icons/fi"

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
  transition: 'border-color 0.2s ease',
}

const ShippingForm = ({ step, shipping, setShipping, onSubmit }) => (
  <div style={{
    background: '#fff',
    border: step === 1 ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.06)',
    overflow: 'hidden',
    transition: 'border-color 0.3s ease',
  }}>
    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '1.75rem', height: '1.75rem', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem',
          background: step > 1 ? '#FFECF7' : step === 1 ? '#191A23' : 'rgba(0,0,0,0.06)',
          color: step > 1 ? '#191A23' : step === 1 ? '#fff' : 'rgba(0,0,0,0.3)',
        }}>
          {step > 1 ? <FiCheck size={10} /> : 1}
        </div>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#191A23' }}>
          Shipping Details
        </p>
      </div>
      {step > 1 && (
        <span
          onClick={() => onSubmit(null, true)}
          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Edit
        </span>
      )}
    </div>

    {step === 1 && (
      <form onSubmit={onSubmit} style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <FiUser style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
            <input type="text" placeholder="Full name" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} required className="checkout-input" style={inputStyle} />
          </div>
          <div style={{ position: 'relative' }}>
            <FiPhone style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
            <input type="tel" placeholder="Phone number" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} required className="checkout-input" style={inputStyle} />
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <FiMapPin style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
          <input type="text" placeholder="Street address" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required className="checkout-input" style={inputStyle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
          <input type="text" placeholder="City" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required className="checkout-input" style={{ ...inputStyle, paddingLeft: '0.5rem' }} />
          <input type="text" placeholder="County" value={shipping.county} onChange={(e) => setShipping({ ...shipping, county: e.target.value })} required className="checkout-input" style={{ ...inputStyle, paddingLeft: '0.5rem' }} />
        </div>

        <button type="submit" style={{
          width: '100%', fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem',
          letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fff',
          background: '#191A23', border: 'none', padding: '1rem', cursor: 'pointer',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#000'}
          onMouseLeave={e => e.currentTarget.style.background = '#191A23'}
        >
          Continue to Payment →
        </button>
      </form>
    )}

    {step > 1 && (
      <div style={{ padding: '0.75rem 1.5rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontWeight: 300, color: '#191A23' }}>
          {shipping.fullName} · {shipping.phone}
        </p>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginTop: '0.2rem' }}>
          {shipping.address}, {shipping.city}, {shipping.county}
        </p>
      </div>
    )}
  </div>
)

export default ShippingForm