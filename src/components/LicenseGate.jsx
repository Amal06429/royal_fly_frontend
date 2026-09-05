import React, { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Clock, KeyRound, Lock, ExternalLink } from 'lucide-react';
import licensingBg from '../assets/licensing.png';

const LICENSE_API_ENDPOINT = 'https://activate.imcbs.com/mobileapp/api/project/customdev/';
const CURRENT_CLIENT_ID = "OOAI0MRGASJG9"; // ⚠️ ROYAL FLY — change for each client
const CUSTOMER_LABEL = "Royal Fly"; // ⚠️ change for each client
const POLL_INTERVAL = 3000;

const DEFAULT_LICENSE_DATA = {
  success: true,
  project_name: "Custom Dev",
  demo_licenses: [],
  customers: [
    {
      customer_name: "Royal Fly",
      client_id: "OOAI0MRGASJG9",
      license_key: "5XPB-66VY-0XHC-U779",
      package: "Custom Dev",
      modules: [{ module_name: "Custom Dev", module_code: "MOD062" }],
      license_summary: { registered_devices: 0, max_devices: 0 },
      license_validity: { expiry_date: "2027-04-01", remaining_days: 207, is_expired: false },
      registered_devices: [],
      status: "Active",
    },
  ],
};

// ───────────────────────── Embedded CSS ─────────────────────────
const LICENSE_GATE_CSS = `
.rlg-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  width: 100vw;
  height: 100vh;
  background-color: #0a0202;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.rlg-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 54%;
  min-width: 340px;
  max-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 48px 44px;
  box-sizing: border-box;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.rlg-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 240px 240px;
}

.rlg-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 800'%3E%3Cg fill='none' stroke='%23ff3232' stroke-width='1'%3E%3Cpath d='M300 120 L230 40 L250 -10'/%3E%3Cpath d='M300 120 L380 30 L420 -30'/%3E%3Cpath d='M300 120 L120 200 L40 190'/%3E%3Cpath d='M300 120 L470 210 L560 250'/%3E%3Cpath d='M120 500 L60 560 L20 640'/%3E%3Cpath d='M480 560 L540 620 L560 700'/%3E%3Cpath d='M300 650 L260 720 L280 800'/%3E%3C/g%3E%3C/svg%3E");
  background-size: cover;
  background-position: center;
}

.rlg-panel-inner {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rlg-icon-wrap {
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  filter: drop-shadow(0 0 18px rgba(255, 45, 45, 0.65));
  animation: rlg-pulse 2.2s ease-in-out infinite;
}

.rlg-icon-wrap svg {
  width: 64px;
  height: 64px;
  color: #ff2d2d;
  stroke-width: 1.6;
}

@keyframes rlg-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.75; transform: scale(0.94); }
}

.rlg-title {
  margin: 0 0 14px 0;
  font-size: clamp(30px, 3.6vw, 44px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #ff3232;
  text-shadow: 0 0 22px rgba(255, 45, 45, 0.55), 0 0 4px rgba(255, 45, 45, 0.4), 0 2px 6px rgba(0,0,0,0.8);
}

.rlg-sub {
  margin: 0 0 30px 0;
  max-width: 440px;
  font-size: 15px;
  line-height: 1.6;
  color: #f1e9e9;
  text-shadow: 0 1px 4px rgba(0,0,0,0.85);
}

.rlg-status-box {
  width: 100%;
  border: 1px solid rgba(255, 60, 60, 0.4);
  border-radius: 6px;
  background: rgba(20, 3, 3, 0.55);
  backdrop-filter: blur(2px);
  box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.5);
  padding: 20px 22px;
  margin-bottom: 26px;
  box-sizing: border-box;
}

.rlg-status-label {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ff8a8a;
  font-weight: 600;
  margin-bottom: 8px;
}

.rlg-status-pill {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #ff3b3b;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
  text-shadow: 0 0 14px rgba(255, 45, 45, 0.5);
}

.rlg-divider {
  height: 1px;
  width: 100%;
  background: rgba(255, 60, 60, 0.22);
  margin: 16px 0;
}

.rlg-stats-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.rlg-stat {
  flex: 1 1 0;
  min-width: 110px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 4px;
}

.rlg-stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #d8c6c6;
}

.rlg-stat-label svg {
  width: 13px;
  height: 13px;
  color: #ff5a5a;
}

.rlg-stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #ff8a8a;
  word-break: break-word;
}

.rlg-customer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.rlg-customer-label {
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #d8c6c6;
}

.rlg-customer-value {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
}

.rlg-help {
  font-size: 13px;
  font-weight: 600;
  color: #ff5a5a;
  margin-bottom: 14px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.85);
}

.rlg-provider-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-radius: 10px;
  background: rgba(10, 2, 2, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-decoration: none;
  margin-bottom: 22px;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.rlg-provider-card:hover {
  background: rgba(30, 6, 6, 0.75);
  border-color: rgba(255, 90, 90, 0.4);
}

.rlg-provider-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.rlg-provider-name {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.rlg-provider-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #ff6a6a;
}

.rlg-secure {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #c9baba;
  text-shadow: 0 1px 4px rgba(0,0,0,0.85);
}

.rlg-secure svg {
  width: 12px;
  height: 12px;
}

.rlg-cta {
  margin: -6px 0 20px 0;
  padding: 10px 22px;
  border-radius: 8px;
  border: 1px solid rgba(255, 60, 60, 0.4);
  background: rgba(255, 45, 45, 0.14);
  color: #ff6a6a;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.rlg-cta:hover {
  background: rgba(255, 45, 45, 0.26);
}

@media (max-width: 820px) {
  .rlg-panel {
    position: relative;
    width: 100%;
    min-width: 0;
    padding: 36px 26px;
    background: radial-gradient(ellipse 90% 70% at 50% 50%, rgba(20, 3, 3, 0.78) 0%, rgba(6, 1, 1, 0.92) 100%);
  }
  .rlg-stats-row {
    flex-direction: column;
    gap: 14px;
  }
}
`;

