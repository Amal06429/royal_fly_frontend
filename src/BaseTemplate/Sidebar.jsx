import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Plane, MessageSquare, CheckCircle, Users, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.is_admin || false

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'flight', label: 'Tickets', icon: Plane, path: '/flights' },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, path: '/enquiries' },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle, path: '/confirmed' },
    { id: 'visa', label: 'Visa', icon: FileText, path: '/visa' },
    ...(isAdmin ? [{ id: 'users', label: 'Users', icon: Users, path: '/users' }] : []),
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    navigate('/login')
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed');
      setCollapsed(saved === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem('sidebarCollapsed', String(next)); } catch (e) {}
      return next;
    });
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

      <div style={{ ...styles.sidebar, width: collapsed ? 80 : 260 }} className="sidebar-container">
      {/* LOGO */}
      <div style={{ ...styles.logo, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/logo.png"
            alt="Royal Fly"
            style={{
              height: collapsed ? 36 : 44,
              width: collapsed ? 36 : '140px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Collapse toggle - visible on desktop */}
        <button onClick={toggleCollapsed} style={{ ...styles.collapseBtn }} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* MENU */}
      <div style={{ ...styles.menu, alignItems: collapsed ? 'center' : 'stretch' }}>
        {menu.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

            return (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.active : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
                width: '100%'
              }}
            >
              <Icon size={18} /> {!collapsed && <span style={{ marginLeft: 10 }}>{item.label}</span>}
            </button>
          )
        })}
      </div>

      {/* LOGOUT */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: collapsed ? 'center' : 'stretch' }}>
        <button onClick={handleLogout} style={{ ...styles.logout, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <LogOut size={18} /> {!collapsed && 'Logout'}
        </button>
      </div>
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
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
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
  ,
  collapseBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'white',
    padding: 6,
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default Sidebar