import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Spinner } from "react-bootstrap";
import Logo from "../../assets/img/logo.png";
import AuthService from "../../services/auth.service";
import "../../assets/style/Register.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
    password: "",
    phoneNumber: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const {
      firstName,
      lastName,
      address,
      city,
      email,
      password,
      confirmPassword,
      phoneNumber,
      postalCode,
    } = formData;
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone is required";
    } else if (phoneNumber.length > 15) {
      newErrors.phoneNumber = "Phone number must be at most 15 characters";
    }
    if (!postalCode) newErrors.postalCode = "Postal code is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setLoading(true);
      try {
        await AuthService.register(formData);
        // console.log('User registered:', response.data);
        // Redirect or show success message
        navigate("/RegisterSuccess");
      } catch (error) {
        if (error.response?.data?.errors) {
          // Handle backend validation errors
          const backendErrors = error.response.data.errors.reduce(
            (acc, err) => {
              acc[err.field] = err.message;
              return acc;
            },
            {}
          );
          setErrors(backendErrors);
        } else if (error.response?.data?.message) {
          // Handle other backend errors
          setErrors({ general: error.response.data.message });
        } else {
          setErrors({ general: "Registration failed. Please try again." });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const formFields = [
    { id: "firstName", label: "First Name", type: "text", md: 6 },
    { id: "lastName", label: "Last Name", type: "text", md: 6 },
    { id: "phoneNumber", label: "Phone", type: "tel", md: 6 },
    { id: "email", label: "Email", type: "email", md: 6 },
    { id: "address", label: "Address", type: "text", md: 12 },
    { id: "city", label: "City", type: "text", md: 6 },
    { id: "postalCode", label: "Postal Code", type: "text", md: 6 },
    { id: "password", label: "Password", type: "password", md: 6 },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      md: 6,
    },
  ];

  return (
    <div className="wrapper-reg">
      <div className="register-wrapper">
        <div className="register-form-container">
          <img src={Logo} alt="Logo" className="logo" />
          <h2 className="register-title">Sign up</h2>

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {formFields.map((field) => (
                <Col md={field.md} key={field.id}>
                  <Form.Group controlId={`form${field.id}`}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleChange}
                      isInvalid={!!errors[field.id]}
                      className="custom-input"
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="error-message"
                    >
                      {errors[field.id]}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              ))}
            </Row>

            {errors.general && (
              <div className="alert alert-danger mt-3">{errors.general}</div>
            )}

            <Button
              variant="primary"
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Register"}
            </Button>

            <Button
              variant="link"
              onClick={() => navigate("/")}
              className="toggle-button"
            >
              Already have an account? Sign in
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
