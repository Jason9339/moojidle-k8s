import React, { useState } from "react";
import "@/styles/Modal.css";
import { addCourse } from "@/services/DashboardApi"

function AddCourseModal({ onClose, onAddCourse, currentUserId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#4A90E2");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ 狀態控制

  const handleAdd = async () => {
    if (!title) {
      alert("請輸入課程名稱！");
      return;
    }

    const coursePayload = {
      name: title,
      description: description,
      syllabus: "",
      user_id: currentUserId,
    };

    try {
      setIsSubmitting(true); // 顯示 loading 狀態
      await addCourse(coursePayload);
      await onAddCourse(); // 重新 fetch 所有資料
      onClose(); // 關閉 modal
    } catch (error) {
      console.error("新增課程失敗:", error);
      const errorMessage = error.response?.data?.message || error.message || "新增課程失敗，請稍後再試。";
      alert(`新增課程失敗: ${errorMessage}`);
    } finally {
      setIsSubmitting(false); // 恢復狀態
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>新增課程</h3>

        <input
          placeholder="課程名稱"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
        <textarea
          placeholder="課程描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="modal-btn-group">
          <button onClick={handleAdd} disabled={isSubmitting}>
            {isSubmitting ? "新增中..." : "確定新增"}
          </button>
          <button onClick={onClose} disabled={isSubmitting}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default AddCourseModal;
