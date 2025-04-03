import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../../../services/admin.service";
import UserEditModal from "./UserEditModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserLayout from "../../UserLayout";
import {
  faCircleCheck,
  faCircle,
  faEdit,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import "../../../assets/style/table-list-styles.css";

const UsersList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const fetchUsers = async () => {
    try {
     const usersResponse = await AdminService.getAllUsers(currentPage, pageSize);
    setUsers(usersResponse.data.content); // Set current page users
    setTotalPages(usersResponse.data.totalPages); 
    
      const rolesResponse = await AdminService.getRoles();
      setAvailableRoles(rolesResponse.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(0);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = (userId, updatedData) => {
    AdminService.updateUser(userId, updatedData)
      .then(() => {
        toast.success("User updated successfully", {
          position: "top-right",
          autoClose: 3000,
        });
        AdminService.getAllUsers().then(
          (response) => setUsers(response.data),
          (error) => console.error(error)
        );
      })
      .catch((error) => {
        toast.error(`Error updating User : ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  /* const handleDeleteClick = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      AdminService.deleteUser(userId)
        .then(() => {
          toast.success('User deleted successfully!', {
            position: "top-right",
            autoClose: 3000,
          });
          AdminService.getAllUsers().then(
            (response) => setUsers(response.data),
            (error) => console.error(error)
          );
        })
        .catch((error) => {
          toast.error(`Update failed: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
          });
        });
    }
  }; */

  const filteredUsers = users.filter((customerWrapper) => {
    const user = customerWrapper;
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
    );
  });
 /*  if (loading) {
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
  } */

  return (
    <>
      <UserLayout>
        <div className="content p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="fs-2 fw-semibold form-title">
              <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
              Users
            </h2>
            <div className="w-50">
              <div className="input-group">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
          <div className="table-responsive rounded-3 shadow-sm">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="ps-4 py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Phone</th>
                  <th className="py-3">Created</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Role</th>
                  <th className="pe-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="transition-all">
                    <td className="ps-4">
                      <div className="fw-semibold text-dark">{`${user.firstName} ${user.lastName}`}</div>
                    </td>
                    <td>
                      <span className="text-muted">{user.email}</span>
                    </td>
                    <td>{user.phoneNumber || "-"}</td>
                    <td>
                      <div className="text-secondary">
                        {new Date(user.createdTime).toLocaleDateString("en-GB")}
                      </div>
                    </td>
                    <td>
                      {user.enabled ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-success fs-5"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="text-light-emphasis fs-5"
                        />
                      )}
                    </td>
                    <td>
                      <span className="badge bg-info bg-opacity-10 text-info">
                        {user.roles?.[0]?.name || "No Role"}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        className="btn btn-sm btn-light-blue"
                        onClick={() => handleEditClick(user)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
  <div>
    <button
      className="btn btn-light-blue"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 0}
    >
      Previous
    </button>
    <span className="mx-2">
      Page {currentPage + 1} of {totalPages}
    </span>
    <button
      className="btn btn-light-blue"
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage >= totalPages - 1 || totalPages === 0}
    >
      Next
    </button>
  </div>
  <div>
    <select
      className="form-select"
      value={pageSize}
      onChange={handlePageSizeChange}
    >
      <option value="5">5 per page</option>
      <option value="10">10 per page</option>
      <option value="20">20 per page</option>
    </select>
  </div>
</div>
          </>
        )}
        </div>
      </UserLayout>
      <UserEditModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        user={selectedUser}
        roles={availableRoles}
        onSave={handleUpdateUser}
      />
    </>
  );
};

export default UsersList;
