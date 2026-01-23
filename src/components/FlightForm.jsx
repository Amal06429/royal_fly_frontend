import React, { useState } from 'react';
import { Plane } from 'lucide-react';

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.departureCode || !formData.departureCity || 
        !formData.destinationCode || !formData.destinationCity ||
        !formData.departureDate || !formData.departureTime ||
        !formData.airline || !formData.price || !formData.seatAvailable) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate return date/time for Round Trip
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
      {/* Header */}
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

      {/* Form */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          
          {/* Trip Type & Flight Type */}
          <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
              <span>🎫</span> Trip & Flight Type
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {/* Trip Type */}
              <div>
                <label style={labelStyle}>Trip Type *</label>
                <select
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    cursor: 'pointer'
                  }}
                >
                  <option value="One Way">One Way</option>
                  <option value="Round Trip">Round Trip</option>
                </select>
              </div>

              {/* Flight Type */}
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

          {/* Route Details */}
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
                  style={inputStyle}
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
                  style={inputStyle}
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

          {/* Departure Schedule */}
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

          {/* Return Schedule (Optional) */}
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

          {/* Airline & Pricing */}
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
  placeholder="e.g., 8500" 
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

          {/* Buttons */}
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

export default FlightForm;