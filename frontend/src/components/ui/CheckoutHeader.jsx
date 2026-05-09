import { FiCheck } from "react-icons/fi"

const CheckoutHeader = ({ step }) => (
  <div style={{ background: '#FFF7FF', padding: '8.2rem 2.5rem 3rem', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)' }} />
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', marginBottom: '0.75rem' }}>
          Almost there
        </p>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, color: '#191A23', lineHeight: 1 }}>
          Checkout
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {[1, 2].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2rem', height: '2rem', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem',
              background: step >= s ? '#FFECF7' : 'rgba(0,0,0,0.2)',
              color: step >= s ? '#191A23' : 'rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
            }}>
              {step > s ? <FiCheck size={10} /> : s}
            </div>
            {s < 2 && <div style={{ width: '2rem', height: '1px', background: step > s ? '#FFECF7' : 'rgba(0,0,0,0.9)' }} />}
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default CheckoutHeader