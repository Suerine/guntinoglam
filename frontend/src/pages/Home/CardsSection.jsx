import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import exclusiveCardImage1 from '../../assets/images/IMGT0963.jpg'
import exclusiveCardImage2 from '../../assets/images/IMG_8880.jpg'
import exclusiveCardImage3 from '../../assets/images/1S0A6804.jpg'
import exclusiveCardImage4 from '../../assets/images/IMG_8881.jpg'
import exclusiveCardImage5 from '../../assets/images/IMGT0773.jpg'
import exclusiveCardImage6 from '../../assets/images/1S0A6804.jpg'

const cards = [
  { id: 1, image: exclusiveCardImage1, title: 'Faransawi', description: 'EXPLORE', collection: 'Faransawi' },
  { id: 2, image: exclusiveCardImage2, title: 'Hido Iyo Dhaqan', description: 'EXPLORE', collection: 'Hido Iyo Dhaqan' },
  { id: 3, image: exclusiveCardImage3, title: 'Guntino', description: 'EXPLORE', collection: 'Guntino' },
  { id: 4, image: exclusiveCardImage4, title: 'Baati', description: 'EXPLORE', collection: 'Baati' },
  { id: 5, image: exclusiveCardImage5, title: 'Maqbal', description: 'EXPLORE', collection: 'Maqbal' },
  { id: 6, image: exclusiveCardImage3, title: 'Jerseys', description: 'EXPLORE', collection: 'Jerseys' },
]

const CardsSection = ({ isMobile }) => {
  if (isMobile) {
    return cards.map((card) => (
      <div
        key={card.id}
        style={{
          height: '100vh',
          width: '100%',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Link to={`/products?collection=${card.collection}`} className="block w-full h-full">
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-1/2 -translate-y-1/2 right-6 text-right">
            <h2 className="text-black text-xl font-light tracking-widest">{card.title}</h2>
            <p className="text-black/80 text-xs tracking-widest mt-1 relative inline-block">
              {card.description}
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-black" />
            </p>
          </div>
        </Link>
      </div>
    ))
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        flexShrink: 0,
        background: '#FFF7FF',
      }}
    >
      <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-lg backdrop-blur-sm"> 
        <FiChevronRight className="h-4 w-4 text-black/80" />
      </div>

      <div
        className="h-full overflow-x-auto overflow-y-hidden pl-3 pr-1"
        style={{
          scrollSnapType: 'x proximity',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex h-full gap-1" style={{ width: 'max-content', minWidth: '100%' }}>
          {cards.map((card) => (
            <Link
              key={card.id}
              to={`/products?collection=${card.collection}`}
              className="group relative overflow-hidden"
              style={{
                width: 'min(32vw, 420px)',
                minWidth: '300px',
                height: '100%',
                flexShrink: 0,
                scrollSnapAlign: 'start',
              }}
            >
              <img src={card.image} alt={card.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 text-right">
                <h2 className="text-white text-xl font-light tracking-widest">{card.title}</h2>
                <p className="text-white/80 text-xs tracking-widest mt-1 relative inline-block">
                  {card.description}
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardsSection