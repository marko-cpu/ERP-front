import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ArticleWarehouseService from "../../../services/articleWarehouse.service.jsx";
import EditProductWarehouseModal from "./EditProductWarehouseModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxes,
  faSearch,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";
import UserLayout from "../../UserLayout";
import { toast } from "react-toastify";

const ArticleWarehouseList = () => {
  const { warehouseId } = useParams();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const location = useLocation();
  const warehouse = location.state?.warehouse;
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [articleWarehouseToDelete, setArticleWarehouseToDelete] =
    useState(null);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, pageSize]);

  const fetchArticles = () => {
    ArticleWarehouseService.getArticlesByWarehouse(
      warehouseId,
      currentPage,
      pageSize
    ).then(
      (response) => {
        setArticles(response.data?.content || []);
        setTotalPages(response.data?.totalPages || 0);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching articles", error);
        setLoading(false);
      }
    );
  };

  const handleEditClick = (article) => {
    setSelectedArticle(article);
    setShowEditModal(true);
  };

  const handleUpdateArticle = (articleId, updatedData) => {
    ArticleWarehouseService.updateArticleWarehouse(
      articleId,
      updatedData.quantity,
      updatedData.purchasePrice
    )
      .then(() => {
        toast.success("Article updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchArticles();
      })
      .catch((error) => {
        toast.error(`Error updating article: ${error.message}`);
      });
  };

  const filteredArticles = articles.filter((article) => {
    return (
      article.product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      article.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async () => {
    try {
      ArticleWarehouseService.deleteArticleWarehouse(articleWarehouseToDelete);
      toast.success("Article deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchArticles();
    } catch (error) {
    } finally {
      setShowDeleteConfirm(false);
      setArticleWarehouseToDelete(null);
    }
  };

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
        <h2 className="fs-2 fw-semibold form-title pb-4">
          <FontAwesomeIcon icon={faBoxes} className="me-2 text-primary" />
          {warehouse.warehouseName}
        </h2>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fs-2 fw-semibold form-title">
            <FontAwesomeIcon icon={faBoxes} className="me-2 text-primary" />
            Warehouse Articles
          </h2>
          <div className="w-50">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search articles..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {/*  <button
            className="btn btn-light-blue d-flex align-items-center gap-2"
            onClick={() => navigate("/account/add-product-warehouse", { 
              state: { warehouseId: warehouse.id } 
            })}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Product
          </button> */}
        </div>
        <button
          className="btn btn btn-sm btn-light-blue d-flex align-items-center mb-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" /> Back
        </button>

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
                    <th className="ps-4 py-3">SKU</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Purchase Price</th>
                    <th className="pe-5 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="transition-all text-center">
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">
                          {article.product.sku}
                        </div>
                      </td>
                      <td>{article.product.productName}</td>
                      <td>{article.quantity}</td>
                      <td>${article.purchasePrice.toFixed(2)}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-light-blue me-2"
                          onClick={() => handleEditClick(article)}
                        >
                          <FontAwesomeIcon icon={faPlus} className="me-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            setArticleWarehouseToDelete(article.id);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                          Delete
                        </button>
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
      {showEditModal && (
        <EditProductWarehouseModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          article={selectedArticle}
          onSave={handleUpdateArticle}
        />
      )}
    </UserLayout>
  );
};

export default ArticleWarehouseList;
