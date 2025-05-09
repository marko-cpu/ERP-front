import React, { useEffect, useState } from "react";
import AccountingService from "../../../services/accounting.service.jsx";
import OrderService from "../../../services/order.service.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout.jsx";
import AccountingEditModal from "./AccountingEditModal.jsx";
import "../../../assets/style/table-list-styles.css";
import { toast } from "react-toastify";
import {
  faSearch,
  faCalculator,
  faEdit,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const AccountingList = () => {
  const [accountings, setAccountings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  /*  const [selectedState, setSelectedState] = useState("all"); */
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccounting, setSelectedAccounting] = useState(null);
  const [showConfirmPay, setShowConfirmPay] = useState(false);
  const [accToPay, setAccToPay] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchAccountings();
  }, [currentPage, pageSize, selectedStatus]);

  const fetchAccountings = () => {
    const params = {
      page: currentPage,
      size: pageSize,
      status: selectedStatus !== "all" ? selectedStatus : null,
    };

    AccountingService.getAllAccountings(params).then(
      (response) => {
        setAccountings(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching accountings", error);
        setLoading(false);
      }
    );
  };

  const handlePay = async () => {
    if (!accToPay) return;

    OrderService.payInvoice(accToPay.id, accToPay.totalPrice)
      .then(() => {
        toast.success("Payment successful!");
        fetchAccountings();
      })
      .catch((error) => {
        toast.error("Payment failed: " + error.response?.data);
      })
      .finally(() => {
        setShowConfirmPay(false);
        setAccToPay(null);
      });
  };

  const handleEditClick = async (accounting) => {
    try {
      const response = await AccountingService.getAccountingById(accounting.id);
      setSelectedAccounting(response.data);
      setShowEditModal(true);
    } catch (error) {
      toast.error("Error fetching accounting details");
    }
  };

  const handleUpdateAccounting = (id, updatedData) => {
    AccountingService.updateAccounting(id, updatedData)
      .then(() => {
        fetchAccountings();
        toast.success("Accounting entry updated successfully");
      })
      .catch((error) => {
        toast.error(`Error updating entry: ${error.message}`);
      });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  /* const handleDelete = (id) => {
      if (
        window.confirm("Are you sure you want to delete this accounting entry?")
      ) {
        AccountingService.deleteAccounting(id)
          .then(() => {
            fetchAccountings();
            toast.success("Accounting deleted successfully");
          })
          .catch((error) => {
            toast.error(`Error deleting accounting: ${error.message}`);
          });
      }
    }; */

  const filteredAccountings = accountings.filter((accounting) => {
    const order = accounting.order || {};
    const user = order.user || {};
    const searchLower = searchTerm.toLowerCase();

    return (
      accounting.id.toString().includes(searchTerm) ||
      (user.firstName?.toLowerCase() || "").includes(searchLower) ||
      (user.lastName?.toLowerCase() || "").includes(searchLower) ||
      accounting.totalPrice.toString().includes(searchTerm)
    );
  });

  return (
    <UserLayout>
      {showConfirmPay && (
        <div className="modal-overlay">
          <div className="delete-confirm-modal">
            <h5>Confirm Payment</h5>
            <p>Are you sure you want to mark this as paid?</p>
            <div className="modal-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmPay(false)}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handlePay}>
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="content p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fs-2 fw-semibold form-title">
            <FontAwesomeIcon
              icon={faCalculator}
              className="me-2 text-primary"
            />
            Accounting Entries
          </h2>
          <div className="d-flex gap-3 w-50">
            <div className="input-group flex-grow-1">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search accountings..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="input-group w-28">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faFilter} />
              </span>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="0">Pending</option>
                <option value="1">Paid</option>
              </select>
            </div>
            {/*  <div className="input-group w-25">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faFilter} />
                </span>
                  <select
                  className="form-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="all">All States</option>
                  <option value="2">State 2</option>
                </select>
              </div> */}
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
                    <th className="ps-4 py-3">ID</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Expiration Date</th>
                    <th className="py-3">Total</th>
                    <th className="py-3">Status</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccountings.map((accounting) => {
                    const order = accounting.order || {};
                    const user = order.user || {};

                    return (
                      <tr
                        key={accounting.id}
                        className="transition-all text-center"
                      >
                        <td className="ps-4">
                          <div className="fw-semibold text-dark">
                            #{accounting.id}
                          </div>
                        </td>
                        <td>
                          {user.firstName} {user.lastName}
                        </td>
                        <td>#{order.id || "N/A"}</td>
                        <td>{formatDate(accounting.date)}</td>
                        <td>€{accounting.totalPrice.toFixed(2)}</td>
                        <td>
                          <span
                            className={`badge ${
                              accounting.state === 1
                                ? "bg-success"
                                : accounting.state === 2
                                ? "bg-danger"
                                : "bg-warning"
                            }`}
                          >
                            {accounting.state === 1
                              ? "Paid"
                              : accounting.state === 2
                              ? "Overdue"
                              : "Pending"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 float-end">
                            <button
                              className="btn btn-sm btn-light-blue"
                              onClick={() => handleEditClick(accounting)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-1" />
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                setAccToPay({
                                  id: accounting.id,
                                  totalPrice: accounting.totalPrice,
                                });
                                setShowConfirmPay(true);
                              }}
                              disabled={accounting.state !== 0}
                            >
                              Pay
                            </button>
                            {/*  <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(accounting.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="me-1"
                                />
                                Delete
                              </button>{" "} */}
                            {/*   <button
                                className="btn btn-sm btn-outline-secondary float-end"
                                onClick={() => {
                                  AccountingService.downloadAccountingReport(
                                    accounting.id
                                  ).then((response) => {
                                    const url = window.URL.createObjectURL(
                                      new Blob([response.data])
                                    );
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.setAttribute(
                                      "download",
                                      `accounting_${accounting.id}.pdf`
                                    );
                                    document.body.appendChild(link);
                                    link.click();
                                  });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faFilePdf}
                                  className="me-1"
                                />
                                Report
                              </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
      <AccountingEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        accounting={selectedAccounting}
        onSave={handleUpdateAccounting}
      />
    </UserLayout>
  );
};

export default AccountingList;