// ───────────────────────── Blocking shell ─────────────────────────
const BlockShell = ({ badgeLead, badgeAccent, message, customer, onRefresh, showButton }) => (
  <div className="rlg-overlay" style={{ backgroundImage: `url(${licensingBg})` }}>
    <style>{LICENSE_GATE_CSS}</style>
    <div className="rlg-panel">
      <div className="rlg-panel-inner">
        <div className="rlg-icon-wrap">
          <AlertTriangle strokeWidth={1.6} />
        </div>

        <h1 className="rlg-title">
          {badgeLead}<br />{badgeAccent}
        </h1>
        <p className="rlg-sub">{message}</p>

        {customer && (
          <div className="rlg-status-box">
            <div className="rlg-status-label">License Status</div>
            <div className="rlg-status-pill">
              <AlertTriangle size={18} /> {customer.status?.toUpperCase() || 'INACTIVE'} <AlertTriangle size={18} />
            </div>

            <div className="rlg-stats-row">
              <div className="rlg-stat">
                <span className="rlg-stat-label"><Calendar /> Expiry Date</span>
                <span className="rlg-stat-value">{customer.license_validity?.expiry_date || '—'}</span>
              </div>
              <div className="rlg-stat">
                <span className="rlg-stat-label"><Clock /> Remaining Days</span>
                <span className="rlg-stat-value">{customer.license_validity?.remaining_days ?? '—'}</span>
              </div>
              <div className="rlg-stat">
                <span className="rlg-stat-label"><KeyRound /> License Key</span>
                <span className="rlg-stat-value">{customer.license_key || '—'}</span>
              </div>
            </div>

            <div className="rlg-divider" />

            <div className="rlg-customer-row">
              <span className="rlg-customer-label">Customer</span>
              <span className="rlg-customer-value">{customer.customer_name}</span>
            </div>
          </div>
        )}

        {showButton && (
          <button onClick={onRefresh} className="rlg-cta">↺ Retry Connection</button>
        )}

        <div className="rlg-help">Need Help? Contact Support</div>

        <a href="https://imcbs.com" target="_blank" rel="noopener noreferrer" className="rlg-provider-card">
          <span className="rlg-provider-meta">
            <span className="rlg-provider-name">IMCBS</span>
            <span className="rlg-provider-link">Visit website <ExternalLink size={11} /></span>
          </span>
        </a>

        <div className="rlg-secure">
          <Lock size={11} />
          <span>Secure license management system</span>
        </div>
      </div>
    </div>
  </div>
);

// ───────────────────────── Main gate ─────────────────────────
const LicenseGate = ({ children }) => {
  const [licenseData, setLicenseData] = useState(null);
  const [error, setError] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchLicenseData = async () => {
    try {
      const response = await fetch(LICENSE_API_ENDPOINT, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`API returned ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setLicenseData(data);
      setError(null);
    } catch (err) {
      console.error('[License] Fetch failed:', err.message);
      setLicenseData(DEFAULT_LICENSE_DATA);
      setError(err.message);
    }
  };

  const handleManualRefresh = () => {
    setRefreshTick(prev => prev + 1);
  };

  useEffect(() => {
    fetchLicenseData();
    const interval = setInterval(fetchLicenseData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshTick]);

  if (!licenseData) return children;

  const customer = licenseData?.customers?.find(c => c.client_id === CURRENT_CLIENT_ID);

  if (!customer) {
    return (
      <BlockShell
        badgeLead="Wrong"
        badgeAccent="Application"
        message={`This application is licensed for ${CUSTOMER_LABEL} only. Please contact support@imcbs.com.`}
        customer={null}
        onRefresh={handleManualRefresh}
        showButton={true}
      />
    );
  }

  const isExpired = customer.license_validity?.is_expired === true;
  const isActive = (customer.status || '').toLowerCase().trim() === 'active';

  if (isExpired || !isActive) {
    return (
      <BlockShell
        badgeLead="License"
        badgeAccent={isExpired ? 'Expired' : 'Inactive'}
        message={
          isExpired
            ? 'Your application license has expired. Please renew your subscription to continue.'
            : 'Your application license is currently inactive. Please contact your system administrator to activate it.'
        }
        customer={customer}
        onRefresh={handleManualRefresh}
        showButton={true}
      />
    );
  }

  return children;
};

export default LicenseGate;