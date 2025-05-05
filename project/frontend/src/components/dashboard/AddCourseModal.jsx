import React, { useState } from "react";
import "@/styles/Modal.css";
import { addCourse } from "@/services/DashboardApi"

function AddCourseModal({ onClose, onAddCourse }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [color, setColor] = useState("#4A90E2");

  // const handleAdd = () => {
  //   if (!title || !courseId) return;
  //
  //   const newCourse = {
  //     title,
  //     courseId,
  //     color,
  //     description,
  //     isTeacher: true, // 新增者就是老師
  //   };
  //
  //   onAddCourse(newCourse);
  //   onClose();
  // };
  
  const handleAdd = async () => {
    if (!title) {
      alert("請輸入課程名稱！");
      return;
    }

    const coursePayload = {
      name: title,
      description: description,
      syllabus: "", // Still sending empty string
    };

    try {
      // Call the service function which uses axios
      const newCourse = await addCourse(coursePayload);

      // WARN:Just a temporary solution for isTeacher and color
      newCourse.color = "#4A90E2"

      // Axios throws for non-2xx, so if we get here, it's successful
      onAddCourse(newCourse); // Pass the actual backend response data
      onClose();

    } catch (error) {
      // Handle errors thrown by axios or the addCourse service function
      console.error("新增課程失敗:", error);
      // Display error message from backend if available, otherwise generic message
      const errorMessage = error.response?.data?.message || error.message || "新增課程失敗，請稍後再試。";
      alert(`新增課程失敗: ${errorMessage}`);
    }
  };


  
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>新增課程</h3>
        <input
          placeholder="課程代碼 (courseId)"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
        <input
          placeholder="課程名稱"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="課程描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <div className="modal-btn-group">
          <button onClick={handleAdd}>確定新增</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default AddCourseModal;
