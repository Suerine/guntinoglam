import { useEffect, useState } from "react"
import API from "../../api/axios"
import ProductCard from "./ProductCard"
import ProductsPage from "./ProductPage"
import { Link, useSearchParams } from "react-router-dom"
import { FiSearch, FiSliders } from "react-icons/fi"
import Navbar from "../../components/layout/Navbar"
import FilterDrawer from "../../components/ui/FilterDrawer"
import { FilterTrigger } from "../../components/ui/FilterDrawer"
import { Helmet } from 'react-helmet-async'


const CATEGORIES = ["All", "Dirac"]
const COLLECTIONS = ["All", "Maqbal", "Stones", "Faransawi", "Guntino", "Baati", "Traditional"]
const PRODUCTS_PER_PAGE = 12 // 3 cols × 4 rows

function Products() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const [searchParams] = useSearchParams()
  const search = searchParams.get("search")
  const collectionParam = searchParams.get("collection")
  const [collection, setCollection] = useState(collectionParam || "All")

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(search?.toLowerCase() || "")
  )

  useEffect(() => {
    setCollection(collectionParam || "All")
    setPage(1) // reset page when collection changes via URL
  }, [collectionParam])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [category, collection])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let url = `/api/products?page=${page}&limit=${PRODUCTS_PER_PAGE}&`
        if (category !== "All") url += `category=${category}&`
        if (collection !== "All") url += `collection=${collection}&`
        const res = await API.get(url)
        setProducts(res.data.products || [])
        setTotalPages(res.data.pages || 1)
        setTotalProducts(res.data.totalProducts || 0)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, collection, page])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
   <>
   <Helmet>
    <title>
      {collection !== 'All'
        ? `${collection} Collection | Guntino Glam`
        : category !== 'All'
        ? `${category} | Guntino Glam`
        : 'Shop All Pieces | Guntino Glam'}
    </title>
    <meta
      name="description"
      content={
        collection !== 'All'
          ? `Shop the ${collection} collection at Guntino Glam — curated Dirac and Somali fashion for weddings and special occasions. Based in Nairobi, Kenya.`
          : `Browse all ${totalProducts} pieces at Guntino Glam. Dirac, Guntino, Maqbal, Faransawi and more — curated Somali fashion for the modern woman.`
      }
    />
    <meta property="og:title" content={collection !== 'All' ? `${collection} Collection | Guntino Glam` : 'Shop | Guntino Glam'} />
    <meta property="og:url" content={`https://guntinoglam.vercel.app/products${collection !== 'All' ? `?collection=${collection}` : ''}`} />
    <link rel="canonical" href={`https://guntinoglam.vercel.app/products${collection !== 'All' ? `?collection=${collection}` : ''}`} />
  </Helmet>
    <div style={{ minHeight: '100vh', background: '#FFF7FF' }}>

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

    {/* Filters */}
     <FilterDrawer
       collection={collection}
       setCollection={setCollection}
       category={category}
       setCategory={setCategory}
       COLLECTIONS={COLLECTIONS}
       CATEGORIES={CATEGORIES}
     />

     {/* Page header bar */}
     <div 
      className="pt-28 md:pt-32 pb-2 px-2"
      style={{
       background: '#FFF7FF',
       borderBottom: '1px solid rgba(0,0,0,0.06)',
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
     }}>
      <FilterTrigger
           onClick={() => document.getElementById('filter-drawer-open').click()}
           activeCount={(collection !== 'All' ? 1 : 0) + (category !== 'All' ? 1 : 0)}
         />
       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
         {!loading && (
           <p style={{
             fontFamily: 'Montserrat, sans-serif',
             fontSize: '0.55rem',
             letterSpacing: '0.2em',
             color: 'rgba(0,0,0,0.3)',
             textTransform: 'uppercase',
           }}>
             {totalProducts} piece{totalProducts !== 1 ? 's' : ''}
           </p>
         )}
       </div>
     </div>

     {/* Body */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }} className="pb-6">

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

        {/* ✅ Product grid + pagination — keep only this one */}
        {!loading && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1">
              {filteredProducts.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`} className="product-card-link">
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '3rem 1rem' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={{
                    fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em',
                    textTransform: 'uppercase', color: page === 1 ? 'rgba(0,0,0,0.2)' : '#191A23',
                    background: 'none', border: '1px solid', borderColor: page === 1 ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)',
                    padding: '0.6rem 1.25rem', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => { if (page !== 1) e.currentTarget.style.borderColor = '#191A23' }}
                  onMouseLeave={e => { if (page !== 1) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) => p === '...' ? (
                    <span key={`dots-${i}`} style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.3)', padding: '0 0.25rem' }}>...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', letterSpacing: '0.1em',
                        width: '2.25rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: page === p ? '#191A23' : 'transparent',
                        color: page === p ? '#fff' : 'rgba(0,0,0,0.4)',
                        border: '1px solid', borderColor: page === p ? '#191A23' : 'rgba(0,0,0,0.12)',
                        cursor: 'pointer', transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { if (page !== p) { e.currentTarget.style.borderColor = '#191A23'; e.currentTarget.style.color = '#191A23' } }}
                      onMouseLeave={e => { if (page !== p) { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'rgba(0,0,0,0.4)' } }}
                    >
                      {p}
                    </button>
                  ))
                }

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={{
                    fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em',
                    textTransform: 'uppercase', color: page === totalPages ? 'rgba(0,0,0,0.2)' : '#191A23',
                    background: 'none', border: '1px solid', borderColor: page === totalPages ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.2)',
                    padding: '0.6rem 1.25rem', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.borderColor = '#191A23' }}
                  onMouseLeave={e => { if (page !== totalPages) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)' }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
   </>
  )
}

export default Products