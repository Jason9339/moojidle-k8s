
import React, { useState } from "react";
import "./JoinCourseModal.css";
import { addCourse } from "@/services/DashboardApi"

function JoinCourseModal({ onClose, onAddCourse, currentUserId }) {
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = async () => {
    if (!inviteCode) {
      alert("請輸入課程代碼！");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 這裡需要修改為加入課程的 API 呼叫
      // TODO: 替換為正確的 joinCourse API 調用
      await addCourse({ 
        inviteCode: inviteCode,
        userId: currentUserId 
      });
      
      await onAddCourse(); // 重新 fetch 所有資料
      onClose(); // 關閉 modal
    } catch (error) {
      console.error("加入課程失敗:", error);
      const errorMessage = error.response?.data?.message || error.message || "加入課程失敗，請稍後再試。";
      alert(`加入課程失敗: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>加入課程</h3>

        <input
          placeholder="課程代碼"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="modal-btn-group">
          <button onClick={handleJoin} disabled={isSubmitting}>
            {isSubmitting ? "加入中..." : "加入課程"}
          </button>
          <button onClick={onClose} disabled={isSubmitting}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default JoinCourseModal;

