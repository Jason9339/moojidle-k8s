import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateUserPassword } from "@/services/user_api/UserApi.js";
import "./UserUpdatePassword.css";

const UserUpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

            if (!userId) {
                setError("User not logged in. Please log in again.");
                return;
            }

            const response = await UpdateUserPassword(userId, { currentPassword, newPassword });

            if (response?.message === "Password updated successfully") {
                setSuccess("Password updated successfully. You will be logged out.");
                localStorage.removeItem("user"); 
                setTimeout(() => navigate("/login"), 2000); 
            } else {
                setError(response?.message || "Failed to update password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="update-password-container">
            <form className="update-password-form" onSubmit={handleSubmit}>
                <h2>Password</h2>
                <p>Change your password here. After saving, you'll be logged out.</p>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <div className="form-group">
                    <label htmlFor="current-password">Current password</label>
                    <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="new-password">New password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="save-password-button">Save password</button>
            </form>
        </div>
    );
};

export default UserUpdatePassword;