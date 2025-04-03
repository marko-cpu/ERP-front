import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../../services/product.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductEditModal from "./ProductEditModal";
import UserLayout from "../../UserLayout";
import "../../../assets/style/table-list-styles.css";
import {
  faEdit,
  faTrash,
  faSearch,
  faBox,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const fetchProducts = () => {
    ProductService.getAllProducts(currentPage, pageSize).then(
      (response) => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    ProductService.getCategories()
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = (productId, updatedData) => {
    ProductService.updateProduct(productId, updatedData)
      .then(() => {
        toast.success("Product updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchProducts();
      })
      .catch((error) =>
        toast.error(`Error updating Product : ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        })
      );
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };
  const categoryDisplayNames = {
    ELECTRONICS: "Electronics",
    FASHION: "Fashion",
    HOME: "Home",
    BEAUTY: "Beauty",
    OTHER: "Other",
  };

  return (
    <UserLayout>
      <div className="content p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="fs-2 fw-semibold form-title">
            <FontAwesomeIcon icon={faBox} className="me-2 text-primary" />
            Products
          </h2>
          <div className="w-50">
            <div className="input-group">
              <span className="input-group-text">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                placeholder="Search products..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-light-blue d-flex align-items-center gap-2"
            onClick={() => navigate("/account/add-product")}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Product
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
                    <th className="ps-4 py-3">SKU</th>
                    <th className="py-3">Product Name</th>
                    <th className="py-3">Measure Unit</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Description</th>
                    <th className="py-3">Price</th>
                    <th className="pe-4 py-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="transition-all">
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">
                          {product.sku}
                        </div>
                      </td>
                      <td>{product.productName}</td>
                      <td>{product.measureUnit}</td>
                      <td>
                        {product.category ? (
                          categoryDisplayNames[product.category] ||
                          product.category
                        ) : (
                          <span className="text-muted fst-italic">
                            No category
                          </span>
                        )}
                      </td>
                      <td>{product.description || "-"}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-light-blue"
                            onClick={() => handleEditClick(product)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              /* Add delete functionality */
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

        <ProductEditModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          product={selectedProduct}
          onSave={handleUpdateProduct}
        />
      </div>
    </UserLayout>
  );
};

export default ProductList;
