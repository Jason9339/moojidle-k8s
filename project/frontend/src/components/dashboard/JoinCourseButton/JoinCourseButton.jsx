import React from "react";
import { FaPlus } from "react-icons/fa";
import "./JoinCourseButton.css";

function JoinCourseButton({ onClick }) {
    return (
        <button
            className="join-course-button"
            onClick={onClick}
            title="加入課程"
        >
            <FaPlus />
            <span>加入課程</span>
        </button>
    );
}

export default JoinCourseButton;
