import React, { useState } from "react";
import { DeleteDiscussionBoard, EditDiscussionBoard } from "@/services/DiscussionBoardApi.js";
import styles from "./EditDiscussionBoardModal.module.css";
import { useNavigate } from "react-router-dom";
import { addAlert } from "@/utils/alert/AlertContext";

export default function EditDiscussionBoardModal({ boardId, onClose }) {
    const [boardName, setBoardName] = useState(""); // 預留未來可編輯
    const [error, setError] = useState("");
    const navigate = useNavigate();
    
    const handleDelete = async () => {
        try {
            await DeleteDiscussionBoard(boardId);
            addAlert("討論版已成功刪除", "success");
            onClose();
            navigate("/discussion/home");
        } catch (err) {
            console.error(err);
            addAlert("刪除失敗，請稍後再試", "error");
        }
    };

    const handleSave = async () => {
        try {
            await EditDiscussionBoard(boardId, boardName);
            addAlert("討論版名稱已成功更新", "success");
            onClose();
            navigate("/discussion/" + boardId);
        } catch (err) {
            console.error(err);
            addAlert("更新失敗，請稍後再試", "error");
        }
    };

    return (
        <div
            className={styles.backdrop}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.title}>編輯討論版</h2>
                <div className={styles.body}>
                    <label htmlFor="boardName">討論版名稱</label>
                    <input
                        id="boardName"
                        type="text"
                        autoFocus
                        placeholder={"請輸入討論版名稱"}
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                    />

                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>

                <div className={styles.buttonGroup}>
                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", width: "100%" }}>
                        <button className={styles.cancelBtn} onClick={onClose}>
                            取消
                        </button>
                        <button
                            className={styles.confirmBtn}
                            onClick={handleSave}
                        >
                            儲存修改
                        </button>
                        <button
                            className={styles.deleteBtn}
                            onClick={handleDelete}
                        >
                            刪除討論版
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
