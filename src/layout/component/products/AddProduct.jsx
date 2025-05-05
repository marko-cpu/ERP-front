import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../../services/product.service";
import WarehouseService from "../../../services/warehouse.service";
import AuthService from "../../../services/auth.service";
import UserLayout from "../../UserLayout";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faSave, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../../assets/style/table-list-styles.css";
import { toast } from "react-toastify";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    measureUnit: "",
    price: "",
    description: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState({
    warehouseName: "",
    location: "",
  });
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

 /*  useEffect(() => {
    WarehouseService.getAllWarehouses(0, 1000)
      .then((response) => setWarehouses(response.data.content))
      .catch((error) => console.error("Error fetching warehouses:", error));
  }, []); */

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!Object.values(formData).every(field => field !== "") /* || !selectedWarehouse.warehouseName || !quantity || !purchasePrice */) {
      setError("Please fill in all required fields");
      return;
    }
  
    const productData = { ...formData, price: parseFloat(formData.price) };
  
    ProductService.addProduct(productData)
      .then((response) => {
        /* const warehousePayload = {
          warehouseName: selectedWarehouse.warehouseName,
          location: selectedWarehouse.location,
          articles: [{
            product: { id: response.data.id },
            purchasePrice: parseFloat(purchasePrice),
            quantity: parseInt(quantity)
          }]
        };
        return ProductService.addProductToWarehouse(warehousePayload); */
      })
      .then(() => {
        toast.success("Product created successfully!");
        setTimeout(() => navigate("/account/productsList"), 1500);
      })
      .catch((error) => {
        toast.error(`Error creating product: ${error.message}`);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <UserLayout>
      <div className="mt-0 ">
        <div className="form-wrapper mx-auto">
          <h2 className="form-title mt-3">
            <FontAwesomeIcon icon={faBox} className="me-2 text-primary mb-3 " />
            Add New Product
          </h2>

          <div className="form-card card shadow-sm ">
            {error && (
              <Alert variant="danger" className="rounded-1">
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="rounded-1">
                {success}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Product Name *
                </Form.Label>
                <Form.Control
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="form-control-custom rounded-1 py-2 px-3"
                  required
                />
              </Form.Group>

              <Form.Group className="">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Measure Unit *
                </Form.Label>
                <Form.Select
                  name="measureUnit"
                  value={formData.measureUnit}
                  onChange={handleChange}
                  className="form-control-custom rounded-1 py-2 px-3"
                  required
                >
                  <option value="">Select Measure Unit</option>
                  <option value="KG">Kilogram (kg)</option>
                  <option value="G">Gram (g)</option>
                  <option value="L">Litre (L)</option>
                  <option value="ML">Millilitre (ml)</option>
                  <option value="PCS">Pieces (pcs)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Price *
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control-custom rounded-1 py-2 px-3"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Category *
                </Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control-custom rounded-1 py-2 px-3"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="ELECTRONICS">Electronics</option>
                  <option value="FASHION">Fashion</option>
                  <option value="HOME">Home</option>
                  <option value="BEAUTY">Beauty</option>
                  <option value="OTHER">Other</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control-custom rounded-1 py-2 px-3"
                />
              </Form.Group>

              {/* <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Warehouse *
                </Form.Label>
                <Form.Select
                  value={`${selectedWarehouse.warehouseName}|${selectedWarehouse.location}`}
                  onChange={(e) => {
                    const [warehouseName, location] = e.target.value.split("|");
                    setSelectedWarehouse({ warehouseName, location });
                  }}
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option
                      key={warehouse.id}
                      value={`${warehouse.warehouseName}|${warehouse.location}`}
                    >
                      {warehouse.warehouseName} - {warehouse.location}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Quantity *
                </Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Purchase Price *
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  required
                />
              </Form.Group> */}

              <div className="d-flex justify-content-end gap-3">
                <Button
                  variant="light"
                  onClick={() => navigate("/account/productsList")}
                  className="btn-light-blue px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="px-4 py-2 shadow-sm"
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save Product
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AddProduct;
