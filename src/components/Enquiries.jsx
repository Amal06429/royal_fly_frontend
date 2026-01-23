import React, { useEffect, useState } from "react";
import api from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [currentEnquiry, setCurrentEnquiry] = useState(null);
  const [pricingDetails, setPricingDetails] = useState({
    ticketPrice: "",
    airline: "",
    travelDate: "",
    additionalNotes: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch enquiries
  useEffect(() => {
    api.get("enquiries/")
      .then(res => {
        setEnquiries(res.data);
      })
      .catch(err => {
        console.error("Failed to load enquiries", err);
      });
  }, []);

  // Get unique from and to locations
  const uniqueFromLocations = [...new Set(enquiries.map(e => e.from_city))];
  const uniqueToLocations = [...new Set(enquiries.map(e => e.to_city))];

  // Filters
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search);

    const enquiryDate = new Date(item.date);
    const isAfterFrom = fromDate ? enquiryDate >= new Date(fromDate) : true;
    const isBeforeTo = toDate ? enquiryDate <= new Date(toDate) : true;
    
    const matchesFromFilter = fromFilter ? item.from_city === fromFilter : true;
    const matchesToFilter = toFilter ? item.to_city === toFilter : true;

    return matchesSearch && isAfterFrom && isBeforeTo && matchesFromFilter && matchesToFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle checkbox selection
  const handleSelectEnquiry = (id) => {
    setSelectedEnquiries(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Select all visible enquiries
  const handleSelectAll = () => {
    if (selectedEnquiries.length === paginatedEnquiries.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(paginatedEnquiries.map(e => e.id));
    }
  };

  // Open pricing modal
  const handleAddPricing = (enquiry) => {
    setCurrentEnquiry(enquiry);
    setShowPricingModal(true);
    setPricingDetails({
      ticketPrice: "",
      airline: "",
      travelDate: enquiry.date || "",
      additionalNotes: ""
    });
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = () => {
    if (!currentEnquiry || !pricingDetails.ticketPrice) {
      alert("Please fill in the ticket price");
      return;
    }

    const message = `Hello ${currentEnquiry.name}! 👋

Thank you for your flight enquiry.

✈️ *Flight Details:*
━━━━━━━━━━━━━━━━
📍 Route: ${currentEnquiry.from_city} → ${currentEnquiry.to_city}

${pricingDetails.airline ? `🛫 Airline: ${pricingDetails.airline}` : ''}
${pricingDetails.travelDate ? `📅 Travel Date: ${pricingDetails.travelDate}` : ''}
💰 Ticket Price: ₹${pricingDetails.ticketPrice}

${pricingDetails.additionalNotes ? `📝 *Additional Information:*
${pricingDetails.additionalNotes}` : ''}

For booking or queries, please feel free to contact us.

Best Regards,
Travel Agency Team`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = currentEnquiry.phone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setShowPricingModal(false);
    setCurrentEnquiry(null);
  };

  // Send bulk WhatsApp to selected enquiries
  const sendBulkWhatsApp = () => {
    if (selectedEnquiries.length === 0) {
      alert("Please select at least one enquiry");
      return;
    }

    selectedEnquiries.forEach(id => {
      const enquiry = enquiries.find(e => e.id === id);
      if (enquiry) {
        const message = `Hello ${enquiry.name}! 👋
Thank you for your flight enquiry for ${enquiry.from_city} → ${enquiry.to_city}.

We have exciting flight options available for your travel dates. Please let us know your preferences!

Best Regards,
Travel Agency Team`;
        
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = enquiry.phone.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
      }
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headingWrapper}>
        <div style={styles.iconBox}>
          <svg style={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" fill="white"/>
          </svg>
        </div>
        <h2 style={styles.heading}>Enquiry List</h2>
        {selectedEnquiries.length > 0 && (
          <button onClick={sendBulkWhatsApp} style={styles.bulkWhatsappBtn}>
            📱 Send WhatsApp to {selectedEnquiries.length} Selected
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={styles.filterRow}>
        <input
          type="text"
          placeholder="Search name / email / phone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          style={styles.input}
        />

        <select
          value={fromFilter}
          onChange={(e) => {
            setFromFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value="">All Origins</option>
          {uniqueFromLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={toFilter}
          onChange={(e) => {
            setToFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.select}
        >
          <option value="">All Destinations</option>
          {uniqueToLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.dateInput}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            setCurrentPage(1);
          }}
          style={styles.dateInput}
        />
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>
                <input
                  type="checkbox"
                  checked={selectedEnquiries.length === paginatedEnquiries.length && paginatedEnquiries.length > 0}
                  onChange={handleSelectAll}
                  style={styles.checkbox}
                />
              </th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>From → To</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedEnquiries.length === 0 ? (
              <tr>
                <td colSpan="8" style={styles.noData}>
                  No enquiries found
                </td>
              </tr>
            ) : (
              paginatedEnquiries.map((item) => (
                <tr key={item.id} style={styles.bodyRow}>
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={selectedEnquiries.includes(item.id)}
                      onChange={() => handleSelectEnquiry(item.id)}
                      style={styles.checkbox}
                    />
                  </td>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>
                    {item.created_at?.split("T")[0]}
                  </td>
                  <td style={styles.td}>{item.phone}</td>
                  <td style={styles.td}>{item.email}</td>
                  <td style={styles.td}>
                    {item.from_city} → {item.to_city}
                  </td>
                  <td style={styles.td}>{item.message}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleAddPricing(item)}
                      style={styles.addPricingBtn}
                    >
                      ➕ 
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredEnquiries.length > itemsPerPage && (
          <div style={styles.paginationContainer}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...styles.paginationButton,
                background: currentPage === 1 ? "#f3f4f6" : "#fff",
                color: currentPage === 1 ? "#9ca3af" : "#374151",
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            
            <div style={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    ...styles.pageButton,
                    background: currentPage === page ? "#ff8c42" : "#fff",
                    color: currentPage === page ? "#fff" : "#374151",
                    border: currentPage === page ? "1px solid #ff8c42" : "1px solid #e5e7eb",
                    fontWeight: currentPage === page ? "600" : "400"
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
                ...styles.paginationButton,
                background: currentPage === totalPages ? "#f3f4f6" : "#fff",
                color: currentPage === totalPages ? "#9ca3af" : "#374151",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next <ChevronRight size={16} />
            </button>
            
            <div style={styles.pageInfo}>
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
            </div>
          </div>
        )}
      </div>

      {/* Pricing Modal */}
      {showPricingModal && currentEnquiry && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Message Popup</h3>
              <button 
                onClick={() => setShowPricingModal(false)}
                style={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.enquiryInfo}>
                <p><strong>Customer:</strong> {currentEnquiry.name}</p>
                <p>
                  <strong>Route:</strong>{" "}
                  {currentEnquiry.from_city} → {currentEnquiry.to_city}
                </p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Ticket Price (₹) *</label>
                <input
                  type="number"
                  value={pricingDetails.ticketPrice}
                  onChange={(e) => setPricingDetails({...pricingDetails, ticketPrice: e.target.value})}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Airline</label>
                <input
                  type="text"
                  value={pricingDetails.airline}
                  onChange={(e) => setPricingDetails({...pricingDetails, airline: e.target.value})}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Travel Date</label>
                <input
                  type="date"
                  value={pricingDetails.travelDate}
                  onChange={(e) => setPricingDetails({...pricingDetails, travelDate: e.target.value})}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Additional Notes</label>
                <textarea
                  value={pricingDetails.additionalNotes}
                  onChange={(e) => setPricingDetails({...pricingDetails, additionalNotes: e.target.value})}
                  style={styles.textarea}
                  rows="3"
                />
              </div>

              <button 
                onClick={sendWhatsAppMessage}
                style={styles.whatsappBtn}
              >
                📱 Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;

/* Styles */
const styles = {
  container: {
    padding: "25px",
    background: "#f5f6fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  headingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  iconBox: {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #FF8C42 0%, #FF7425 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(255, 140, 66, 0.3)",
  },
  icon: {
    width: "26px",
    height: "26px",
  },
  heading: {
    margin: "0",
    fontSize: "24px",
    fontWeight: "600",
    color: "#2c3e50",
  },
  bulkWhatsappBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#25D366",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    marginLeft: "auto",
  },
  filterRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    flex: "1",
    minWidth: "200px",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    minWidth: "150px",
    cursor: "pointer",
    background: "#ffffff",
  },
  dateInput: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    minWidth: "150px",
  },
  tableWrapper: {
    background: "#ffffff",
    borderRadius: "10px",
    overflowX: "auto",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    background: "#ffffff",
    borderBottom: "2px solid #e5e7eb",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    whiteSpace: "nowrap",
  },
  bodyRow: {
    borderBottom: "1px solid #f3f4f6",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#4b5563",
    verticalAlign: "middle",
  },
  noData: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#9ca3af",
    fontSize: "14px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  addPricingBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#10B981",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#ffffff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0",
    width: "30px",
    height: "30px",
  },
  modalBody: {
    padding: "20px",
  },
  enquiryInfo: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px",
  },
  modalInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: "border-box",
  },
  whatsappBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#25D366",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
    flexWrap: "wrap",
  },
  paginationButton: {
    padding: "8px 16px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px"
  },
  pageNumbers: {
    display: "flex",
    gap: "4px",
  },
  pageButton: {
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "40px"
  },
  pageInfo: {
    marginLeft: "16px",
    fontSize: "14px",
    color: "#6b7280",
  }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    table tbody tr:hover {
      background-color: #f9fafb !important;
    }
    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    button:active {
      transform: translateY(0);
    }
    input:focus, select:focus, textarea:focus {
      border-color: #4F7FF5 !important;
    }
  `;
  document.head.appendChild(style);
}