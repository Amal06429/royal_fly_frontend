import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

const ConfirmEnquiryModal = ({ isOpen, enquiry, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    route: "",
    travel_date: "",
    contact_no: "",
    message: "",
    fare_type: "",
    sale_price: "",
    pnr: "",
    profit: "",
    status: "pending",
  });

  useEffect(() => {
    if (enquiry) {
      setFormData({
        name: enquiry.name || "",
        date: enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString('en-GB') : "",
        route: `${enquiry.from_city?.toUpperCase() || ""} → ${enquiry.to_city?.toUpperCase() || ""}`,
        travel_date: enquiry.date || "",
        contact_no: enquiry.phone || "",
        message: enquiry.message || enquiry.notes || "",
        fare_type: enquiry.fare_type || "",
        sale_price: enquiry.sale_price || "",
        pnr: enquiry.pnr || "",
        profit: enquiry.profit || "",
        status: enquiry.status || "pending",
      });
    }
  }, [enquiry, isOpen]);

  const handleConfirm = async () => {
    if (!formData.travel_date) {
      alert("Please enter travel date");
      return;
    }

    try {
      // Update enquiry with all details
      await api.patch(`enquiries/${enquiry.id}/`, {
        status: formData.status,
        travel_date: formData.travel_date,
        fare_type: formData.fare_type,
        sale_price: formData.sale_price,
        pnr: formData.pnr,
        profit: formData.profit,
      });

      alert("Enquiry updated successfully! ✅");
      onConfirm && onConfirm();
      onClose();
    } catch (error) {
      console.error("Error updating enquiry:", error);
      alert("Failed to update enquiry. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
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
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        input:focus, select:focus, textarea:focus {
          outline: none !important;
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1) !important;
        }
        button:hover {
          transform: translateY(-2px);
        }
        [data-info-row]:last-child {
          border-bottom: none !important;
          padding-bottom: 0 !important;
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h3 style={styles.title}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
              </svg>
              Confirm Enquiry
            </h3>
            <button onClick={onClose} style={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>

        <div style={styles.content}>
          {/* Customer Info Section */}
          <div style={styles.customerInfoBox}>
            <h4 style={styles.customerInfoTitle}>Customer Information</h4>
            
            <div style={styles.infoRow} data-info-row>
              <span style={styles.infoLabel}>Customer Name</span>
              <span style={styles.infoValue}>{formData.name}</span>
            </div>

            <div style={styles.infoRow} data-info-row>
              <span style={styles.infoLabel}>Enquiry Date</span>
              <span style={styles.infoValue}>{formData.date}</span>
            </div>

            <div style={styles.infoRow} data-info-row>
              <span style={styles.infoLabel}>Route</span>
              <span style={styles.infoValue}>{formData.route}</span>
            </div>

            <div style={styles.infoRow} data-info-row>
              <span style={styles.infoLabel}>Contact Number</span>
              <span style={styles.infoValue}>{formData.contact_no}</span>
            </div>

            <div style={styles.infoRow} data-info-row>
              <span style={styles.infoLabel}>Message/Notes</span>
              <span style={styles.infoValue}>{formData.message || "N/A"}</span>
            </div>
          </div>

          <div style={styles.divider}></div>

          {/* Booking Details Section */}
          <div style={styles.sectionTitle}>Booking Details</div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Travel Date *</label>
            <input
              type="date"
              value={formData.travel_date}
              onChange={(e) => setFormData({...formData, travel_date: e.target.value})}
              style={styles.input}
            />
          </div>

          <div style={styles.twoColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Fare Type</label>
              <input
                type="text"
                value={formData.fare_type}
                onChange={(e) => setFormData({...formData, fare_type: e.target.value})}
                style={styles.input}
                placeholder="Enter fare type"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Sale Price</label>
              <input
                type="number"
                value={formData.sale_price}
                onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                style={styles.input}
                placeholder="0.00"
              />
            </div>
          </div>

          <div style={styles.twoColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>PNR</label>
              <input
                type="text"
                value={formData.pnr}
                onChange={(e) => setFormData({...formData, pnr: e.target.value})}
                style={styles.input}
                placeholder="Enter PNR"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Profit</label>
              <input
                type="number"
                value={formData.profit}
                onChange={(e) => setFormData({...formData, profit: e.target.value})}
                style={styles.input}
                placeholder="0.00"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              style={styles.input}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleConfirm} style={styles.confirmBtn}>
            ✓ Update Enquiry
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modal: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
    width: "90%",
    maxWidth: "620px",
    maxHeight: "90vh",
    overflow: "auto",
    animation: "slideUp 0.3s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
    background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    margin: 0,
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    padding: "6px",
    transition: "all 0.2s",
    hover: {
      background: "rgba(255,255,255,0.3)",
    }
  },
  content: {
    padding: "24px",
    background: "#fafbfc",
  },
  customerInfoBox: {
    background: "white",
    borderRadius: "12px",
    padding: "18px 20px",
    marginBottom: "20px",
    border: "1.5px solid #e5e7eb",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  customerInfoTitle: {
    margin: "0 0 16px 0",
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: "14px",
    borderBottom: "1px solid #f0f1f3",
    gap: "12px",
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    minWidth: "140px",
  },
  infoValue: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#1f2937",
    textAlign: "right",
    flex: 1,
    wordBreak: "break-word",
  },
  formGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "8px",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "all 0.2s",
    background: "white",
  },
  textarea: {
    minHeight: "80px",
    resize: "vertical",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  divider: {
    height: "2px",
    background: "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%)",
    margin: "24px 0",
  },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "16px",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  footer: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    padding: "20px 24px",
    borderTop: "1px solid #e5e7eb",
    background: "white",
  },
  cancelBtn: {
    padding: "10px 20px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    transition: "all 0.2s",
  },
  confirmBtn: {
    padding: "10px 24px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
  },
};

export default ConfirmEnquiryModal;
