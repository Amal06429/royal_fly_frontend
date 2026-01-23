import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        height: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout