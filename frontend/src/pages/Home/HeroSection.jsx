import React from 'react'
import HeroBackground from "../../assets/images/HeroImg5.jpg";
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section
      id="hero-section"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      <img
         id="hero-bg"
         src={HeroBackground}
         alt="Hero Background"
         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
       />

      {/* Deeper gradient on mobile so text is always readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
      }} />

      {/* Text pinned to bottom */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center gap-2 px-6 text-center"
        style={{ bottom: 'clamp(4rem, 10vh, 5rem)' }}
      >
        <h1
          className="text-white font-light italic"
          style={{
            fontSize: 'clamp(1.75rem, 7vw, 4rem)',
            letterSpacing: '0.03em',
            lineHeight: 1.2,
          }}
        >
          Tradition draped in glamour
        </h1>
        <h3
         className="text-white/80 font-light uppercase"
         style={{
           fontFamily: 'Montserrat, sans-serif',
           fontSize: 'clamp(0.65rem, 3.5vw, 1rem)',
           letterSpacing: '0.3em',
           marginTop: '0.25rem',
           paddingRight: '0.3em', // compensates for letter-spacing pushing text right
         }}
       >
         Stylish Dirac
       </h3>
      </div>

      {/* Bounce arrow */}
      <div className="absolute bottom-4 w-full flex justify-center">
        <ChevronDown className="text-white animate-bounce" size={28} />
      </div>
    </section>
  )
}

export default HeroSection