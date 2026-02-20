import { useEffect, useState } from "react"
import api from "../services/api"

const Home = () => {
  const [flights, setFlights] = useState([])
  const [filteredFlights, setFilteredFlights] = useState([])
  const [tripType, setTripType] = useState("One Way")
  const [fromSearch, setFromSearch] = useState("")
  const [toSearch, setToSearch] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [dateSearch, setDateSearch] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1 Adult, Economy / Premium")
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [travelClass, setTravelClass] = useState("Economy / Premium Economy")
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showEnquireForm, setShowEnquireForm] = useState(false)

  // Form fields for enquiry
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  // Fetch flights from Django API instead of localStorage
  useEffect(() => {
    setIsLoaded(true)
    const fetchFlights = async () => {
      try {
        const response = await api.get('flights/')
        setFlights(response.data)
        setFilteredFlights(response.data)
      } catch (error) {
        console.error('Error fetching flights:', error)
        // Fallback to localStorage if API fails
        const localData = JSON.parse(localStorage.getItem("flights")) || []
        setFlights(localData)
        setFilteredFlights(localData)
      }
    }
    
    fetchFlights()
  }, [])

  const handleSearch = () => {
    let filtered = flights

    if (fromSearch) {
      filtered = filtered.filter(f => 
        f.departureCode?.toLowerCase().includes(fromSearch.toLowerCase()) ||
        f.departureCity?.toLowerCase().includes(fromSearch.toLowerCase())
      )
    }

    if (toSearch) {
      filtered = filtered.filter(f => 
        f.destinationCode?.toLowerCase().includes(toSearch.toLowerCase()) ||
        f.destinationCity?.toLowerCase().includes(toSearch.toLowerCase())
      )
    }

    if (dateSearch) {
      filtered = filtered.filter(f => f.departureDate === dateSearch)
    }

    setFilteredFlights(filtered)
  }

  const swapLocations = () => {
    const temp = fromSearch
    setFromSearch(toSearch)
    setToSearch(temp)
  }

  const updatePassengerDisplay = (newAdults, newChildren, newInfants, newClass) => {
    const total = newAdults + newChildren + newInfants
    const passengerText = total === 1 ? '1 Adult' : `${newAdults} Adult${newAdults > 1 ? 's' : ''}${newChildren > 0 ? `, ${newChildren} Child${newChildren > 1 ? 'ren' : ''}` : ''}${newInfants > 0 ? `, ${newInfants} Infant${newInfants > 1 ? 's' : ''}` : ''}`
    setPassengers(`${passengerText}, ${newClass}`)
  }

  const handlePassengerDone = () => {
    updatePassengerDisplay(adults, children, infants, travelClass)
    setShowPassengerDropdown(false)
  }

  const handleEnquireClick = (flight) => {
    setSelectedFlight(flight)
    setShowEnquireForm(true)
    // Reset form
    setName("")
    setPhone("")
    setEmail("")
    setMessage("")
  }

  const handleEnquireSubmit = async (e) => {
    e.preventDefault()

    const enquiry = {
      name,
      phone,
      email,
      message,
      from_city: selectedFlight.departureCity,
      to_city: selectedFlight.destinationCity
    }

    try {
      const response = await api.post('enquiries/create/', enquiry)
      alert("Enquiry sent successfully!")
      setShowEnquireForm(false)
      setSelectedFlight(null)
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      alert("Error submitting enquiry. Please try again.")
    }
  }

  const styles = {
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 }
    },
    '@keyframes slideDown': {
      from: { opacity: 0, transform: 'translateY(-30px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    '@keyframes slideUp': {
      from: { opacity: 0, transform: 'translateY(30px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    },
    '@keyframes scaleIn': {
      from: { opacity: 0, transform: 'scale(0.9)' },
      to: { opacity: 1, transform: 'scale(1)' }
    },
    container: {
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2d5f8d 0%, #1e3a5f 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    },
    heroSection: {
      textAlign: 'center',
      padding: '60px 20px 40px',
      color: 'white',
      animation: isLoaded ? 'fadeIn 0.8s ease-out' : 'none',
    },
    badge: {
      display: 'inline-block',
      background: 'rgba(255, 255, 255, 0.15)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      marginBottom: '30px',
      backdropFilter: 'blur(10px)',
      animation: isLoaded ? 'slideDown 0.6s ease-out' : 'none',
      animationDelay: '0.2s',
      animationFillMode: 'both',
    },
    mainTitle: {
      fontSize: '48px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '20px',
      color: 'white',
      animation: isLoaded ? 'slideDown 0.8s ease-out' : 'none',
      animationDelay: '0.4s',
      animationFillMode: 'both',
    },
    highlight: {
      color: '#ff8c42',
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0 20px 60px',
    },
    searchBox: {
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      maxWidth: '1200px',
      width: '100%',
      animation: isLoaded ? 'slideUp 0.8s ease-out' : 'none',
      animationDelay: '0.6s',
      animationFillMode: 'both',
    },
    searchRow: {
      display: 'flex',
      gap: '15px',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
    },
    searchField: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
      minWidth: '180px',
    },
    label: {
      fontSize: '11px',
      color: '#999',
      marginBottom: '8px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      padding: '14px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s',
    },
    select: {
      padding: '14px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s',
      background: 'white',
      cursor: 'pointer',
    },
    swapBtn: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: '#ff8c42',
      color: 'white',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      flexShrink: '0',
      alignSelf: 'flex-end',
      marginBottom: '0',
    },
    searchBtn: {
      background: '#ff8c42',
      color: 'white',
      padding: '14px 32px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      whiteSpace: 'nowrap',
      height: '48px',
    },
    flightsSection: {
      background: '#f5f7fa',
      padding: '60px 20px',
      minHeight: '400px',
      animation: isLoaded ? 'fadeIn 1s ease-out' : 'none',
      animationDelay: '0.8s',
      animationFillMode: 'both',
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '32px',
      color: '#1e3a5f',
      marginBottom: '40px',
      fontWeight: '700',
      animation: isLoaded ? 'slideDown 0.8s ease-out' : 'none',
      animationDelay: '1s',
      animationFillMode: 'both',
    },
    flightsGrid: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: '24px',
    },
    flightCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s',
      border: '1px solid #e0e0e0',
    },
    airlineBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: '#e8f4f8',
      color: '#1e3a5f',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '15px',
    },
    statusBadge: {
      background: '#d4f4dd',
      color: '#0a7029',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      marginLeft: 'auto',
    },
    flightRoute: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    cityCode: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e3a5f',
    },
    cityName: {
      fontSize: '12px',
      color: '#666',
      marginTop: '4px',
    },
    planeIcon: {
      fontSize: '20px',
      color: '#ff8c42',
    },
    flightDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '15px',
      marginBottom: '20px',
      paddingTop: '15px',
      borderTop: '1px solid #f0f0f0',
    },
    detailItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    detailLabel: {
      fontSize: '11px',
      color: '#999',
      textTransform: 'uppercase',
    },
    detailValue: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    priceSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '15px',
      borderTop: '1px solid #f0f0f0',
    },
    priceLabel: {
      fontSize: '12px',
      color: '#666',
    },
    price: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0a7029',
    },
    priceSubtext: {
      fontSize: '11px',
      color: '#999',
    },
    enquireBtn: {
      background: '#0a7029',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    noResults: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666',
      fontSize: '18px',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out',
    },
    modalCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      padding: '28px',
      maxWidth: '480px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      animation: 'scaleIn 0.3s ease-out',
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#FF6B35',
      margin: '0 0 16px 0',
      textAlign: 'center',
    },
    modalFlightRoute: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      padding: '14px',
      background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
      borderRadius: '10px',
    },
    modalAirportCode: {
      fontSize: '20px',
      fontWeight: '700',
      color: 'white',
      letterSpacing: '1.5px',
    },
    modalArrow: {
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
    formLabel: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#4a5568',
      marginLeft: '2px',
    },
    formInput: {
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
    cancelBtn: {
      background: '#e0e0e0',
      color: '#333',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      transition: 'all 0.3s ease',
    },
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(1.05); 
          }
        }
      `}</style>
      
      <div style={styles.container}>
        {/* Hero Section */}
        <div style={styles.heroSection}>
        <div style={styles.badge}>✈️ Best Tickets Enquiry</div>
        
        <h1 style={styles.mainTitle}>
          Flight Tickets<br />
          <span style={styles.highlight}>at Unbeatable Prices</span>
        </h1>
      </div>

      {/* Search Box */}
      <div style={styles.searchContainer}>
        <div style={styles.searchBox}>
          <div style={styles.searchRow}>
            <div style={styles.searchField}>
              <label style={styles.label}>TRIP TYPE</label>
              <select 
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                style={styles.select}
              >
                <option>One Way</option>
                <option>Round Trip</option>
              </select>
            </div>

            <div style={styles.searchField}>
              <label style={styles.label}>FROM</label>
              <input 
                type="text"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                style={styles.input}
              />
            </div>

            <button 
              style={styles.swapBtn} 
              onClick={swapLocations}
              onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(180deg)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
            >
              ⇄
            </button>

            <div style={styles.searchField}>
              <label style={styles.label}>TO</label>
              <input 
                type="text"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.searchField}>
              <label style={styles.label}>DEPART</label>
              <input 
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.searchField}>
              <label style={styles.label}>RETURN</label>
              <input 
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                style={{...styles.input, color: returnDate ? '#000' : '#999'}}
                disabled={tripType === "One Way"}
              />
            </div>

            <button 
              style={styles.searchBtn} 
              onClick={handleSearch}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#ff7a28'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ff8c42'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* Flight Results */}
      <div style={styles.flightsSection}>
        <h2 style={styles.sectionTitle}>Available Flights</h2>

        <div style={styles.flightsGrid}>
          {filteredFlights.map((f, index) => (
            <div 
              key={f.id}
              style={{
                ...styles.flightCard,
                animation: isLoaded ? 'slideUp 0.6s ease-out' : 'none',
                animationDelay: `${1.2 + index * 0.1}s`,
                animationFillMode: 'both',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={styles.airlineBadge}>
                  ✈️ {f.airline || 'Emirates'}
                </div>
                <div style={styles.statusBadge}>Confirmed</div>
              </div>

              <div style={styles.flightRoute}>
                <div>
                  <div style={styles.cityCode}>{f.departureCode}</div>
                  <div style={styles.cityName}>{f.departureCity || 'Dubai'}</div>
                </div>
                <div style={styles.planeIcon}>✈️</div>
                <div style={{textAlign: 'right'}}>
                  <div style={styles.cityCode}>{f.destinationCode}</div>
                  <div style={styles.cityName}>{f.destinationCity || 'London'}</div>
                </div>
              </div>

              <div style={styles.flightDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>🕐 Departure</span>
                  <span style={styles.detailValue}>{f.departureTime || '08:30'}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>📅 Date</span>
                  <span style={styles.detailValue}>{f.departureDate}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>👥 Seats</span>
                  <span style={styles.detailValue}>{f.seatAvailable} left</span>
                </div>
              </div>

              <div style={styles.priceSection}>
                <div>
                  <div style={styles.priceLabel}>Starting from</div>
                  <div style={styles.price}>
                    ₹ {f.price ? Number(f.price).toLocaleString("en-IN") : "—"}
                  </div>
                  <div style={styles.priceSubtext}>per person</div>
                </div>
                <button 
                  style={styles.enquireBtn} 
                  onClick={() => handleEnquireClick(f)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#085d1f'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#0a7029'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  💬 Enquire Now
                </button>
              </div>
            </div>
          ))}

          {filteredFlights.length === 0 && (
            <div style={styles.noResults}>
              No flights found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquireForm && selectedFlight && (
        <div style={styles.modal} onClick={() => setShowEnquireForm(false)}>
          <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Flight Enquiry</h2>
            
            <div style={styles.modalFlightRoute}>
              <span style={styles.modalAirportCode}>{selectedFlight.departureCode}</span>
              <span style={styles.modalArrow}>→</span>
              <span style={styles.modalAirportCode}>{selectedFlight.destinationCode}</span>
            </div>

            <form onSubmit={handleEnquireSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="name">Full Name</label>
                <input 
                  id="name"
                  type="text"
                  placeholder="Enter your name" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="phone">Phone Number</label>
                <input 
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="email">Email Address</label>
                <input 
                  id="email"
                  type="email"
                  placeholder="Enter your email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={styles.formInput}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="message">Message</label>
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

              <div style={{display: 'flex', gap: '10px'}}>
                <button type="submit" style={styles.submitBtn}>
                  Submit Enquiry
                </button>
                <button 
                  type="button" 
                  style={styles.cancelBtn}
                  onClick={() => setShowEnquireForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Home