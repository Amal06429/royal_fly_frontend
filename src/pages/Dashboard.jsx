import React, { useState } from 'react';
import { Plane, LayoutDashboard, MessageSquare, Users, Settings, LogOut, Menu, X, Search, Bell, TrendingUp, ArrowRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileSidebarOpen(false);
  };

  const recentFlights = [
    { id: 'FL001', airline: 'Emirates', route: 'Dubai (DXB) â†’ London (LHR)', date: '2024-01-15 at 14:30' },
    { id: 'FL002', airline: 'Qatar Airways', route: 'Doha (DOH) â†’ New York (JFK)', date: '2024-01-15 at 18:45' },
    { id: 'FL003', airline: 'Singapore Airlines', route: 'Singapore (SIN) â†’ Tokyo (NRT)', date: '2024-01-16 at 09:15' },
    { id: 'FL004', airline: 'British Airways', route: 'London (LHR) â†’ Paris (CDG)', date: '2024-01-16 at 11:20' },
    { id: 'FL005', airline: 'Lufthansa', route: 'Frankfurt (FRA) â†’ Mumbai (BOM)', date: '2024-01-17 at 16:00' },
  ];

  const renderDashboard = () => (
    <div>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, Admin</h1>
          <p style={styles.welcomeSubtitle}>Here's what's happening with your travel operations today.</p>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.searchContainer}>
            <Search size={18} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search flights, enquiries..." 
              style={styles.searchInput}
            />
          </div>
          <button style={styles.notificationButton}>
            <Bell size={20} />
            <span style={styles.notificationBadge}>3</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Total Flights</span>
              <div style={{...styles.statIconBox, backgroundColor: '#1e3a8a'}}>
                <Plane size={24} color="white" />
              </div>
            </div>
            <div style={styles.statValue}>524</div>
            <div style={styles.statFooter}>
              <span style={styles.statSubtext}>This month</span>
              <span style={{...styles.statChange, color: '#10b981'}}>â†‘ 12%</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Active Enquiries</span>
              <div style={{...styles.statIconBox, backgroundColor: '#f97316'}}>
                <MessageSquare size={24} color="white" />
              </div>
            </div>
            <div style={styles.statValue}>89</div>
            <div style={styles.statFooter}>
              <span style={styles.statSubtext}>Pending response</span>
              <span style={{...styles.statChange, color: '#10b981'}}>â†‘ 8%</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Happy Customers</span>
              <div style={{...styles.statIconBox, backgroundColor: '#10b981'}}>
                <Users size={24} color="white" />
              </div>
            </div>
            <div style={styles.statValue}>2,145</div>
            <div style={styles.statFooter}>
              <span style={styles.statSubtext}>Total served</span>
              <span style={{...styles.statChange, color: '#10b981'}}>â†‘ 15%</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Revenue</span>
              <div style={{...styles.statIconBox, backgroundColor: '#f59e0b'}}>
                <TrendingUp size={24} color="white" />
              </div>
            </div>
            <div style={styles.statValue}>$125K</div>
            <div style={styles.statFooter}>
              <span style={styles.statSubtext}>This month</span>
              <span style={{...styles.statChange, color: '#10b981'}}>â†‘ 22%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Flights Section */}
      <div style={styles.recentFlightsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Flights</h2>
          <p style={styles.sectionSubtitle}>Manage and track all flight schedules</p>
        </div>

        <div style={styles.flightsTable}>
          <div style={styles.tableHeader}>
            <div style={styles.tableHeaderCell}>FLIGHT</div>
            <div style={{...styles.tableHeaderCell, flex: 2}}>ROUTE</div>
            <div style={styles.tableHeaderCell}>SCHEDULE</div>
          </div>

          {recentFlights.map((flight) => (
            <div key={flight.id} style={styles.flightRow}>
              <div style={styles.flightCell}>
                <div style={styles.flightIcon}>
                  <Plane size={20} color="#1e3a8a" />
                </div>
                <div>
                  <div style={styles.flightId}>{flight.id}</div>
                  <div style={styles.flightAirline}>{flight.airline}</div>
                </div>
              </div>
              <div style={{...styles.flightCell, flex: 2}}>
                <div style={styles.routeText}>{flight.route}</div>
              </div>
              <div style={styles.flightCell}>
                <div style={styles.scheduleContainer}>
                  <Clock size={16} color="#6b7280" />
                  <span style={styles.scheduleText}>{flight.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'flights':
        return (
          <div>
            <h1 style={styles.pageTitle}>Flights Management</h1>
            <div style={styles.contentCard}>
              <p style={styles.contentText}>View and manage all flight bookings and schedules.</p>
            </div>
          </div>
        );
      case 'enquiries':
        return (
          <div>
            <h1 style={styles.pageTitle}>Customer Enquiries</h1>
            <div style={styles.contentCard}>
              <p style={styles.contentText}>Manage customer queries and support requests.</p>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div>
            <h1 style={styles.pageTitle}>Customer Management</h1>
            <div style={styles.contentCard}>
              <p style={styles.contentText}>View and manage customer information and bookings.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h1 style={styles.pageTitle}>Settings</h1>
            <div style={styles.contentCard}>
              <p style={styles.contentText}>Configure your account and system preferences.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .mobile-hidden {
            display: none !important;
          }
        }
      `}</style>
      <div style={styles.container}>
        {/* Mobile Menu Button */}
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div style={{
          ...styles.sidebar,
          ...(isMobileSidebarOpen ? styles.sidebarOpen : {}),
        }}>
          {/* Logo Section */}
          <div style={styles.logoSection}>
            <div style={styles.logoBox}>
              <Plane size={24} color="white" />
            </div>
            <div style={styles.logoTextContainer}>
              <div style={styles.logoTitle}>Royal Fly</div>
              <div style={styles.logoSubtitle}>Travel Management</div>
            </div>
          </div>

          {/* Menu Items */}
          <nav style={styles.nav}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  style={{
                    ...styles.menuItem,
                    ...(isActive ? styles.menuItemActive : {}),
                  }}
                >
                  <Icon size={20} />
                  <span style={styles.menuLabel}>{item.label}</span>
                  {isActive && <ArrowRight size={18} style={styles.activeIndicator} />}
                </button>
              );
            })}
          </nav>

          {/* User Section */}
          <div style={styles.userSection}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>AD</div>
              <div style={styles.userDetails}>
                <div style={styles.userName}>Admin User</div>
                <div style={styles.userEmail}>admin@royalfly.com</div>
              </div>
            </div>
            <button style={styles.logoutButton}>
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileSidebarOpen && (
          <div 
            style={styles.mobileOverlay}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div style={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: '#f5f5f7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
  },
  mobileMenuButton: {
    display: 'none',
    position: 'fixed',
    top: '16px',
    left: '16px',
    zIndex: 1001,
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  sidebar: {
    width: '255px',
    backgroundColor: '#1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    boxShadow: '2px 0 12px rgba(0,0,0,0.08)',
    position: 'relative',
    zIndex: 1000,
    transition: 'transform 0.3s ease',
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px 24px 20px',
    marginBottom: '24px',
  },
  logoBox: {
    backgroundColor: '#f97316',
    padding: '10px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  logoTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    lineHeight: '1.2',
  },
  logoSubtitle: {
    color: '#bfdbfe',
    fontSize: '11px',
    lineHeight: '1.4',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '0 12px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: '#e0e7ff',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    position: 'relative',
    textAlign: 'left',
  },
  menuItemActive: {
    backgroundColor: '#f97316',
    color: 'white',
  },
  menuLabel: {
    flex: 1,
  },
  activeIndicator: {
    marginLeft: 'auto',
  },
  userSection: {
    padding: '0 12px',
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f97316',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
  },
  userEmail: {
    color: '#bfdbfe',
    fontSize: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#bfdbfe',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  mobileOverlay: {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  mainContent: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
    backgroundColor: '#f5f5f7',
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px',
  },
  welcomeSubtitle: {
    fontSize: '15px',
    color: '#6b7280',
    lineHeight: '1.5',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '10px',
    paddingBottom: '10px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    width: '280px',
    transition: 'all 0.2s',
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#f97316',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '10px',
    padding: '2px 6px',
    minWidth: '18px',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
  },
  statIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: '1',
  },
  statFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statSubtext: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  statChange: {
    fontSize: '13px',
    fontWeight: '600',
  },
  recentFlightsSection: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #e5e7eb',
  },
  sectionHeader: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  flightsTable: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    display: 'flex',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  flightRow: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  flightCell: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  flightIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: '#eff6ff',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  flightId: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1f2937',
  },
  flightAirline: {
    fontSize: '13px',
    color: '#6b7280',
  },
  routeText: {
    fontSize: '14px',
    color: '#374151',
  },
  scheduleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  scheduleText: {
    fontSize: '13px',
    color: '#6b7280',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '24px',
  },
  contentCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  contentText: {
    fontSize: '15px',
    color: '#6b7280',
  },
};

// Media queries for responsive design
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  if (mediaQuery.matches) {
    styles.mobileMenuButton.display = 'flex';
    styles.sidebar.position = 'fixed';
    styles.sidebar.top = '0';
    styles.sidebar.left = '0';
    styles.sidebar.height = '100vh';
    styles.sidebar.transform = 'translateX(-100%)';
    styles.sidebar.zIndex = '1000';
    styles.mobileOverlay.display = 'block';
    styles.mainContent.padding = '80px 16px 16px 16px';
    styles.searchInput.width = '180px';
  }
}

export default Dashboard;