import React, { useState, useEffect } from 'react'
import { Plane, Mail, Lock, User, Shield } from 'lucide-react'



const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    boxSizing: 'border-box',
  },
  leftSection: {
    display: 'none',
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
    width: '100%',
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
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',

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
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user');
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 const handleSubmit = () => {
  console.log('Login attempt:', { email, password, loginType });

  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }

  // ✅ TELL APP THAT LOGIN SUCCEEDED
  onLogin();
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
        #root {
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div style={styles.container}>
        {/* Left Side - Blue Section */}
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

        {/* Right Side - Login Form */}
        <div style={{...styles.rightSection, width: isDesktop ? '50%' : '100%'}}>
          <div style={styles.formContainer}>
            {/* Mobile Logo */}
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
              {/* Email Field */}
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

              {/* Password Field */}
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
                  />
                </div>
              </div>

              {/* Login Type Selection */}
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

              {/* Sign In Button */}
              <button
                onClick={handleSubmit}
                onMouseEnter={() => setHoveredButton('signin')}
                onMouseLeave={() => setHoveredButton(null)}
                style={getSignInButtonStyle()}
              >
                Sign in
              </button>

              {/* Demo Credentials */}
              <div style={styles.demoCredentials}>
                Demo credentials: any email with password{' '}
                <span style={styles.demoPassword}>demo123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}