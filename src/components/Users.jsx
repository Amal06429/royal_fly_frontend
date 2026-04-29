import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Plus, Trash2 } from "lucide-react";
import AddUserModal from "./AddUserModal";

const Users = () => {
  const navigate = useNavigate()

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = user.is_admin || false

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Redirect non-admins to dashboard
  useEffect(() => {
    // Only redirect if we have user data and they're not admin
    if (Object.keys(user).length > 0 && !isAdmin) {
      navigate('/dashboard')
    }
  }, [isAdmin, navigate, user])

  // Fetch users list
  const fetchUsers = () => {
    setLoading(true);
    setAuthError(false);
    api.get("users/")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load users", err);
        
        // Handle 401 - unauthorized, redirect to login
        if (err.response?.status === 401) {
          setAuthError(true);
          localStorage.clear();
          navigate('/login');
          return;
        }
        
        setLoading(false);
      });
  };

  useEffect(() => {
    // Only fetch if user is admin
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  // Handle delete user
  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      api.delete(`users/${userId}/`)
        .then(res => {
          setUsers(users.filter(u => u.id !== userId));
          alert("User deleted successfully");
        })
        .catch(err => {
          console.error("Failed to delete user", err);
          const errorMsg = err.response?.data?.error || err.message || "Failed to delete user";
          alert(errorMsg);
        });
    }
  };

  // Handle user created
  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={styles.addButton}
        >
          <Plus size={18} /> Add User
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : users.length === 0 ? (
        <div style={styles.noData}>No users found</div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Password</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.td}>{user.username}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.password || "N/A"}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      style={styles.deleteButton}
                      title="Delete user"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddUserModal 
          onClose={() => setShowModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    flex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#183d68",
    margin: 0,
  },
  addButton: {
    background: "#f06400",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background 0.3s",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "16px",
    color: "#666",
  },
  noData: {
    textAlign: "center",
    padding: "40px",
    fontSize: "16px",
    color: "#999",
  },
  tableContainer: {
    overflowX: "auto",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    background: "#183d68",
    color: "white",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
  },
  tableRow: {
    borderBottom: "1px solid #e0e0e0",
    transition: "background 0.2s",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#333",
  },
  deleteButton: {
    background: "#ff4444",
    color: "white",
    border: "none",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s",
  },
};

export default Users;
