import React, { useState, useEffect } from "react"
import { Plus, Plane, Edit, Trash2, Calendar, Clock, Users, Search, ChevronLeft, ChevronRight } from "lucide-react"
import api from "../services/api";

// FlightForm Component (remains the same)
const FlightForm = ({ onSubmit, onBack, editData = null }) => {
  const [formData, setFormData] = useState(editData || {
    tripType: 'One Way',
    flightType: 'Domestic',
    departureCode: '',
    departureCity: '',
    destinationCode: '',
    destinationCity: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    airline: '',
    price: '',
    seatAvailable: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'departureCode' || name === 'destinationCode') {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!formData.departureCode || !formData.departureCity || 
        !formData.destinationCode || !formData.destinationCity ||
        !formData.departureDate || !formData.departureTime ||
        !formData.airline || !formData.price || !formData.seatAvailable) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.tripType === 'Round Trip') {
      if (!formData.returnDate || !formData.returnTime) {
        alert('Please fill in return date and time for Round Trip');
        return;
      }
    }
    
    onSubmit(formData);
  };

  const inputStyle = {
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    background: '#fff',
    transition: 'border-color 0.2s'  
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const sectionStyle = { 
    marginBottom: '32px',
    background: '#f9fafb',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  };

  const sectionTitleStyle = {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#1e3a5f',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '12px',
    borderBottom: '2px solid #ff8c42'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)' }}>
      <div style={{ background: '#fff', borderBottom: '2px solid #ff8c42', padding: '24px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ background: '#ff8c42', padding: '12px', borderRadius: '12px' }}>
              <Plane size={28} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', color: '#1e3a5f' }}>Add Flight Ticket</h1>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                Fill in the flight details to add to available tickets
              </p>
            </div>
          </div>
          <button 
            onClick={onBack} 
            style={{ 
              background: '#e5e7eb', 
              border: 'none', 
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#d1d5db'}
            onMouseOut={(e) => e.currentTarget.style.background = '#e5e7eb'}
          >
            ← Back
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>🎫</span> Trip & Flight Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              <div>
                <label style={labelStyle}>Trip Type *</label>
                <select
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="One Way">One Way</option>
                  <option value="Round Trip">Round Trip</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Flight Type *</label>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', height: '48px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px' }}>
                    <input
                      type="radio"
                      name="flightType"
                      value="Domestic"
                      checked={formData.flightType === 'Domestic'}
                      onChange={handleChange}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '500' }}>Domestic</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '15px' }}>
                    <input
                      type="radio"
                      name="flightType"
                      value="International"
                      checked={formData.flightType === 'International'}
                      onChange={handleChange}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontWeight: '500' }}>International</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>📍</span> Route Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>From Airport Code *</label>
                <input 
                  name="departureCode" 
                  value={formData.departureCode} 
                  onChange={handleChange} 
                  placeholder="e.g., DXB" 
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                  maxLength="3"
                />
              </div>
              <div>
                <label style={labelStyle}>From City *</label>
                <input 
                  name="departureCity" 
                  value={formData.departureCity} 
                  onChange={handleChange} 
                  placeholder="e.g., Dubai" 
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>To Airport Code *</label>
                <input 
                  name="destinationCode" 
                  value={formData.destinationCode} 
                  onChange={handleChange} 
                  placeholder="e.g., LHR" 
                  style={{ ...inputStyle, textTransform: 'uppercase' }}
                  maxLength="3"
                />
              </div>
              <div>
                <label style={labelStyle}>To City *</label>
                <input 
                  name="destinationCity" 
                  value={formData.destinationCity} 
                  onChange={handleChange} 
                  placeholder="e.g., London" 
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>📅</span> Departure Schedule
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Departure Date *</label>
                <input 
                  type="date" 
                  name="departureDate" 
                  value={formData.departureDate} 
                  onChange={handleChange} 
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Departure Time *</label>
                <input 
                  type="time" 
                  name="departureTime" 
                  value={formData.departureTime} 
                  onChange={handleChange} 
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>🔄</span> Return Schedule {formData.tripType === 'Round Trip' ? '(Required for Round Trip)' : '(Optional)'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>
                  Return Date {formData.tripType === 'Round Trip' ? '*' : ''}
                </label>
                <input 
                  type="date" 
                  name="returnDate" 
                  value={formData.returnDate} 
                  onChange={handleChange} 
                  style={{
                    ...inputStyle,
                    opacity: formData.tripType === 'One Way' ? 0.5 : 1
                  }}
                  disabled={formData.tripType === 'One Way'}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Return Time {formData.tripType === 'Round Trip' ? '*' : ''}
                </label>
                <input 
                  type="time" 
                  name="returnTime" 
                  value={formData.returnTime} 
                  onChange={handleChange} 
                  style={{
                    ...inputStyle,
                    opacity: formData.tripType === 'One Way' ? 0.5 : 1
                  }}
                  disabled={formData.tripType === 'One Way'}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>✈️</span> Airline & Pricing Details
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Airline Name *</label>
                <input 
                  name="airline" 
                  value={formData.airline} 
                  onChange={handleChange} 
                  placeholder="e.g., Emirates" 
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Price (₹ INR) *</label>
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="e.g., 2850" 
                  style={inputStyle}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label style={labelStyle}>Seats Available *</label>
                <input
                  type="number"
                  name="seatAvailable"
                  value={formData.seatAvailable}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  style={inputStyle}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '32px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
            <button 
              onClick={onBack} 
              style={{ 
                background: '#fff',
                color: '#374151',
                padding: '14px 32px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f3f4f6'
                e.currentTarget.style.borderColor = '#d1d5db'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              style={{ 
                background: '#ff8c42',
                color: '#fff',
                padding: '14px 32px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(255, 140, 66, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#ff7a28'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#ff8c42'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 140, 66, 0.3)'
              }}
            >
              {editData ? 'Update Ticket' : '✓ Add Ticket'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Main FlightManagement Component
const FlightManagement = () => {
  const [flights, setFlights] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    api.get("flights/")
      .then(res => setFlights(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      seatAvailable: Number(data.seatAvailable),
      returnDate: data.returnDate ? data.returnDate : null,
      returnTime: data.returnTime ? data.returnTime : null,
    };

    if (editIndex !== null) {
      const flightId = flights[editIndex].id;
      api.put(`flights/${flightId}/update/`, payload)
        .then(() => api.get("flights/"))
        .then(res => {
          setFlights(res.data);
          setShowForm(false);
          setEditIndex(null);
        })
        .catch(err => console.error("UPDATE ERROR:", err));
    } else {
      api.post("flights/", payload)
        .then(() => api.get("flights/"))
        .then(res => {
          setFlights(res.data);
          setShowForm(false);
        })
        .catch(err => console.error("CREATE ERROR:", err));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this flight ticket?")) {
      api.delete(`flights/${id}/`)
        .then(() => {
          setFlights(prev => prev.filter(f => f.id !== id));
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index)
    setShowForm(true)  
  }

  // Search filter logic
  const filteredFlights = flights.filter(flight => {
    const searchLower = search.toLowerCase();
    return (
      flight.departureCode.toLowerCase().includes(searchLower) ||
      flight.departureCity.toLowerCase().includes(searchLower) ||
      flight.destinationCode.toLowerCase().includes(searchLower) ||
      flight.destinationCity.toLowerCase().includes(searchLower) ||
      flight.airline.toLowerCase().includes(searchLower) ||
      flight.tripType.toLowerCase().includes(searchLower) ||
      flight.flightType.toLowerCase().includes(searchLower) ||
      flight.price.toString().includes(search) ||
      flight.seatAvailable.toString().includes(search)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFlights = filteredFlights.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (showForm) {
    return (
      <FlightForm
        onSubmit={handleSubmit}
        onBack={() => {
          setShowForm(false)
          setEditIndex(null)
        }}
        editData={editIndex !== null ? flights[editIndex] : null}
      />
    )
  }
 
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f9fafb 0%, #e5e7eb 100%)" }}>
      <div style={{ background: "#fff", borderBottom: "2px solid #ff8c42", padding: "24px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ background: "#ff8c42", padding: "12px", borderRadius: "12px" }}>
              <Plane size={28} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", color: "#1e3a5f" }}>Flight Tickets</h1>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280" }}>
                Manage all available flight tickets
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search flights..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                style={{
                  padding: "10px 16px 10px 40px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                  width: "250px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#ff8c42"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              />
              <Search 
                size={18} 
                color="#6b7280" 
                style={{ 
                  position: "absolute", 
                  left: "12px", 
                  top: "50%", 
                  transform: "translateY(-50%)" 
                }} 
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#ff8c42",
                color: "#fff",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(255, 140, 66, 0.3)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#ff7a28"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 140, 66, 0.4)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#ff8c42"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(255, 140, 66, 0.3)"
              }}
            >
              <Plus size={18} /> Add Tickets
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        {flights.length === 0 ? (
          <div style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "64px 32px",
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>✈️</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", color: "#1e3a5f" }}>No Flight Tickets Yet</h3>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>Click "Add New Ticket" to create your first flight ticket</p>
          </div>
        ) : (
          <>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", 
              gap: "20px",
              marginBottom: "32px"
            }}>
              {paginatedFlights.map((flight, index) => (
                <div
                  key={index}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "18px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    transition: "all 0.3s",
                    border: "2px solid transparent"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"
                    e.currentTarget.style.borderColor = "#ff8c42"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{
                        background: "#ff8c42",
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600"
                      }}>
                        {flight.tripType}
                      </span>
                      <span style={{
                        background: "#e5e7eb",
                        color: "#374151",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600"
                      }}>
                        {flight.flightType}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Edit
                        size={18}
                        style={{ cursor: "pointer", color: "#6b7280", transition: "color 0.2s" }}
                        onClick={() => handleEdit(index)}
                        onMouseOver={(e) => e.currentTarget.style.color = "#ff8c42"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
                      />
                      <Trash2
                        size={18}
                        style={{ cursor: "pointer", color: "#6b7280", transition: "color 0.2s" }}
                        onClick={() => handleDelete(flight.id)}
                        onMouseOver={(e) => e.currentTarget.style.color = "#ef4444"}
                        onMouseOut={(e) => e.currentTarget.style.color = "#6b7280"}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "20px", fontWeight: "700", color: "#1e3a5f", marginBottom: "2px" }}>
                          {flight.departureCode}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>
                          {flight.departureCity}
                        </div>
                      </div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 10px" }}>
                        <div style={{ height: "2px", background: "#e5e7eb", flex: 1 }}></div>
                        <Plane size={16} color="#ff8c42" style={{ margin: "0 6px", transform: "rotate(90deg)" }} />
                        <div style={{ height: "2px", background: "#e5e7eb", flex: 1 }}></div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "20px", fontWeight: "700", color: "#1e3a5f", marginBottom: "2px" }}>
                          {flight.destinationCode}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: "500" }}>
                          {flight.destinationCity}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    background: "#f9fafb",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{ fontSize: "16px" }}>✈️</span>
                    <span style={{ fontWeight: "600", color: "#1e3a5f", fontSize: "14px" }}>
                      {flight.airline}
                    </span>
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "10px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Departure
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} color="#ff8c42" />
                        <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                          {flight.departureDate}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={14} color="#ff8c42" />
                        <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                          {flight.departureTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {flight.tripType === "Round Trip" && flight.returnDate && (
                    <div style={{ marginBottom: "10px" }}>
                      <div style={{ fontSize: "10px", fontWeight: "600", color: "#6b7280", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Return
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={14} color="#ff8c42" />
                          <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                            {flight.returnDate}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Clock size={14} color="#ff8c42" />
                          <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                            {flight.returnTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e5e7eb"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ background: "#dcfce7", padding: "6px", borderRadius: "6px", fontSize: "16px" }}>
                        ₹
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>PRICE</div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#16a34a" }}>
                          ₹ {flight.price}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ background: "#dbeafe", padding: "6px", borderRadius: "6px" }}>
                        <Users size={16} color="#2563eb" />
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>SEATS</div>
                        <div style={{ fontSize: "16px", fontWeight: "700", color: "#2563eb" }}>
                          {flight.seatAvailable}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filteredFlights.length > itemsPerPage && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "32px",
                padding: "16px",
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e5e7eb",
                    background: currentPage === 1 ? "#f3f4f6" : "#fff",
                    color: currentPage === 1 ? "#9ca3af" : "#374151",
                    borderRadius: "6px",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px"
                  }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                
                <div style={{ display: "flex", gap: "4px" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        padding: "8px 12px",
                        border: currentPage === page ? "1px solid #ff8c42" : "1px solid #e5e7eb",
                        background: currentPage === page ? "#ff8c42" : "#fff",
                        color: currentPage === page ? "#fff" : "#374151",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: currentPage === page ? "600" : "400",
                        fontSize: "14px",
                        minWidth: "40px"
                      }}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e5e7eb",
                    background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                    color: currentPage === totalPages ? "#9ca3af" : "#374151",
                    borderRadius: "6px",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px"
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
                
                <div style={{ marginLeft: "16px", fontSize: "14px", color: "#6b7280" }}>
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFlights.length)} of {filteredFlights.length} flights
                </div>
              </div>
            )}
          </>
        )}  
      </div>
    </div>
  )
}

export default FlightManagement