import React, { useState, useRef, useEffect } from "react";
import { FaSignOutAlt, FaChevronDown, FaBell, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../common/AuthProvider";
import "../../assets/style/Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message received", read: false },
    { id: 2, text: "System update available", read: true },
  ]);

  const navigate = useNavigate();
  const { currentUser, logOut } = useAuth();
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    return names
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setDropdownOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {currentUser && (
              <>
                {/* Notifications Dropdown */}
                <li className="nav-item dropdown" ref={notificationsRef}>
                  <div
                    className="nav-link cursor-pointer position-relative"
                    role="button"
                    aria-expanded={notificationsOpen}
                    onClick={toggleNotifications}
                  >
                    <div className="position-relative">
                      <FaBell />
                      {unreadCount > 0 && (
                        <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow ${
                      notificationsOpen ? "show" : ""
                    }`}
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      minWidth: "300px",
                      transition: "all 0.3s ease",
                      opacity: notificationsOpen ? 1 : 0,
                      visibility: notificationsOpen ? "visible" : "hidden",
                      display: "block",
                    }}
                  >
                    <li className="dropdown-header">
                      <div className="d-flex justify-content-center align-items-center p-2">
                        <h6 className="mb-0">Notifications</h6>
                      </div>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    {notifications.map((notification) => (
                      <li key={notification.id}>
                        <div
                          className={`dropdown-item ${
                            !notification.read ? "fw-bold" : ""
                          }`}
                        >
                          {notification.text}
                        </div>
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        to="/notifications"
                        className="dropdown-item text-center"
                      >
                        View all notifications
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Profile Dropdown */}
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <div
                    className="nav-link d-flex align-items-center cursor-pointer"
                    role="button"
                    aria-expanded={dropdownOpen}
                    onClick={toggleDropdown}
                    style={{ position: "relative" }}
                  >
                    <div className="initials-circle me-2">
                      {getInitials(currentUser.fullName)}
                    </div>
                    <FaChevronDown
                      style={{
                        transition: "transform 0.3s ease",
                        transform: dropdownOpen ? "rotate(180deg)" : "none",
                      }}
                    />
                  </div>

                  <ul
                    className={`dropdown-menu dropdown-menu-end shadow ${
                      dropdownOpen ? "show" : ""
                    }`}
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      minWidth: "220px",
                      transition: "all 0.3s ease",
                      opacity: dropdownOpen ? 1 : 0,
                      visibility: dropdownOpen ? "visible" : "hidden",
                      display: "block",
                    }}
                  >
                    <li className="dropdown-header">
                      <div className="d-flex flex-column align-items-center p-2">
                        <div className="initials-circle-lg mb-2">
                          {getInitials(currentUser.fullName)}
                        </div>
                        <div className="text-center">
                          <h6 className="mb-0">{currentUser.fullName}</h6>
                          <small className="text-muted">
                            {currentUser.role}
                          </small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        to="/account/profile"
                        className="dropdown-item d-flex align-items-center py-2"
                        style={{ transition: "background-color 0.2s" }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUser className="me-2" />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item d-flex align-items-center py-2"
                        style={{ transition: "background-color 0.2s" }}
                      >
                        <FaSignOutAlt className="me-2" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
