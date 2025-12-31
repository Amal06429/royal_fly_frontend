import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Plane, 
  MessageSquare, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Flights', icon: Plane },
    { name: 'Enquiries', icon: MessageSquare },
    { name: 'Customers', icon: Users },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <>
      <style>{`
        .sidebar-container {
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, #1e3a5f 0%, #0f1c2e 100%);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: white;
          position: relative;
        }

        .sidebar-header {
          padding: 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logo-icon {
          width: 45px;
          height: 45px;
          background: #ff6b35;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
        }

        .menu-container {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          margin-bottom: 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 15px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
          position: relative;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .menu-item.active {
          background: #ff6b35;
          color: white;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }

        .menu-item.active::after {
          content: '›';
          position: absolute;
          right: 16px;
          font-size: 20px;
          font-weight: bold;
        }

        .menu-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .user-section {
          padding: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ff6b35;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .user-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: white;
          line-height: 1.3;
        }

        .user-email {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .logout-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .logout-btn:hover {
          color: white;
        }

        /* Scrollbar styling */
        .menu-container::-webkit-scrollbar {
          width: 6px;
        }

        .menu-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .menu-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .menu-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>

      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Plane size={24} strokeWidth={2.5} color="white" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Royal Fly</span>
            {/* <span className="logo-subtitle">Travel Management</span> */}
          </div>
        </div>

        <div className="menu-container">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`menu-item ${activeItem === item.name ? 'active' : ''}`}
                onClick={() => setActiveItem(item.name)}
              >
                <Icon className="menu-icon" strokeWidth={2} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="user-section">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <div className="user-name">Admin User</div>
            <div className="user-email">admin@royalfly.com</div>
          </div>
          <button className="logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;