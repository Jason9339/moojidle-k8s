import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UpdateUserPassword } from "@/services/UserApi.js";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import styles from "./UserUpdatePassword.module.css";
import { addAlert } from "@/utils/alert/AlertContext";
import LeftBar from "@/components/LeftBar/LeftBar";

const UserUpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
            if (!userId) {

                setError("使用者未登入");
                addAlert("請先登入", "error");
                navigate("/login");
                return;
            }
            if (currentPassword === newPassword) {

                setError("新密碼不能與舊密碼相同");
                addAlert("新密碼不能與舊密碼相同", "error");

                return;
            }

            const response = await UpdateUserPassword(userId, {
                currentPassword,
                newPassword,
            });

            if (response?.message === "Password updated successfully") {
                setSuccess("密碼更改成功！");
                addAlert("密碼更改成功", "success");
                localStorage.removeItem("user");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError("密碼錯誤");
            }
        } catch (err) {
            setError("發生錯誤，請稍後再試");
        }
    };

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            <div className={styles["update-password-container"]}>
                <form className={styles["update-password-form"]} onSubmit={handleSubmit}>
                    <h2 className={styles.h2}>Password</h2>
                    <p className={styles.p}>
                        Change your password here. After saving, you'll be logged out.
                    </p>
                    {error && <p className={styles["error-message"]}>{error}</p>}
                    {success && <p className={styles["success-message"]}>{success}</p>}

                    <div className={styles["form-group"]}>
                        <label htmlFor="current-password" className={styles.label}>
                            Current password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                id="current-password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className={styles.input}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((v) => !v)}
                                className={styles["toggle-eye-btn"]}
                                tabIndex={-1}
                                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                            >
                                {showCurrentPassword ? (
                                    <IoIosEye size={22} color="#6366f1" />
                                ) : (
                                    <IoIosEyeOff size={22} color="#6366f1" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={styles["form-group"]}>
                        <label htmlFor="new-password" className={styles.label}>
                            New password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className={styles.input}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((v) => !v)}
                                className={styles["toggle-eye-btn"]}
                                tabIndex={-1}
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                            >
                                {showNewPassword ? (
                                    <IoIosEye size={22} color="#6366f1" />
                                ) : (
                                    <IoIosEyeOff size={22} color="#6366f1" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles["save-password-button"]}>
                        Save password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserUpdatePassword;
