import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { FiSliders, FiX } from 'react-icons/fi'

export const FilterTrigger = ({ onClick, activeCount }) => (
  <button
    id="filter-trigger"
    onClick={onClick}
    style={{
      background: 'none',
      border: '1px solid rgba(0,0,0,0.15)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      transition: 'border-color 0.2s ease',
      position: 'relative',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#191A23'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'}
  >
    <FiSliders size={12} style={{ color: '#191A23' }} />
    <span style={{
      fontFamily: 'Montserrat, sans-serif',
      fontSize: '0.55rem',
      letterSpacing: '0.25em',
      textTransform: 'uppercase',
      color: '#191A23',
    }}>
      {activeCount > 0 ? `Filter (${activeCount})` : 'Filter'}
    </span>
  </button>
)

const FilterDrawer = ({ collection, setCollection, category, setCategory, COLLECTIONS, CATEGORIES }) => {
  const [isOpen, setIsOpen] = useState(false)
  const activeCount = (collection !== 'All' ? 1 : 0) + (category !== 'All' ? 1 : 0)

  useEffect(() => {
    const handleClick = (e) => {
      if (isOpen && !e.target.closest('#filter-drawer') && !e.target.closest('#filter-trigger')) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.15)',
            zIndex: 45,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div
        id="filter-drawer"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '16rem',
          background: '#FFF7FF',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isOpen ? '4px 0 30px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '2rem 1.5rem 1.25rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '0.3rem' }}>
              Refine
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.75rem', fontWeight: 300, color: '#191A23', lineHeight: 1 }}>
              Filter
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.3)' }}>
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* Collections */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '1rem' }}>
              Collection
            </p>
            {COLLECTIONS.map((col) => (
              <button
                key={col}
                onClick={() => setCollection(col)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  color: collection === col ? '#191A23' : 'rgba(0,0,0,0.35)',
                  transition: 'color 0.2s ease',
                }}
              >
                {col}
                {collection === col && <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#191A23' }} />}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: '1rem' }}>
              Category
            </p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.6rem 0',
                  borderBottom: '1px solid rgba(0,0,0,0.04)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: '1.1rem',
                  fontWeight: 300,
                  color: category === cat ? '#191A23' : 'rgba(0,0,0,0.35)',
                  transition: 'color 0.2s ease',
                }}
              >
                {cat}
                {category === cat && <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: '#191A23' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        {activeCount > 0 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <button
              onClick={() => { setCollection('All'); setCategory('All') }}
              style={{
                width: '100%',
                background: 'none',
                border: '1px solid rgba(0,0,0,0.15)',
                padding: '0.65rem',
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#191A23'; e.currentTarget.style.color = '#191A23' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'; e.currentTarget.style.color = 'rgba(0,0,0,0.4)' }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Hidden trigger that the header calls */}
      <button id="filter-drawer-open" onClick={() => setIsOpen(true)} style={{ display: 'none' }} />
    </>
  )
}

export default FilterDrawer