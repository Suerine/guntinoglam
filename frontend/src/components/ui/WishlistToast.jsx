import React from 'react'
import { FiHeart } from 'react-icons/fi'


const WishlistToast = ({ product, removed }) => {
  return (
    <div style={{
      background: '#FFF7FF',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      minWidth: '240px',
    }}>
      <FiHeart style={{
        color: removed ? 'rgba(0,0,0,0.3)' : 'rgba(255,100,100,0.7)',
        fontSize: '1rem',
        fill: removed ? 'none' : 'rgba(255,100,100,0.7)',
        flexShrink: 0,
      }} />

      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.5rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)',
        }}>
          {removed ? 'Removed from wishlist' : 'Added to wishlist ♡'}
        </p>
        <p style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: '1rem',
          fontWeight: 300,
          color: '#191A23',
          marginTop: '0.2rem',
        }}>
          {product.name}
        </p>
        {!removed && (
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.55rem',
            color: 'rgba(0,0,0,0.4)',
            marginTop: '0.2rem',
            letterSpacing: '0.05em',
          }}>
            KSh {product.price?.toLocaleString()}
          </p>
        )}
      </div>

      {!removed && (
        <img
          src={product.images?.[0]}
          alt={product.name}
          style={{ width: '3rem', height: '3.5rem', objectFit: 'cover', flexShrink: 0 }}
        />
      )}
    </div>
  )
}

export default WishlistToast