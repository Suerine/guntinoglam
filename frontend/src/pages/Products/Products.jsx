import { useEffect, useState } from "react"
import API from "../../api/axios"
import ProductCard from "./ProductCard"
import ProductsPage from "./ProductPage"
import { Link, useSearchParams } from "react-router-dom"
import { FiSearch, FiSliders } from "react-icons/fi"
import Navbar from "../../components/layout/Navbar"
import FilterDrawer from "../../components/ui/FilterDrawer"
import { FilterTrigger } from "../../components/ui/FilterDrawer"


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
             {filteredProducts.length} piece{filteredProducts.length !== 1 ? 's' : ''}
           </p>
         )}
       </div>
     </div>

     {/* Body — no top padding needed, header handles it */}
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