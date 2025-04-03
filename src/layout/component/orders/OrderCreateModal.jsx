import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Table, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBox,
  faSearch,
  faPlusCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import AuthService from "../../../services/auth.service";
import OrderService from "../../../services/order.service";
import ProductService from "../../../services/product.service";
import UserService from "../../../services/user.service";
import "../../../assets/style/modal-styles.css";
import { toast } from "react-toastify";

const OrderCreateModal = ({ show, handleClose, refreshOrders }) => {
  const [formData, setFormData] = useState({
    userId: "",
    customer: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    },
    products: [],
  });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [existingCustomers, setExistingCustomers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [currentProduct, setCurrentProduct] = useState({
    product: null,
    quantity: 1,
  });
  const [productSearch, setProductSearch] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);

  useEffect(() => {
    if (show) {
      UserService.getCurrentUser()
        .then((response) => {
          setCurrentUser(response.data);
          setFormData((prev) => ({
            ...prev,
            userId: response.data.userId,
          }));
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
      OrderService.getCustomers().then((response) => {
        setExistingCustomers(response.data);
      });
      ProductService.getAllProductsWithoutPagination().then((response) => {
        // console.log("Products response:", response);
        setProducts(response.data || []);
      });
    }
  }, [show]);

  const handleCustomerSearch = (e) => {
    setCustomerSearch(e.target.value);
    OrderService.searchCustomers(e.target.value).then((response) => {
      setExistingCustomers(response.data);
    });
  };

  const selectProduct = (product) => {
    setCurrentProduct((prev) => ({
      ...prev,
      product: product,
    }));
    setProductSearch(product.productName);
    setIsDropdownVisible(false);
  };

  const handleProductSearch = (e) => {
    setProductSearch(e.target.value);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectCustomer = (customer) => {
    setFormData({
      ...formData,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
      },
    });
    setCustomerSearch("");
  };

  const checkExistingCustomer = async () => {
    if (!formData.customer.email) return;
    try {
      const response = await OrderService.checkCustomerExists(
        formData.customer.email
      );
      if (response.data.exists) {
        selectCustomer(response.data.customer);
      }
    } catch (error) {
      console.error("Error checking customer:", error);
    }
  };

  const addProduct = () => {
    if (!currentProduct.product || currentProduct.quantity <= 0) {
      setError("Изаберите производ и унесите валидну количину");
      return;
    }

    const pdvRate = currentProduct.product.pdvRate || 20;
    const price = currentProduct.product.price;
    const quantity = currentProduct.quantity;

    const pdvAmount = (price * quantity * pdvRate) / 100;
    const totalPrice = price * quantity + pdvAmount;

    const newProduct = {
      product: currentProduct.product,
      quantity: quantity,
      pdvRate: pdvRate, // Чувамо стопу на нивоу ставке
      pdv: pdvAmount,
      totalPrice: totalPrice,
    };

    setFormData({
      ...formData,
      products: [...formData.products, newProduct],
    });

    setCurrentProduct({ product: null, quantity: 1 });
    setProductSearch("");
    setError("");
  };
  const removeProduct = (index) => {
    const newProducts = [...formData.products];
    newProducts.splice(index, 1);
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = async () => {
    if (
      !formData.userId ||
      !formData.customer.email ||
      formData.products.length === 0
    ) {
      setError("Please fill all required fields");
      return;
    }

    const customerData = formData.customer.id
      ? { id: formData.customer.id }
      : {
          firstName: formData.customer.firstName,
          lastName: formData.customer.lastName,
          email: formData.customer.email,
          phone: formData.customer.phone,
          address: formData.customer.address,
          city: formData.customer.city,
          postalCode: formData.customer.postalCode,
        };

    // Prepare products with productId
    const orderProducts = formData.products.map((p) => ({
      productId: p.product.id, // Send productId instead of nested product object
      quantity: p.quantity,
    }));

    /*  console.log(
      "Request body:",
      JSON.stringify({
        userId: formData.userId,
        customer: customerData,
        products: formData.products.map((p) => ({
          product: { id: p.product.id },
          quantity: p.quantity,
        })),
      })
    ); */

    try {
      await OrderService.createOrder({
        userId: formData.userId,
        customer: customerData,
        products: formData.products.map((p) => ({
          product: { id: p.product.id },
          quantity: p.quantity,
        })),
      });

      await refreshOrders();
      handleClose();
      toast.success("Order created successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Error creating order: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      className="modal-professional"
    >
      <Modal.Header closeButton className="text-white">
        <Modal.Title className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPlusCircle} />
          Create New Order
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="order-section mb-4">
          <h5 className="section-title mb-3 d-flex align-items-center gap-2 text-primary">
            <FontAwesomeIcon icon={faUser} />
            User & Customer Information
          </h5>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="formUser">
                <Form.Label className="text-secondary">
                  Responsible User *
                </Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={
                    currentUser
                      ? `${currentUser.firstName} ${currentUser.lastName} (${currentUser.email})`
                      : "Loading user data..."
                  }
                  className="bg-light"
                />
                <Form.Text className="text-muted">
                  Current logged in user
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary small fw-semibold mb-2">
                  <FontAwesomeIcon icon={faSearch} className="me-2" />
                  Search Existing Customers
                </Form.Label>
                <div className="position-relative">
                  <div className="input-group border rounded-3 shadow-sm">
                    <span className="input-group-text bg-transparent border-0">
                      <FontAwesomeIcon icon={faSearch} className="text-muted" />
                    </span>
                    <Form.Control
                      type="text"
                      value={customerSearch}
                      onChange={handleCustomerSearch}
                      placeholder="Enter customer Name... "
                      className="border-0 py-2 px-2 focus-ring-0"
                      style={{ outline: "none", boxShadow: "none" }}
                    />
                  </div>

                  {customerSearch && (
                    <div className="position-absolute w-100 mt-1 z-index-1">
                      <div className="bg-white border rounded-2 shadow-lg overflow-hidden">
                        <div
                          className="custom-scrollbar"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {existingCustomers.length > 0 ? (
                            existingCustomers.map((customer) => (
                              <div
                                key={customer.id}
                                onClick={() => selectCustomer(customer)}
                                className="customer-item px-3 py-2 hover-bg-light-primary cursor-pointer transition-all"
                                style={{
                                  borderBottom: "1px solid #f0f0f0",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <div>
                                    <div className="fw-medium text-dark">
                                      {customer.firstName} {customer.lastName}
                                    </div>
                                    <div className="text-muted small">
                                      {customer.email}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-muted small">
                              No customers found for "{customerSearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mt-4 mb-3">Customer Details</h6>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">First Name</Form.Label>
                <Form.Control
                  value={formData.customer.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: {
                        ...formData.customer,
                        firstName: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Last Name</Form.Label>
                <Form.Control
                  value={formData.customer.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: {
                        ...formData.customer,
                        lastName: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: { ...formData.customer, email: e.target.value },
                    })
                  }
                  onBlur={checkExistingCustomer}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Phone</Form.Label>
                <Form.Control
                  value={formData.customer.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: { ...formData.customer, phone: e.target.value },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Address</Form.Label>
                <Form.Control
                  value={formData.customer.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: {
                        ...formData.customer,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">City</Form.Label>
                <Form.Control
                  value={formData.customer.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: { ...formData.customer, city: e.target.value },
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary">Postal Code</Form.Label>
                <Form.Control
                  value={formData.customer.postalCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customer: {
                        ...formData.customer,
                        postalCode: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </div>

        <div className="order-section mb-4">
          <h5 className="section-title mb-3 d-flex align-items-center gap-2 text-primary">
            <FontAwesomeIcon icon={faBox} />
            Products
          </h5>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary">
                  Select Product
                </Form.Label>
                <div className="position-relative">
                  <div className="input-group border rounded-3 shadow-sm">
                    <span className="input-group-text bg-transparent border-0">
                      <FontAwesomeIcon icon={faSearch} className="text-muted" />
                    </span>
                    <Form.Control
                      type="text"
                      value={productSearch}
                      onChange={handleProductSearch}
                      placeholder="Search products..."
                      className="border-0 py-2 px-2 focus-ring-0"
                      style={{ outline: "none", boxShadow: "none" }}
                    />
                  </div>

                  {isDropdownVisible && productSearch && (
                    <div className="position-absolute w-100 mt-1 z-index-1">
                      <div className="bg-white border rounded-2 shadow-lg overflow-hidden">
                        <div
                          className="custom-scrollbar"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => selectProduct(product)}
                                className="customer-item px-3 py-2 hover-bg-light-primary cursor-pointer transition-all"
                                style={{
                                  borderBottom: "1px solid #f0f0f0",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <div className="d-flex align-items-center justify-content-between">
                                  <div>
                                    <div className="fw-medium text-dark">
                                      {product.productName} ({product.sku})
                                    </div>
                                    <div className="text-muted small">
                                      Price: €{product.price.toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-muted small">
                              No products found for "{productSearch}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label className="text-secondary">Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={currentProduct.quantity}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="text-secondary">PDV (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  value={currentProduct.pdvRate}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      pdv: parseInt(e.target.value),
                    })
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="light-blue" onClick={addProduct}>
                <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                Add Product
              </Button>
            </Col>
          </Row>

          {formData.products.length > 0 && (
            <div className="table-responsive">
              <Table hover className="product-table">
                <thead className="bg-primary text-white">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th className="text-center">Qty</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">PDV</th>
                    <th className="text-end">Износ PDV</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.products.map((product, index) => (
                    <tr key={index}>
                      <td>{product.product.productName}</td>
                      <td>{product.product.sku}</td>
                      <td className="text-center">{product.quantity}</td>
                      <td className="text-end">
                        €{product.product.price.toFixed(2)}
                      </td>
                      <td className="text-end">{product.pdvRate}%</td>
                      <td className="text-end">€{product.pdv}</td>
                      <td className="text-end fw-bold">
                        €{product.totalPrice.toFixed(2)}
                      </td>
                      <td className="text-end">
                        <Button
                          variant="link"
                          className="text-danger"
                          onClick={() => removeProduct(index)}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="light-blue" onClick={handleSubmit}>
          Create Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderCreateModal;
