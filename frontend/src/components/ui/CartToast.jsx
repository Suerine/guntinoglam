import React from "react"

const CartToast = ({ product, selectedSize, selectedColor }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontFamily: 'Montserrat, sans-serif',
      minWidth: '280px',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={product.images?.[0]}
          alt={product.name}
          style={{
            width: '4rem',
            height: '5rem',
            objectFit: 'cover',
          }}
        />
        {/* Green dot */}
        <div style={{
          position: 'absolute',
          top: '-0.3rem',
          right: '-0.3rem',
          width: '0.75rem',
          height: '0.75rem',
          borderRadius: '50%',
          background: '#4ade80',
          border: '2px solid #FFF7FF',
        }} />
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
        <span style={{
          fontSize: '0.5rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
        }}>
          Added to cart ✓
        </span>

        <span style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1.1rem',
          fontWeight: 300,
          color: '#191A23',
          lineHeight: 1.2,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.name}
        </span>

        {/* Details row */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {selectedSize && (
            <span style={{
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
              background: 'rgba(0,0,0,0.06)',
              padding: '0.15rem 0.5rem',
            }}>
              {selectedSize}
            </span>
          )}
          {selectedColor && (
            <span style={{
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
            }}>
              {selectedColor}
            </span>
          )}
        </div>

        <span style={{
          fontSize: '0.65rem',
          letterSpacing: '0.05em',
          color: '#191A23',
          fontWeight: 500,
        }}>
          KSh {product.price?.toLocaleString()}
          {product.isRentable && product.rentalPrice && (
            <span style={{ color: 'rgba(0,0,0,0.35)', fontWeight: 300, marginLeft: '0.4rem', fontStyle: 'italic' }}>
              · Rent KSh {product.rentalPrice?.toLocaleString()}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}

export default CartToast