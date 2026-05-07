import { Link } from 'react-router-dom'
import exclusiveCardImage1 from '../../assets/images/IMGT0963.jpg'
import exclusiveCardImage2 from '../../assets/images/IMGT0773.jpg'
import exclusiveCardImage3 from '../../assets/images/1S0A6804.jpg'

const cards = [
  { id: 1, image: exclusiveCardImage1, title: 'Faransawi', description: 'EXPLORE', collection: 'Faransawi' },
  { id: 2, image: exclusiveCardImage2, title: 'Maqbal', description: 'EXPLORE', collection: 'Maqbal' },
  { id: 3, image: exclusiveCardImage3, title: 'Guntino', description: 'EXPLORE', collection: 'Guntino' },
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
          <div className="absolute bottom-6 right-6 text-right">
            <h2 className="text-white text-xl font-light tracking-widest">{card.title}</h2>
            <p className="text-white/80 text-xs tracking-widest mt-1 relative inline-block">
              {card.description}
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white" />
            </p>
          </div>
        </Link>
      </div>
    ))
  }

  return (
    <div className="flex w-full gap-1" style={{ height: '100vh', scrollSnapAlign: 'start', scrollSnapStop: 'always', flexShrink: 0, background: '#FFF5FF' }}>
      {cards.map((card) => (
        <Link key={card.id} to={`/products?collection=${card.collection}`} className="relative flex-1 overflow-hidden group">
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
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
  )
}

export default CardsSection