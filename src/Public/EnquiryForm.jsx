import React, { useState } from "react";
import api from "../services/api";

const EnquiryForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    travel_date: "",
    from_city: "",
    to_city: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.from_city || !formData.to_city) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("enquiries/create/", formData);
      alert("✅ Enquiry submitted successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        phone: "",
        travel_date: "",
        from_city: "",
        to_city: "",
        notes: ""
      });
      if (onClose) onClose();
    } catch (error) {
      console.error("Enquiry submission error:", error);
      alert("❌ Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease-out",
    },
    modal: {
      background: "white",
      borderRadius: "16px",
      padding: "30px",
      maxWidth: "550px",
      width: "90%",
      maxHeight: "85vh",
      overflowY: "auto",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      animation: "slideUp 0.3s ease-out",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "transparent",
      border: "none",
      fontSize: "28px",
      cursor: "pointer",
      color: "#666",
      lineHeight: "1",
      padding: "5px 10px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1e3a5f",
      marginBottom: "10px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    subtitle: {
      fontSize: "14px",
      color: "#666",
      marginBottom: "16px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
    },
    required: {
      color: "#ff4444",
      marginLeft: "3px",
    },
    input: {
      padding: "12px 15px",
      fontSize: "15px",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s",
    },
    textarea: {
      padding: "12px 15px",
      fontSize: "15px",
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      outline: "none",
      transition: "border-color 0.3s",
      minHeight: "70px",
      fontFamily: "inherit",
      resize: "vertical",
    },
    row: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
    },
    submitBtn: {
      background: "linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)",
      color: "white",
      padding: "14px 30px",
      fontSize: "16px",
      fontWeight: "600",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginTop: "10px",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    submitBtnDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .enquiry-input:focus {
          border-color: #ff8c42 !important;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 140, 66, 0.3);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
      
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button style={styles.closeBtn} onClick={onClose}>
            ×
          </button>
          
          <h2 style={styles.title}>
            ✈️ Flight Enquiry
          </h2>
          <p style={styles.subtitle}>
            Fill in your details and we'll get back to you with the best flight options
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Your Name<span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
                className="enquiry-input"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Phone Number<span style={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                style={styles.input}
                className="enquiry-input"
                required
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Travel From<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="from_city"
                  value={formData.from_city}
                  onChange={handleChange}
                  placeholder="e.g., Dubai"
                  style={styles.input}
                  className="enquiry-input"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Travel To<span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="to_city"
                  value={formData.to_city}
                  onChange={handleChange}
                  placeholder="e.g., Calicut"
                  style={styles.input}
                  className="enquiry-input"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Preferred Travel Date
              </label>
              <input
                type="date"
                name="travel_date"
                value={formData.travel_date}
                onChange={handleChange}
                style={styles.input}
                className="enquiry-input"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requirements or preferences..."
                style={styles.textarea}
                className="enquiry-input"
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {})
              }}
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EnquiryForm;
