import React, { useState } from "react";
import styles from "./PostContent.module.css";
import { FiMoreVertical } from "react-icons/fi";

function PostContent({
    post,
    currentUserId,
    showMenu,
    setShowMenu,
    handleDeletePost,
    description,
    textareaRef,
}) {
    const [imgSrc, setImgSrc] = useState(post.auther_image || "/user_pfp/default.png");

    return (
        <div className={styles.card}>
            {/* Header Row: breadcrumb + more options */}
            <div className={styles.headerRow}>
                <div className={styles.breadcrumb}>
                    {post.course_name} &gt; {post.board_name}
                </div>
                <div className={styles.moreOptionsWrapper}>
                    <button className={styles.moreButton} onClick={() => setShowMenu(!showMenu)}>
                        <FiMoreVertical size={25} />
                    </button>
                    {showMenu && (
                        <ul className={styles.dropdownMenu}>
                            {currentUserId === post.post_by_user_id && (
                                <li className={styles.dropdownItem} onClick={handleDeletePost}>
                                    刪除貼文
                                </li>
                            )}
                            <li className={styles.dropdownItem}>檢舉</li>
                        </ul>
                    )}
                </div>
            </div>

            <div className={styles.userSection}>
                <img
                    src={imgSrc}
                    onError={() => setImgSrc("/user_pfp/default.png")}
                    className={styles.pfp}
                    alt="profile"
                />
                <div className={styles.userInfo}>
                    <div className={styles.usernameDateWrapper}>
                        <div className={styles.username}>{post.author_name}</div>
                        <div className={styles.date}>
                            {new Date(post.post_date).toISOString().split("T")[0]}
                        </div>
                    </div>
                    {post.post_user_custom_tags?.length > 0 && (
                        <div className={styles.customTag}>{post.post_user_custom_tags[0].tag_name}</div>
                    )}
                </div>
            </div>

            <h2 className={styles.postTitle}>{post.title}</h2>

            <textarea
                ref={textareaRef}
                className={styles.description}
                value={description}
                readOnly
                rows={1}
            />
        </div>
    );
}

export default PostContent;
