import React, { useState } from "react";
import { CreateDiscussionBoard } from "@/services/DiscussionBoardApi";
import styles from "./CreateDiscussionBoardModal.module.css";

const CreateDiscussionBoardModal = ({ courseId, userId, onClose }) => {
    const [boardName, setBoardName] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!boardName.trim()) {
            setError("討論版名稱不能為空");
            return;
        }

        try {
            await CreateDiscussionBoard(courseId, boardName);
            onClose();
        } catch (err) {
            console.error("Error creating discussion board:", err);
            setError("發生錯誤，請稍後再試");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.title}>新增討論版</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label htmlFor="boardName">討論版名稱</label>
                    <input
                        id="boardName"
                        type="text"
                        placeholder="請輸入討論版名稱"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        required
                    />
                    <div className={styles.buttonGroup}>
                        <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={onClose}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className={styles.confirmBtn}
                            disabled={!boardName.trim()}
                        >
                            確認
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDiscussionBoardModal;
