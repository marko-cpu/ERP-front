import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../common/AuthProvider";
import AdminService from "../../../services/admin.service";
import UserService from "../../../services/user.service";

import UserLayout from "../../UserLayout";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import UserEditModal from "./UserEditModal";

const UserOverview = () => {
  const navigate = useNavigate();
  const { currentUser: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);

  const isAdmin = authUser?.roles?.some((role) => role === "ADMIN");

  // This condition will ensure that only admin users can see the Edit button
  const showEditButton = isAdmin;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await UserService.getCurrentUser();
        setUser(userResponse.data);

        // Fetch roles only if admin
        if (isAdmin) {
          const rolesResponse = await AdminService.getRoles();
          setAvailableRoles(rolesResponse.data);
        }
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, isAdmin]);

  const handleUpdateUser = async (email, updatedData) => {
    try {
      await AdminService.updateUser(email, updatedData);
      toast.success("Profile updated successfully");

      const usersResponse = await AdminService.getAllUsers();
      const updatedUser = usersResponse.data.find(
        (u) => u.email === authUser.email
      );
      setUser(updatedUser);
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="d-flex justify-content-center mt-5">
          <Oval
            visible={true}
            height={50}
            width={50}
            color="#0d6efd"
            secondaryColor="#e9ecef"
            ariaLabel="oval-loading"
          />
        </div>
      </UserLayout>
    );
  }

  if (!user) {
    return (
      <UserLayout>
        <div className="alert alert-danger mt-4">User profile not found</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="content">
        <div className="card shadow-sm text-center pb-3">
          <div className="card-body p-1">
            <div className="row g-4">
              <div className="col-12">
                <h5 className="fw-semibold mb-3 border-bottom pb-2">
                  Personal Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">First Name</label>
                    <div className="form-control bg-light border-0">
                      {user.firstName}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Last Name</label>
                    <div className="form-control bg-light border-0">
                      {user.lastName}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Email</label>
                    <div className="form-control bg-light border-0">
                      {user.email}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Phone Number
                    </label>
                    <div className="form-control bg-light border-0">
                      {user.phoneNumber || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <h5 className="fw-semibold mb-3 border-bottom pb-2">
                  Account Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">
                      Account Created
                    </label>
                    <div className="form-control bg-light border-0">
                      {new Date(user.createdTime).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted">Status</label>
                    <div className="form-control bg-light border-0 d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon
                        icon={user.enabled ? faCircleCheck : faCircle}
                        className={`me-2 ${
                          user.enabled ? "text-success" : "text-secondary"
                        }`}
                      />
                      {user.enabled ? "Active" : "Inactive"}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">User Role</label>
                    <div className="form-control bg-light border-0">
                     
                        {user.roles?.length > 0 ? (
                          user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="badge bg-info bg-opacity-10 text-info me-1"
                              style={{ fontSize: "0.8rem", fontWeight: "bold" }}
                            >
                              {role.name || role}
                            </span>
                          ))
                        ) : (
                          <span className="badge bg-secondary">No Role</span>
                        )}
                     
                    </div>
                  </div>
                </div>
                {showEditButton && (
                  <button
                    className="btn btn-light-blue"
                    onClick={() => setShowEditModal(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        user={user}
        roles={availableRoles}
        onSave={handleUpdateUser}
        allowRoleEdit={isAdmin}
      />
    </UserLayout>
  );
};

export default UserOverview;
