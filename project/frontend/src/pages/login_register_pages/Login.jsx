import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "@/services/login_register_api/LoginLogoutApi.js";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            const response = await LoginUser({ email, pw: password }); // Match API format
            if (response && response.user_id) {
                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(response));
                navigate("/"); 
            } else {
                setError(response?.message || "Invalid email or password");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
        console.log("Google login clicked");
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Moojidle</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email"></label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"></label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit" className="login-button">Log In</button>
                <div className="additional-options">
                    <a href="/forgot-password" className="forgot-password-link">Forget password?</a>
                    <p>
                        Do not have an account?{" "}
                        <a href="/register" className="sign-up-link">Sign Up</a>
                    </p>
                </div>
                <div className="social-login">
                    <p>Or log in with</p>
                    <button type="button" className="google-login-button" onClick={handleGoogleLogin}>
                        <img src="/google-icon.png" alt="Google Icon" className="google-icon" />
                        Log in with Google
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;