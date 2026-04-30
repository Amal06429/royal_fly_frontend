import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LoginPage from "./pages/login";
import Dashboard from "./pages/Dashboard";
import FlightManagement from "./components/FlightManagement";
import Enquiries from "./components/Enquiries";
import Users from "./components/Users";
import Confirmed from "./pages/Confirmed";
import Layout from "./BaseTemplate/Layout";

// Public
import Home from "./Public/Home";
import Enquire from "./Public/Enquire";
import PublicLayout from "./Public/Publiclayout";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
    setAuthChecked(true);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  if (!authChecked) return null;

  return (
    <Routes>
      {/* 🌍 PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/enquire/:id" element={<Enquire />} />
      </Route>

      {/* 🔓 LOGIN */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

      {/* 🔒 ADMIN */}
      <Route
        element={
          isAuthenticated ? (
            <Layout onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flights" element={<FlightManagement />} />
        <Route path="/enquiries" element={<Enquiries />} />
        <Route path="/confirmed" element={<Confirmed />} />
        <Route path="/users" element={<Users />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
