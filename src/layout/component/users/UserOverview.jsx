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
      <div className="content px-3 py-4">
        <div className="card border-0 shadow-lg rounded-3">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-gradient">User Profile</h4>
              {showEditButton && (
                <button 
                  className="btn btn-light-blue rounded-pill px-4"
                  onClick={() => setShowEditModal(true)}
                >
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Profile
                </button>
              )}
            </div>

            <div className="row g-4">
              {/* Personal Information */}
              <div className="col-12">
                <div className="bg-light p-4 rounded-4">
                  <h5 className="fw-semibold mb-3 text-primary">Personal Information</h5>
                  <div className="row g-3">
                    {[
                      { label: "First Name", value: user.firstName },
                      { label: "Last Name", value: user.lastName },
                      { label: "Email", value: user.email },
                      { label: "Phone Number", value: user.phoneNumber || "-" }
                    ].map((field, idx) => (
                      <div key={idx} className="col-md-6">
                        <div className="d-flex flex-column">
                          <span className="text-muted small mb-1">{field.label}</span>
                          <div className="p-2 bg-white rounded-2 border">
                            {field.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="col-12">
                <div className="bg-light p-4 rounded-4">
                  <h5 className="fw-semibold mb-3 text-primary">Account Details</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex flex-column">
                        <span className="text-muted small mb-1">Account Created</span>
                        <div className="p-2 bg-white rounded-2 border">
                          {new Date(user.createdTime).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex flex-column">
                        <span className="text-muted small mb-1">Status</span>
                        <div className="p-2 bg-white rounded-2 border d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={user.enabled ? faCircleCheck : faCircle}
                            className={`me-2 ${user.enabled ? "text-success" : "text-danger"}`}
                          />
                          <span className={user.enabled ? "text-success" : "text-danger"}>
                            {user.enabled ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex flex-column">
                        <span className="text-muted small mb-1">Roles</span>
                        <div className="d-flex gap-2 flex-wrap">
                          {user.roles?.map((role, index) => (
                            <span 
                              key={index}
                              className="badge rounded-pill bg-opacity-10 text-primary border border-primary p-2" 
                            >
                              {role.name || role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <UserEditModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          user={user}
          roles={availableRoles}
          onSave={handleUpdateUser}
          allowRoleEdit={isAdmin}
        />
      </div>
    </UserLayout>
  );
};


export default UserOverview;
