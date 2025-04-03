// UserEditModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./../../../assets/style/modal-styles.css";
const UserEditModal = ({ show, handleClose, user, roles, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    enabled: false,
    roles: [],
  });

  // Inicijalizacija podataka kada se promijeni user
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
        enabled: user.enabled || false,
        roles: user.roles.map((role) => role.id) || [],
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  const handleSubmit = () => {
    const updatedData = {
      ...formData,
      roles: roles.filter((role) => formData.roles.includes(role.id)),
    };
    onSave(user.userId, updatedData);
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
        <Modal.Title>Edit User Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="firstName">
                <Form.Label className="form-label-emphasized">
                  First Name
                </Form.Label>
                <Form.Control
                  className="form-control-custom"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="lastName">
                <Form.Label className="text-secondary">Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="email">
                <Form.Label className="text-secondary">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="phoneNumber">
                <Form.Label className="text-secondary">Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group controlId="address">
                <Form.Label className="text-secondary">Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group controlId="postalCode">
                <Form.Label className="text-secondary">Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="city">
                <Form.Label className="text-secondary">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="enabled">
                <Form.Label className="text-secondary">Status</Form.Label>
                <div className="d-flex align-items-center mt-2">
                  <Form.Check
                    type="switch"
                    id="enabled-switch"
                    label={formData.enabled ? "Enabled" : "Disabled"}
                    checked={formData.enabled}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        enabled: e.target.checked,
                      }))
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-emphasized">Roles</Form.Label>
            <div className="roles-checkbox-group">
              {roles.map((role) => (
                <div className="role-check-item" key={role.id}>
                  <Form.Check
                    key={role.id}
                    type="checkbox"
                    label={role.name}
                    checked={formData.roles.includes(role.id)}
                    onChange={() => handleRoleChange(role.id)}
                  />
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" className="btn-cancel" onClick={handleClose}>
            Cancel
        </Button>
        <Button variant="primary" className="btn-save" onClick={handleSubmit}>
            Save Changes
        </Button>
    </Modal.Footer>
    </Modal>
  );
};

export default UserEditModal;
