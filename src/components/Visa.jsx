import React, { useState, useEffect } from 'react'
import { Plus, X, Edit, Trash2 } from 'lucide-react'
import api from '../services/api'

const Visa = () => {
  const [visas, setVisas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterPassport, setFilterPassport] = useState('')
  const [filterContact, setFilterContact] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [creatorFilter, setCreatorFilter] = useState('all') // all, admin, user
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    fill_no: '',
    passport_number: '',
    passport_detail: '',
    contact_no: '',
    visa_number: '',
    id_number: '',
    visa_date: '',
    mofa_number: '',
    passport_post_date: '',
    passport_return_date: '',
  })

  // Fetch visas on component mount
  useEffect(() => {
    fetchVisas()
  }, [])

  const fetchVisas = async () => {
    try {
      setLoading(true)
      const response = await api.get('visas/')
      setVisas(response.data)
    } catch (error) {
      console.error('Failed to load visas', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddVisa = async () => {
    try {
      setLoading(true)
      
      // Convert empty strings to null for optional fields
      const cleanedData = Object.keys(formData).reduce((acc, key) => {
        acc[key] = formData[key] === '' ? null : formData[key]
        return acc
      }, {})
      
      if (editingId) {
        // Update visa
        await api.put(`visas/${editingId}/`, cleanedData)
      } else {
        // Create new visa
        await api.post('visas/', cleanedData)
      }
      await fetchVisas()
      resetForm()
      setShowModal(false)
    } catch (error) {
      console.error('Failed to save visa', error)
      console.error('Error response:', error.response?.data)
      alert('Failed to save visa record')
    } finally {
      setLoading(false)
    }
  }

  const handleEditVisa = (visa) => {
    setFormData(visa)
    setEditingId(visa.id)
    setShowModal(true)
  }

  const handleDeleteVisa = async (id) => {
    if (confirm('Are you sure you want to delete this visa record?')) {
      try {
        setLoading(true)
        await api.delete(`visas/${id}/`)
        await fetchVisas()
      } catch (error) {
        console.error('Failed to delete visa', error)
        alert('Failed to delete visa record')
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      fill_no: '',
      passport_number: '',
      passport_detail: '',
      contact_no: '',
      visa_number: '',
      id_number: '',
      visa_date: '',
      mofa_number: '',
      passport_post_date: '',
      passport_return_date: '',
    })
    setEditingId(null)
  }

  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  // Filtering logic
  const filteredVisas = visas.filter(visa => {
    const matchesSearch =
      visa.fill_no.toLowerCase().includes(search.toLowerCase()) ||
      visa.passport_number.includes(search)

    const matchesPassport = filterPassport ? visa.passport_number === filterPassport : true
    const matchesContact = filterContact ? visa.contact_no === filterContact : true
    
    const matchesCreator = 
      creatorFilter === 'all' ? true :
      creatorFilter === 'admin' ? visa.username === 'admin' :
      creatorFilter === 'user' ? visa.username !== 'admin' : true

    return matchesSearch && matchesPassport && matchesContact && matchesCreator
  })

  // Get unique passport numbers and contact numbers for filters
  const uniquePassports = [...new Set(visas.map(v => v.passport_number).filter(Boolean))]
  const uniqueContacts = [...new Set(visas.map(v => v.contact_no).filter(Boolean))]

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredVisas.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVisas = filteredVisas.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  // Format date to "20/05/2026" format (day/month/year)
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString + 'T00:00:00')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div style={styles.container}>
      <style>{`
        table td, table th {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100px;
        }
        table th {
          font-size: 11px;
        }
      `}</style>
      <div style={styles.header}>
        <h1 style={styles.title}>Visa Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={styles.addButton}
          disabled={loading}
        >
          <Plus size={20} style={{ marginRight: '8px' }} />
          Add 
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div style={styles.filtersSection}>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search (Fill NO / Passport):</label>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search by Fill NO or Passport Number"
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Passport Number:</label>
            <select
              value={filterPassport}
              onChange={(e) => {
                setFilterPassport(e.target.value)
                setCurrentPage(1)
              }}
              style={styles.filterInput}
            >
              <option value="">All Passports</option>
              {uniquePassports.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Contact NO:</label>
            <select
              value={filterContact}
              onChange={(e) => {
                setFilterContact(e.target.value)
                setCurrentPage(1)
              }}
              style={styles.filterInput}
            >
              <option value="">All Contacts</option>
              {uniqueContacts.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Created By:</label>
            <select
              value={creatorFilter}
              onChange={(e) => {
                setCreatorFilter(e.target.value)
                setCurrentPage(1)
              }}
              style={styles.filterInput}
            >
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      {loading && visas.length === 0 ? (
        <div style={styles.loadingState}>
          <p style={styles.loadingText}>Loading visa records...</p>
        </div>
      ) : visas.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No visa records added yet</p>
          <p style={styles.emptySubtext}>Click "Add Visa" to create a new record</p>
        </div>
      ) : filteredVisas.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No visa records found</p>
          <p style={styles.emptySubtext}>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>Sl No</th>
                  <th style={styles.th}>Fill No</th>
                  <th style={styles.th}>Passport Number</th>
                  <th style={styles.th}>Passport Detail</th>
                  <th style={styles.th}>Contact No</th>
                  <th style={styles.th}>Visa Number</th>
                  <th style={styles.th}>Id Number</th>
                  <th style={styles.th}>Visa Date</th>
                  <th style={styles.th}>Mofa Number</th>
                  <th style={styles.th}>Passport Post Date</th>
                  <th style={styles.th}>Passport Return</th>
                  <th style={styles.th}>Created By</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
              {paginatedVisas.map((visa, index) => (
                <tr key={visa.id} style={styles.bodyRow}>
                  <td style={styles.td}>{startIndex + index + 1}</td>
                  <td style={styles.td}>{visa.fill_no}</td>
                  <td style={styles.td}>{visa.passport_number}</td>
                  <td style={styles.td}>{visa.passport_detail}</td>
                  <td style={styles.td}>{visa.contact_no}</td>
                  <td style={styles.td}>{visa.visa_number}</td>
                  <td style={styles.td}>{visa.id_number}</td>
                  <td style={styles.td}>{formatDate(visa.visa_date)}</td>
                  <td style={styles.td}>{visa.mofa_number}</td>
                  <td style={styles.td}>{formatDate(visa.passport_post_date)}</td>
                  <td style={styles.td}>{formatDate(visa.passport_return_date)}</td>
                  <td style={styles.td}>{visa.username || 'User'}</td>
                  <td style={styles.actionTd}>
                    <button
                      onClick={() => handleEditVisa(visa)}
                      style={styles.editButton}
                      title="Edit"
                      disabled={loading}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVisa(visa.id)}
                      style={styles.deleteButton}
                      title="Delete"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        <div style={styles.paginationContainer}>
          <div style={styles.paginationInfo}>
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredVisas.length)} of {filteredVisas.length} records
          </div>
          <div style={styles.paginationControls}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...styles.paginationButton,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Previous
            </button>
            {Array.from({ length: Math.min(6, totalPages) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={
                  page === currentPage
                    ? { ...styles.paginationButton, ...styles.paginationButtonActive }
                    : styles.paginationButton
                }
              >
                {page}
              </button>
            ))}
            {/* Show ... and last page if total pages > 6 */}
            {totalPages > 6 && (
              <>
                <span style={{...styles.paginationButton, background: "transparent", border: "none", cursor: "default", padding: "0 4px"}}>
                  ...
                </span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  style={
                    totalPages === currentPage
                      ? { ...styles.paginationButton, ...styles.paginationButtonActive }
                      : styles.paginationButton
                  }
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                ...styles.paginationButton,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingId ? 'Edit Visa' : 'Add New Visa'}</h2>
              <button 
                onClick={closeModal}
                style={styles.closeButton}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={styles.formContainer}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fill NO:</label>
                  <input
                    type="text"
                    name="fill_no"
                    value={formData.fill_no}
                    onChange={handleInputChange}
                    placeholder="Enter Fill NO"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Passport Number:</label>
                  <input
                    type="text"
                    name="passport_number"
                    value={formData.passport_number}
                    onChange={handleInputChange}
                    placeholder="Enter Passport Number"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Passport Detail:</label>
                  <input
                    type="text"
                    name="passport_detail"
                    value={formData.passport_detail}
                    onChange={handleInputChange}
                    placeholder="Enter Passport Detail"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Contact NO:</label>
                  <input
                    type="tel"
                    name="contact_no"
                    value={formData.contact_no}
                    onChange={handleInputChange}
                    placeholder="Enter Contact NO"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Visa Number:</label>
                  <input
                    type="text"
                    name="visa_number"
                    value={formData.visa_number}
                    onChange={handleInputChange}
                    placeholder="Enter Visa Number"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ID Number:</label>
                  <input
                    type="text"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleInputChange}
                    placeholder="Enter ID Number"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Visa Date:</label>
                  <input
                    type="date"
                    name="visa_date"
                    value={formData.visa_date}
                    onChange={handleInputChange}
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>MOFA Number:</label>
                  <input
                    type="text"
                    name="mofa_number"
                    value={formData.mofa_number}
                    onChange={handleInputChange}
                    placeholder="Enter MOFA Number"
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Passport Post Date:</label>
                  <input
                    type="date"
                    name="passport_post_date"
                    value={formData.passport_post_date}
                    onChange={handleInputChange}
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Passport Return Date:</label>
                  <input
                    type="date"
                    name="passport_return_date"
                    value={formData.passport_return_date}
                    onChange={handleInputChange}
                    style={styles.input}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button 
                onClick={closeModal}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddVisa}
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingId ? 'Update Visa' : 'Add Visa')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '16px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  },
  addButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  filtersSection: {
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '16px',
    border: '1px solid #e5e7eb',
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  filterInput: {
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '12px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  loadingState: {
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  },
  loadingText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px 16px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '0 0 6px 0',
  },
  emptySubtext: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  },
  headerRow: {
    backgroundColor: '#183d68',
    color: 'white',
  },
  th: {
    padding: '8px 6px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '12px',
    borderBottom: '2px solid #e5e7eb',
    whiteSpace: 'nowrap',
  },
  bodyRow: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '8px 6px',
    color: '#374151',
    fontSize: '13px',
  },
  actionTd: {
    padding: '8px 6px',
    display: 'flex',
    gap: '4px',
  },
  editButton: {
    backgroundColor: "transparent",
    color: "#3B82F6",
    border: "2px solid #3B82F6",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "32px",
    minHeight: "32px",
  },
  deleteButton: {
    backgroundColor: "transparent",
    color: "#DC2626",
    border: "2px solid #DC2626",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
    minWidth: "32px",
    minHeight: "32px",
  },
  editButtonDisabled: {
    backgroundColor: '#dbeafe',
    color: '#0284c7',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  deleteButtonDisabled: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: 0,
  },
  formContainer: {
    marginBottom: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  input: {
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '12px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '12px',
    marginTop: '12px',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  cancelButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  submitButton: {
    backgroundColor: '#ff6b35',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '6px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  paginationInfo: {
    fontSize: '12px',
    color: '#6b7280',
  },
  paginationControls: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  paginationButton: {
    padding: '6px 10px',
    border: '1px solid #d1d5db',
    backgroundColor: 'white',
    color: '#374151',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  paginationButtonActive: {
    backgroundColor: '#ff6b35',
    color: 'white',
    borderColor: '#ff6b35',
  },
}

export default Visa
