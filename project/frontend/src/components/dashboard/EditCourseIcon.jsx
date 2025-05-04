import React from 'react';
import { FaEdit } from 'react-icons/fa';

function EditCourseIcon({ onClick }) {
  return (
    <div className="edit-icon" onClick={onClick}>
      <FaEdit />
    </div>
  );
}

export default EditCourseIcon;
