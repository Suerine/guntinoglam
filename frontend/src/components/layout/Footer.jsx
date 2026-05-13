import { Link } from 'react-router-dom'
import Guntino_Logo from "../../assets/images/GuntinoGlam.jpg"
import ModelsButton from '../ui/ModelsButton'

const Footer = () => {

  const socials = [
   { label: 'Instagram', url: 'https://www.instagram.com/guntino_glam/' },
   { label: 'TikTok', url: 'https://www.tiktok.com/@guntino_glam' },
   ]

   const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  return (
    <footer style={{
       background: '#FFF7FF',
       color: '#191A23',
       minHeight: '100vh',
       display: 'flex',
       flexDirection: 'column',
       justifyContent: 'space-between',
       fontFamily: '"Cormorant Garamond", serif',
       position: 'relative',
       overflow: 'hidden',
     }}
     className="px-6 pt-24 pb-10 md:px-16 md:pt-36"
     >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400&display=swap');

        .footer-link {
          color: rgba(0,0,0,0.3);
          text-decoration: none;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: color 0.3s ease;
          display: block;
          margin-bottom: 1rem;
        }
        .footer-link:hover { color: rgba(0,0,0); }

        .footer-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(0,0,0,0.3);
          color: #191A23;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          padding: 0.5rem 0;
          width: 100%;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .footer-input::placeholder { color: rgba(0,0,0,0.3); font-style: italic; }
        .footer-input:focus { border-color: rgba(0,0,0,0.6); }

        .footer-submit {
          background: transparent;
          border: none;
          color: rgba(0,0,0,0.3);
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 1rem;
          padding: 0;
          transition: color 0.3s ease;
        }
        .footer-submit:hover { color: #fff; }

        @media (max-width: 767px) {
          .footer-grid { flex-direction: column !important; gap: 3rem !important; }
          .footer-wordmark { font-size: 15vw !important; }
          footer { padding: 3rem 1.5rem 2rem !important; }
        }
      `}</style>

      {/* Top — logo + columns */}
      <div className="footer-grid pt-24 md:pt-5" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>

        {/* Brand col */}
        <div style={{ flex: 2 }}>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(0,0,0,0.7)',
            lineHeight: 1.8,
            maxWidth: '26ch',
            marginBottom: '2rem',
          }}>
            Tradition draped in glamour. Handcrafted pieces for the modern Somali woman.
          </p>
          <ModelsButton />
  
        </div>

        {/* Navigation col */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.7)',
            marginBottom: '1.5rem',
          }}>
            collection
          </p>
          <Link to="/products?collection=Maqbal" className="footer-link" onClick={scrollToTop}>Maqbal</Link>
          <Link to="/products?collection=Stones" className="footer-link" onClick={scrollToTop}>Stones</Link>
          <Link to="/products?collection=Faransawi" className="footer-link" onClick={scrollToTop}>Faransawi</Link>
          <Link to="/products?collection=Guntino" className="footer-link" onClick={scrollToTop}>Guntino</Link>
          <Link to="/products?collection=Baati" className="footer-link" onClick={scrollToTop}>Baati</Link>
          <Link to="/products?collection=Hido Iyo Dhaqan" className="footer-link" onClick={scrollToTop}>Hido Iyo Dhaqan</Link>
        </div>

        {/* Info col */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.7)',
            marginBottom: '1.5rem',
          }}>
            Info
          </p>
          <Link to="/order-information" className="footer-link" onClick={scrollToTop}>Order Information</Link>
          <Link to="/shipping-returns" className="footer-link" onClick={scrollToTop}>Shipping & Returns</Link>
          <Link to="/refund-policy" className="footer-link" onClick={scrollToTop}>Refund Policy</Link>
          <Link to="/terms-of-service" className="footer-link" onClick={scrollToTop}>Terms of Service</Link>
        </div>

        {/* Newsletter col */}
        <div style={{ flex: 2 }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.7)',
            marginBottom: '1.5rem',
          }}>
            Stay in the loop
          </p>
          <input
            type="email"
            placeholder="Your email address"
            className="footer-input"
          />
          <button className="footer-submit">Subscribe →</button>
        </div>

      </div>

      {/* Middle — large wordmark */}
      <div style={{ margin: '4rem 0 2rem', overflow: 'hidden' }}>
        <h2
          className="footer-wordmark"
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(1.8rem, 8vw, 10rem)', // clamp handles mobile → desktop naturally
            fontWeight: 300,
            letterSpacing: '0.05em',
            color: 'rgba(0,0,0,0.07)',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          GUNTINO GLAM
        </h2>
        <h4 style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          letterSpacing: '0.2em',
          color: 'rgba(0,0,0,0.35)',
          marginTop: '0.75rem',
          marginBottom: '0.2rem',
          textTransform: 'uppercase',
        }}>
          We sell and rent dirac · Ships worldwide
        </h4>
        <h5 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.8rem', color: 'rgba(0,0,0,0.35)',textTransform: 'uppercase' }}>
          For more information, please contact our customer support team on <a href="mailto:artbynajmaa@gmail.com?subject=Order%20Inquiry" className="text-pink-500 underline">artbynajmaa@gmail.com</a> or call us at <a href="tel:+254793904535" className="text-pink-500 underline">+254 793 904 535</a>.
        </h5>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(0,0,0,0.7)',
        paddingTop: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(0,0,0,0.7)',
          textTransform: 'uppercase',
        }}>
          © 2025 Guntino Glam. All rights reserved.
        </p>

       <div style={{ display: 'flex', gap: '2rem' }}>
          {socials.map(({ label, url }) => (
             <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              style={{ marginBottom: 0 }}
            >
              {label}
            </a>
          ))}
        </div>
        <p style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          color: 'rgba(0,0,0,0.7)',
          textTransform: 'uppercase',
        }}>
          Nairobi, Kenya
        </p>
      </div>

    </footer>
  )
}

export default Footer