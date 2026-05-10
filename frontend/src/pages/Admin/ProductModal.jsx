import { useState, useRef } from "react"
import { FiX, FiUploadCloud, FiTrash2 } from "react-icons/fi"
import toast from "react-hot-toast"
import API from "../../api/axios"

const CATEGORIES = ["Jerseys", "Boots", "Balls"]
const COLLECTIONS = ["Maqbal", "Stones", "Faransawi", "Guntino"]

const labelStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.5rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.3)',
  display: 'block',
  marginBottom: '0.4rem',
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.75rem',
  border: '1px solid rgba(0,0,0,0.08)',
  outline: 'none',
  background: 'transparent',
  color: '#191A23',
  transition: 'border-color 0.2s',
  letterSpacing: '0.03em',
  boxSizing: 'border-box',
}

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    discount: product?.discount || 0,
    category: product?.category || "Jerseys",
    collection: product?.collection || "Maqbal",
    images: product?.images || [],
    colors: product?.colors?.join(", ") || "",
    tags: product?.tags?.join(", ") || "",
    sku: product?.sku || "",
    sizes: product?.sizes?.map(s => `${s.size}:${s.stock}`).join(", ") || "",
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive ?? true,
    isRentable: product?.isRentable || false,
    rentalPrice: product?.rentalPrice || "",
    rentalDuration: product?.rentalDuration || "event",
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category || !form.collection) {
      toast.error("Name, price, category and collection are required")
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        discount: Number(form.discount),
        rentalPrice: form.rentalPrice ? Number(form.rentalPrice) : undefined,
        images: form.images,
        colors: form.colors.split(",").map(s => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map(s => {
          const [size, stock] = s.trim().split(":")
          return { size: size?.trim(), stock: Number(stock) || 0 }
        }).filter(s => s.size),
      }
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key])
      await onSave(payload)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product")
    } finally {
      setSaving(false)
    }
  }

  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (files.length + form.images.length > 5) {
      toast.error("You can only have up to 5 images per product")
      return
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i])
    }

    setUploading(true)
    try {
      // Import API at the top, or pass it as prop, wait we need to import API from axios
      // I will import API at the top in the next chunk if not already imported.
      const res = await API.post("/api/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setForm(prev => ({ ...prev, images: [...prev.images, ...res.data.images] }))
      toast.success("Images uploaded")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload images")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeImage = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#FFF7FF', width: '100%', maxWidth: '38rem', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(0,0,0,0.06)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', position: 'sticky', top: 0, background: '#FFF7FF', zIndex: 1 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.35rem', fontWeight: 300, color: '#191A23' }}>
            {product ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} style={{ padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.3)' }}>
            <FiX style={{ fontSize: '1rem' }} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <div>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Price (KSh) *</label>
              <input type="number" style={inputStyle} value={form.price} onChange={e => set('price', e.target.value)} placeholder="2500" />
            </div>
            <div>
              <label style={labelStyle}>Original Price</label>
              <input type="number" style={inputStyle} value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="3000" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Category *</label>
              <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Collection *</label>
              <select style={inputStyle} value={form.collection} onChange={e => set('collection', e.target.value)}>
                {COLLECTIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Discount (%)</label>
              <input type="number" style={inputStyle} value={form.discount} onChange={e => set('discount', e.target.value)} min="0" max="100" />
            </div>
            <div>
              <label style={labelStyle}>SKU</label>
              <input style={inputStyle} value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SKU-12345" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '4rem' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." />
          </div>

          <div>
            <label style={labelStyle}>Images (Max 5)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(4rem, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {form.images.map((img, index) => (
                <div key={index} style={{ position: 'relative', aspectRatio: '1', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{ position: 'absolute', top: '0.25rem', right: '0.25rem', background: 'rgba(255,255,255,0.9)', border: 'none', padding: '0.25rem', cursor: 'pointer', color: 'rgb(220,38,38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <FiTrash2 style={{ fontSize: '0.6rem' }} />
                  </button>
                </div>
              ))}
              {form.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{ aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: '1px dashed rgba(0,0,0,0.15)', background: 'transparent', cursor: uploading ? 'wait' : 'pointer', color: 'rgba(0,0,0,0.4)' }}
                >
                  <FiUploadCloud style={{ fontSize: '1.25rem' }} />
                  <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {uploading ? "Uploading..." : "Upload"}
                  </span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Colors (comma separated)</label>
              <input style={inputStyle} value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Red, Blue" />
            </div>
            <div>
              <label style={labelStyle}>Tags (comma separated)</label>
              <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="New, Sale" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Sizes & Stock (e.g. S:10, M:5)</label>
            <input style={inputStyle} value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="S:10, M:5, L:8" />
          </div>

          {/* Rental */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
              <input type="checkbox" checked={form.isRentable} onChange={e => set('isRentable', e.target.checked)} style={{ accentColor: 'rgb(219,39,119)' }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.5)' }}>Make Rentable</span>
            </label>
            {form.isRentable && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Rental Price (KSh)</label>
                  <input type="number" style={inputStyle} value={form.rentalPrice} onChange={e => set('rentalPrice', e.target.value)} placeholder="500" />
                </div>
                <div>
                  <label style={labelStyle}>Rental Duration</label>
                  <select style={inputStyle} value={form.rentalDuration} onChange={e => set('rentalDuration', e.target.value)}>
                    <option>daily</option><option>weekly</option><option>event</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Flags */}
          <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} style={{ accentColor: 'rgb(219,39,119)' }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.5)' }}>Featured</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} style={{ accentColor: 'rgb(219,39,119)' }} />
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.5)' }}>Active</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: '0.75rem', padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', position: 'sticky', bottom: 0, background: '#FFF7FF' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.7rem', border: '1px solid rgba(0,0,0,0.1)', background: 'transparent', fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '0.7rem', border: 'none', background: '#191A23', fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
