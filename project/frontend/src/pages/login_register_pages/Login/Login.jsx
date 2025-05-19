import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "@/services/login_register_api/LoginLogoutApi.js";
import styles from "./Login.module.css";
import { FcGoogle } from "react-icons/fc";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            const response = await LoginUser({ email, pw: password }); // Match API format
            if (response && response.user_id) {
                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(response));
                navigate("/dashboard");
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
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <div className={styles["login-container"]}>
            <form className={styles["login-form"]} onSubmit={handleSubmit}>
                <h2 className={styles["login-title"]}>
                    Welcome to Moojidle
                    <span className={styles["exclamation-mark"]}>!</span>
                </h2>
                <p className={styles["login-subtitle"]}>
                    Enter to get unlimited access to data &amp; information.
                </p>
                <div className={styles["form-group"]}>
                    <label htmlFor="email" className={styles["input-label"]}>
                        Email
                        {!email && <span className={styles["required"]}>*</span>}
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your mail address"
                        className={styles.input}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <label htmlFor="password" className={styles["input-label"]}>
                        Password
                        {!password && <span className={styles["required"]}>*</span>}
                    </label>
                    <div className={styles["password-input-wrapper"]}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                            className={styles.input}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className={styles["eye-button"]}
                            onClick={togglePasswordVisibility}
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <IoIosEye size={24} color="#6366f1" />
                            ) : (
                                <IoIosEyeOff size={24} color="#6366f1" />
                            )}
                        </button>
                    </div>
                    {error && <p className={styles["error-message"]}>{error}</p>}
                </div>
                <div className={styles["options-row"]}>
                    <label className={styles["remember-label"]}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe((v) => !v)}
                            className={styles["remember-checkbox"]}
                        />
                        Remember me
                    </label>
                    <a href="/forgot-password" className={styles["forgot-password-link"]}>
                        Forgot your password?
                    </a>
                </div>
                <button type="submit" className={styles["login-button"]}>Log In</button>
                <div className={styles["divider"]}><span>Or, Login with</span></div>
                <button type="button" className={styles["google-login"]}>
                    <FcGoogle size={22} />
                    Sign in with google
                </button>
                <div className={styles["register-row"]}>
                    Don’t have an account?{" "}
                    <a href="/register" className={styles["sign-up-link"]}>Register here</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
