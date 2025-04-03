import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../services/order.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import OrderViewModal from "./OrderViewModal.jsx";
import OrderCreateModal from "./OrderCreateModal.jsx";
import "../../../assets/style/table-list-styles.css";
import {
  faFileInvoice,
  faSearch,
  faEye,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const OrdersList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  const fetchOrders = () => {
    OrderService.getAllOrders(currentPage, pageSize).then(
      (response) => {
        setOrders(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders", error);
        setLoading(false);
      }
    );
  };
  
  const refreshOrders = async () => {
    try {
      setLoading(true);
      setCurrentPage(0);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const response = await OrderService.getAllOrders(0, pageSize);
      setOrders(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setLoading(false);
    }
  };


  const filteredOrders = orders.filter((order) => {
    const user = order.user || {};
    return (
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const calculateOrderTotal = (orderProducts) => {
    return orderProducts.reduce((total, op) => total + op.totalPrice, 0);
  };

  const calculateTotalPDV = (orderProducts) => {
    return orderProducts.reduce((total, op) => total + op.pdv, 0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleViewClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowViewModal(true);
  };

  return (
    <>
      <UserLayout>
        <div className="content p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-2 fw-semibold form-title">
              <FontAwesomeIcon
                icon={faFileInvoice}
                className="me-2 text-primary"
              />
              Orders
            </h2>
            <div className="w-50">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button
              className="btn btn-light-blue d-flex align-items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add New Order
            </button>
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
                    <tr>
                      <th className="ps-4 py-3">Order ID</th>
                      <th className="py-3">User</th>
                      <th className="py-3">Total</th>
                      <th className="py-3">Items</th>
                      <th className="py-3">PDV</th>
                      <th className="pe-4 py-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const user = order.user || {};
                      return (
                        <tr key={order.id} className="transition-all">
                          <td className="ps-4 fw-semibold text-dark">
                            #{order.id}
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-medium">{`${user.firstName} ${user.lastName}`}</span>
                              <small className="text-muted">
                                {user.email || "-"}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-success bg-opacity-10 text-secondary">
                              {calculateOrderTotal(order.productList).toFixed(
                                2
                              )}
                              €
                            </span>
                          </td>
                          <td>
                            <span className="text-primary ">
                              {order.productList.length}
                            </span>
                          </td>
                          <td className="text-secondary">
                            {calculateTotalPDV(order.productList).toFixed(2)}€
                          </td>

                          <td className="pe-4 text-end">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-light-blue"
                                onClick={() => handleViewClick(order.id)}
                              >
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="me-2"
                                />
                                View
                              </button>
                              {/*  <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                               
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="me-2"
                              />
                              Delete
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
      </UserLayout>
      <OrderViewModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        orderId={selectedOrderId}
      />
      <OrderCreateModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        refreshOrders={refreshOrders}
      />
    </>
  );
};

export default OrdersList;
