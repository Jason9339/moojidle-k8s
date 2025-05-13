import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteDiscussionBoard } from "@/services/discussion_board_api/BoardApi";

const DeleteDiscussion = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { boardId, boardName } = location.state || {};

    const handleDelete = async () => {
        try {
            await DeleteDiscussionBoard(boardId);
            alert("討論版已成功刪除");
            navigate("/discussion/home"); 
        } catch (err) {
            alert("刪除失敗，請稍後再試");
            console.error(err);
        }
    };

    const handleCancel = () => {
        navigate(-1); // 返回上一頁
    };

    if (!boardId || !boardName) {
        return <p>無效的請求，缺少討論版資訊。</p>;
    }

    return (
        <div className="delete-board-container">
            <h2>刪除討論版</h2>
            <p>你確定要刪除「<strong>{boardName}</strong>」這個討論版嗎？此操作無法復原。</p>
            <div className="button-group">
                <button onClick={handleCancel} className="cancel-btn">取消</button>
                <button onClick={handleDelete} className="delete-btn">刪除</button>
            </div>
        </div>
    );
};

export default DeleteDiscussion;
