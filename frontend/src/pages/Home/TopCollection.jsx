import React from 'react'
import topcollectionImg1 from "../../assets/images/IMGT0636.jpg"
import { Link } from 'react-router-dom'

const TopCollection = ({ isMobile }) => {
  return (
    <section
      id="top-collection-section"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        flexShrink: 0,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: '#FFF7FF',
      }}
    >
      {/* Image side */}
      <div style={{
        position: 'relative',
        width: isMobile ? '100%' : '50%',
        height: isMobile ? '50%' : '100%',
        flexShrink: 0,
      }}>
        <img
          src={topcollectionImg1}
          alt="Stones collection"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: isMobile ? 'top' : 'center',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: isMobile
            ? 'linear-gradient(to bottom, transparent 60%, #FFF7FF 100%)'
            : 'linear-gradient(to right, transparent 60%, #FFF7FF 100%)',
        }} />
      </div>

      {/* Text side */}
      <div style={{
        flex: 1,
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? 'flex-start' : 'center',
        padding: isMobile ? '1.5rem 1.5rem 0' : '0 4rem',
        height: isMobile ? '85%' : '100%',
      }}>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.65rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.45)',
          marginBottom: '1rem',
        }}>
          Best Selling collection
        </p>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: isMobile ? '2rem' : 'clamp(3rem, 6vw, 5.5rem)',
          fontWeight: 200,
          letterSpacing: '0.08em',
          color: '#191A23',
          lineHeight: 1.05,
          marginBottom: isMobile ? '0.5rem' : '3rem',
        }}>
          STONES
        </h1>

        <div style={{ width: '2.5rem', height: '1px', background: '#191A23', marginBottom: isMobile ? '1rem' : '2rem' }} />

        <p style={{
           fontFamily: '"Cormorant Garamond", serif',
           fontSize: isMobile ? '0.95rem' : '1.25rem',
           fontWeight: 300,
           lineHeight: 1.9,
           color: 'rgba(0,0,0,0.55)',
           maxWidth: isMobile ? '55ch' : '28ch',
           marginBottom: isMobile ? '1rem' : '3rem',
           fontStyle: 'italic',
         }}>
           Each piece tells a story of earth and elegance — raw minerals reimagined for the modern woman.
         </p>

        <Link
          to="/products?collection=Stones"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: isMobile ? '0.75rem' : '1rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.55)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(0,0,0,0.3)',
            paddingBottom: '0.4rem',
            width: 'fit-content',
            transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#191A23'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)'}
        >
          Explore the collection <span style={{ fontSize: '1.1rem' }}>→</span>
        </Link>

        {!isMobile && (
          <div style={{
            position: 'absolute',
            bottom: '2.5rem',
            right: '2.5rem',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            color: 'rgba(0,0,0,0.15)',
            textTransform: 'uppercase',
          }}>
            Vol. III
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap');
      `}</style>
    </section>
  )
}

export default TopCollection