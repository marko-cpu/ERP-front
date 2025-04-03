import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../common/AuthProvider";
import { Oval } from "react-loader-spinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, roles, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin">
          <Oval
            height={40}
            width={40}
            color="#4fa94d"
            secondaryColor="#4fa94d"
            ariaLabel="loading"
            className="animate-bounce"
          />
        </div>
        <span className="mt-2 text-gray-800 font-semibold text-sm">
          Loading, please wait...
        </span>
      </div>
    );
  }

  const hasAccess =
    currentUser && roles?.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    // Osveži stranicu kada se preusmerava na login
    /* window.location.reload();
    return <Navigate to="/login" replace />; */
    return <Navigate to={location.state?.from || "/login"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
