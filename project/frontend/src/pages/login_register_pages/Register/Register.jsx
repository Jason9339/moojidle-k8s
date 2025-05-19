import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterUser } from "@/services/login_register_api/RegisterApi.js";
import styles from "./Register.module.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await RegisterUser({ name, email, password });
            if (response && response.message === "User registered successfully") {
                navigate("/login"); 
            } else {
                setError(response?.message || "Registration failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

return (
        <div className={styles["register-container"]}>
            <form className={styles["register-form"]} onSubmit={handleSubmit}>
                <h2 className={styles["register-title"]}>Welcome Moojidle<span className={styles["moojidle-accent"]}> !</span></h2>
                <p className={styles["register-subtitle"]}>
                    Create your account to get unlimited access to data &amp; information.
                </p>
                {error && <p className={styles["error-message"]}>{error}</p>}
                <div className={styles["form-group"]}>
                    <label htmlFor="name" className={styles["input-label"]}>
                         Name
                        {!name && <span className={styles["required"]}>*</span>}
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your name"
                        className={styles.input}
                        maxLength={20}
                    />
                </div>
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
                        placeholder="Enter your email"
                        className={styles.input}
                        maxLength={30}
                    />
                </div>
                <div className={styles["form-group"]}>
                    <label htmlFor="password" className={styles["input-label"]}>
                        Password
                        {!password && <span className={styles["required"]}>*</span>}
                    </label>    
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                        className={styles.input}
                        autoComplete="new-password"
                    />
                </div>
                <button type="submit" className={styles["register-button"]}>Register</button>
                <div className={styles["register-row"]}>
                    Already have an account?{" "}
                    <a href="/login" className={styles["sign-in-link"]}>Log In</a>
                </div>
            </form>
        </div>
    );
};

export default Register;
