import { useEffect, useState } from "react"
import API from "../../api/axios"
import {
  FiUsers, FiChevronLeft, FiChevronRight, FiShield, FiUser
} from "react-icons/fi"
import toast from "react-hot-toast"

const labelStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.5rem',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.25)',
  fontWeight: 400,
}

const thStyle = {
  ...labelStyle,
  textAlign: 'left',
  padding: '0.75rem 1.25rem',
}

const tdStyle = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '0.7rem',
  color: 'rgba(0,0,0,0.6)',
  padding: '0.85rem 1.25rem',
}

const UsersTab = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page, limit: 20 })
        const res = await API.get(`/api/admin/users?${params}`)
        setUsers(res.data.users)
        setTotal(res.data.totalUsers)
        setPages(res.data.pages)
      } catch {
        toast.error("Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await API.put(`/api/admin/users/${id}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u._id === id ? res.data : u))
      toast.success(`Role updated to ${newRole}`)
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role")
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Count */}
      <p style={{
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '0.55rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.25)',
      }}>{total} customer{total !== 1 ? "s" : ""}</p>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '10rem' }}>
          <div style={{
            width: '1.5rem', height: '1.5rem',
            border: '1.5px solid rgba(249,168,212,0.3)',
            borderTopColor: 'rgb(249,168,212)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <FiUsers style={{ fontSize: '1.75rem', color: 'rgba(0,0,0,0.1)', margin: '0 auto 0.75rem' }} />
          <p style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1rem',
            fontStyle: 'italic',
            color: 'rgba(0,0,0,0.25)',
          }}>No customers yet</p>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Joined</th>
                  <th style={{ ...thStyle, width: '7rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,168,212,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: u.role === 'admin' ? 'rgba(249,168,212,0.15)' : 'rgba(0,0,0,0.04)',
                        }}>
                          <span style={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            color: u.role === 'admin' ? 'rgb(219,39,119)' : 'rgba(0,0,0,0.4)',
                          }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span style={{
                          fontFamily: '"Cormorant Garamond", serif',
                          fontSize: '0.95rem',
                          color: '#191A23',
                        }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)' }}>{u.email}</td>
                    <td style={{ ...tdStyle, fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)' }}>{u.phone || "—"}</td>
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.45rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: u.role === 'admin' ? 'rgba(249,168,212,0.1)' : 'rgba(0,0,0,0.04)',
                        color: u.role === 'admin' ? 'rgb(219,39,119)' : 'rgba(0,0,0,0.4)',
                      }}>
                        {u.role === 'admin' ? <FiShield style={{ fontSize: '0.45rem' }} /> : <FiUser style={{ fontSize: '0.45rem' }} />}
                        {u.role}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '0.55rem', color: 'rgba(0,0,0,0.25)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleRoleChange(u._id, u.role === "admin" ? "user" : "admin")}
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontSize: '0.45rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          padding: '0.35rem 0.75rem',
                          border: u.role === 'admin' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(249,168,212,0.3)',
                          background: 'transparent',
                          color: u.role === 'admin' ? 'rgb(220,38,38)' : 'rgb(219,39,119)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
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
    </div>
  )
}

export default UsersTab
