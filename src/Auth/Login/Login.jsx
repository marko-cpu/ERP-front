import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import AuthService from "../../services/auth.service";
import "../../assets/style/Login.css";
import { useNavigate, useLocation } from "react-router-dom";
import { BiLock, BiShow, BiHide, BiEnvelope } from "react-icons/bi";
import { useAuth } from "../../common/AuthProvider";
import { Oval } from "react-loader-spinner";

const Login = () => {
  const navigate = useNavigate();
  const { updateUser, currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, from, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      await AuthService.login(email, password);
      const currentUser = AuthService.getCurrentUser();

      updateUser(currentUser);

      if (currentUser && currentUser.roles.length > 0) {      
          navigate("/account")
      }
    } catch (error) {
      setErrors({ api: error.response?.data?.message || "Login failed" });

      setTimeout(() => {
        const errorDiv = document.querySelector(".error-message");
        if (errorDiv) {
          errorDiv.classList.add("fade-out");
        }

        setTimeout(() => {
          setErrors({});
        }, 500);
      }, 5000);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="wrapper-log">
      <div className="login-wrapper">
        <div className="login-form-container">
         
          <h2 className="login-title">Sign in</h2>

          {errors.api && <div className="error-message">{errors.api}</div>}

          {loading ? ( 
            <div className="d-flex justify-content-center align-items-center">
              <Oval
                height={40}
                width={40}
                color="#4fa94d"
                secondaryColor="#4fa94d"
                ariaLabel="loading"
              />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <BiEnvelope />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                    className={`form-control ${
                      !!errors.email ? "is-invalid" : ""
                    }`}
                  />
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="mb-3 position-relative"
                controlId="formBasicPassword"
              >
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <BiLock />
                  </span>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="●●●●●●●●"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                    className={`form-control ${
                      !!errors.password ? "is-invalid" : ""
                    }`}
                    style={{ transition: "border-color 0.3s ease" }}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="btn btn-outline-secondary"
                    style={{ border: "none", cursor: "pointer" }}
                  >
                    {showPassword ? <BiHide /> : <BiShow />}
                  </button>
                </div>
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="login-button">
                Login
              </Button>

              <a
                href="/register"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/register";
                }}
                className="toggle-button"
              >
                Don't have an account? Sign up
              </a>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
