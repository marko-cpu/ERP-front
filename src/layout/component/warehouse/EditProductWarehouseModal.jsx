// EditProductWarehouseModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import "./../../../assets/style/modal-styles.css";

const EditProductWarehouseModal = ({ 
  show, 
  handleClose, 
  article, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    quantity: 0,
    purchasePrice: 0.0
  });

  useEffect(() => {
    if (article) {
      setFormData({
        quantity: article.quantity || 0,
        purchasePrice: article.purchasePrice || 0.0
      });
    }
  }, [article]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : parseFloat(value)
    }));
  };

  const handleSubmit = () => {
    if (formData.quantity < 0 || formData.purchasePrice < 0) {
      toast.error("Values cannot be negative");
      return;
    }
    onSave(article.id, formData);
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      className="modal-professional"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Article Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="quantity">
                <Form.Label className="form-label-emphasized">
                  Quantity
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="purchasePrice">
                <Form.Label className="form-label-emphasized">
                  Purchase Price
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
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

export default EditProductWarehouseModal;