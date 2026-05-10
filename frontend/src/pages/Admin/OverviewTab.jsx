import { useEffect, useState } from "react"
import API from "../../api/axios"
import {
  FiPackage, FiShoppingCart, FiUsers, FiTrendingUp,
  FiClock, FiCheckCircle, FiTruck
} from "react-icons/fi"
import toast from "react-hot-toast"

const labelStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.5rem',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.3)',
}

const valueStyle = {
  fontFamily: '"Cormorant Garamond", serif',
  fontSize: '1.75rem',
  fontWeight: 300,
  color: '#191A23',
  marginTop: '0.25rem',
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

const StatCard = ({ icon: Icon, label, value, iconColor }) => (
  <div style={{
    background: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(0,0,0,0.05)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    transition: 'box-shadow 0.3s ease',
  }}>
    <div style={{
      width: '2.5rem',
      height: '2.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      background: 'rgba(249,168,212,0.08)',
    }}>
      <Icon style={{ fontSize: '1rem', color: iconColor || 'rgb(249,168,212)' }} />
    </div>
    <div>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{value}</p>
    </div>
  </div>
)

const OverviewTab = () => {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/api/admin/stats")
        setStats(res.data.stats)
        setRecentOrders(res.data.recentOrders || [])
      } catch {
        toast.error("Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
        <div style={{
          width: '1.5rem', height: '1.5rem',
          border: '1.5px solid rgba(249,168,212,0.3)',
          borderTopColor: 'rgb(249,168,212)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <StatCard icon={FiTrendingUp} label="Revenue" value={`KSh ${(stats?.totalRevenue || 0).toLocaleString()}`} />
        <StatCard icon={FiShoppingCart} label="Orders" value={stats?.totalOrders || 0} />
        <StatCard icon={FiPackage} label="Products" value={stats?.totalProducts || 0} />
        <StatCard icon={FiUsers} label="Customers" value={stats?.totalUsers || 0} />
      </div>

      {/* Secondary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          { icon: FiClock, label: 'Pending', value: stats?.pendingOrders || 0, color: 'rgb(180,130,20)' },
          { icon: FiCheckCircle, label: 'Paid', value: stats?.paidOrders || 0, color: 'rgb(22,163,74)' },
          { icon: FiTruck, label: 'Delivered', value: stats?.deliveredOrders || 0, color: 'rgb(126,34,206)' },
        ].map(item => (
          <div key={item.label} style={{
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(0,0,0,0.05)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <item.icon style={{ fontSize: '0.9rem', color: item.color }} />
            <div>
              <p style={{ ...labelStyle, fontSize: '0.45rem' }}>{item.label}</p>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: '1.35rem',
                fontWeight: 300,
                color: '#191A23',
              }}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <h3 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.15rem',
            fontWeight: 400,
            color: '#191A23',
            letterSpacing: '0.03em',
          }}>Recent Orders</h3>
        </div>

        {recentOrders.length === 0 ? (
          <p style={{
            ...labelStyle,
            textAlign: 'center',
            padding: '3rem',
          }}>No orders yet</p>
        ) : (
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.15s' }}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(0,0,0,0.35)' }}>
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 500, color: '#191A23', fontSize: '0.7rem' }}>{order.user?.name || "—"}</p>
                      <p style={{ fontSize: '0.55rem', color: 'rgba(0,0,0,0.3)', marginTop: '0.15rem' }}>{order.user?.email || ""}</p>
                    </td>
                    <td style={tdStyle}>
                      {order.orderItems?.length || 0} piece{(order.orderItems?.length || 0) !== 1 ? "s" : ""}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: '"Cormorant Garamond", serif', fontSize: '0.95rem', fontWeight: 400, color: '#191A23' }}>
                      KSh {(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '0.5rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.5rem',
                        background: order.isPaid ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                        color: order.isPaid ? 'rgb(22,163,74)' : 'rgb(220,38,38)',
                        fontFamily: 'Montserrat, sans-serif',
                      }}>
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        fontSize: '0.5rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        padding: '0.25rem 0.5rem',
                        fontFamily: 'Montserrat, sans-serif',
                        ...statusColor(order.status),
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.55rem', color: 'rgba(0,0,0,0.25)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewTab
