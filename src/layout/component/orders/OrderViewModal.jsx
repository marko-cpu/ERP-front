import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import OrderService from "../../../services/order.service";
import "../../../assets/style/modal-styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faUser, faBoxes, faCalendarCheck, faEuroSign } from "@fortawesome/free-solid-svg-icons";


const OrderViewModal = ({ show, handleClose, orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && show) {
      OrderService.getOrderById(orderId)
        .then((response) => {
          setOrder(response.data);
          setLoading(false);
          console.log(response.data);
          
        })
        .catch((error) => {
          console.error("Error fetching order details:", error);
          setLoading(false);
        });
    }
  }, [orderId, show]);

  const calculateOrderTotal = (orderProducts) => {
    return orderProducts?.reduce((total, op) => total + op.totalPrice, 0) || 0;
  };

  const calculateTotalPDV = (orderProducts) => {
    return orderProducts?.reduce((total, op) => total + op.pdv, 0) || 0;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="modal-professional">
      <Modal.Header closeButton className="text-white">
        <Modal.Title className="d-flex align-items-center   gap-2">
          <FontAwesomeIcon icon={faReceipt} />
          Order Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="custom-modal-body">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : order ? (
          <>
            <div className="order-section mb-4">
              <h5 className="section-title mb-3 d-flex align-items-center gap-2 text-primary">
                <FontAwesomeIcon icon={faCalendarCheck} />
                Order Information
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="info-item mb-2">
                    <span className="label">Order ID:</span>
                    <span className="value badge ">#{order.id}</span>
                  </div>
                 
                {/*   <div className="info-item mb-2">
                    <span className="label">Status:</span>
                    <span className={`badge ${order.accounting?.state === 1 ? 'bg-success' : 'bg-warning'}`}>
                      {order.accounting?.state === 1 ? 'Paid' : 'Pending'}
                    </span>
                  </div> */}
                </div>
                <div className="col-md-6">
                  <div className="info-item mb-2">
                    <span className="label">Total Amount:</span>
                    <span className="value text-success fw-bold">
                      <FontAwesomeIcon icon={faEuroSign} className="me-1" />
                      {calculateOrderTotal(order.productList).toFixed(2)}
                    </span>
                  </div>
                  <div className="info-item mb-2">
                    <span className="label">Total PDV:</span>
                    <span className="value">
                      €{calculateTotalPDV(order.productList).toFixed(2)}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="order-section mb-4">
              <h5 className="section-title mb-3 d-flex align-items-center gap-2 text-primary">
                <FontAwesomeIcon icon={faUser} />
                Customer Information
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <div className="customer-card p-3 bg-light rounded">
                    <div className="info-item mb-2">
                      <span className="label">Name:</span>
                      <span className="value fw-medium">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </span>
                    </div>
                    <div className="info-item mb-2">
                      <span className="label">Email:</span>
                      <span className="value">
                        <a href={`mailto:${order.customer?.email}`} className="text-decoration-none">
                          {order.customer?.email}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="customer-card p-3 bg-light rounded">
                    <div className="info-item mb-2">
                      <span className="label">Address:</span>
                      <span className="value">{order.customer?.address}</span>
                    </div>
                    <div className="info-item mb-2">
                      <span className="label">City:</span>
                      <span className="value">
                        {order.customer?.city} {order.customer?.postalCode}
                      </span>
                    </div>
                    <div className="info-item mb-0">
                      <span className="label">Phone:</span>
                      <span className="value">
                        <a href={`tel:${order.customer?.phone}`} className="text-decoration-none">
                          {order.customer?.phone}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-section">
              <h5 className="section-title mb-3 d-flex align-items-center gap-2 text-primary">
                <FontAwesomeIcon icon={faBoxes} />
                Products
              </h5>
              <div className="table-responsive">
                <Table hover className="product-table">
                  <thead className="bg-primary text-white">
                    <tr>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th className="text-center">Qty</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">PDV</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.productList?.map((product) => (
                      <tr key={product.id}>
                        <td className="fw-medium">{product.product?.productName}</td>
                        <td className="text-muted">{product.product?.sku}</td>
                        <td className="text-center">{product.quantity}</td>
                        <td className="text-end">€{product.pricePerUnit?.toFixed(2)}</td>
                        <td className="text-end">€{product.pdv?.toFixed(2)}</td>
                        <td className="text-end fw-bold">€{product.totalPrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted py-4">No order details found</div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderViewModal;