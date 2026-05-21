import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import api from "../services/api";

const DEFAULT_LABEL_COLOR = "#10b981";
const CANCEL_LABEL_COLOR = "#ef4444";
const RESERVED_LABEL_COLORS = {
  confirm: DEFAULT_LABEL_COLOR,
  cancel: CANCEL_LABEL_COLOR,
};

const createLabel = (name = "", color = "#6b7280") => ({
  id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
  name,
  color,
});

const parseStoredLabels = (labelName, labelColour) => {
  if (!labelName) {
    return [createLabel("", labelColour || DEFAULT_LABEL_COLOR)];
  }

  try {
    const parsed = JSON.parse(labelName);
    if (Array.isArray(parsed)) {
      const labels = parsed
        .map((item) => createLabel(item?.name || "", item?.color || labelColour || DEFAULT_LABEL_COLOR))
        .filter((item) => item.name || item.color);

      if (labels.length) {
        return labels;
      }
    }
  } catch (error) {
    // Fall back to the delimited storage format below.
  }

  const names = labelName.split(";").map((item) => item.trim()).filter(Boolean);
  const colors = (labelColour || "").split(";").map((item) => item.trim()).filter(Boolean);

  if (!names.length) {
    return [createLabel("", colors[0] || DEFAULT_LABEL_COLOR)];
  }

  return names.map((name, index) => createLabel(name, colors[index] || colors[0] || DEFAULT_LABEL_COLOR));
};

const serializeLabels = (labels) => {
  const validLabels = (labels || [])
    .filter((label) => label && String(label.name).trim())
    .map((label) => ({
      name: String(label.name || "").trim(),
      color: String(label.color || "#6b7280").trim(),
    }));

  return {
    label_name: validLabels.map((label) => label.name).join(";") || "",
    label_colour: validLabels.map((label) => label.color).join(";") || "",
  };
};

const getLabelColor = (name, currentColor) => {
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName === "confirm") {
    return RESERVED_LABEL_COLORS.confirm;
  }

  if (normalizedName === "cancel") {
    return RESERVED_LABEL_COLORS.cancel;
  }

  return currentColor || DEFAULT_LABEL_COLOR;
};

const darkenHexColor = (hexColor, amount = 0.18) => {
  if (!hexColor || typeof hexColor !== "string") {
    return "#4b5563";
  }

  const hex = hexColor.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return hexColor;
  }

  const clamp = (value) => Math.max(0, Math.min(255, value));
  const factor = 1 - amount;
  const r = clamp(Math.round(parseInt(hex.slice(0, 2), 16) * factor));
  const g = clamp(Math.round(parseInt(hex.slice(2, 4), 16) * factor));
  const b = clamp(Math.round(parseInt(hex.slice(4, 6), 16) * factor));

  const toHex = (value) => value.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const normalizeLabelName = (name = "") => String(name).trim().toLowerCase();

const mergeUniqueLabels = (baseLabels = [], incomingLabels = []) => {
  const merged = [];
  const seen = new Set();

  [...baseLabels, ...incomingLabels].forEach((label) => {
    if (!label || !String(label.name || "").trim()) {
      return;
    }

    const normalized = normalizeLabelName(label.name);
    if (seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    merged.push(createLabel(String(label.name).trim(), label.color || "#6b7280"));
  });

  return merged;
};

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
    credit_amount: "",
    credit_note: "",
    status: "pending",
  });
  const [customLabels, setCustomLabels] = useState([]);
  const [selectedBuiltIn, setSelectedBuiltIn] = useState({
    confirm: false,
    cancel: false,
  });
  const [selectedCustom, setSelectedCustom] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newCustomLabel, setNewCustomLabel] = useState({ name: "", color: "#6b7280" });
  const [labelsHydrated, setLabelsHydrated] = useState(false);

  // Load saved custom labels from localStorage on mount
  useEffect(() => {
    try {
      const savedLabels = localStorage.getItem("customEnquiryLabels");
      if (savedLabels) {
        setCustomLabels(JSON.parse(savedLabels));
      }
    } catch (err) {
      console.error("Error loading custom labels:", err);
    } finally {
      setLabelsHydrated(true);
    }
  }, []);

  // Save custom labels to localStorage whenever they change
  useEffect(() => {
    if (!labelsHydrated) {
      return;
    }

    try {
      localStorage.setItem("customEnquiryLabels", JSON.stringify(customLabels));
    } catch (err) {
      console.error("Error saving custom labels:", err);
    }
  }, [customLabels, labelsHydrated]);

  useEffect(() => {
    if (enquiry) {
      const enquiryLabels = parseStoredLabels(enquiry.label_name, enquiry.label_colour);
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
        credit_amount: enquiry.credit_amount || "",
        credit_note: enquiry.credit_note || "",
        status: enquiry.status || "pending",
      });
      try {
        // Check which built-in labels exist in the stored labels
        const hasConfirm = (enquiryLabels || []).some((label) => label && label.name && label.name.trim().toLowerCase() === "confirm");
        const hasCancel = (enquiryLabels || []).some((label) => label && label.name && label.name.trim().toLowerCase() === "cancel");
        
        // Update selectedBuiltIn based on what's stored
        setSelectedBuiltIn({
          confirm: hasConfirm,
          cancel: hasCancel,
        });
        
        // Merge enquiry custom labels into reusable localStorage label options.
        const custom = (enquiryLabels || []).filter((label) => label && label.name && !["confirm", "cancel"].includes(normalizeLabelName(label.name)));
        setCustomLabels((current) => mergeUniqueLabels(current, custom || []));
        
        // Find which custom label is selected (only one allowed)
        const selectedLabel = custom && custom.length > 0 ? custom[0].name : null;
        setSelectedCustom(selectedLabel);
      } catch (err) {
        console.error("Error processing custom labels:", err);
        setSelectedBuiltIn({ confirm: false, cancel: false });
        setSelectedCustom(null);
      }
    }
  }, [enquiry, isOpen]);

  const handleToggleBuiltIn = (label) => {
    setSelectedBuiltIn((prev) => {
      const newState = { ...prev, [label]: !prev[label] };
      // If selecting built-in, deselect custom label
      if (newState[label]) {
        setSelectedCustom(null);
      }
      return newState;
    });
  };

  const handleSelectCustomLabel = (labelName) => {
    // Toggle selection of custom label
    if (selectedCustom === labelName) {
      setSelectedCustom(null);
    } else {
      // Deselect all built-in labels when selecting custom
      setSelectedBuiltIn({ confirm: false, cancel: false });
      setSelectedCustom(labelName);
    }
  };

  const addCustomLabel = () => {
    setShowCustomForm(true);
    setNewCustomLabel({ name: "", color: "#6b7280" });
  };

  const submitCustomLabel = () => {
    const trimmedName = newCustomLabel.name.trim();
    if (!trimmedName) {
      alert("Please enter a label name");
      return;
    }

    const existingLabel = customLabels.find(
      (label) => normalizeLabelName(label.name) === normalizeLabelName(trimmedName)
    );

    if (existingLabel) {
      setSelectedCustom(existingLabel.name);
      setShowCustomForm(false);
      setNewCustomLabel({ name: "", color: "#6b7280" });
      return;
    }

    const newLabel = createLabel(trimmedName, newCustomLabel.color);
    setCustomLabels((current) => mergeUniqueLabels(current, [newLabel]));
    setSelectedCustom(newLabel.name);
    setShowCustomForm(false);
    setNewCustomLabel({ name: "", color: "#6b7280" });
  };

  const cancelCustomLabel = () => {
    setShowCustomForm(false);
    setNewCustomLabel({ name: "", color: "#6b7280" });
  };

  const removeCustomLabel = (name) => {
    setCustomLabels((current) => current.filter((label) => label.name !== name));
    if (selectedCustom === name) {
      setSelectedCustom(null);
    }
  };

  const handleConfirm = async () => {
    if (!formData.travel_date) {
      alert("Please enter travel date");
      return;
    }

    const allLabels = [];
    if (selectedBuiltIn.confirm) {
      allLabels.push({ name: "Confirm", color: DEFAULT_LABEL_COLOR });
    }
    if (selectedBuiltIn.cancel) {
      allLabels.push({ name: "Cancel", color: CANCEL_LABEL_COLOR });
    }
    if (selectedCustom) {
      const customLabel = customLabels.find(l => l.name === selectedCustom);
      if (customLabel) {
        allLabels.push({ name: customLabel.name, color: customLabel.color });
      }
    }

    // Validation: at least one label must be selected
    if (allLabels.length === 0) {
      alert("Please select at least one label");
      return;
    }

    const serializedLabels = serializeLabels(allLabels);

    try {
      // Prepare payload with proper data types
      const payload = {
        status: formData.status || "pending",
        travel_date: formData.travel_date || "",
        fare_type: formData.fare_type || "",
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : 0,
        pnr: formData.pnr || "",
        profit: formData.profit || "",
        credit_amount: formData.credit_amount ? parseFloat(formData.credit_amount) : 0,
        credit_note: formData.credit_note || "",
        label_name: String(serializedLabels.label_name || ""),
        label_colour: String(serializedLabels.label_colour || ""),
      };

      console.log("Sending payload:", payload);
      
      // Update enquiry with all details
      await api.patch(`enquiries/${enquiry.id}/`, payload);

      alert("Enquiry updated successfully! ✅");
      onConfirm && onConfirm();
      onClose();
    } catch (error) {
      console.error("Error updating enquiry:", error);
      console.error("Response data:", error.response?.data);
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
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
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
                type="text"
                value={formData.profit}
                onChange={(e) => setFormData({...formData, profit: e.target.value})}
                style={styles.input}
                placeholder="Enter profit (number or text)"
              />
            </div>
          </div>

          <div style={styles.twoColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Credit Amount</label>
              <input
                type="number"
                value={formData.credit_amount}
                onChange={(e) => setFormData({...formData, credit_amount: e.target.value})}
                style={styles.input}
                placeholder="0.00"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Credit Note</label>
              <input
                type="text"
                value={formData.credit_note}
                onChange={(e) => setFormData({...formData, credit_note: e.target.value})}
                style={styles.input}
                placeholder="Enter credit note"
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
            <div style={styles.labelHeader}>
              <label style={styles.label}>Labels</label>
            </div>

            {/* Built-in labels */}
            <div style={styles.builtInLabels}>
              <button
                type="button"
                onClick={() => handleToggleBuiltIn("confirm")}
                style={{
                  ...styles.labelBadge,
                  backgroundColor: DEFAULT_LABEL_COLOR,
                  color: "white",
                  opacity: selectedBuiltIn.confirm ? 1 : 0.6,
                  border: selectedBuiltIn.confirm ? "2px solid #047857" : "2px solid transparent",
                  boxShadow: selectedBuiltIn.confirm ? `inset 0 0 0 2px #047857` : "none",
                }}
                title="Toggle Confirm label"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => handleToggleBuiltIn("cancel")}
                style={{
                  ...styles.labelBadge,
                  backgroundColor: CANCEL_LABEL_COLOR,
                  color: "white",
                  opacity: selectedBuiltIn.cancel ? 1 : 0.6,
                  border: selectedBuiltIn.cancel ? "2px solid #991b1b" : "2px solid transparent",
                  boxShadow: selectedBuiltIn.cancel ? `inset 0 0 0 2px #991b1b` : "none",
                }}
                title="Toggle Cancel label"
              >
                Cancel
              </button>
              {customLabels.map((label) => (
                <button
                  key={label.name}
                  type="button"
                  onClick={() => handleSelectCustomLabel(label.name)}
                  style={{
                    ...styles.labelBadge,
                    backgroundColor: darkenHexColor(label.color),
                    color: "white",
                    opacity: selectedCustom === label.name ? 1 : 0.6,
                    border: selectedCustom === label.name ? `2px solid ${darkenHexColor(label.color, 0.35)}` : "2px solid transparent",
                    boxShadow: selectedCustom === label.name ? `inset 0 0 0 2px ${darkenHexColor(label.color, 0.35)}` : "none",
                  }}
                  title={`Toggle ${label.name} label`}
                >
                  {label.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => addCustomLabel()}
                style={styles.addLabelBtn}
                title="Add custom label"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Custom label form */}
            {showCustomForm && (
              <div style={styles.customFormContainer}>
                <input
                  type="text"
                  value={newCustomLabel.name}
                  onChange={(e) => setNewCustomLabel({...newCustomLabel, name: e.target.value})}
                  style={styles.input}
                  placeholder="Custom label name"
                  autoFocus
                />
                <div style={styles.colorPickerRow}>
                  <input
                    type="color"
                    value={newCustomLabel.color}
                    onChange={(e) => setNewCustomLabel({...newCustomLabel, color: e.target.value})}
                    style={styles.colorInput}
                    aria-label="Pick color"
                  />
                </div>
                <div style={styles.formButtonGroup}>
                  <button
                    type="button"
                    onClick={submitCustomLabel}
                    style={{...styles.removeLabelBtn, background: "#10b981", color: "white", border: "none"}}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={cancelCustomLabel}
                    style={styles.removeLabelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
  labelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  builtInLabels: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  labelBadge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "20px",
    color: "white",
    fontSize: "13px",
    fontWeight: "600",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
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
  labelEditor: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  labelRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr) auto",
    gap: "8px",
    alignItems: "center",
  },
  labelFieldGroup: {
    minWidth: 0,
  },
  labelColorWrap: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: 0,
    flexWrap: "wrap",
  },
  colorInput: {
    width: "34px",
    height: "34px",
    padding: 0,
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "white",
    cursor: "pointer",
    flexShrink: 0,
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
  addLabelBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2px solid #10b981",
    background: "white",
    color: "#10b981",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "24px",
    transition: "all 0.2s",
    padding: 0,
  },

  removeLabelBtn: {
    minWidth: "74px",
    height: "34px",
    borderRadius: "999px",
    border: "1px solid #94a3b8",
    background: "white",
    color: "#64748b",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 12px",
    fontSize: "13px",
    fontWeight: "600",
  },
  customFormContainer: {
    marginTop: "12px",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#f9fafb",
  },
  colorPickerRow: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    marginTop: "8px",
  },
  formButtonGroup: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  customLabelsRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
};

export default ConfirmEnquiryModal;
