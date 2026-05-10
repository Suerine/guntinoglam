import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../../components/layout/Navbar'
import HeroSection from './HeroSection'
import CardsSection from './CardsSection'
import TopCollection from './TopCollection'
import About from './About'
import Footer from '../../components/layout/Footer'

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      <Helmet>
        <title>Guntino Glam | Somali Fashion & Dirac — Nairobi</title>
        <meta name="description" content="Guntino Glam is a Nairobi-based fashion brand offering curated Somali Dirac for sale and hire. Shop Guntino, Maqbal, Faransawi and more." />
        <link rel="canonical" href="https://guntinoglam.vercel.app/" />
        <meta property="og:title" content="Guntino Glam | Somali Fashion & Dirac — Nairobi" />
        <meta property="og:description" content="Curated Somali Dirac for sale and hire. Based in Nairobi, Kenya." />
        <meta property="og:url" content="https://guntinoglam.vercel.app/" />
        <meta property="og:image" content="https://guntinoglam.vercel.app/og-image.jpg" />
      </Helmet>

      <Navbar />
      <div
        id="snap-container"
        style={{
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
        }}
      >
        <HeroSection />
        <CardsSection isMobile={isMobile} />
        <TopCollection isMobile={isMobile} />
        <About isMobile={isMobile}/>
        <section style={{
          scrollSnapAlign: 'start',
          flexShrink: 0,
          minHeight: '100vh',
          background: '#FFF7FF'
        }}>
          <Footer />
        </section>
      </div>
    </>
  )
}

export default Home