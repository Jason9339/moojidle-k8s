import React, { useState } from 'react';
import { deleteCourse } from '@/services/dashboard_api/DashboardApi';
import styles from './EditCourseModal.module.css';

function EditCourseModal({ course, onClose, onDeleteCourse }) {
  const [newName, setNewName] = useState(course.title);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = () => {
    console.log('修改課程:', { courseId: course.courseId, newName });
    onClose(); // 編輯功能尚未實作
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('刪除課程:', course.courseId);
      await deleteCourse(course.courseId);
      await onDeleteCourse(course.courseId); // 通知外層重新 fetch
      onClose();
    } catch (error) {
      console.error('刪除課程失敗:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`${styles["modal-backdrop"]}`} onClick={onClose}>
      <div
        className={`${styles["modal"]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>編輯課程</h3>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={isDeleting}
        />
        <div className={`${styles["modal-btn-group"]}`}>
          <button onClick={handleSave} disabled={isDeleting}>儲存修改</button>
          <button onClick={handleDelete} className={`${styles["danger"]}`} disabled={isDeleting}>
            {isDeleting ? "刪除中..." : "刪除課程"}
          </button>
          <button onClick={onClose} disabled={isDeleting}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default EditCourseModal;
