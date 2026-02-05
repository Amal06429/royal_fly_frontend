import React, { useEffect, useState } from "react";
import api from "../services/api";


const Dashboard = () => {
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalEnquiries: 0,
    todayEnquiries: 0,
    totalSeats: 0,
    recentEnquiries: []
  });

 useEffect(() => {
  const token = localStorage.getItem("access");
  if (!token) {
    console.error("No access token found");
    return;
  }

  api.get("dashboard/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => setStats(res.data))
  .catch(err => console.error("Dashboard API error", err));
}, []);



  return (
    <div style={styles.container}>
      {/* HEADER WITH GRADIENT */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard Overview</h1>
          <p style={styles.subtitle}>Track your flight operations in real-time</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* STATS CARDS WITH ANIMATIONS */}
      <div style={styles.grid}>
        <StatCard 
          title="Total Flights" 
          value={stats.totalFlights} 
          color="#2563eb"
          gradient="linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
          icon="✈️"
        />
        <StatCard 
          title="Total Enquiries" 
          value={stats.totalEnquiries} 
          color="#f97316"
          gradient="linear-gradient(135deg, #f97316 0%, #fb923c 100%)"
          icon="📋"
        />
        <StatCard 
          title="Today's Enquiries" 
          value={stats.todayEnquiries} 
          color="#059669"
          gradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
          icon="📅"
        />
        <StatCard 
          title="Seats Available" 
          value={stats.totalSeats} 
          color="#7c3aed"
          gradient="linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)"
          icon="💺"
        />
      </div>

      {/* RECENT ENQUIRIES WITH MODERN DESIGN */}
<div style={styles.section}>
  <div style={styles.sectionHeader}>
    <h2 style={styles.sectionTitle}>Recent Enquiries</h2>
    <span style={styles.badge}>
      {stats?.recentEnquiries?.length || 0} Total
    </span>
  </div>

  {!stats?.recentEnquiries || stats.recentEnquiries.length === 0 ? (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>🔭</div>
      <p style={styles.emptyText}>No enquiries found</p>
      <p style={styles.emptySubtext}>New enquiries will appear here</p>
    </div>
  ) : (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeaderRow}>
            <th style={styles.tableHeader}>Name</th>
            <th style={styles.tableHeader}>Route</th>
            <th style={styles.tableHeader}>Date</th>
            <th style={styles.tableHeader}>Status</th>
          </tr>
        </thead>
        <tbody>
          {stats.recentEnquiries.map((e) => (
            <tr key={e.id} style={styles.tableRow}>
              {/* NAME */}
              <td style={styles.tableCell}>
                <div style={styles.nameCell}>
                  <div style={styles.avatar}>
                    {e.name ? e.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <span>{e.name || "N/A"}</span>
                </div>
              </td>

              {/* ROUTE */}
              <td style={styles.tableCell}>
                <div style={styles.routeCell}>
                  <span style={styles.location}>
                    {e.from_city ? e.from_city.toUpperCase() : "N/A"}
                  </span>
                  <span style={styles.arrow}>→</span>
                  <span style={styles.location}>
                    {e.to_city ? e.to_city.toUpperCase() : "N/A"}
                  </span>
                </div>
              </td>

              {/* DATE */}
              <td style={styles.tableCell}>
                {e.created_at
                  ? new Date(e.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </td>

              {/* STATUS */}
              <td style={styles.tableCell}>
                <span style={styles.statusBadge}>Pending</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )} 
      </div>
    </div>
  );
};

/* ENHANCED STAT CARD COMPONENT */
const StatCard = ({ title, value, color, gradient, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.cardContent}>
        <div>
          <p style={styles.cardTitle}>{title}</p>
          <p style={{ ...styles.cardValue, color }}>{value}</p>
        </div>
        <div style={{...styles.iconCircle, background: gradient}}>
          <span style={styles.icon}>{icon}</span>
        </div>
      </div>
      <div style={{...styles.cardFooter, background: gradient}}></div>
    </div>
  );
};

/* ENHANCED STYLES */
const styles = {
  container: {
    padding: 32,
    background: "linear-gradient(to bottom, #f9fafb 0%, #f3f4f6 100%)",
    minHeight: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    flexWrap: "wrap",
    gap: 16
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    margin: 0,
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8
  },
  dateBadge: {
    background: "#fff",
    padding: "12px 20px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    color: "#475569",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
    marginBottom: 40
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    position: "relative"
  },
  cardContent: {
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cardTitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 12,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  cardValue: {
    fontSize: 40,
    fontWeight: 700,
    margin: 0
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9
  },
  icon: {
    fontSize: 28
  },
  cardFooter: {
    height: 4,
    width: "100%"
  },
  section: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  },
  sectionTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#1e293b"
  },
  badge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600
  },
  tableContainer: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0
  },
  tableHeaderRow: {
    background: "#f8fafc"
  },
  tableHeader: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: 13,
    fontWeight: 600,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #e2e8f0"
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s ease"
  },
  tableCell: {
    padding: "16px",
    fontSize: 14,
    color: "#334155"
  },
  nameCell: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: 14
  },
  routeCell: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  location: {
    fontWeight: 500
  },
  arrow: {
    color: "#94a3b8",
    fontSize: 16
  },
  statusBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#94a3b8"
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 600,
    color: "#64748b",
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94a3b8"
  }
};

export default Dashboard;









