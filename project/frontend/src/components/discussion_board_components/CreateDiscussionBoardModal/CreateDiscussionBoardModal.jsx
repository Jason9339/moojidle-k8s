import React, { useEffect, useState } from "react";
import { CreateDiscussionBoard } from "@/services/discussion_api/DiscussionBoardApi";
import styles from "./CreateDiscussionBoardModal.module.css";

const CreateDiscussionModal = ({ courseId, userId, onClose, pushNewBoard }) => {
    const [boardName, setBoardName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!courseId) {
            alert("發生錯誤");
        }
    }, [courseId, userId]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");
        try {
            const response = await CreateDiscussionBoard(courseId, boardName);
            if (response?.board_id) {
                pushNewBoard(response); 
            } else {
                setError(response?.error || "無法建立討論版");
            }

            onClose();
        } catch (err) {
            console.error("Error creating discussion board:", err);
            setError("發生錯誤，請稍後再試");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>新增討論版</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label>討論版名稱</label>
                    <input
                        type="text"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        required
                    />
                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={onClose}>取消</button>
                        <button type="submit">發布</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateDiscussionModal;
