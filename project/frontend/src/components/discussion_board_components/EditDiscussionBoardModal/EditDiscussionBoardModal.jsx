import React from "react";
import { DeleteDiscussionBoard } from "@/services/discussion_api/DiscussionBoardApi.js";
import styles from "./EditDiscussionBoardModal.module.css"
import { useNavigate } from "react-router-dom";
export default function EditDiscussionBoardModal({ boardId, onClose }) {

    const navigate = useNavigate();
    const handleSubmit = async () => {
        try {
            await DeleteDiscussionBoard(boardId);
            alert("討論版已成功刪除");
        } catch (err) {
            alert("刪除失敗，請稍後再試");
            console.error(err);
        }

        onClose();
        navigate("/discussion/home");
    };
    return (
        // Backdrop
        <div
            className={styles.backdrop}
            onClick={onClose}
        >
            {/* Modal box */}
            <div
                className={styles.modal}
                onClick={e => e.stopPropagation()}>
                <h2 className={styles.title}>確定要刪除嗎?</h2>
                <div className={styles.buttons}>
                    <button
                        onClick={onClose}
                        className={styles.cancelButton}>
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={styles.confirmButton}>
                        確認
                    </button>
                </div>
            </div>
        </div>
    );
}
