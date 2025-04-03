import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import "../../assets/style/RegisterSuccess.css";
import Logo from "../../assets/img/logo.png";

const Verify = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const code = query.get("code");

  const handleLoginRedirect = () => {
    navigate("/");
  };

  useEffect(() => {
    if (!code) {
      navigate("/login");
      return;
    }
    fetch(`http://localhost:8080/api/auth/verify?code=${code}`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("Verification failed."));
  }, [code, navigate]);

  return (
    <div className="registerSuccess-wrapper">
      <div className="registerSuccess-form-container">
        <img src={Logo} alt="Logo" className="logo" />

        <div
          className="success-icon"
          style={{ color: message.startsWith("Success") ? "green" : "red" }}
        >
          {message.startsWith("Success") ? (
            <FiCheckCircle />
          ) : (
            <MdErrorOutline />
          )}
        </div>

        <h1 className="title">
          {message.startsWith("Success")
            ? "Email Verified!"
            : "Verification Issue"}
        </h1>

        <p className="message">{message}</p>

        <button className="login-btn" onClick={handleLoginRedirect}>
          <FiArrowLeft className="btn-icon" />
          Return to Login
        </button>
      </div>
    </div>
  );
};

export default Verify;
