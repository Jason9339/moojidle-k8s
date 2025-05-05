import React, { useState } from 'react';
import '@/styles/Modal.css';
import { deleteCourse } from '@/services/DashboardApi';

function EditCourseModal({ course, onClose }) {
  const [newName, setNewName] = useState(course.title);

  const handleSave = () => {
    console.log('修改課程:', { courseId: course.courseId, newName });
    onClose();
  };

  const handleDelete = async () => {
    try {
      console.log('刪除課程:', course);
      await deleteCourse(course.course_id);
      console.log('刪除課程成功:', course.course_id);
      onClose();
    } catch (error) {
      console.error('刪除課程失敗:', error);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}  
      >
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
