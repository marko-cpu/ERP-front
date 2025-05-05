import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import "../../../assets/style/modal-styles.css";

const InvoiceEditModal = ({ show, handleClose, invoice, onSave, readOnlyMode = true }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    payDate: "",
    totalPrice: 0,
    customer: {
      firstName: "",
      lastName: "",
      email: "",
      address: ""
    },
    order: {
      id: "",
      products: []
    },
    accounting: {
      id: "",
      date: ""
    }
  });

  useEffect(() => {
    if (invoice) {
      const accounting = invoice.accounting || {};
      const order = accounting.order || {};
      const customer = order.customer || {};

      setFormData({
        invoiceNumber: invoice.invoiceNumber || "",
        payDate: invoice.payDate?.split("T")[0] || "",
        totalPrice: invoice.totalPrice || 0,
        customer: {
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          email: customer.email || "",
          address: customer.address || ""
        },
        order: {
          id: order.id || "",
          products: order.productList || []
        },
        accounting: {
          id: accounting.id || "",
          date: accounting.date?.split("T")[0] || ""
        }
      });
    }
  }, [invoice]);

  const handleInputChange = (path, value) => {
    setFormData(prev => ({
      ...prev,
      [path]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    if (!formData.invoiceNumber || !formData.payDate) {
      toast.error("Invoice number and date are required");
      return;
    }

    const updatedData = {
      ...formData,
      accounting: {
        id: formData.accounting.id,
        date: formData.accounting.date,
        order: {
          id: formData.order.id,
          customer: formData.customer
        }
      }
    };

    onSave(invoice.id, updatedData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" className="modal-professional">
      <Modal.Header closeButton>
        <Modal.Title>Edit Invoice {formData.invoiceNumber}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Основне информације */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Invoice Number *</Form.Label>
                <Form.Control
                  value={formData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  readOnly={readOnlyMode}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Issue Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.payDate}
                  onChange={(e) => handleInputChange('payDate', e.target.value)}
                  disabled={readOnlyMode}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label className="text-secondary">Total Amount (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                  disabled={readOnlyMode}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Информације о купцу */}
          <div className="section-header mb-3">Customer Details</div>
          <Row className="mb-4">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-secondary">First Name</Form.Label>
                <Form.Control
                  value={formData.customer.firstName}
                  onChange={(e) => handleNestedChange('customer', 'firstName', e.target.value)}
                  readOnly={readOnlyMode}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="text-secondary">Last Name</Form.Label>
                <Form.Control
                  value={formData.customer.lastName}
                  onChange={(e) => handleNestedChange('customer', 'lastName', e.target.value)}
                  readOnly={readOnlyMode}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary">Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) => handleNestedChange('customer', 'email', e.target.value)}
                  readOnly={readOnlyMode}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Информације о поруџбини */}
          <div className="section-header mb-3">Order Details</div>
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary">Order ID</Form.Label>
                <Form.Control
                  value={formData.order.id}
                  readOnly
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-secondary">Order Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.accounting.date}
                  onChange={(e) => handleNestedChange('accounting', 'date', e.target.value)}
                  disabled={readOnlyMode}
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Листа производа */}
          <div className="section-header mb-3">Products</div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Unit Price</th>
                <th>PDV</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {formData.order.products.map((product, index) => (
                <tr key={index}>
                  <td>{product.product?.productName || "N/A"}</td>
                  <td>{product.quantity}</td>
                  <td>{product.product?.category || "N/A"}</td>
                  <td>{product.product?.measureUnit || "N/A"}</td>
                  <td>€{product.product?.price?.toFixed(2) || "0.00"}</td>
                  <td>€{product.pdv?.toFixed(2) || "0.00"}</td>
                  <td>€{(product?.totalPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Form>
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {!readOnlyMode && (
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceEditModal;
