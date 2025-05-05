import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "warning" },
];

const ReservationEditModal = ({ show, handleClose, reservation, onSave }) => {
  const [formData, setFormData] = useState({
    quantity: 0,
    status: "PENDING",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reservation) {
      setFormData({
        quantity: reservation.quantity,
        status: reservation.status.toUpperCase(),
      });
    }
  }, [reservation]);

  const handleSubmit = () => {
    setLoading(true);
    onSave(reservation.id, formData);
    setLoading(false);
    handleClose();
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Edit Reservation #{reservation?.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reservation && (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-secondary">Product</Form.Label>
                  <Form.Control
                    plaintext
                    readOnly
                    value={reservation.productName || "N/A"}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-secondary">Order ID</Form.Label>
                  <Form.Control
                    plaintext
                    readOnly
                    value={`#${reservation.orderId || "N/A"}`}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-secondary">
                    Reservation Date
                  </Form.Label>
                  <Form.Control
                    plaintext
                    readOnly
                    value={formatDate(reservation.reservationDate)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="text-secondary">
                    Current Status:
                  </Form.Label>
                  <div
                    className={`badge bg-${
                      statusOptions.find((s) => s.value === formData.status)
                        ?.color
                    }`}
                  >
                    {formData.status}
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary">Quantity</Form.Label>
                  <Form.Control value={formData.quantity} redOnly />
                </Form.Group>
              </Col>
              {/* <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-secondary">New Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col> */}
            </Row>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Cancel
        </Button>
        {/* <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export default ReservationEditModal;
