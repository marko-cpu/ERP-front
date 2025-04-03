// src/components/account/warehouse/AddWarehouse.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WarehouseService from "../../../services/warehouse.service";
import UserLayout from "../../UserLayout";
import { Form, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import {
  faWarehouse,
  faSave,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "../../../assets/style/table-list-styles.css";
const AddWarehouse = () => {
  const navigate = useNavigate();
  const [warehouseName, setWarehouseName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!warehouseName || !location) {
      setError("Please fill in all fields");
      return;
    }

    WarehouseService.createWarehouse(warehouseName, location)
      .then(() => {
        toast.success("Warehouse added successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/account/warehouseList"), 1500);
      })
      .catch((err) => {
        toast.error(
          `Error creating warehouse. Please try again. : ${error.message}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      });
  };

  return (
    <UserLayout>
      <div className="content p-4">
        <button
          className="btn btn btn-sm btn-light-blue d-flex align-items-center mb-3"
          onClick={() => navigate(-1)} // back to previous page
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
        </button>

        <div className="form-wrapper mx-auto">
          <h2 className="form-title mb-4">
            <FontAwesomeIcon icon={faWarehouse} className="me-2 text-primary" />
            Add New Warehouse
          </h2>

          <div className="form-card card shadow-sm p-4 p-md-5">
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
              <Form.Group className="mb-4">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Warehouse Name
                </Form.Label>
                <Form.Control
                  type="text"
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  className="form-control-custom rounded-1 py-2 px-3"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-5">
                <Form.Label className="text-secondary fw-medium mb-2">
                  Location
                </Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control-custom rounded-1 py-2 px-3"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-3">
                <Button
                  variant="light"
                  onClick={() => navigate("/account/warehouseList")}
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
                  Save Warehouse
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default AddWarehouse;
