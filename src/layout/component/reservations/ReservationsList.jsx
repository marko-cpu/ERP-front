import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import "../../../assets/style/table-list-styles.css";
import { toast } from "react-toastify";
import ReservationService from "../../../services/reservation.service";
import {
  faSearch,
  faBoxOpen,
  faEdit
} from "@fortawesome/free-solid-svg-icons";

export const ReservationsList = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchReservations();
  }, [currentPage, pageSize]);

  const fetchReservations = () => {
    ReservationService.getAllReservations(currentPage, pageSize)
      .then(response => {
        setReservations(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch(error => {
        toast.error("Error fetching reservations");
        setLoading(false);
      });
  };

  const handleEditClick = (reservation) => {
    // Implement edit logic
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

  const filteredReservations = reservations.filter(reservation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.id.toString().includes(searchTerm) ||
      (reservation.product?.name?.toLowerCase() || "").includes(searchLower) ||
      reservation.quantity.toString().includes(searchTerm) ||
      reservation.status?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <UserLayout>
      <div className="content p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fs-2 fw-semibold form-title">
            <FontAwesomeIcon icon={faBoxOpen} className="me-2 text-primary" />
            Reservations
          </h2>
          <div className="d-flex gap-3 w-50">
            <div className="input-group flex-grow-1">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search reservations..."
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
                  <tr>
                    <th className="ps-4 py-3">ID</th>
                    <th className="py-3">Product</th>
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Reservation Date</th>
                    <th className="py-3">Status</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map(reservation => (
                    <tr key={reservation.id} className="transition-all">
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">
                          #{reservation.id}
                        </div>
                      </td>
                      <td>{reservation.product?.name || "N/A"}</td>
                      <td>#{reservation.order?.id || "N/A"}</td>
                      <td>{reservation.quantity}</td>
                      <td>{formatDate(reservation.reservationDate)}</td>
                      <td>
                        <span className={`badge ${
                          reservation.status === 'ACTIVE' ? 'bg-success' : 
                          reservation.status === 'EXPIRED' ? 'bg-danger' : 'bg-warning'
                        }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 float-end">
                          <button
                            className="btn btn-sm btn-light-blue"
                            onClick={() => handleEditClick(reservation)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination controls... (same as in AccountingList) */}
          </>
        )}
      </div>
    </UserLayout>
  );
};