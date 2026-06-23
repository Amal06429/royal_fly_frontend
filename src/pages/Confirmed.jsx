import React, { useEffect, useState } from "react";
import api from "../services/api";
import { ChevronLeft, ChevronRight, Download, RefreshCw, Edit2, X } from "lucide-react";

const splitLabels = (value) => {
  if (!value) {
    return [];
  }

  return String(value)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getLabelEntries = (item) => {
  const names = splitLabels(item.label_name);
  const colors = splitLabels(item.label_colour);

  if (!names.length) {
    return [];
  }

  return names.map((name, index) => ({
    name,
    color: colors[index] || colors[0] || "#6b7280",
  }));
};

const Confirmed = () => {
  const [confirmedEnquiries, setConfirmedEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [travelDateSearch, setTravelDateSearch] = useState("");
  const [selectedLabelName, setSelectedLabelName] = useState("");
  const [selectedCreator, setSelectedCreator] = useState("");
  const [labelMenuOpen, setLabelMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const itemsPerPage = 10;

  // Fetch confirmed enquiries
  const fetchConfirmedEnquiries = () => {
    api.get("enquiries/")
      .then(res => {
        // Filter only confirmed enquiries
        const confirmed = res.data.filter(e => e.status === "confirmed");
        setConfirmedEnquiries(confirmed);
      })
      .catch(err => {
        console.error("Failed to load confirmed enquiries", err);
      });
  };

    const formatTravelDate = (value) => {
      if (!value) {
        return "N/A";
      }

      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-GB');
      }

      return String(value);
    };

  useEffect(() => {
    setIsLoaded(true);
    fetchConfirmedEnquiries();
  }, []);

  // Filters
  const creators = Array.from(new Set(confirmedEnquiries.map(e => (e.username || e.created_by)).filter(Boolean))).sort();
  const labelOptions = Array.from(
    confirmedEnquiries.reduce((map, item) => {
      getLabelEntries(item).forEach((label) => {
        if (!map.has(label.name)) {
          map.set(label.name, label);
        }
      });

      return map;
    }, new Map()).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const filteredEnquiries = confirmedEnquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search) ||
      (item.pnr && item.pnr.includes(search));

    const enquiryDate = new Date(item.created_at || item.date);
    const isAfterFrom = fromDate ? enquiryDate >= new Date(fromDate) : true;
    const isBeforeTo = toDate ? enquiryDate <= new Date(toDate) : true;

    // Travel Date Filter - matches dd/mm/yyyy format when user searches
    const matchesTravelDate = travelDateSearch
      ? formatTravelDate(item.travel_date).includes(travelDateSearch)
      : true;

    const matchesLabel = selectedLabelName ? getLabelEntries(item).some((label) => label.name === selectedLabelName) : true;
    const matchesCreator = selectedCreator ? (item.username || item.created_by) === selectedCreator : true;

    return matchesSearch && isAfterFrom && isBeforeTo && matchesTravelDate && matchesLabel && matchesCreator;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Name", "Phone", "Route", "Travel Date", "Fare Type", "Sale Price", "PNR", "Profit", "Credit Amount", "Credit Note", "Label Name", "Created Date"];
    const rows = filteredEnquiries.map(item => [
      item.name,
      item.phone,
      `${item.from_city?.toUpperCase()} → ${item.to_city?.toUpperCase()}`,
      item.travel_date || "N/A",
      item.fare_type || "N/A",
      item.sale_price || "0",
      item.pnr || "N/A",
      item.profit || "0",
      item.credit_amount || "0",
      item.credit_note || "N/A",
      getLabelEntries(item).map((label) => label.name).join("; ") || "N/A",
      new Date(item.created_at).toLocaleDateString('en-GB')
    ]);

    let csv = headers.join(",") + "\n";
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `confirmed-enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Edit functions
  const handleEditClick = (enquiry) => {
    setEditingId(enquiry.id);
    setEditFormData({
      name: enquiry.name || "",
      phone: enquiry.phone || "",
      from_city: enquiry.from_city || "",
      to_city: enquiry.to_city || "",
      travel_date: enquiry.travel_date || "",
      fare_type: enquiry.fare_type || "",
      sale_price: enquiry.sale_price || "",
      pnr: enquiry.pnr || "",
      profit: enquiry.profit || "",
      credit_amount: enquiry.credit_amount || "",
      credit_note: enquiry.credit_note || "",
      notes: enquiry.notes || "",
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEnquiry = async () => {
    if (!editFormData.name || !editFormData.phone || !editFormData.from_city || !editFormData.to_city) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await api.put(`enquiries/${editingId}/`, editFormData);
      alert("✅ Enquiry updated successfully!");
      fetchConfirmedEnquiries();
      setShowEditModal(false);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Failed to update enquiry", error);
      alert("❌ Failed to update enquiry");
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditFormData({});
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Horizontal scrollbar styling */
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          height: 8px;
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          transition: background 0.3s;
        }
        div[style*="overflowX: auto"]::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div style={{...styles.container, animation: isLoaded ? 'fadeIn 0.6s ease-out' : 'none', animationFillMode: 'both'}}>
        <div style={{...styles.headingWrapper, animation: isLoaded ? 'slideDown 0.6s ease-out' : 'none', animationDelay: '0.1s', animationFillMode: 'both'}}>
          <div style={styles.iconBox}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
            </svg>
          </div>
          <h2 style={styles.heading}>Confirmed Enquiries</h2>
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              onClick={fetchConfirmedEnquiries}
              style={styles.refreshBtn}
              title="Refresh list"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            
          </div>
        </div>

        {/* Filters */}
        <div style={{...styles.filterRow, animation: isLoaded ? 'slideDown 0.6s ease-out' : 'none', animationDelay: '0.2s', animationFillMode: 'both'}}>
          <input
            type="text"
            placeholder="Search name / phone / PNR"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#059669"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />

          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.dateInput}
            onFocus={(e) => e.target.style.borderColor = "#059669"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.dateInput}
            onFocus={(e) => e.target.style.borderColor = "#059669"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />

          {/* Travel Date Search - separate filter */}
          <input
            type="text"
            placeholder="Travel Date (dd/mm/yyyy)"
            value={travelDateSearch}
            onChange={(e) => {
              setTravelDateSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = "#059669"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />

          {/* Created By filter */}
          <select
            value={selectedCreator}
            onChange={(e) => { setSelectedCreator(e.target.value); setCurrentPage(1); }}
            style={styles.creatorSelect}
          >
            <option value="">All Creators</option>
            {creators.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Label name filter with colour badge */}
          <div style={styles.labelDropdown}>
            <button
              type="button"
              onClick={() => setLabelMenuOpen((open) => !open)}
              style={styles.labelDropdownButton}
            >
              {selectedLabelName ? (
                <span style={{...styles.labelBadge, backgroundColor: labelOptions.find((item) => item.name === selectedLabelName)?.color || '#6b7280'}}>
                  {selectedLabelName}
                </span>
              ) : (
                <span style={styles.dropdownText}>All Status</span>
              )}
            </button>

            {labelMenuOpen && (
              <div style={styles.labelMenu}>
                <div
                  onClick={() => {
                    setSelectedLabelName("");
                    setCurrentPage(1);
                    setLabelMenuOpen(false);
                  }}
                  style={styles.labelOption}
                >
                  <span style={styles.dropdownText}>All Labels</span>
                </div>
                {labelOptions.map((label) => (
                  <div
                    key={label.name}
                    onClick={() => {
                      setSelectedLabelName(label.name);
                      setCurrentPage(1);
                      setLabelMenuOpen(false);
                    }}
                    style={styles.labelOption}
                  >
                    <span style={{...styles.labelBadge, backgroundColor: label.color}}>
                      {label.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Route</th>
                <th style={styles.th}>Travel Date</th>
                <th style={styles.th}>Fare Type</th>
                <th style={styles.th}>Sale Price</th>
                <th style={styles.th}>PNR</th>
                <th style={styles.th}>Profit</th>
                <th style={styles.th}>Credit Amount</th>
                <th style={styles.th}>Credit Note</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Confirmed Date</th>
                <th style={styles.th}>Created By</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="14" style={styles.noData}>
                    No confirmed enquiries found
                  </td>
                </tr>
              ) : (
                paginatedEnquiries.map((item) => (
                  <tr key={item.id} style={styles.bodyRow}>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.phone}</td>
                    <td style={styles.td}>
                      {item.from_city?.toUpperCase()} → {item.to_city?.toUpperCase()}
                    </td>
                    <td style={styles.td}>
                      {formatTravelDate(item.travel_date)}
                    </td>
                    <td style={styles.td}>{item.fare_type || "N/A"}</td>
                    <td style={styles.td}>₹{item.sale_price || "0"}</td>
                    <td style={styles.td}>{item.pnr || "N/A"}</td>
                    <td style={styles.td}>₹{item.profit || "0"}</td>
                    <td style={styles.td}>₹{item.credit_amount || "0"}</td>
                    <td style={styles.td}>{item.credit_note || "N/A"}</td>
                    <td style={styles.td}>
                      {getLabelEntries(item).length ? (
                        <div style={styles.labelChipGroup}>
                          {getLabelEntries(item).map((label) => (
                            <span key={`${item.id}-${label.name}`} style={{...styles.labelBadge, backgroundColor: label.color}}>
                              {label.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{color: "#9ca3af", fontSize: "12px"}}>-</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {new Date(item.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td style={styles.td}>
                      {item.username || item.created_by || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEditClick(item)}
                        style={styles.editButton}
                        title="Edit this enquiry"
                      >
                        <Edit2 size={16} />
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
                      background: currentPage === page ? "#10B981" : "#fff",
                      color: currentPage === page ? "#fff" : "#374151",
                      border: currentPage === page ? "1px solid #10B981" : "1px solid #e5e7eb",
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
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEnquiries.length)} of {filteredEnquiries.length} confirmed enquiries
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay} onClick={closeEditModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={closeEditModal}>
              <X size={24} />
            </button>
            <h2 style={styles.modalTitle}>Edit Enquiry Details</h2>
            
            <div style={styles.editForm}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name <span style={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter name"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone <span style={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter phone"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>From City <span style={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="from_city"
                    value={editFormData.from_city}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter from city"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>To City <span style={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="to_city"
                    value={editFormData.to_city}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter to city"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Travel Date</label>
                  <input
                    type="date"
                    name="travel_date"
                    value={editFormData.travel_date}
                    onChange={handleEditFormChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fare Type</label>
                  <input
                    type="text"
                    name="fare_type"
                    value={editFormData.fare_type}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="GRP GE, NORMAL, etc."
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Sale Price</label>
                  <input
                    type="number"
                    name="sale_price"
                    value={editFormData.sale_price}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter sale price"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>PNR</label>
                  <input
                    type="text"
                    name="pnr"
                    value={editFormData.pnr}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter PNR"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Profit</label>
                  <input
                    type="text"
                    name="profit"
                    value={editFormData.profit}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter profit (number or text)"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Credit Amount</label>
                  <input
                    type="number"
                    name="credit_amount"
                    value={editFormData.credit_amount}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter credit amount"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Credit Note</label>
                  <input
                    type="text"
                    name="credit_note"
                    value={editFormData.credit_note}
                    onChange={handleEditFormChange}
                    style={styles.input}
                    placeholder="Enter credit note"
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Notes</label>
                <textarea
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleEditFormChange}
                  style={styles.textarea}
                  placeholder="Enter any additional notes"
                  rows="3"
                />
              </div>

              <div style={styles.buttonGroup}>
                <button 
                  onClick={handleUpdateEnquiry}
                  style={styles.saveButton}
                >
                  Save Changes
                </button>
                <button 
                  onClick={closeEditModal}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* Styles */
const styles = {
  container: {
    padding: "28px",
    background: "#f8f9fa",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  headingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  iconBox: {
    width: 56,
    height: 56,
    background: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
  },
  icon: {
    width: 32,
    height: 32,
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
    flex: 1,
    letterSpacing: "-0.5px",
  },
  refreshBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
  },
  exportBtn: {
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    color: "white",
    border: "none",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
  },
  filterRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.2fr 1fr 1fr",
    gap: "14px",
    marginBottom: "22px",
  },
  input: {
    padding: "11px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    background: "white",
    transition: "all 0.2s",
  },
  dateInput: {
    padding: "11px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    background: "white",
    transition: "all 0.2s",
  },
  creatorSelect: {
    padding: "11px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    background: "white",
    transition: "all 0.2s",
  },
  labelDropdown: {
    position: "relative",
    minWidth: "170px",
  },
  labelDropdownButton: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "left",
  },
  dropdownText: {
    color: "#374151",
  },
  swatchSmall: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 3px 8px rgba(16,24,40,0.08)',
    position: 'relative',
    transition: 'transform 0.12s, box-shadow 0.12s',
  },
  swatchInner: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.95)',
    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.08)',
  },
  swatchTable: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    display: 'inline-block',
    boxShadow: '0 3px 8px rgba(16,24,40,0.06)',
    position: 'relative',
  },
  labelBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  labelChipGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  labelMenu: {
    position: 'absolute',
    right: 0,
    top: 'calc(100% + 8px)',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    zIndex: 1200,
    minWidth: 190,
    padding: 8,
  },
  labelOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    padding: '8px 10px',
    cursor: 'pointer',
    borderRadius: 6,
  },
  
  tableWrapper: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
    overflowX: "auto",
    overflowY: "visible",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    background: "linear-gradient(135deg, #f3f4f6 0%, #f0f1f3 100%)",
    borderBottom: "2px solid #e5e7eb",
  },
  th: {
    padding: "16px 14px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: "700",
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  bodyRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background 0.2s",
  },
  td: {
    padding: "14px",
    fontSize: "13px",
    color: "#374151",
    fontWeight: "500",
  },
  noData: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#9ca3af",
    fontSize: "15px",
  },
  paginationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "24px",
    background: "white",
    borderTop: "1px solid #e5e7eb",
    flexWrap: "wrap",
  },
  paginationButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s",
    background: "white",
  },
  pageNumbers: {
    display: "flex",
    gap: "8px",
  },
  pageButton: {
    width: "36px",
    height: "36px",
    padding: "0",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s",
    background: "white",
  },
  pageInfo: {
    fontSize: "12px",
    color: "#6b7280",
    marginLeft: "16px",
    fontWeight: "500",
  },
  editButton: {
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "700px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#9ca3af",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "20px",
    marginTop: "0",
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    padding: "10px 12px",
    fontSize: "13px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "10px 12px",
    fontSize: "13px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    resize: "vertical",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  saveButton: {
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    color: "white",
    border: "none",
    padding: "11px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
  },
  cancelButton: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1.5px solid #d1d5db",
    padding: "11px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};

export default Confirmed;
