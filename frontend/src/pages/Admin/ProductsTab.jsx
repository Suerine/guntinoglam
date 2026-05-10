import { useEffect, useState } from "react"
import API from "../../api/axios"
import {
  FiPlus, FiEdit2, FiTrash2, FiSearch,
  FiChevronLeft, FiChevronRight, FiEye, FiEyeOff, FiPackage
} from "react-icons/fi"
import toast from "react-hot-toast"
import ProductModal from "./ProductModal"

const CATEGORIES = ["All", "Jerseys", "Boots", "Balls"]

const ProductsTab = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page, limit: 12 })
        if (search) params.set("keyword", search)
        if (categoryFilter !== "All") params.set("category", categoryFilter)
        const res = await API.get(`/api/admin/products?${params}`)
        setProducts(res.data.products)
        setTotal(res.data.totalProducts)
        setPages(res.data.pages)
      } catch {
        toast.error("Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, search, categoryFilter])

  const refetch = async () => {
    const params = new URLSearchParams({ page: 1, limit: 12 })
    const res = await API.get(`/api/admin/products?${params}`)
    setProducts(res.data.products)
    setTotal(res.data.totalProducts)
    setPages(res.data.pages)
  }

  const handleCreate = async (payload) => {
    await API.post("/api/admin/products", payload)
    toast.success("Product created")
    setPage(1)
    await refetch()
  }

  const handleUpdate = async (payload) => {
    await API.put(`/api/admin/products/${editingProduct._id}`, payload)
    toast.success("Product updated")
    setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...payload } : p))
  }

  const handleToggle = async (id, current) => {
    await API.patch(`/api/admin/products/${id}/toggle`)
    setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: !current } : p))
    toast.success(current ? "Product hidden" : "Product visible")
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/admin/products/${id}`)
      setProducts(prev => prev.filter(p => p._id !== id))
      setTotal(prev => prev - 1)
      toast.success("Product deleted")
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete")
    }
  }

  const filterBtnStyle = (active) => ({
    padding: '0.5rem 1rem',
    border: active ? '1px solid #191A23' : '1px solid rgba(0,0,0,0.08)',
    background: active ? '#191A23' : 'transparent',
    color: active ? '#fff' : 'rgba(0,0,0,0.35)',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.5rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  const actionBtnStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    padding: '0.6rem',
    border: 'none',
    background: 'transparent',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.5rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.25)' }}>
          {total} product{total !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => { setEditingProduct(null); setModalOpen(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            border: 'none',
            background: '#191A23',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.5rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <FiPlus style={{ fontSize: '0.65rem' }} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '16rem' }}>
          <FiSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', color: 'rgba(0,0,0,0.2)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            style={{
              width: '100%',
              paddingLeft: '2rem',
              paddingRight: '0.75rem',
              padding: '0.6rem 0.75rem 0.6rem 2rem',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.7rem',
              border: '1px solid rgba(0,0,0,0.08)',
              outline: 'none',
              background: 'transparent',
              color: '#191A23',
              letterSpacing: '0.03em',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategoryFilter(cat); setPage(1) }} style={filterBtnStyle(categoryFilter === cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10rem' }}>
          <div style={{ width: '1.5rem', height: '1.5rem', border: '1.5px solid rgba(249,168,212,0.3)', borderTopColor: 'rgb(249,168,212)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <FiPackage style={{ fontSize: '1.75rem', color: 'rgba(0,0,0,0.1)', margin: '0 auto 0.75rem' }} />
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>No products found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))', gap: '1rem' }}>
          {products.map(p => (
            <div key={p._id} style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              opacity: p.isActive ? 1 : 0.45,
              transition: 'opacity 0.2s, box-shadow 0.3s',
            }}>
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '3/4', background: 'rgba(0,0,0,0.02)' }}>
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiPackage style={{ fontSize: '1.5rem', color: 'rgba(0,0,0,0.1)' }} />
                  </div>
                )}
                {p.isFeatured && (
                  <span style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', fontFamily: 'Montserrat, sans-serif', fontSize: '0.4rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.2rem 0.5rem', background: 'rgba(249,168,212,0.9)', color: '#fff' }}>
                    Featured
                  </span>
                )}
                {p.discount > 0 && (
                  <span style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', fontFamily: 'Montserrat, sans-serif', fontSize: '0.4rem', letterSpacing: '0.1em', padding: '0.2rem 0.5rem', background: 'rgba(220,38,38,0.85)', color: '#fff' }}>
                    -{p.discount}%
                  </span>
                )}
                {p.isRentable && (
                  <span style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', fontFamily: 'Montserrat, sans-serif', fontSize: '0.4rem', letterSpacing: '0.1em', padding: '0.2rem 0.5rem', background: 'rgba(126,34,206,0.85)', color: '#fff' }}>
                    Rentable
                  </span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '0.85rem 1rem' }}>
                <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', color: '#191A23', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontWeight: 400, color: '#191A23' }}>KSh {p.price?.toLocaleString()}</span>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', color: 'rgba(0,0,0,0.25)', textDecoration: 'line-through' }}>KSh {p.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem' }}>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase' }}>{p.collection}</span>
                  <span style={{ color: 'rgba(0,0,0,0.1)' }}>·</span>
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase' }}>{p.category}</span>
                </div>
                {p.sizes && (
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', color: 'rgba(0,0,0,0.25)', marginTop: '0.25rem', letterSpacing: '0.1em' }}>
                    Stock: {p.sizes.reduce((sum, s) => sum + (s.stock || 0), 0)} units
                  </p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                <button
                  onClick={() => { setEditingProduct(p); setModalOpen(true) }}
                  style={{ ...actionBtnStyle, color: 'rgba(0,0,0,0.4)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <FiEdit2 style={{ fontSize: '0.55rem' }} /> Edit
                </button>
                <button
                  onClick={() => handleToggle(p._id, p.isActive)}
                  style={{ ...actionBtnStyle, color: 'rgba(0,0,0,0.4)', borderLeft: '1px solid rgba(0,0,0,0.04)', borderRight: '1px solid rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {p.isActive ? <><FiEyeOff style={{ fontSize: '0.55rem' }} /> Hide</> : <><FiEye style={{ fontSize: '0.55rem' }} /> Show</>}
                </button>
                <button
                  onClick={() => setDeleteId(p._id)}
                  style={{ ...actionBtnStyle, color: 'rgba(220,38,38,0.6)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <FiTrash2 style={{ fontSize: '0.55rem' }} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', cursor: 'pointer', opacity: page === 1 ? 0.3 : 1 }}>
            <FiChevronLeft style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }} />
          </button>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', letterSpacing: '0.1em' }}>
            Page {page} of {pages}
          </span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            style={{ padding: '0.5rem', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', cursor: 'pointer', opacity: page === pages ? 0.3 : 1 }}>
            <FiChevronRight style={{ fontSize: '0.75rem', color: 'rgba(0,0,0,0.4)' }} />
          </button>
        </div>
      )}

      {/* Modals */}
      {modalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setModalOpen(false); setEditingProduct(null) }}
          onSave={editingProduct ? handleUpdate : handleCreate}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#FFF7FF', padding: '2rem', width: '100%', maxWidth: '22rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
            <FiTrash2 style={{ fontSize: '1.5rem', color: 'rgba(220,38,38,0.5)', margin: '0 auto 1rem' }} />
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', color: 'rgba(0,0,0,0.6)', fontStyle: 'italic' }}>Delete this product permanently?</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '0.7rem', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '0.7rem', border: 'none', background: 'rgb(220,38,38)', fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsTab
