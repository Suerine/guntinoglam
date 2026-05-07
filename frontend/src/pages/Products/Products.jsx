import { useEffect, useState } from "react"
import API from "../../api/axios"
import ProductCard from "./ProductCard"
import ProductsPage from "./ProductPage"
import { Link, useSearchParams } from "react-router-dom"
import { FiSearch, FiSliders } from "react-icons/fi"
import Navbar from "../../components/layout/Navbar"


const CATEGORIES = ["All", "Dirac"]
const COLLECTIONS = ["All", "Maqbal", "Stones", "Faransawi", "Guntino"]

function Products() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  const [searchParams] = useSearchParams()
  const search = searchParams.get("search")

  const collectionParam = searchParams.get("collection")
  const [collection, setCollection] = useState(collectionParam || "All")

  const [collectionOpen, setCollectionOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(search?.toLowerCase() || "")
  )

  useEffect(() => {
   setCollection(collectionParam || "All")
  }, [collectionParam])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let url = "/api/products?"
        if (category !== "All") url += `category=${category}&`
        if (collection !== "All") url += `collection=${collection}&`
        const res = await API.get(url)
        setProducts(res.data.products || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, collection])

  return (
   <>
    <div style={{ minHeight: '100vh', background: 'rgb(252, 240, 252)' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .prod-cormorant { font-family: 'Cormorant Garamond', serif; }
        .prod-montserrat { font-family: 'Montserrat', sans-serif; }

        .skeleton {
          background: linear-gradient(90deg, rgba(0,0,0,0.8) 25%, rgba(0,0,0.6) 50%, rgba(0,0,0,0.8) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .filter-pill {
          transition: all 0.25s ease;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
        }
        .filter-pill.active {
          background: #191A23;
          color: #fff;
        }
        .filter-pill.inactive {
          background: transparent;
          color: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,0,0,0.12);
        }
        .filter-pill.inactive:hover {
          border-color: rgba(0,0,0,0.4);
          color: rgba(0,0,0,0.8);
        }

        .product-card-link {
          text-decoration: none;
          display: block;
        }
        .product-card-link:hover .card-img {
          transform: scale(1.04);
        }
        .card-img {
          transition: transform 0.5s ease;
        }
      `}</style>

      {/* Hero header */}
      <div style={{
        background: '#FFF5FF',
        padding: '8.5rem 2.5rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)' }} ></div>
        <div style={{ position: 'absolute', bottom: '-6rem', left: '10rem', width: '25rem', height: '25rem', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)' }} ></div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#191A23',
            marginBottom: '1rem',
          }}>
            {search ? `Search — "${search}"` : collection !== "All" ? collection : "Full Collection"}
          </p>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(3.5rem, 8vw, 5rem)',
            fontWeight: 300,
            color: '#191A23',
            lineHeight: 1,
            letterSpacing: '0.05em',
            marginBottom: '1.5rem',
          }}>
            {search ? "Results" : "Shop"}
          </h1>

          {!loading && (
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'rgba(0,0,0,0.4)',
              textTransform: 'uppercase',
            }}>
              {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* MOBILE: Dropdowns */}
        <div className="flex md:hidden gap-3 px-4 py-3">
          {/* Collection Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => { setCollectionOpen(!collectionOpen); setCategoryOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-3 border border-black/20 text-xs tracking-widest uppercase font-light"
            >
              <span>{collection || 'Collection'}</span>
              <span style={{ fontSize: '0.6rem' }}>{collectionOpen ? '▲' : '▼'}</span>
            </button>
            {collectionOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-black/10 z-50 shadow-sm">
                {COLLECTIONS.map((col) => (
                  <button
                    key={col}
                    onClick={() => { setCollection(col); setCollectionOpen(false) }}
                    className="w-full text-left px-4 py-3 text-xs tracking-widest uppercase font-light hover:bg-black/5"
                    style={{ color: collection === col ? 'black' : 'rgba(0,0,0,0.5)' }}
                  >
                    {col}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => { setCategoryOpen(!categoryOpen); setCollectionOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-3 border border-black/20 text-xs tracking-widest uppercase font-light"
            >
              <span>{category || 'Category'}</span>
              <span style={{ fontSize: '0.6rem' }}>{categoryOpen ? '▲' : '▼'}</span>
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-black/10 z-50 shadow-sm">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setCategoryOpen(false) }}
                    className="w-full text-left px-4 py-3 text-xs tracking-widest uppercase font-light hover:bg-black/5"
                    style={{ color: category === cat ? 'black' : 'rgba(0,0,0,0.5)' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP: Pills */}
         <div className="hidden md:block px-6 py-4">
           {/* Collections row */}
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
             <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
               Collection
             </span>
             {COLLECTIONS.map((col) => (
               <button
                 key={col}
                 onClick={() => setCollection(col)}
                 className={`filter-pill ${collection === col ? 'active' : 'inactive'}`}
               >
                 {col}
               </button>
             ))}
           </div>

           {/* Categories row */}
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto' }}>
             <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)', marginRight: '0.5rem', whiteSpace: 'nowrap' }}>
               Category
             </span>
             {CATEGORIES.map((cat) => (
               <button
                 key={cat}
                 onClick={() => setCategory(cat)}
                 className={`filter-pill ${category === cat ? 'active' : 'inactive'}`}
               >
                 {cat}
               </button>
             ))}
           </div>
         </div>


      </div>

      {/* Body */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', }}>

        {/* Skeletons */}
        {loading && (
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
             {Array.from({ length: 6 }).map((_, i) => (
               <div key={i}>
                 <div className="skeleton" style={{ aspectRatio: '3/4', width: '100%', borderRadius: '4px' }} />
               </div>
             ))}
           </div>
         )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 0', gap: '1.5rem', textAlign: 'center' }}>
            <FiSearch style={{ fontSize: '2rem', color: 'rgba(0,0,0,0.15)' }} />
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 300, color: 'rgba(0,0,0,0.3)' }}>
                Nothing here yet
              </h2>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.3)', marginTop: '0.5rem' }}>
                {search ? `No results for "${search}"` : `No pieces in this filter`}
              </p>
            </div>
            <button
              onClick={() => { setCategory("All"); setCollection("All") }}
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                background: '#0a0a0a',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                cursor: 'pointer',
                borderRadius: '999px',
              }}
            >
              View All
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
            {filteredProducts.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="product-card-link">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
   </>
  )
}

export default Products