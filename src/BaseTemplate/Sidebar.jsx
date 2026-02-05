import React from 'react'
import { LayoutDashboard, Plane, MessageSquare, Users, Settings, LogOut } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'flight', label: 'Tickets', icon: Plane, path: '/flights' },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, path: '/enquiries' },
    
  ]

  const handleLogout = () => {
    localStorage.removeItem('auth')
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div style={styles.sidebar}>
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
              onClick={() => navigate(item.path)}
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
  )
}

const styles = {
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