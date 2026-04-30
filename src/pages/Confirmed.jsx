import React, { useEffect, useState } from "react";
import api from "../services/api";
import { ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react";

const Confirmed = () => {
  const [confirmedEnquiries, setConfirmedEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
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

  useEffect(() => {
    setIsLoaded(true);
    fetchConfirmedEnquiries();
  }, []);

  // Filters
  const filteredEnquiries = confirmedEnquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(search.toLowerCase())) ||
      item.phone.includes(search) ||
      (item.pnr && item.pnr.includes(search));

    const enquiryDate = new Date(item.created_at || item.date);
    const isAfterFrom = fromDate ? enquiryDate >= new Date(fromDate) : true;
    const isBeforeTo = toDate ? enquiryDate <= new Date(toDate) : true;

    return matchesSearch && isAfterFrom && isBeforeTo;
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
    const headers = ["Name", "Email", "Phone", "Route", "Travel Date", "Fare Type", "Sale Price", "PNR", "Profit", "Created Date"];
    const rows = filteredEnquiries.map(item => [
      item.name,
      item.email || "N/A",
      item.phone,
      `${item.from_city?.toUpperCase()} → ${item.to_city?.toUpperCase()}`,
      item.travel_date || "N/A",
      item.fare_type || "N/A",
      item.sale_price || "0",
      item.pnr || "N/A",
      item.profit || "0",
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

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
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
            placeholder="Search name / email / phone / PNR"
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
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Route</th>
                <th style={styles.th}>Travel Date</th>
                <th style={styles.th}>Fare Type</th>
                <th style={styles.th}>Sale Price</th>
                <th style={styles.th}>PNR</th>
                <th style={styles.th}>Profit</th>
                <th style={styles.th}>Confirmed Date</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEnquiries.length === 0 ? (
                <tr>
                  <td colSpan="10" style={styles.noData}>
                    No confirmed enquiries found
                  </td>
                </tr>
              ) : (
                paginatedEnquiries.map((item) => (
                  <tr key={item.id} style={styles.bodyRow}>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>{item.email || "N/A"}</td>
                    <td style={styles.td}>{item.phone}</td>
                    <td style={styles.td}>
                      {item.from_city?.toUpperCase()} → {item.to_city?.toUpperCase()}
                    </td>
                    <td style={styles.td}>
                      {item.travel_date ? new Date(item.travel_date).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                    <td style={styles.td}>{item.fare_type || "N/A"}</td>
                    <td style={styles.td}>₹{item.sale_price || "0"}</td>
                    <td style={styles.td}>{item.pnr || "N/A"}</td>
                    <td style={styles.td}>₹{item.profit || "0"}</td>
                    <td style={styles.td}>
                      {new Date(item.created_at).toLocaleDateString('en-GB')}
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
    gridTemplateColumns: "2fr 1fr 1fr",
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
  tableWrapper: {
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
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
};

export default Confirmed;
