import { useEffect, useState } from "react"
import API from "../../api/axios"
import {
  FiX, FiChevronLeft, FiChevronRight,
  FiTruck, FiMapPin, FiPhone
} from "react-icons/fi"
import toast from "react-hot-toast"

const ORDER_STATUS = ["pending", "processing", "shipped", "delivered", "cancelled", "returned"]

const labelStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.5rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.3)',
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
}

const thStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.5rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.25)',
  textAlign: 'left',
  padding: '0.75rem 1.25rem',
  fontWeight: 400,
}

const tdStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.7rem',
  color: 'rgba(0,0,0,0.6)',
  padding: '0.85rem 1.25rem',
}

const statusColor = (s) => {
  const map = {
    pending: { background: 'rgba(251,191,36,0.1)', color: 'rgb(180,130,20)' },
    processing: { background: 'rgba(59,130,246,0.1)', color: 'rgb(37,99,235)' },
    shipped: { background: 'rgba(147,51,234,0.1)', color: 'rgb(126,34,206)' },
    delivered: { background: 'rgba(34,197,94,0.1)', color: 'rgb(22,163,74)' },
    cancelled: { background: 'rgba(239,68,68,0.1)', color: 'rgb(220,38,38)' },
    returned: { background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.45)' },
  }
  return map[s] || map.returned
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderModal = ({ order, onClose, onStatusChange }) => {
  const [status, setStatus] = useState(order?.status || "pending")
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || "")
  const [adminNote, setAdminNote] = useState(order?.adminNote || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onStatusChange(order._id, { status, trackingNumber, adminNote })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.35)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#FFF7FF',
        width: '100%',
        maxWidth: '34rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid rgba(0,0,0,0.06)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          position: 'sticky', top: 0,
          background: '#FFF7FF',
          zIndex: 1,
        }}>
          <div>
            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.35rem',
              fontWeight: 300,
              color: '#191A23',
            }}>Order #{order._id.slice(-6).toUpperCase()}</h2>
            <p style={{ ...labelStyle, fontSize: '0.45rem', marginTop: '0.25rem' }}>
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} style={{
            padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'rgba(0,0,0,0.3)', transition: 'color 0.2s',
          }}>
            <FiX style={{ fontSize: '1rem' }} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Customer */}
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', border: '1px solid rgba(0,0,0,0.04)' }}>
            <p style={{ ...labelStyle, marginBottom: '0.5rem' }}>Customer {order.isGuest && "(Guest)"}</p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', color: '#191A23' }}>
              {order.isGuest ? (order.guestName || "Guest User") : (order.user?.name || "—")}
            </p>
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginTop: '0.2rem' }}>
              {order.isGuest ? (order.guestEmail || "") : (order.user?.email || "")}
            </p>
            {(order.isGuest ? order.guestPhone : order.user?.phone) && (
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6rem', color: 'rgba(0,0,0,0.4)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiPhone style={{ fontSize: '0.5rem' }} /> {order.isGuest ? order.guestPhone : order.user.phone}
              </p>
            )}
          </div>

          {/* Shipping */}
          {order.shippingAddress && (
            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p style={{ ...labelStyle, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FiMapPin style={{ fontSize: '0.5rem' }} /> Shipping
              </p>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.5)', lineHeight: 1.7 }}>
                {[order.shippingAddress.address, order.shippingAddress.city, order.shippingAddress.postalCode, order.shippingAddress.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {/* Items */}
          <div>
            <p style={{ ...labelStyle, marginBottom: '0.65rem' }}>Items ({order.orderItems?.length || 0})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {order.orderItems?.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  background: 'rgba(0,0,0,0.02)', padding: '0.75rem',
                  border: '1px solid rgba(0,0,0,0.04)',
                }}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} style={{ width: '2.75rem', height: '3.25rem', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '2.75rem', height: '3.25rem', background: 'rgba(0,0,0,0.05)', flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.9rem', color: '#191A23', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name || item.product?.name || "Product"}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                      {item.size && <span style={{ ...labelStyle, fontSize: '0.4rem' }}>Size: {item.size}</span>}
                      {item.color && <span style={{ ...labelStyle, fontSize: '0.4rem' }}>Color: {item.color}</span>}
                      <span style={{ ...labelStyle, fontSize: '0.4rem' }}>× {item.quantity}</span>
                    </div>
                    {item.isRental && (
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', color: 'rgb(126,34,206)', marginTop: '0.2rem' }}>
                        Rental ({item.rentalDuration})
                      </p>
                    )}
                  </div>
                  <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', color: '#191A23', flexShrink: 0 }}>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)' }}>
              <span>Subtotal</span><span>KSh {(order.itemsPrice || 0).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)' }}>
              <span>Shipping</span><span>KSh {(order.shippingPrice || 0).toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', color: 'rgb(22,163,74)' }}>
                <span>Discount {order.couponCode && `(${order.couponCode})`}</span><span>- KSh {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '0.25rem' }}>
              <span style={{ ...labelStyle }}>Total</span>
              <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.25rem', fontWeight: 300, color: '#191A23' }}>
                KSh {(order.totalPrice || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.25rem 0.6rem',
              background: order.isPaid ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
              color: order.isPaid ? 'rgb(22,163,74)' : 'rgb(220,38,38)',
            }}>
              {order.isPaid ? `Paid` : "Unpaid"}
            </span>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', color: 'rgba(0,0,0,0.25)', textTransform: 'capitalize' }}>
              via {order.paymentMethod?.replace("_", " ")}
            </span>
          </div>

          {order.customerNote && (
            <div style={{ background: 'rgba(251,191,36,0.06)', padding: '0.85rem', border: '1px solid rgba(251,191,36,0.12)' }}>
              <p style={{ ...labelStyle, color: 'rgb(180,130,20)', marginBottom: '0.35rem', fontSize: '0.45rem' }}>Customer Note</p>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(0,0,0,0.6)', lineHeight: 1.6 }}>{order.customerNote}</p>
            </div>
          )}

          {/* Editable Fields */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ ...labelStyle, display: 'block', marginBottom: '0.4rem' }}>Status</label>
              <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
                {ORDER_STATUS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ ...labelStyle, display: 'block', marginBottom: '0.4rem' }}>Tracking Number</label>
              <input style={inputStyle} value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="Enter tracking number..." />
            </div>
            <div>
              <label style={{ ...labelStyle, display: 'block', marginBottom: '0.4rem' }}>Admin Note</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '3rem' }} value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Internal note..." />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', gap: '0.75rem',
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          position: 'sticky', bottom: 0,
          background: '#FFF7FF',
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '0.7rem',
            border: '1px solid rgba(0,0,0,0.1)',
            background: 'transparent',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.4)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: '0.7rem',
            border: 'none',
            background: '#191A23',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fff',
            cursor: 'pointer',
            transition: 'background 0.2s',
            opacity: saving ? 0.5 : 1,
          }}>{saving ? "Saving..." : "Update Order"}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────
