import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/login_register_api/RegisterApi";
import { loginUser } from "@/services/login_register_api/LoginApi";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 註冊使用者
            await registerUser(formData);

            // 自動登入
            const loginResponse = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            if (loginResponse) {
                // 儲存登入狀態 (例如 token)
                localStorage.setItem("user", JSON.stringify(loginResponse.user));
                navigate("/dashboard"); // 導向主畫面
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;