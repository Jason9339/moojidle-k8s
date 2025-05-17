import React from "react";
import { FaPlus } from "react-icons/fa";
import styles from "./AddCourseButton.module.css";

function AddCourseButton({ onClick }) {
    return (
        <button
            className={`${styles["add-course-button"]}`}
            onClick={onClick}
            title="新增或加入課程"
        >
            <FaPlus />
            <span>創建課程</span>
        </button>
    );
}

export default AddCourseButton;
