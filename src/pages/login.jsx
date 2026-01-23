import React, { useState } from 'react'
import { Plane, Mail, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// ❌ DEMO PASSWORD REMOVED (kept variable name unused to avoid breaking anything)
const DEMO_PASSWORD = 'demo123'

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    const enteredEmail = email.trim().toLowerCase()
    const enteredPassword = password.trim()

    if (!enteredEmail || !enteredPassword) {
      alert('Please enter email and password')
      return
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login/',
        {
          email: enteredEmail,
          password: enteredPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const data = response.data

      // ✅ STORE JWT TOKENS
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)

      // optional user info
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: data.email,
          username: data.username
        })
      )

      // keep existing app auth flow
      onLogin({ email: enteredEmail, role: 'user' })
      navigate('/dashboard')

    } catch (error) {
      if (error.response) {
        alert(error.response.data.error || 'Invalid credentials')
      } else {
        alert('Backend server not reachable')
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.left}>
          <div>
            <div style={styles.brand}>
              <div style={styles.logoIcon}>
                <Plane size={28} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>Royal Fly Travels</h3>
                <p style={styles.subTitle}>Travel Management</p>
              </div>
            </div>

            <h1 style={styles.heading}>
              Manage Your Travel
              <br />
              <span style={styles.highlight}>Operations Seamlessly</span>
            </h1>

            <p style={styles.desc}>
              Track flights, manage customer enquiries, and stay connected with automated WhatsApp notifications—all in one powerful platform.
            </p>
          </div>

          <p style={styles.footer}>© 2024 Royal Fly Travels. All rights reserved.</p>
        </div>

        <div style={styles.right}>
          <div style={styles.loginBox}>
            <h2 style={{ marginBottom: 6, fontSize: 32, fontWeight: 'bold', color: '#1e293b' }}>Welcome back</h2>
            <p style={{ marginBottom: 32, color: '#64748b', fontSize: 16 }}>
              Sign in to your account to continue
            </p>

            <label style={styles.label}>Email address</label>
            <div style={styles.inputBox}>
              <Mail size={20} color="#94a3b8" />
              <input
                placeholder="amal@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
              />
            </div>

            <label style={styles.label}>Password</label>
            <div style={styles.inputBox}>
              <Lock size={20} color="#94a3b8" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
              />
            </div>

            <button style={styles.button} onClick={handleLogin}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    width: '100vw',
    height: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    margin: 0,
    padding: 0,
    overflow: 'hidden'
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    color: 'white',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  logoIcon: {
    background: '#f97316',
    padding: 16,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subTitle: {
    margin: 0,
    fontSize: 14,
    opacity: 0.9,
    fontWeight: 400
  },
  heading: {
    fontSize: 48,
    marginTop: 80,
    lineHeight: 1.2,
    fontWeight: 'bold'
  },
  highlight: {
    color: '#fb923c'
  },
  desc: {
    maxWidth: 480,
    marginTop: 24,
    lineHeight: 1.7,
    fontSize: 16,
    opacity: 0.95
  },
  footer: {
    fontSize: 14,
    opacity: 0.8
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8fafc',
    overflowY: 'auto'
  },
  loginBox: {
    width: 440,
    padding: 20
  },
  label: {
    fontSize: 15,
    marginBottom: 10,
    display: 'block',
    color: '#1e293b',
    fontWeight: 600
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: '2px solid #e2e8f0',
    padding: '14px 16px',
    borderRadius: 10,
    marginBottom: 20,
    background: '#f1f5f9'
  },
  input: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    flex: 1,
    fontSize: 15,
    color: '#1e293b'
  },
  button: {
    width: '100%',
    padding: 16,
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 16,
    transition: 'all 0.2s'
  }
}

export default LoginPage
