import React from "react";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaUsers,
  FaUser,
  FaBox,
  FaClipboardList,
  FaFileInvoice,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/style/sidebar.css";
import { useAuth } from "../../common/AuthProvider";

const Sidebar = ({ loading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roles } = useAuth();

  const menuItems = [
    {
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      path: "/account",
      roles: ["*"],
    },
    {
      icon: <FaUsers />,
      label: "Users",
      path: "/account/usersList",
      roles: ["ADMIN"],
    },
    {
      icon: <FaUsers />,
      label: "Customers",
      path: "/account/customerList",
      roles: ["SALES_MANAGER", "ADMIN"],
    },
    {
      icon: <FaShoppingCart />,
      label: "Orders",
      path: "/account/ordersList",
      roles: ["ADMIN", "SALES_MANAGER"],
    },
    {
      icon: <FaUser />,
      label: "Warehouses",
      path: "/account/warehouseList",
      roles: ["ADMIN", "INVENTORY_MANAGER"],
    },
    {
      icon: <FaBox />,
      label: "Products",
      path: "/account/productsList",
      roles: ["ADMIN", "INVENTORY_MANAGER", "SALES_MANAGER"],
    },
    {
      icon: <FaFileInvoice />,
      label: "Invoices",
      path: "/account/invoiceList",
      roles: ["ADMIN", "ACCOUNTANT"],
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Accountings",
      path: "/account/accountingList",
      roles: ["ADMIN", "ACCOUNTANT"],
    },
    {
      icon: <FaClipboardList />,
      label: "Reservation",
      path: "/account/reservations",
      roles: ["ADMIN", "ACCOUNTANT"],
    },
  ];

  const filteredItems = menuItems.filter(
    (item) =>
      item.roles.includes("*") || item.roles.some((r) => roles.includes(r))
  );

  return (
    <div className="sidebar  text-white  p-3 border-end shadow-lg">
      <div className="sidebar-header text-center mb-4">
        <h1 className="fs-4 fw-bold mb-0 py-3 border-bottom border-secondary">
          <span className="text-gradient">ERP</span>
        </h1>
      </div>

      <ul className="list-unstyled px-2">
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className={`sidebar-item mb-2 ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <div className="d-flex align-items-center gap-3 px-3 py-2">
              <span className="sidebar-icon fs-5">{item.icon}</span>
              <span className="sidebar-label fs-6">{item.label}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
