import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleWarehouseService from "../../../services/articleWarehouse.service.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxes, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
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

  const filteredArticles = articles.filter((article) => {
    return (
      article.product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      article.product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      ArticleWarehouseService.deleteArticleWarehouse(id).then(() => {
        toast.success("Article deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchArticles();
      });
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
      <div className="content p-4">
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
        </div>
        <button
          className="btn btn btn-sm btn-light-blue d-flex align-items-center mb-3"
          onClick={() => navigate(-1)} // back to previous page
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
                  <tr>
                    <th className="ps-4 py-3">SKU</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Purchase Price</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="transition-all">
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">
                          {article.product.sku}
                        </div>
                      </td>
                      <td>{article.product.productName}</td>
                      <td>{article.quantity}</td>
                      <td>${article.purchasePrice.toFixed(2)}</td>
                      <div className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            handleDelete(article.id);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="me-1" />
                          Delete
                        </button>
                      </div>
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

export default ArticleWarehouseList;
