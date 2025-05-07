import React from "react";
import { useNavigate } from "react-router-dom";
import "./LeftbarPopup.css"; 

function LeftbarPopup({ className, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); 
        navigate("/login"); 
    };

    return (
        <div className={`popup-container ${className}`}>
            <div className="popup-content">
                <button className="popup-close" onClick={onClose}>×</button>
                <ul className="popup-menu">
                    <li onClick={() => navigate("/user/update-password")}>重設密碼</li>
                    <li onClick={() => navigate("/user/profile")}>個人檔案</li>
                    <li onClick={handleLogout}>登出</li>
                </ul>
            </div>
        </div>
    );
}

export default LeftbarPopup;