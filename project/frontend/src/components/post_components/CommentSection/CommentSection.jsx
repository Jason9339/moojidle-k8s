import React from "react";
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
        post.comments
          .slice()
          .reverse()
          .map((comment) => (
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
                  onClick={() => {
                    handleCommentDelete(comment);
                  }}
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
          className={styles.commentText}
          value={comment.description}
          readOnly
          rows={Math.max(3, comment.description.split("\n").length)}
        />
      </div>
    </div>
  );
}

export default CommentSection;
