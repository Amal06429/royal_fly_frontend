import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "../services/api"

const Enquire = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [flight, setFlight] = useState(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const flights = JSON.parse(localStorage.getItem("flights")) || []
    setFlight(flights[id])
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Prepare data matching backend serializer expectations
   const enquiry = {
  name,
  phone,
  email,
  message,
  from_city: flight.departureCity,
  to_city: flight.destinationCity,
}


    try {
      const response = await api.post('enquiries/create/', enquiry)
      console.log('Success:', response.data)
      alert("Enquiry sent successfully")
      navigate("/")
    } catch (error) {
      console.error('Network error:', error)
      alert("Network error. Please check if the backend is running.")
    }
  }

  if (!flight) return <div style={styles.loading}>Loading...</div>

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Flight Enquiry</h2>
        
        <div style={styles.flightRoute}>
          <span style={styles.airportCode}>{flight.departureCode}</span>
          <span style={styles.arrow}>→</span>
          <span style={styles.airportCode}>{flight.destinationCode}</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Full Name</label>
            <input 
              id="name"
              type="text"
              placeholder="Enter your name" 
              value={name}
              onChange={e => setName(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="phone">Phone Number</label>
            <input 
              id="phone"
              type="tel"
              placeholder="Enter your phone number" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email"
              placeholder="Enter your email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="message">Message</label>
            <textarea 
              id="message"
              placeholder="Enter your enquiry details" 
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows="4"
              style={styles.textarea}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, rgb(235, 186, 155) 0%, rgb(230, 144, 113) 100%)',
    padding: '30px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(255, 250, 249, 0.3)',
    padding: '28px',
    maxWidth: '480px',
    width: '100%',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#FF6B35',
    margin: '0 0 16px 0',
    textAlign: 'center',
  },
  flightRoute: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    padding: '14px',
    background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
    borderRadius: '10px',
  },
  airportCode: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    letterSpacing: '1.5px',
  },
  arrow: {
    fontSize: '20px',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4a5568',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #FFE5D9',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: '#FFF8F5',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    border: '2px solid #FFE5D9',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    background: '#FFF8F5',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    minHeight: '90px',
    boxSizing: 'border-box',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'all 0.3s ease',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#FF6B35',
    fontWeight: '600',
  }
}

export default Enquire