const OrdersTab = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page, limit: 15 })
        if (statusFilter) params.set("status", statusFilter)
        const res = await API.get(`/api/admin/orders?${params}`)
        setOrders(res.data.orders)
        setTotal(res.data.totalOrders)
        setPages(res.data.pages)
      } catch {
        toast.error("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, statusFilter])

  const handleStatusChange = async (id, payload) => {
    try {
      const res = await API.put(`/api/admin/orders/${id}/status`, payload)
      setOrders(prev => prev.map(o => o._id === id ? res.data : o))
      toast.success("Order updated")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order")
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <p style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '0.55rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.25)',
      }}>{total} order{total !== 1 ? "s" : ""}</p>

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setStatusFilter(""); setPage(1) }} style={filterBtnStyle(!statusFilter)}>All</button>
        {ORDER_STATUS.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} style={filterBtnStyle(statusFilter === s)}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10rem' }}>
          <div style={{ width: '1.5rem', height: '1.5rem', border: '1.5px solid rgba(249,168,212,0.3)', borderTopColor: 'rgb(249,168,212)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <FiTruck style={{ fontSize: '1.75rem', color: 'rgba(0,0,0,0.1)', margin: '0 auto 0.75rem' }} />
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', fontStyle: 'italic', color: 'rgba(0,0,0,0.25)' }}>No orders found</p>
        </div>
      ) : (
        <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <th style={thStyle}>Order</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Items</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Payment</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                  <th style={{ ...thStyle, width: '2rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} onClick={() => setSelectedOrder(order)}
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,168,212,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(0,0,0,0.35)' }}>#{order._id.slice(-6).toUpperCase()}</td>
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 500, color: '#191A23', fontSize: '0.7rem' }}>
                        {order.isGuest ? (order.guestName || "Guest User") : (order.user?.name || "—")}
                        {order.isGuest && <span style={{ marginLeft: '4px', fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', fontWeight: 'normal' }}>(Guest)</span>}
                      </p>
                      <p style={{ fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', marginTop: '0.1rem' }}>
                        {order.isGuest ? (order.guestEmail || "") : (order.user?.email || "")}
                      </p>
                    </td>
                    <td style={tdStyle}>{order.orderItems?.length || 0}</td>
                    <td style={{ ...tdStyle, fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', color: '#191A23' }}>
                      KSh {(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                        padding: '0.2rem 0.5rem',
                        background: order.isPaid ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                        color: order.isPaid ? 'rgb(22,163,74)' : 'rgb(220,38,38)',
                      }}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily: 'Montserrat, sans-serif', fontSize: '0.45rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                        padding: '0.2rem 0.5rem',
                        ...statusColor(order.status),
                      }}>{order.status}</span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.55rem', color: 'rgba(0,0,0,0.25)' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ ...tdStyle, color: 'rgba(0,0,0,0.15)', fontSize: '0.7rem' }}>→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={handleStatusChange} />
      )}
    </div>
  )
}

export default OrdersTab
