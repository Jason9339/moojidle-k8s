import React from "react";
import { FaPlus } from "react-icons/fa";
import "./AddCourseButton.css";

function AddCourseButton({ onClick }) {
    return (
        <button
            className="add-course-button"
            onClick={onClick}
            title="新增或加入課程"
        >
            <FaPlus />
            <span>創建課程</span>
        </button>
    );
}

export default AddCourseButton;
