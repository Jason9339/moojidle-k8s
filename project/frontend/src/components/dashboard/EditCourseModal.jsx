import React, { useState } from 'react';
import '@/styles/Modal.css';

function EditCourseModal({ course, onClose }) {
  const [newName, setNewName] = useState(course.title);

  const handleSave = () => {
    console.log('修改課程:', { courseId: course.courseId, newName });
    onClose();
  };

  const handleDelete = () => {
    console.log('刪除課程:', course.courseId);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>編輯課程</h3>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        <div className="modal-btn-group">
          <button onClick={handleSave}>儲存修改</button>
          <button onClick={handleDelete} className="danger">刪除課程</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
