import React, { useState } from 'react';
import { 
  Plane, 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings,
  LogOut,
  Mail,
  Lock,
  User,
  Shield,
  Search,
  Bell,
  TrendingUp,
  Clock,
  Menu,
  X
} from 'lucide-react';

// Sidebar Component
const Sidebar = ({ activeSection, onSectionChange, onLogout }) => {
  const menuItems = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Flights', id: 'flights', icon: Plane },
    { name: 'Enquiries', id: 'enquiries', icon: MessageSquare },
    { name: 'Customers', id: 'customers', icon: Users },
    { name: 'Settings', id: 'settings', icon: Settings }
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

        @media (max-width: 768px) {
          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .sidebar-container.open {
            transform: translateX(0);
          }
        }
      `}</style>

      <div className="sidebar-container">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Plane size={24} strokeWidth={2.5} color="white" />
          </div>
          <div className="logo-text">
            <span className="logo-title">Royal Fly</span>
          </div>
        </div>

        <div className="menu-container">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
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
          <button className="logout-btn" title="Logout" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </>
  );
};

// Login Component
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user');
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    if (password === 'demo123') {
      onLogin();
    } else {
      alert('Invalid credentials. Use password: demo123');
    }
  };

  const getInputStyle = (inputName) => ({
    ...styles.input,
    ...(focusedInput === inputName ? {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    } : {}),
  });

  const getLoginTypeButtonStyle = (type) => ({
    ...styles.loginTypeButton,
    ...(loginType === type ? {
      border: '2px solid #f97316',
      backgroundColor: '#fff7ed',
      color: '#ea580c',
    } : {}),
    ...(hoveredButton === type && loginType !== type ? {
      borderColor: '#9ca3af',
    } : {}),
  });

  const getSignInButtonStyle = () => ({
    ...styles.signInButton,
    ...(hoveredButton === 'signin' ? {
      backgroundColor: '#1e40af',
    } : {}),
  });

  return (
    <div style={styles.container}>
      {isDesktop && (
        <div style={{...styles.leftSection, display: 'flex', width: '50%'}}>
          <div>
            <div style={styles.logoContainer}>
              <div style={styles.logoBox}>
                <Plane size={32} />
              </div>
              <div>
                <h1 style={styles.logoText}>Royal Fly Travels</h1>
                <p style={styles.logoSubtext}>Travel Management System</p>
              </div>
            </div>

            <div style={styles.headingContainer}>
              <h2 style={styles.mainHeading}>Manage Your Travel</h2>
              <h2 style={styles.mainHeadingOrange}>Operations Seamlessly</h2>
            </div>

            <p style={styles.description}>
              Track flights, manage customer enquiries, and stay connected with automated WhatsApp notifications—all in one powerful platform.
            </p>
          </div>

          <div>
            <div style={styles.statsContainer}>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Flights Managed</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>2000+</div>
                <div style={styles.statLabel}>Happy Customers</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>99%</div>
                <div style={styles.statLabel}>Satisfaction Rate</div>
              </div>
            </div>

            <div style={styles.footer}>© 2024 Royal Fly Travels. All rights reserved.</div>
          </div>
        </div>
      )}

      <div style={{...styles.rightSection, width: isDesktop ? '50%' : '100%'}}>
        <div style={styles.formContainer}>
          {!isDesktop && (
            <div style={styles.mobileLogoContainer}>
              <div style={styles.mobileLogoBox}>
                <Plane size={24} />
              </div>
              <div>
                <h1 style={styles.mobileLogoText}>Royal Fly Travels</h1>
                <p style={styles.mobileLogoSubtext}>Travel Management System</p>
              </div>
            </div>
          )}

          <div style={styles.welcomeContainer}>
            <h2 style={styles.welcomeHeading}>Welcome back</h2>
            <p style={styles.welcomeSubtext}>Sign in to your account to continue</p>
          </div>

          <div style={styles.formFieldsContainer}>
            <div style={styles.fieldContainer}>
              <label htmlFor="email" style={styles.label}>Email address</label>
              <div style={styles.inputWrapper}>
                <Mail size={20} style={styles.icon} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="you@example.com"
                  style={getInputStyle('email')}
                />
              </div>
            </div>

            <div style={styles.fieldContainer}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={20} style={styles.icon} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  placeholder="Enter your password"
                  style={getInputStyle('password')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            <div style={styles.loginTypeContainer}>
              <label style={styles.label}>Login as</label>
              <div style={styles.loginTypeGrid}>
                <button
                  onClick={() => setLoginType('user')}
                  onMouseEnter={() => setHoveredButton('user')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={getLoginTypeButtonStyle('user')}
                >
                  <User size={20} />
                  User
                </button>
                <button
                  onClick={() => setLoginType('admin')}
                  onMouseEnter={() => setHoveredButton('admin')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={getLoginTypeButtonStyle('admin')}
                >
                  <Shield size={20} />
                  Admin
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              onMouseEnter={() => setHoveredButton('signin')}
              onMouseLeave={() => setHoveredButton(null)}
              style={getSignInButtonStyle()}
            >
              Sign in
            </button>

            <div style={styles.demoCredentials}>
              Demo credentials: any email with password{' '}
              <span style={styles.demoPassword}>demo123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const recentFlights = [
    { id: 'FL001', airline: 'Emirates', route: 'Dubai (DXB) → London (LHR)', date: '2024-01-15 at 14:30' },
    { id: 'FL002', airline: 'Qatar Airways', route: 'Doha (DOH) → New York (JFK)', date: '2024-01-15 at 18:45' },
    { id: 'FL003', airline: 'Singapore Airlines', route: 'Singapore (SIN) → Tokyo (NRT)', date: '2024-01-16 at 09:15' },
    { id: 'FL004', airline: 'British Airways', route: 'London (LHR) → Paris (CDG)', date: '2024-01-16 at 11:20' },
    { id: 'FL005', airline: 'Lufthansa', route: 'Frankfurt (FRA) → Mumbai (BOM)', date: '2024-01-17 at 16:00' },
  ];

  const renderDashboard = () => (
    <div>
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

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Total Flights</span>
              <div style={{...styles.statIconBox, backgroundColor: '#1e3a5f'}}>
                <Plane size={24} color="white" />
              </div>
            </div>
            <div style={styles.statValue}>524</div>
            <div style={styles.statFooter}>
              <span style={styles.statSubtext}>This month</span>
              <span style={{...styles.statChange, color: '#10b981'}}>↑ 12%</span>
            </div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statHeader}>
              <span style={styles.statLabel}>Active Enquiries</span>
              <div style={{...styles.statIconBox, backgroundColor: '#ff6b35'}}>
                <MessageSquare size={24} color="white" />
              </div>
            </div>
            <div style={styles.statValue}>89</div>
            <div style={styles.statFooter}>
              <span style={styles.statSubtext}>Pending response</span>
              <span style={{...styles.statChange, color: '#10b981'}}>↑ 8%</span>
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
              <span style={{...styles.statChange, color: '#10b981'}}>↑ 15%</span>
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
              <span style={{...styles.statChange, color: '#10b981'}}>↑ 22%</span>
            </div>
          </div>
        </div>
      </div>

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
                  <Plane size={20} color="#1e3a5f" />
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
      `}</style>
      <div style={styles.dashboardContainer}>
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div style={{position: 'relative'}}>
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              setIsMobileSidebarOpen(false);
            }}
            onLogout={onLogout}
          />
          {isMobileSidebarOpen && (
            <div 
              style={styles.mobileOverlay}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </div>

        <div style={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      `}</style>
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} />
      ) : (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </>
  );
};

const styles = {
  // Login Styles
  container: {
    display: 'flex',
    minHeight: '100vh',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  leftSection: {
    background: 'linear-gradient(to bottom right, #1e3a8a, #1e40af, #1e3a8a)',
    color: 'white',
    padding: '48px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '64px',
  },
  logoBox: {
    backgroundColor: '#f97316',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  logoSubtext: {
    color: '#bfdbfe',
    fontSize: '14px',
    margin: 0,
  },
  headingContainer: {
    marginBottom: '48px',
  },
  mainHeading: {
    fontSize: '48px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    margin: '0 0 16px 0',
  },
  mainHeadingOrange: {
    fontSize: '48px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    color: '#fb923c',
    margin: 0,
  },
  description: {
    color: '#dbeafe',
    fontSize: '18px',
    maxWidth: '450px',
    lineHeight: '1.6',
  },
  statsContainer: {
    display: 'flex',
    gap: '48px',
    flexWrap: 'wrap',
  },
  statBox: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#fb923c',
  },
  statLabel: {
    color: '#bfdbfe',
    marginTop: '4px',
    fontSize: '14px',
  },
  footer: {
    color: '#93c5fd',
    fontSize: '14px',
    marginTop: '24px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    backgroundColor: '#f9fafb',
    overflowY: 'auto',
  },
  formContainer: {
    width: '100%',
    maxWidth: '448px',
  },
  mobileLogoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  mobileLogoBox: {
    backgroundColor: '#f97316',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
  },
  mobileLogoSubtext: {
    color: '#6b7280',
    fontSize: '12px',
    margin: 0,
  },
  welcomeContainer: {
    marginBottom: '32px',
  },
  welcomeHeading: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '8px',
    margin: 0,
  },
  welcomeSubtext: {
    color: '#4b5563',
    fontSize: '14px',
    margin: 0,
  },
  formFieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  inputWrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
    backgroundColor: 'white',
  },
  loginTypeContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  loginTypeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  loginTypeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '2px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '15px',
  },
  signInButton: {
    width: '100%',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  demoCredentials: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
  },
  demoPassword: {
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#111827',
  },

  // Dashboard Styles
  dashboardContainer: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: '#f5f5f7',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  mobileMenuButton: {
    display: 'none',
    position: 'fixed',
    top: '16px',
    left: '16px',
    zIndex: 1001,
    backgroundColor: '#1e3a5f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
    backgroundColor: '#ff6b35',
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

// Add media query styles
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(max-width: 768px)');
  
  if (mediaQuery.matches) {
    styles.mobileMenuButton.display = 'flex';
    styles.mobileOverlay.display = 'block';
    styles.mainContent.padding = '80px 16px 16px 16px';
    styles.searchInput.width = '180px';
  }
}

export default App;