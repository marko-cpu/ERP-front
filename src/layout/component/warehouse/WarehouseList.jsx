import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseService from "../../../services/warehouse.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import "../../../assets/style/table-list-styles.css";
import { toast } from "react-toastify";
import {
  faSearch,
  faWarehouse,
  faTrash,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const WarehouseList = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [warehouseToDelete, setWarehouseToDelete] = useState(null);
  

  useEffect(() => {
    fetchWarehouses();
  }, [currentPage, pageSize]);

  const fetchWarehouses = () => {
    WarehouseService.getAllWarehouses(currentPage, pageSize).then(
      (response) => {
        setWarehouses(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching warehouses", error);
        setLoading(false);
      }
    );
  };

  const handleDelete = async () => {
    try {
     await WarehouseService.deleteWarehouse(warehouseToDelete);
      toast.success("Warehouse deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== warehouseToDelete));
    } catch (error) {
      console.error("Error deleting warehouse", error);
      toast.error("Error deleting warehouse", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setWarehouseToDelete(null);
    }
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    return (
      warehouse.warehouseName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="content p-4">
        <div className="d-flex align-items-center justify-content-between mb-4 ">
          <h2 className="fs-2 fw-semibold form-title">
            <FontAwesomeIcon icon={faWarehouse} className="me-2 text-primary" />
            Warehouses
          </h2>
          <div className="w-50">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search warehouses..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-light-blue d-flex align-items-center gap-2"
            onClick={() => navigate("/account/add-warehouse")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Warehouse
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
                    <th className="ps-4 py-3">Name</th>
                    <th className="py-3">Location</th>
                    <th className="pe-4 py-3 text-end ">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWarehouses.map((warehouse) => (
                    <tr key={warehouse.id} className="transition-all">
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">
                          {warehouse.warehouseName}
                        </div>
                      </td>
                      <td>
                        <span className="text-muted">{warehouse.location}</span>
                      </td>
                      <td>
                        <div className="pe-4 text-end">
                          <button
                            className="btn btn-sm btn-light-blue m-1"
                            onClick={() =>
                              navigate(
                                `/account/warehouse/${warehouse.id}/articles`,
                                {
                                  state: { warehouse },
                                }
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faEye} className="me-2" />
                            View Articles
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setWarehouseToDelete(warehouse.id);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
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
  );
};

export default WarehouseList;
