import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./JoinCourseButton.module.css";

function JoinCourseButton({ onClick }) {
    return (
        <button
            className={`${styles["join-course-button"]}`}
            onClick={onClick}
            title="加入課程"
        >
            <FaPlus />
            <span>加入課程</span>
        </button>
    );
}

export default JoinCourseButton;
