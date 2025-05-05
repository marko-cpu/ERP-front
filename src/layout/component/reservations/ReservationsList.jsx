import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import "../../../assets/style/table-list-styles.css";
import { toast } from "react-toastify";
import ReservationService from "../../../services/reservation.service";
import ReservationEditModal from "./ReservationEditModal";
import { faSearch, faBoxOpen, faEdit } from "@fortawesome/free-solid-svg-icons";

export const ReservationsList = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, [currentPage, pageSize]);

  const fetchReservations = () => {
    ReservationService.getAllReservations(currentPage, pageSize)
      .then((response) => {
        setReservations(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
        console.log(response.data);
      })
      .catch((error) => {
        toast.error("Error fetching reservations");
        setLoading(false);
      });
  };

  const handleEditClick = async (reservation) => {
    try {
      const response = await ReservationService.getReservationById(
        reservation.id
      );
      setSelectedReservation(response.data);
      setShowEditModal(true);
    } catch (error) {
      toast.error("Greška pri učitavanju podataka");
    }
  };

  const handleUpdateReservation = (id, updatedData) => {
    ReservationService.updateReservation(id, updatedData)
      .then(() => {
        toast.success("Updated successfully");
        fetchReservations(); // This already uses currentPage/pageSize
      })
      .catch((error) => {
        toast.error("Error updating reservation");
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

  const filteredReservations = (reservations || []).filter((reservation) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.id.toString().includes(searchTerm) ||
      (reservation.productName?.toLowerCase() || "").includes(searchLower) ||
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
                  <tr className="text-center">
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
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="transition-all text-center">
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">
                          #{reservation.id}
                        </div>
                      </td>
                      <td>{reservation?.productName || "N/A"}</td>
                      <td>#{reservation?.orderId || "N/A"}</td>
                      <td>{reservation.quantity}</td>
                      <td>{formatDate(reservation.reservationDate)}</td>
                      <td>
                        <span
                          className={`badge ${
                            reservation.status === "PENDING"
                              ? "bg-warning"
                              : "bg-warning"
                          }`}
                        >
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
                            View
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
                  disabled={currentPage + 1 >= totalPages}
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
      <ReservationEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        reservation={selectedReservation}
        onSave={handleUpdateReservation}
      />
    </UserLayout>
  );
};
