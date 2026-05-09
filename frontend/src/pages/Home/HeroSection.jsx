import React from 'react'
import HeroBackground from "../../assets/images/HeroImg5.jpg";
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="hero-section" style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', scrollSnapAlign: 'start', flexShrink: 0 }}>
      <img
        src={HeroBackground}
        alt="Hero Background"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Dark gradient at bottom so text is readable */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'
      }} />

      {/* Text pinned to bottom */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 px-4 text-center">
        <h1 className="text-white text-4xl md:text-6xl font-light tracking-wide italic">
          Tradition draped in glamour
        </h1>
        <h3 className="text-white/80 text-lg font-light tracking-widest uppercase font-montserrat">
          Stylish Dirac
        </h3>
      </div>

      {/* Bounce arrow */}
      <ChevronDown className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white animate-bounce" size={30} />
    </section>
  )
}

export default HeroSection