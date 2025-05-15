import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreateDiscussionBoard, GetAllUserCourses } from "@/services/discussion_board_api/BoardApi.js";
import styles from "./CreateDiscussionBoard.module.css";

const CreateDiscussion = () => {
    const location = useLocation();
    const [boardName, setBoardName] = useState("");
    const [courseId, setCourseId] = useState(location.state?.courseId || "");
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const userId = JSON.parse(localStorage.getItem("user") || "{}").user_id;

    useEffect(() => {
        if (!courseId) {
            // 如果沒有預設 courseId 才拉取課程列表
            GetAllUserCourses(userId).then(setCourses).catch(console.error);
        }
    }, [courseId, userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await CreateDiscussionBoard({ course_id: courseId, name: boardName });
            if (response?.board_id) {
                navigate(`/discussion/${courseId}`);
            } else {
                setError(response?.error || "無法建立討論版");
            }
        } catch {
            setError("發生錯誤，請不要直接用網址進入此頁面");
        }
    };

    return (
        <div className={styles["create-board-container"]}>
            <form className={styles["create-board-form"]} onSubmit={handleSubmit}>
                <h2>新增討論版</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label htmlFor="board-name">討論版名稱</label>
                    <input
                        type="text"
                        id="board-name"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        required
                        placeholder="輸入討論版名稱"
                    />
                </div>
                <div className={styles["button-group"]}>
                    <button type="button" onClick={() => navigate(-1)} className={styles["cancel-btn"]}>
                        取消
                    </button>
                    <button type="submit" className={styles["submit-btn"]}>發布</button>
                </div>
            </form>
        </div>
    );
};

export default CreateDiscussion;
