import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "@/services/login_register_api/LoginLogoutApi.js";
import styles from "./Login.module.css";

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
        <div className={styles["login-container"]}>
            <form className={styles["login-form"]} onSubmit={handleSubmit}>
                <h2 className={styles.h2}>Moojidle</h2>
                {error && <p className={styles["error-message"]}>{error}</p>}
                <div className={styles["form-group"]}>
                    <label htmlFor="email" className={styles.label}></label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                        className={styles.input}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <label htmlFor="password" className={styles.label}></label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className={styles.input}
                    />
                </div>
                <button type="submit" className={styles["login-button"]}>Log In</button>
                <div className={styles["additional-options"]}>
                    <a href="/forgot-password" className={styles["forgot-password-link"]}>Forget password?</a>
                    <p>
                        Do not have an account?{" "}
                        <a href="/register" className={styles["sign-up-link"]}>Sign Up</a>
                    </p>
                </div>
                <div className={styles["social-login"]}>
                    <p>Or log in with</p>
                    <img
                        src="/icons/GoogleLogo.jpg"
                        alt="Google Login"
                        className={styles["google-login"]}
                        onClick={handleGoogleLogin}
                    />
                </div>
            </form>
        </div>
    );
};

export default Login;