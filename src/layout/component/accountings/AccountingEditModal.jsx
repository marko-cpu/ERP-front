import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "../../../assets/style/modal-styles.css";

const AccountingEditModal = ({ show, handleClose, accounting, onSave }) => {
  const [formData, setFormData] = useState({
    date: "",
    totalPrice: 0,
    order: {
      id: "",
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        createdTime: "",
      },
      products: [],
      state: undefined,
      createdTime: "",
    },

    user: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (accounting) {
      const order = accounting.order || {};
      const customer = order.customer || {};
      const user = order.user || {};
  
      setFormData({
        date: accounting.date?.split("T")[0] || "",
        totalPrice: accounting.totalPrice || 0,
        state: accounting.state || 0, 
        order: {
          id: order.id || "",
          state: order.state || 0, 
          createdTime: order.createdTime || "",
          customer: {
            firstName: customer.firstName || "",
            lastName: customer.lastName || "",
            email: customer.email || "",
            phone: customer.phone || "",
            address: customer.address || "",
            city: customer.city || "",
            postalCode: customer.postalCode || "",
            createdTime: customer.createdTime || "",
          },
          products: order.productList || [],
        },
        user: {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        },
      });
    }
  }, [accounting]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.date || formData.totalPrice <= 0) {
      toast.error("Date and total price are required");
      return;
    }

    const updatedData = {
      ...formData,
      totalPrice: parseFloat(formData.totalPrice),
      state: parseInt(formData.state),
    };

    onSave(accounting.id, updatedData);
    handleClose();
  };

  const getOrderStateLabel = (state) => {
    switch (state) {
      case 1:
        return "Completed";
      case 2:
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="xl"
      className="modal-professional"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Accounting Entry #{accounting?.id}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Accounting Section */}
          <div className="section-header mb-3">Accounting Details</div>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-secondary">Entry Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-secondary">
                  Total Amount (€) *
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-secondary">
                  Payment Status
                </Form.Label>
                <Form.Select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled
                >
                  <option value={1}>Paid</option>
                  <option value={0}>Pending</option>
                  <option value={2}>Overdue</option>
                </Form.Select>
              </Form.Group>
            </Col>

           
          </Row>

          {/* Customer Section */}
          <div className="section-header mb-3">Customer Details</div>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Full Name</Form.Label>
                <Form.Control
                  value={`${formData.order.customer.firstName} ${formData.order.customer.lastName}`}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Contact Info</Form.Label>
                <Form.Control
                  value={`${formData.order.customer.phone} / ${formData.order.customer.email}`}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Address</Form.Label>
                <Form.Control
                  value={`${formData.order.customer.address}, ${formData.order.customer.postalCode} ${formData.order.customer.city}`}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Order Section */}
          <div className="section-header mb-3">Order Details</div>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Order Status</Form.Label>
                <Form.Control
                  value={getOrderStateLabel(formData.state)}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Processed By</Form.Label>
                <Form.Control
                  value={`${formData.user.firstName} ${formData.user.lastName}`}
                  readOnly
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Products Section */}
          <div className="section-header mb-3">Product Details</div>
          <Table striped bordered hover className="mb-4">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>PDV</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.order.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.product?.productName || "N/A"}</td>
                  <td>{product.product?.sku || "N/A"}</td>
                  <td>{product.product?.category || "N/A"}</td>
                  <td>{product.product?.measureUnit || "N/A"}</td>
                  <td>{product.quantity}</td>
                  <td>€{product.pricePerUnit?.toFixed(2) || "0.00"}</td>
                  <td>€{product.pdv?.toFixed(2) || "0.00"}</td>
                  <td>€{product.totalPrice?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="6"></td>
                <td className="text-end">Total:</td>
                <td>
                  €
                  {formData.order.products
                    .reduce((sum, p) => sum + (p.totalPrice || 0), 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountingEditModal;
