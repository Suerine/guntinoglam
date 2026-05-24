import { FiUser, FiPhone, FiMapPin, FiMail, FiCheck } from "react-icons/fi"

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

const GuestCheckoutForm = ({ step, guestInfo, setGuestInfo, onSubmit }) => (
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
          Guest Information & Delivery
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
        {/* Guest Information */}
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginTop: '1.25rem', marginBottom: '0.75rem' }}>
          Your Information
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <FiUser style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
            <input type="text" placeholder="Full name" value={guestInfo.fullName} onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })} required className="checkout-input" style={inputStyle} />
          </div>
          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
            <input type="email" placeholder="Email address" value={guestInfo.email} onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })} required className="checkout-input" style={inputStyle} />
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <FiPhone style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
          <input type="tel" placeholder="Phone number" value={guestInfo.phone} onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })} required className="checkout-input" style={inputStyle} />
        </div>

        {/* Delivery Address */}
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginTop: '1.25rem', marginBottom: '0.75rem' }}>
          Delivery Address
        </p>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <FiMapPin style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }} />
          <input type="text" placeholder="Street address" value={guestInfo.address} onChange={(e) => setGuestInfo({ ...guestInfo, address: e.target.value })} required className="checkout-input" style={inputStyle} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
          <input type="text" placeholder="City" value={guestInfo.city} onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })} required className="checkout-input" style={{ ...inputStyle, paddingLeft: '0.5rem' }} />
          <input type="text" placeholder="County" value={guestInfo.county} onChange={(e) => setGuestInfo({ ...guestInfo, county: e.target.value })} required className="checkout-input" style={{ ...inputStyle, paddingLeft: '0.5rem' }} />
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
        <div style={{ marginBottom: '0.75rem' }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23' }}>
            {guestInfo.fullName}
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginTop: '0.2rem' }}>
            {guestInfo.email} · {guestInfo.phone}
          </p>
        </div>

        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.3rem' }}>
            Delivery To
          </p>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', fontWeight: 300, color: '#191A23' }}>
            {guestInfo.address}
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginTop: '0.2rem' }}>
            {guestInfo.city}, {guestInfo.county}
          </p>
        </div>
      </div>
    )}
  </div>
)

export default GuestCheckoutForm
