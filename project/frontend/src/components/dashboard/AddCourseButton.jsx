import React from "react";
import { FaPlus } from "react-icons/fa";
import "@/styles/AddCourseButton.css";

function AddCourseButton({ onClick }) {
    return (
        <button
            className="add-course-button"
            onClick={onClick}
            title="新增或加入課程"
        >
            <FaPlus />
        </button>
    );
}

export default AddCourseButton;
