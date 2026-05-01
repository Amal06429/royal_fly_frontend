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
    label_name: "",
    status: "pending",
    label_colour: "",
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
        label_name: enquiry.label_name || "",
        status: enquiry.status || "pending",
        label_colour: enquiry.label_colour || "",
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
        label_name: formData.label_name,
        label_colour: formData.label_colour,
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
        .modal-close-btn:hover {
          background: rgba(255,255,255,0.3) !important;
          transform: scale(1.05) !important;
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
            <button onClick={onClose} style={styles.closeBtn} className="modal-close-btn">
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

            <div style={styles.infoRow} data-info-row>
              <span style={styles.infoLabel}>Created By</span>
              <span style={styles.infoValue}>
                {enquiry?.username || enquiry?.created_by || 'N/A'}
              </span>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>Label Name</label>
            <input
              type="text"
              value={formData.label_name}
              onChange={(e) => setFormData({...formData, label_name: e.target.value})}
              style={styles.input}
              placeholder="Enter label name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Label Colour</label>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center'}}>
              {[
                {name: 'Red', value: '#ef4444'},
                {name: 'Orange', value: '#f97316'},
                {name: 'Yellow', value: '#eab308'},
                {name: 'Green', value: '#10b981'},
                {name: 'Blue', value: '#3b82f6'},
                {name: 'Indigo', value: '#6366f1'},
                {name: 'Purple', value: '#a855f7'},
                {name: 'Pink', value: '#ec4899'},
                {name: 'Gray', value: '#6b7280'},
              ].map((color) => (
                <div
                  key={color.value}
                  onClick={() => setFormData({...formData, label_colour: formData.label_colour === color.value ? '' : color.value})}
                  style={{
                    ...styles.colorOption,
                    backgroundColor: color.value,
                    border: formData.label_colour === color.value ? '3px solid #000' : '2px solid #e5e7eb',
                    transform: formData.label_colour === color.value ? 'scale(1.1)' : 'scale(1)',
                  }}
                  title={color.name}
                />
              ))}
            </div>
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
    background: "rgba(255,255,255,0.25)",
    border: "none",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    transition: "all 0.2s",
    padding: "0",
    flexShrink: 0,
  },
  content: {
    padding: "24px",
  },
  customerInfoBox: {
    background: "#f9fafb",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
  },
  customerInfoTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
    marginTop: 0,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: "10px",
    marginBottom: "10px",
    borderBottom: "1px solid #e5e7eb",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: "13px",
    color: "#111827",
    fontWeight: "600",
    textAlign: "right",
  },
  divider: {
    height: "1px",
    background: "#e5e7eb",
    margin: "20px 0",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "16px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  twoColumn: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px 24px",
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  cancelBtn: {
    padding: "10px 20px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "white",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  confirmBtn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  colourBadge: {
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    minWidth: "60px",
    textAlign: "center",
  },
  colorOption: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default ConfirmEnquiryModal;
