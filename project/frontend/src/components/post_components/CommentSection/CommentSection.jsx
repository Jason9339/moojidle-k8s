import React, { useState, useRef, useEffect } from "react";
import styles from "./CommentSection.module.css";
import { FiMoreVertical } from "react-icons/fi";

function CommentSection({
    post,
    newComment,
    setNewComment,
    handleCommentSubmit,
    currentUserId,
    handleCommentDelete,
    activeCommentId,
    setActiveCommentId,
}) {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 3;

    // Get the total number of pages
    const totalPages = Math.ceil((post.comments?.length || 0) / commentsPerPage);

    // Calculate the starting and ending index for the current page's comments
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const commentsToDisplay = post.comments?.slice(startIndex, endIndex).reverse() || [];

    useEffect(() => {
        if (!(post.comments && post.comments.length > 3)) {
            setCurrentPage(1);
        }
    }, [post.comments]);

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

            {post.comments && post.comments.length > 3 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        上一頁
                    </button>
                    <span className={styles.pageInfo}>
                        第 {currentPage} 頁 / 共 {totalPages} 頁
                    </span>
                    <button
                        className={styles.pageButton}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        下一頁
                    </button>
                </div>
            )
            }


            {!post.comments || post.comments.length === 0 ? (
                <p>目前尚無留言。</p>
            ) : (
                commentsToDisplay.map((comment) => (
                    <CommentCard
                        key={comment.comment_date + currentUserId}
                        comment={comment}
                        currentUserId={currentUserId}
                        handleCommentDelete={handleCommentDelete}
                        isMenuOpen={activeCommentId === comment.comment_date}
                        onToggleMenu={() =>
                            setActiveCommentId(
                                activeCommentId === comment.comment_date ? null : comment.comment_date
                            )
                        }
                    />
                ))
            )}

        </div>
    );
}

function CommentCard({
    comment,
    currentUserId,
    handleCommentDelete,
    isMenuOpen,
    onToggleMenu,
}) {
    const [expanded, setExpanded] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            if (expanded) {
                textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
            } else {
                textareaRef.current.style.height = "50px";
            }
        }
    }, [expanded]);

    const shouldTruncate = comment.description.split("\n").length > 3 ||
        comment.description.length > 100;

    return (
        <div className={styles.commentCardWrapper}>
            <div className={styles.commentCardContainer}>
                <div className={styles.moreOptionsWrapper}>
                    <button className={styles.moreButton} onClick={onToggleMenu}>
                        <FiMoreVertical size={20} />
                    </button>
                    {isMenuOpen && (
                        <ul className={styles.dropdownMenu}>
                            {currentUserId === comment.comment_by_user_id && (
                                <li
                                    className={styles.dropdownItem}
                                    onClick={() => handleCommentDelete(comment)}
                                >
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

                <textarea
                    ref={textareaRef}
                    className={styles.commentText}
                    value={comment.description}
                    readOnly
                />

                {shouldTruncate && (
                    <button
                        className={styles.expandButton}
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? "收起" : "展開更多"}
                    </button>
                )}
            </div>
        </div>
    );
}

export default CommentSection;
