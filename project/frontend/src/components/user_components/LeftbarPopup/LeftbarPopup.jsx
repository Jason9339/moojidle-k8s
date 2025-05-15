import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LeftbarPopup.module.css";

function LeftbarPopup({ onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className={`${styles["popup-container"]}`}>
            <div className={`${styles["popup-content"]}`}>
                <button className={styles["popup-close"]} onClick={onClose}>×</button>
                <ul className={`${styles["popup-menu"]}`}>
                    <li onClick={() => navigate("/user/update-password")}>重設密碼</li>
                    <li onClick={() => navigate("/user/profile")}>個人檔案</li>
                    <li onClick={handleLogout}>登出</li>
                </ul>
            </div>
        </div>
    );
}

export default LeftbarPopup;
