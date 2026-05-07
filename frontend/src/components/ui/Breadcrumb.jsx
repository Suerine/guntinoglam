import { Link } from "react-router-dom"
import { FiChevronRight } from "react-icons/fi"

const Breadcrumb = ({ crumbs }) => (
  <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0.75rem 2.5rem', background: 'rgba(255,245,255,0.8)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {crumbs.map((crumb, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {crumb.to ? (
            <Link to={crumb.to} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', textDecoration: 'none' }}>
              {crumb.label}
            </Link>
          ) : (
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#191A23' }}>
              {crumb.label}
            </span>
          )}
          {i < crumbs.length - 1 && <FiChevronRight style={{ color: 'rgba(0,0,0,0.2)', fontSize: '0.7rem' }} />}
        </span>
      ))}
    </div>
  </div>
)

export default Breadcrumb