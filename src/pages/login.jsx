import React, { useState } from 'react'
import { Plane, Mail, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

// demo constant kept (unused)
const DEMO_PASSWORD = 'demo123'

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // ✅ FIXED: form submit handler
  const handleLogin = async (e) => {
    e.preventDefault() // 🔥 PREVENTS GET /api/login

    const enteredEmail = email.trim().toLowerCase()
    const enteredPassword = password.trim()

    if (!enteredEmail || !enteredPassword) {
      alert('Please enter email and password')
      return
    }

    try {
      const response = await api.post('login/', {
        email: enteredEmail,
        password: enteredPassword
      })

      const data = response.data

      // store tokens
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

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body, html, #root {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>

      <div style={styles.container}>
        {/* LEFT PANEL */}
        <div style={styles.left}>
          <div>
            <div style={styles.brand}>
              <div style={styles.logoIcon}>
                <Plane size={28} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 24 }}>Royal Fly Travels</h3>
                <p style={styles.subTitle}>Travel Management</p>
              </div>
            </div>

            <h1 style={styles.heading}>
              Manage Your Travel
              <br />
              <span style={styles.highlight}>Operations Seamlessly</span>
            </h1>

            <p style={styles.desc}>
              Track flights, manage enquiries, and send automated WhatsApp
              notifications from one platform.
            </p>
          </div>

          <p style={styles.footer}>© 2024 Royal Fly Travels</p>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.right}>
          <div style={styles.loginBox}>
            <h2 style={styles.title}>Welcome back</h2>
            <p style={styles.subtitle}>Sign in to continue</p>

            {/* ✅ FIXED FORM */}
            <form onSubmit={handleLogin}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputBox}>
                <Mail size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                />
              </div>

              <label style={styles.label}>Password</label>
              <div style={styles.inputBox}>
                <Lock size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.button}>
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

const styles = {
  container: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    fontFamily: 'system-ui'
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
    color: 'white',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 16
  },
  logoIcon: {
    background: '#f97316',
    padding: 16,
    borderRadius: 12
  },
  subTitle: {
    fontSize: 14,
    opacity: 0.9
  },
  heading: {
    fontSize: 42,
    marginTop: 80
  },
  highlight: {
    color: '#fb923c'
  },
  desc: {
    marginTop: 20,
    maxWidth: 480
  },
  footer: {
    opacity: 0.8
  },
  right: {
    flex: 1,
    background: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBox: {
    width: 420
  },
  title: {
    fontSize: 32,
    marginBottom: 8
  },
  subtitle: {
    marginBottom: 30,
    color: '#64748b'
  },
  label: {
    fontWeight: 600,
    marginBottom: 6,
    display: 'block'
  },
  inputBox: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    border: '2px solid #e2e8f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  input: {
    border: 'none',
    outline: 'none',
    flex: 1
  },
  button: {
    width: '100%',
    padding: 14,
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    cursor: 'pointer'
  }
}

export default LoginPage