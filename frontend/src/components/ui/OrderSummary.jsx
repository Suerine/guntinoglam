const OrderSummary = ({ items, subtotal, shipping_fee, total }) => (
  <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem', position: 'sticky', top: '6rem' }}>
    <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '1.5rem' }}>
      Order Summary
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '16rem', overflowY: 'auto' }}>
      {items.map((item) => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '3rem', height: '3.5rem', overflow: 'hidden', flexShrink: 0 }}>
            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginTop: '0.15rem' }}>
              {item.size} · ×{item.quantity}
            </p>
          </div>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23', flexShrink: 0 }}>
            KSh {(item.price * item.quantity).toLocaleString()}
          </p>
        </div>
      ))}
    </div>

    <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', marginBottom: '1rem' }} />

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)' }}>Subtotal</p>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: '#191A23' }}>KSh {subtotal.toLocaleString()}</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'rgba(0,0,0,0.4)' }}>Shipping</p>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 300, color: shipping_fee === 0 ? '#4ade80' : '#191A23' }}>
          {shipping_fee === 0 ? 'Free' : `KSh ${shipping_fee.toLocaleString()}`}
        </p>
      </div>
      {shipping_fee > 0 && (
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', fontStyle: 'italic' }}>
          Free delivery on orders over KSh 5,000
        </p>
      )}
    </div>

    <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', marginBottom: '1rem' }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)' }}>Total</p>
      <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', fontWeight: 300, color: '#191A23' }}>
        KSh {total.toLocaleString()}
      </p>
    </div>
  </div>
)

export default OrderSummary