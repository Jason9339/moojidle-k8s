import React, { useState } from "react";
import styles from "./CommentSection.module.css";
import { FiMoreVertical } from "react-icons/fi";
import { DeleteCommend } from "@/services/discussion_api/PostAPI";

function CommentSection({
    post,
    newComment,
    setNewComment,
    handleCommentSubmit,
    reflash,
    currentUserId
}) {
    return (
        <div className={styles.sectionContainer}>
            <h3 className={styles.commentTitle}>留言：</h3>

            <div className={styles.commentInputWrapper}>
                <textarea
                    rows="3"
                    className={styles.commentTextarea}
                    placeholder="寫下你的留言..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button className={styles.commentButton} onClick={handleCommentSubmit}>
                    送出留言
                </button>
            </div>

            {!post.comments || post.comments.length === 0 ? (
                <p>目前尚無留言。</p>
            ) : (
                post.comments.slice().reverse().map((comment) => (
                    <CommentCard
                        key={currentUserId + comment.comment_date}
                        comment={comment}
                        currentPostId={post.post_id}
                        currentUserId={currentUserId}
                        reflash={reflash}
                    />
                ))
            )}
        </div>
    );
}

function CommentCard({ comment, currentPostId, currentUserId, reflash }) {
    const [showMenu, setShowMenu] = useState(false);

    const handleCommentDelete = async () => {
        const commenData = {
            post_id: currentPostId,
            user_id: currentUserId,
            comment_date: comment.comment_date,
            description: comment.description
        };
        try {
            await DeleteCommend(commenData);
            alert("留言刪除成功");
        } catch (err) {
            alert("留言刪除失敗：" + (err.message || "未知錯誤"));
        }
        setShowMenu(false);
        reflash();
    };

    return (
        <div className={styles.commentCardWrapper}>
            <div className={styles.commentCardContainer}>
                <div className={styles.moreOptionsWrapper}>
                    <button className={styles.moreButton} onClick={() => setShowMenu(!showMenu)}>
                        <FiMoreVertical size={20} />
                    </button>
                    {showMenu && (
                        <ul className={styles.dropdownMenu}>
                            {currentUserId === comment.comment_by_user_id && (
                                <li className={styles.dropdownItem} onClick={handleCommentDelete}>
                                    刪除留言
                                </li>
                            )}
                            <li className={styles.dropdownItem}>檢舉</li>
                        </ul>
                    )}
                </div>

                <p className={styles.commentInfo}>
                    使用者 {comment.comment_by_user_name}（{comment.comment_user_custom_tag}）於{" "}
                    {new Date(comment.comment_date).toLocaleString()}：
                </p>
                <p className={styles.commentText}>{comment.description}</p>
            </div>
        </div>
    );
}

export default CommentSection;
