import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceService from "../../../services/invoices.service.jsx";
import AuthService from "../../../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import InvoiceEditModal from "./InvoiceEditModal.jsx";
import "../../../assets/style/table-list-styles.css";
import {
  faEdit,
  faTrash,
  faSearch,
  faFileInvoiceDollar,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const canUseInvoicesList = AuthService.hasAnyRole(["ADMIN", "ACCOUNTANT"]);

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, pageSize]);

  const fetchInvoices = () => {
    InvoiceService.getAllInvoices(currentPage, pageSize).then(
      (response) => {
        setInvoices(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
        setLoading(false);
        console.log("Fetched invoices", response.data);
      },
      (error) => {
        console.error("Error fetching invoices", error);
        setLoading(false);
      }
    );
  };

  const handleEditClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleUpdateInvoice = (id, updatedData) => {
    InvoiceService.updateInvoice(id, updatedData)
      .then(() => {
        fetchInvoices();
        toast.success("Invoice updated successfully");
      })
      .catch((error) => {
        toast.error(`Error updating invoice: ${error.message}`);
      });
  };

  const handleDelete = async () => {
    try {
      InvoiceService.deleteInvoice(invoiceToDelete);
      fetchInvoices();
      toast.success("Invoice deleted successfully");
    } catch (error) {
      toast.error(`Error deleting invoice: ${error.message}`);
    } finally {
      setShowDeleteConfirm(false);
      setInvoiceToDelete(null);
    }
  };

  /*   const handleEdit = (id) => {
    navigate(`/invoices/edit/${id}`);
  }; */

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchTerm.toLowerCase();
    const invoiceNumber = invoice.invoiceNumber || "";
    const payDate = formatDate(invoice.payDate)?.toLowerCase() || "";
    const totalPrice = invoice.totalPrice?.toString() || "";

    return (
      invoiceNumber.includes(searchLower) ||
      payDate.includes(searchLower) ||
      totalPrice.includes(searchTerm)
    );
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  return (
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
      {canUseInvoicesList && (
        <div className="content p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-2 fw-semibold form-title">
              <FontAwesomeIcon
                icon={faFileInvoiceDollar}
                className="me-2 text-primary"
              />
              Invoices
            </h2>
            <div className="w-50">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  placeholder="Search invoices..."
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
              <div className="table-responsive rounded-3 shadow-sm">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-primary text-white">
                    <tr className="text-center">
                      <th className="ps-4 py-3">Invoice Number</th>
                      <th className="py-3">Pay Date</th>
                      <th className="py-3">Total Price</th>
                      <th className="py-3">Accounting ID</th>
                      <th className="pe-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead> 
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="transition-all text-center"
                      >
                        <td className="ps-4">
                          <div className="fw-semibold text-dark">
                            {invoice.invoiceNumber || "-"}
                          </div>
                        </td>
                        <td>{formatDate(invoice.payDate) || "-"}</td>
                        <td>€{invoice.totalPrice?.toFixed(2) || "0.00"}</td>
                        <td>{invoice.accounting?.id || "-"}</td>
                        <td>
                          <div className="d-flex gap-2 float-end ">
                            <button
                              className="btn btn-sm btn-light-blue"
                              onClick={() => handleEditClick(invoice)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                              View
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>  {
                                setInvoiceToDelete(invoice.id)
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="me-1"
                              />
                              Delete
                            </button>{" "}
                            <button
                              className="btn btn-sm btn-outline-secondary float-end"
                              onClick={() => {
                                InvoiceService.downloadInvoicePdf(invoice.id)
                                  .then((response) => {
                                    const url = window.URL.createObjectURL(
                                      new Blob([response.data])
                                    );
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.setAttribute(
                                      "download",
                                      `invoice_${invoice.id}.pdf`
                                    );
                                    document.body.appendChild(link);
                                    link.click();
                                    link.remove();
                                  })
                                  .catch((error) => {
                                    toast.error(
                                      `Error downloading PDF: ${error.message}`
                                    );
                                  });
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faFilePdf}
                                className="me-1"
                              />
                              Download PDF
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
      )}
      <InvoiceEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        invoice={selectedInvoice}
        onSave={handleUpdateInvoice}
      />
    </UserLayout>
  );
};

export default InvoiceList;
