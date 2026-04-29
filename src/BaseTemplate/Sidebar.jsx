import React, { useState } from 'react'
import { LayoutDashboard, Plane, MessageSquare, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.is_admin || false

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'flight', label: 'Tickets', icon: Plane, path: '/flights' },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, path: '/enquiries' },
    ...(isAdmin ? [{ id: 'users', label: 'Users', icon: Users, path: '/users' }] : []),
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleMenuClick = (path) => {
    navigate(path)
    setIsOpen(false) // Close mobile menu after navigation
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed !important;
            left: ${isOpen ? '0' : '-100%'} !important;
            width: 260px !important;
            z-index: 1000 !important;
            transition: left 0.3s ease !important;
          }
          .sidebar-overlay {
            display: ${isOpen ? 'block' : 'none'} !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0,0,0,0.5) !important;
            z-index: 999 !important;
          }
          .hamburger-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .hamburger-btn {
            display: none !important;
          }
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>

      {/* Overlay for mobile */}
      <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>

      {/* Hamburger Button - Only visible on mobile */}
      <button 
        className="hamburger-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={styles.hamburger}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div style={styles.sidebar} className="sidebar-container">
      {/* LOGO */}
      <div style={styles.logo}>Royal Fly</div>

      {/* MENU */}
      <div style={styles.menu}>
        {menu.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.active : {})
              }}
            >
              <Icon size={18} /> {item.label}
            </button>
          )
        })}
      </div>

      {/* LOGOUT */}
      <button onClick={handleLogout} style={styles.logout}>
        <LogOut size={18} /> Logout
      </button>
    </div>
    </>
  )
}

const styles = {
  hamburger: {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1001,
    background: '#183d68',
    color: 'white',
    border: 'none',
    padding: 12,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'none', // Shown via media query
    alignItems: 'center',
    justifyContent: 'center'
  },
  sidebar: {
    width: 260,
    height: '100vh',
    background: '#183d68',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    boxSizing: 'border-box'
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  menuItem: {
    background: 'transparent',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
    textAlign: 'left'
  },
  active: {
    background: '#f06400'
  },
  logout: {
    marginTop: 'auto',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: 12,
    display: 'flex',
    gap: 8,
    fontSize: 15
  }
}

export default Sidebar