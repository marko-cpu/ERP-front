import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./Auth/Login/Login";
import Verify from "./Auth/Login/Verify";
import Register from "./Auth/Register/Register";
import RegisterSuccess from "./Auth/Register/RegisterSuccess";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UsersList from "./layout/component/users/UsersList.jsx";
import { AuthProvider } from "./common/AuthProvider.jsx";
import ProductList from "./layout/component/products/ProductList.jsx";
import OrdersList from "./layout/component/orders/OrdersList.jsx";
import WarehouseList from "./layout/component/warehouse/WarehouseList.jsx";
import ArticleWarehouseList from "./layout/component/warehouse/ArticleWarehouseList.jsx";
import InvoiceList from "./layout/component/invoices/InvoicesList.jsx";
import AccountingList from "./layout/component/accountings/AccountingsList.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserOverview from "./layout/component/users/UserOverview.jsx";
import UserDashboard from "./layout/component/users/UserDashboard.jsx";
import AddWarehouse from "./layout/component/warehouse/AddWrehouse.jsx";
import AddProduct from "./layout/component/products/AddProduct.jsx";
import { ReservationsList } from "./layout/component/reservations/ReservationsList.jsx";

const App = () => {
 

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registerSuccess" element={<RegisterSuccess />} />
          <Route path="/verify" element={<Verify />} />
        </>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={[
                "ADMIN",
                "SALES_MANAGER",
                "INVENTORY_MANAGER",
                "ACCOUNTANT",
              ]}
            />
          }
        >
          <Route path="/" element={<Navigate to="/account" />} />
          <Route path="/account" element={<UserDashboard />} />
          <Route path="/account/profile" element={<UserOverview />} />
          <Route path="/account/usersList" element={<UsersList />} />
          <Route path="/account/productsList" element={<ProductList />} />
          <Route path="/account/add-product" element={<AddProduct />} />
          <Route path="/account/ordersList" element={<OrdersList />} />
          <Route path="/account/invoiceList" element={<InvoiceList />} />
          <Route path="/account/accountingList" element={<AccountingList />} />
          <Route path="/account/reservations" element={<ReservationsList />} />


          <Route path="/account/warehouseList" element={<WarehouseList />} />
          <Route path="/account/add-warehouse" element={<AddWarehouse />} />
          <Route
            path="/account/warehouse/:warehouseId/articles"
            element={<ArticleWarehouseList />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
