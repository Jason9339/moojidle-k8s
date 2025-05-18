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
                <h2 className={styles.h2}>Moojidle</h2>
                <h2 className={styles.h2}>Register</h2>
                {error && <p className={styles["error-message"]}>{error}</p>}
                <div className={styles["form-group"]}>
                    <label htmlFor="name" className={styles.label}></label>
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
                    <label htmlFor="email" className={styles.label}></label>
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
                <button type="submit" className={styles["register-button"]}>Register</button>
                <div className={styles["additional-options"]}>
                    <p>Already have an account? <a href="/login">Log In</a></p>
                </div>
            </form>
        </div>
    );
};

export default Register;