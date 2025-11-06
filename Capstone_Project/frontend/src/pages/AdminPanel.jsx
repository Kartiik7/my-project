    import React, { useState, useEffect } from "react";
    import useAuth from "../hooks/useAuth"; // Corrigé : import par défaut
    import api from "../services/api";
    import LoadingSpinner from "../components/LoadingSpinner";

    // --- Confirmation Modal Component ---
    // Moved outside the AdminPanel component to prevent re-renders
    const ConfirmationModal = ({ userToChange, newRole, onConfirm, onCancel }) => {
        return (
            <div className="modal-overlay">
                <div className="modal-content card">
                    <h3 className="card-title">Confirm Role Change</h3>
                    <p>
                        Are you sure you want to change the role of <strong>{userToChange.name}</strong> ({userToChange.email}) to <strong>{newRole}</strong>?
                    </p>
                    <div className="card-actions" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" onClick={onCancel}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={onConfirm}>
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    const AdminPanel = () => {
        const { user, setUser, isAuthLoading } = useAuth(); // FIX: Get isAuthLoading
        const [users, setUsers] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState("");
        const [success, setSuccess] = useState("");
        // State for the confirmation modal
        const [modalState, setModalState] = useState({
            isOpen: false,
            userToChange: null,
            newRole: '',
            originalRole: ''
        });

        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const res = await api.get("/api/admin/users");
                setUsers(res.data.data);
                setError("");
            } catch (err) {
                setError("Failed to fetch users.");
            }
            setIsLoading(false);
        };

        useEffect(() => {
            // FIX: Wait for auth to be ready before fetching users
            if (isAuthLoading) {
                return; // Wait until auth is initialized
            }
            // Also, only fetch if the user is an Admin
            if (user && user.role === 'Admin') {
                fetchUsers();
            } else if (!user) {
                setError("You must be logged in to view this page.");
            }
            // This page should be protected by ProtectedRoute, but this is an extra layer
            
        }, [isAuthLoading, user]); // FIX: Re-run when auth state changes

        // This function now just opens the modal
        const handleSelectChange = (userToChange, newRole) => {
            setModalState({
                isOpen: true,
                userToChange,
                newRole,
                originalRole: userToChange.role // Store the original role
            });
        };

        // This function closes the modal and reverts the <select> value
        const cancelRoleChange = () => {
            // Revert the visual change in the table by refreshing users
            // This is simpler than trying to manage the <select> value manually
            fetchUsers(); 
            setModalState({ isOpen: false, userToChange: null, newRole: '', originalRole: '' });
        };

        // This function performs the actual API call
        const confirmRoleChange = async () => {
            const { userToChange, newRole } = modalState;
            if (!userToChange || !newRole) return;

            setSuccess("");
            setError("");
            try {
                await api.put(`/api/admin/users/${userToChange._id}/role`, { role: newRole });
                setSuccess("User role updated successfully!");

                // Refresh user list
                fetchUsers();

                // If Admin changed their OWN role, update context
                if (user.id === userToChange._id) {
                    setUser((prevUser) => ({ ...prevUser, role: newRole }));
                }
            } catch (err) {
                setError("Failed to update role.");
            } finally {
                // Close the modal
                setModalState({ isOpen: false, userToChange: null, newRole: '', originalRole: '' });
            }
        };

        // FIX: Show loading spinner if auth is loading OR data is loading
        if (isLoading || isAuthLoading) return <LoadingSpinner />;

        return (
            <div className="card">
                {/* Render the modal conditionally */}
                {modalState.isOpen && (
                    <ConfirmationModal
                        userToChange={modalState.userToChange}
                        newRole={modalState.newRole}
                        onConfirm={confirmRoleChange}
                        onCancel={cancelRoleChange}
                    />
                )}

                <h2 className="card-title">User Management</h2>
                {error && <p className="form-error">{error}</p>}
                {success && (
                    <p style={{ color: "var(--success-color)", marginBottom: "1rem" }}>
                        {success}
                    </p>
                )}

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Change Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>
                                    <select
                                        // The value is now based on the user's actual role
                                        value={u.role}
                                        onChange={(e) => handleSelectChange(u, e.target.value)}
                                        // Prevent Admin from accidentally demoting themselves
                                        // FIX: Compare email instead of ID to avoid type mismatches
                                        disabled={u.email === user.email && u.role === "Admin"}
                                    >
                                        <option value="Viewer">Viewer</option>
                                        <option value="Editor">Editor</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    export default AdminPanel;

