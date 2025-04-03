import React from "react";
import "../../assets/style/RegisterSuccess.css";
import Logo from "../../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const RegisterSuccess = () => {
  const navigate = useNavigate();
  
  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="registerSuccess-wrapper">
      <div className="registerSuccess-form-container">
        <img src={Logo} alt="Logo" className="logo" />
        
        <div className="success-icon">
          <FiCheckCircle />
        </div>

        <h1 className="title">
          Successful Registration!
        </h1>
        
        <p className="message">
          We've sent a verification email to your address. 
          Please check your inbox and confirm your account.
        </p>
        
        <button className="login-btn" onClick={handleLoginRedirect}>
          <FiArrowLeft className="btn-icon" />
          Return to Login
        </button>

      
      </div>
    </div>
  );
};

export default RegisterSuccess;