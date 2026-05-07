import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import HeroSection from './HeroSection'
import CardsSection from './CardsSection'
import TopCollection from './TopCollection'
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
        <section style={{
         scrollSnapAlign: 'start',
         flexShrink: 0,
         minHeight: '100vh', // min instead of fixed, lets footer content dictate height
         background: '#FFF5FF'
       }}>
         <Footer />
       </section>
      </div>
    </>
  )
}

export default Home