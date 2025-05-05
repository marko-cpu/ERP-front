import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerService from "../../../services/customer.service";
import CustomerEditModal from "./CustomerEditModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import {
  faCircleCheck,
  faCircle,
  faEdit,
  faSearch,
  faUsers,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "../../../assets/style/table-list-styles.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [customerToDelete, setCustomerToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, pageSize]);

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.getAllCustomers(
        currentPage,
        pageSize
      );
      setCustomers(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching customers");
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };
 const handleDelete = async () => {
  try {
    await CustomerService.deleteCustomer(customerToDelete);
    toast.success("Customer deleted successfully");
    fetchCustomers();
  } catch (error) {
    // Provera za specifičnu grešku
    if (error.response && error.response.data.includes("cannot be deleted")) {
      toast.error("Customer cannot be deleted because they have associated orders");
    } else {
      toast.error(`Error deleting customer: ${error.message}`);
    }
  } finally {
    setShowDeleteConfirm(false);
  }
};

  const handleUpdateCustomer = (customerId, updatedData) => {
    CustomerService.updateCustomer(customerId, updatedData)
      .then(() => {
        toast.success("Customer updated successfully");
        fetchCustomers();
      })
      .catch((error) => {
        toast.error(`Error updating customer: ${error.message}`);
      });
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchContent =
      `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.phone} ${customer.address}`.toLowerCase();
    return searchContent.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <UserLayout>
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="delete-confirm-modal">
              <h5>Confirm Delete</h5>
              <p>Are you sure you want to delete this order?</p>
              <div className="modal-buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="content p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-2 fw-semibold form-title">
              <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
              Customers
            </h2>
            <div className="w-50">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive rounded-3 shadow-sm border border-light-subtle">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-primary text-white">
                    <tr className="text-center">
                      <th className="ps-4 py-3 text-uppercase small">Name</th>
                      <th className="py-3 text-uppercase small">Address</th>
                      <th className="py-3 text-uppercase small">City</th>
                      <th className="py-3 text-uppercase small">Postal Code</th>
                      <th className="py-3 text-uppercase small">Email</th>
                      <th className="py-3 text-uppercase small">Phone</th>
                      <th className="pe-4 py-3 text-uppercase small text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="transition-all text-center">
                        <td className="ps-4">
                          <div className="fw-semibold text-dark">
                            {`${customer.firstName} ${customer.lastName}`}
                          </div>
                        </td>
                        <td>{customer.address}</td>
                        <td>{customer.city}</td>
                        <td>{customer.postalCode}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end">
                          <button
                            className="btn btn-sm btn-light-blue me-2"
                            onClick={() => handleEditClick(customer)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setCustomerToDelete(customer.id);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            Delete
                          </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <button
                    className="btn btn-light-blue"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </button>
                  <span className="mx-2">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    className="btn btn-light-blue"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1 || totalPages === 0}
                  >
                    Next
                  </button>
                </div>
                <div>
                  <select
                    className="form-select"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </UserLayout>
      <CustomerEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        customer={selectedCustomer}
        onSave={handleUpdateCustomer}
      />
    </>
  );
};

export default CustomerList;
