import { Link } from 'react-router-dom'
import Guntino_Logo from "../../assets/images/GuntinoGlam.jpg"

const Footer = () => {
  return (
    <footer style={{
       background: '#FFF5FF',
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
      <div className="footer-grid" style={{ display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>

        {/* Brand col */}
        <div style={{ flex: 2 }}>
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(0,0,0,0.7)',
            lineHeight: 1.8,
            maxWidth: '26ch',
          }}>
            Tradition draped in glamour. Handcrafted pieces for the modern Somali woman.
          </p>
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
          <Link to="/products" className="footer-link">Maqbal</Link>
          <Link to="/products" className="footer-link">Stones</Link>
          <Link to="/products" className="footer-link">Faransawi</Link>
          <Link to="/products" className="footer-link">Guntino</Link>
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
          <Link to="/" className="footer-link">About</Link>
          <Link to="/" className="footer-link">Stockists</Link>
          <Link to="/" className="footer-link">Care Guide</Link>
          <Link to="/" className="footer-link">Contact</Link>
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
          textTransform: 'uppercase',
        }}>
          We sell and rent dirac · Ships worldwide
        </h4>
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
          {['Instagram', 'TikTok', 'Pinterest'].map(social => (
            <a
              key={social}
              href="#"
              className="footer-link"
              style={{ marginBottom: 0 }}
            >
              {social}
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