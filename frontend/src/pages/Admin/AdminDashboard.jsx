import { useEffect, useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import {
  FiPackage, FiShoppingCart, FiUsers, FiGrid,
  FiLogOut, FiTrendingUp
} from "react-icons/fi"

import OverviewTab from "./OverviewTab"
import ProductsTab from "./ProductsTab"
import OrdersTab from "./OrdersTab"
import UsersTab from "./UsersTab"

const TABS = [
  { key: "overview", label: "Overview", icon: FiTrendingUp },
  { key: "products", label: "Products", icon: FiPackage },
  { key: "orders", label: "Orders", icon: FiShoppingCart },
  { key: "users", label: "Users", icon: FiUsers },
]

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/")
    if (!user) navigate("/login")
  }, [user])

  if (!user || user.role !== "admin") return null

  return (
    <div style={{ minHeight: '100vh', background: '#FFF7FF', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{
        width: '15rem',
        background: '#191A23',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 40,
      }}>
        {/* Brand */}
        <div style={{
          padding: '1.75rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          <Link to="/" style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.5rem',
            fontWeight: 300,
            color: '#fff',
            letterSpacing: '0.08em',
            textDecoration: 'none',
          }}>
            Guntino <span style={{ color: 'rgb(249,168,212)' }}>Glam</span>
          </Link>
          <p style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.5rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.2)',
            marginTop: '0.35rem',
          }}>
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.7rem 1rem',
                  border: 'none',
                  borderRadius: '0',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === key ? 'rgba(249,168,212,0.12)' : 'transparent',
                  color: activeTab === key ? 'rgb(249,168,212)' : 'rgba(255,255,255,0.25)',
                  borderLeft: activeTab === key ? '2px solid rgb(249,168,212)' : '2px solid transparent',
                }}
              >
                <Icon style={{ fontSize: '0.85rem', flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom */}
        <div style={{
          padding: '1rem 0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 1rem',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
          >
            <FiGrid style={{ fontSize: '0.85rem' }} />
            View Site
          </Link>

          <button
            onClick={() => { logout(); navigate("/") }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 1rem',
              border: 'none',
              background: 'transparent',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
            }}
          >
            <FiLogOut style={{ fontSize: '0.85rem' }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: '15rem', flex: 1, minHeight: '100vh' }}>

        {/* Header */}
        <header style={{
          background: 'rgba(255,247,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          padding: '1.25rem 2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}>
          <div>
            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.75rem',
              fontWeight: 300,
              color: '#191A23',
              letterSpacing: '0.04em',
              textTransform: 'capitalize',
            }}>
              {activeTab}
            </h1>
            <p style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.55rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.25)',
              marginTop: '0.25rem',
            }}>
              Welcome back, {user.name}
            </p>
          </div>
        </header>

        <div style={{ padding: '2rem 2.5rem' }}>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "users" && <UsersTab />}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard