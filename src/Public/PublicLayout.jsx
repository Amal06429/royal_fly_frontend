import { Outlet, Link } from "react-router-dom"

const PublicLayout = () => {
  const styles = {
    topBar: {
      background: "#1e3a5f",
      color: "white",
      padding: "8px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "13px",
    },
    topBarLeft: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    topBarItem: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "white",
      textDecoration: "none",
    },
    header: {
      background: "white",
      padding: "15px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      textDecoration: "none",
    },
    logoImage: {
      width: "150px",
      height: "45px",
      objectFit: "contain",
    },
    logoText: {
      display: "flex",
      flexDirection: "column",
    },
    logoTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#1e3a5f",
      margin: 0,
    },
    logoSubtitle: {
      fontSize: "11px",
      color: "#666",
      margin: 0,
    },
    nav: {
      display: "flex",
      gap: "30px",
      alignItems: "center",
    },
    navLink: {
      textDecoration: "none",
      color: "#333",
      fontSize: "15px",
      fontWeight: "500",
      transition: "color 0.3s",
    },
    whatsappBtn: {
      background: "#25D366",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
    },
    footer: {
      background: "#1e3a5f",
      color: "white",
      padding: "50px 40px 30px",
    },
    footerContent: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto 40px",
    },
    footerSection: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    footerTitle: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "10px",
    },
    footerText: {
      fontSize: "14px",
      lineHeight: "1.6",
      opacity: "0.9",
    },
    footerLink: {
      color: "white",
      textDecoration: "none",
      fontSize: "14px",
      opacity: "0.9",
    },
    footerBottom: {
      textAlign: "center",
      paddingTop: "30px",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      fontSize: "13px",
      opacity: "0.8",
    },
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarLeft}>
          <a href="tel:+919656905461" style={styles.topBarItem}>
            📞 +91 9656905461
          </a>
          <a href="mailto:royalflyccj@gmail.com" style={styles.topBarItem}>
            ✉️ royalflyccj@gmail.com
          </a>
        </div>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          <img
            src="/logo.png"
            alt="Royal Fly Travels"
            style={styles.logoImage}
          />

         
        </Link>

        <nav style={styles.nav}>
          <Link
            to="/"
            style={styles.navLink}
            onMouseOver={(e) => (e.currentTarget.style.color = "#ff8c42")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#333")}
          >
            Home
          </Link>

          <a
            href="https://wa.me/9656905461"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.whatsappBtn}
            onMouseOver={(e) => (e.currentTarget.style.background = "#1fbd59")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#25D366")}
          >
            💬 WhatsApp
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          {/* Company Info */}
          <div style={styles.footerSection}>
            <div style={styles.logo}>
              <img
                src="/logo.png"
                alt="Royal Fly Travels"
                style={styles.logoImage}
              />

             
            </div>

            <p style={styles.footerText}>
              Your trusted partner for flight bookings with reliable service and
              competitive fares.
            </p>
          </div>

          {/* Quick Links */}
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Quick Links</h3>
            <Link to="/" style={styles.footerLink}>
              Home
            </Link>
          </div>

          {/* Popular Routes */}
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Popular Routes</h3>
            <span style={styles.footerText}>Dubai → calicut</span>
            <span style={styles.footerText}>Dubai → Mumbai</span>
            <span style={styles.footerText}>Dubai → Delhi</span>
            <span style={styles.footerText}>Dubai → Islamabad</span>
          </div>

          {/* Contact Us */}
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Contact Us</h3>
            <a href="tel:+919656905461" style={styles.footerLink}>
              📞 +91 9656905461
            </a>
            <a href="mailto:royalflyccj@gmail.com" style={styles.footerLink}>
              ✉️ royalflyccj@gmail.com
            </a>
            <span style={styles.footerText}>📍 </span>
          </div>
        </div>

        <div style={styles.footerBottom}>
          © 2026 Royal Fly Travels. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout
