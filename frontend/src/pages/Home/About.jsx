import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const About = ({ isMobile }) => {
  return (
   <>
   <Helmet>
        <title>About Us | Guntino Glam</title>
        <meta name="description" content="Guntino Glam is a Nairobi-based fashion brand celebrating Somali dress. We sell and rent Dirac for weddings — Guntino, Maqbal, Faransawi and more." />
        <meta property="og:title" content="About Us | Guntino Glam" />
        <meta property="og:description" content="Rooted in heritage, dressed for today. Curated Dirac collections for the modern Somali woman." />
        <meta property="og:url" content="https://guntinoglam.vercel.app/about" />
        <meta name="keywords" content="Luxury,Dirac, Somali fashion, Guntino, Maqbal, Faransawi, Nairobi, wedding dress, Somali wedding" />
      </Helmet>
    <section
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        flexShrink: 0,
        background: '#FFF7FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400&display=swap');
        .about-stat { border-left: 1px solid rgba(0,0,0,0.08); padding-left: 1.5rem; }
        .about-link:hover { background: #000 !important; }
      `}</style>

      {/* Ghost watermark */}
      <h1 style={{
        position: 'absolute',
        bottom: '-2rem',
        left: '-1rem',
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: 'clamp(4rem, 15vw, 10rem)',
        fontWeight: 300,
        color: 'rgba(0,0,0,0.03)',
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        textTransform: 'uppercase',
      }}>
        Guntino Glam
      </h1>

      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-8rem', right: '-8rem', width: '32rem', height: '32rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.04)', pointerEvents: 'none' }} />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        padding: isMobile ? '3rem 1.5rem 0rem' : '0 2.5rem',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1px 1fr',
        gap: isMobile ? '1.5rem' : '4rem',
        alignItems: 'center',
      }}>

        {/* Left — heading */}
        <div>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.3)',
            marginBottom: '1rem',
          }}>
            Who we are
          </p>

          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: isMobile ? '2.5rem' : 'clamp(2.8rem, 6vw, 5.5rem)',
            fontWeight: 300,
            color: '#191A23',
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            marginBottom: isMobile ? '1rem' : '2rem',
          }}>
            Rooted in<br />
            heritage.<br />
            <em style={{ color: 'rgba(0,0,0,0.35)' }}>Dressed for today.</em>
          </h2>
        </div>

        {/* Divider — desktop only */}
        {!isMobile && (
          <div style={{ width: '1px', height: '60%', background: 'rgba(0,0,0,0.08)', margin: '0 auto' }} />
        )}

        {/* Right — copy */}
        <div>
          {/* Thin line */}
          <div style={{ width: '2rem', height: '1px', background: 'rgba(0,0,0,0.15)', marginBottom: '1.25rem' }} />

          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: isMobile ? '1rem' : '1.35rem',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.85,
            color: 'rgba(0,0,0,0.5)',
            marginBottom: '1rem',
          }}>
            "We wanted to create a space where people can proudly wear and celebrate beautiful dirac, guntino and cultural fashion without feeling limited to one option."
          </p>

            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.68rem',
              letterSpacing: '0.05em',
              lineHeight: 2,
              color: 'rgba(0,0,0,0.4)',
              marginBottom: '2rem',
            }}>
             Guntino Glam was created out of love for our hido iyo dhaqankeena Soomaaliyeed. We noticed how people spend so much on beautiful dirac, guntiino, and cultural outfits, wear them once at aroos or special events, then leave them hanging in the closet or sell them away. That’s how Guntino Glam was born, a space where people can both rent and buy elegant cultural wear while still celebrating our Soomaalinimo, traditions, and timeless beauty in a modern and affordable way. 
            </p>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: isMobile ? '1rem' : '0' }}>
            <Link
              to="/products"
              className="about-link"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.6rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#fff',
                background: '#191A23',
                textDecoration: 'none',
                padding: '0.75rem 1.75rem',
                transition: 'background 0.3s ease',
                display: 'inline-block',
              }}
            >
              Shop now
            </Link>

            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(0,0,0,0.25)',
              textTransform: 'uppercase',
            }}>
              Nairobi, Kenya
            </p>
          </div>
        </div>

      </div>
    </section>
    </>
  )
}

export default About