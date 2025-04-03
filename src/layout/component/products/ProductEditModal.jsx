import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./../../../assets/style/modal-styles.css";
import ArticleWarehouseService from "../../../services/articleWarehouse.service";
import ProductService from "../../../services/product.service";

const ProductEditModal = ({ show, handleClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    sku: "",
    productName: "",
    measureUnit: "",
    category: "",
    description: "",
    price: 0,
  });
  const [warehouseData, setWarehouseData] = useState([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        productName: product.productName,
        measureUnit: product.measureUnit,
        category: product.category || "",
        description: product.description || "",
        price: product.price,
      });
      setLoadingWarehouses(true);
      ArticleWarehouseService.getWarehousesByProduct(product.id)
        .then((response) => {
          setWarehouseData(response.data);
          setLoadingWarehouses(false);
        })
        .catch((error) => {
          console.error("Error loading warehouse data:", error);
          setLoadingWarehouses(false);
        });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(product.id, formData);
    handleClose();
  };

  useEffect(() => {
    ProductService.getCategories()
      .then((response) => {
        setCategories(response.data);
        setLoadingCategories(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      });
  }, []);

  const categoryDisplayNames = {
    ELECTRONICS: "Electronics",
    FASHION: "Fashion",
    HOME: "Home",
    BEAUTY: "Beauty",
    OTHER: "Other"
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      className="modal-professional"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="sku">
                <Form.Label className="text-secondary">SKU</Form.Label>
                <Form.Control
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="productName">
                <Form.Label className="text-secondary">Product Name</Form.Label>
                <Form.Control
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="measureUnit">
                <Form.Label className="text-secondary">Measure Unit</Form.Label>
                <Form.Control
                  type="text"
                  name="measureUnit"
                  value={formData.measureUnit}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="category">
                <Form.Label className="text-secondary">Category</Form.Label>
                {loadingCategories ? (
                  <div className="text-center">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <Form.Select
                  name="category"
                  value={formData.category || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryDisplayNames[cat] || cat}
                    </option>
                  ))}
                </Form.Select>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="price">
                <Form.Label className="text-secondary">Price</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-emphasized">
              Description
            </Form.Label>
            <Form.Control
              as="textarea"
              className="textarea-custom form-control-custom"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label-emphasized">
              Warehouse Availability
            </Form.Label>

            {loadingWarehouses ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : warehouseData.length === 0 ? (
              <div className="text-muted">
                Product not found in any warehouses
              </div>
            ) : (
              <div className="table-responsive  shadow-sm">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Warehouse</th>
                      <th>Location</th>
                      <th>Quantity</th>
                      <th>Purchase Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warehouseData.map((item) => (
                      <tr key={item.warehouse.id}>
                        <td>{item.warehouse.warehouseName}</td>
                        <td>{item.warehouse.location}</td>
                        <td>{item.quantity}</td>
                        <td>${item.purchasePrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button
          variant="text-secondary"
          className="btn-cancel"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="text-primary"
          className="btn btn-light-blue"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductEditModal;
