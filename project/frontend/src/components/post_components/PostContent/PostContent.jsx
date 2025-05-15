import React, { useState } from 'react';
import styles from "./PostContent.module.css";
import { FiMoreVertical, FiCornerUpLeft } from "react-icons/fi";

function PostContent({ post, currentUserId, showMenu, setShowMenu, handleDeletePost }) {
    const [imgSrc, setImgSrc] = useState(post.auther_image || "/user_pfp/default.png");
    return (
        <>
            <div className={styles.postHeader}>
                <div className={styles.headerTop}>
                    <h2 className={styles.title}>
                        <span className={styles.courseName}>{post.course_name}</span> /{" "}
                        <span className={styles.boardName}>{post.board_name}</span>
                    </h2>
                    <div className={styles.moreOptionsWrapper}>
                        <button className={styles.moreButton} onClick={() => setShowMenu(!showMenu)}>
                            <FiMoreVertical size={30} />
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
                <img
                    src={imgSrc}
                    onError={() => setImgSrc("/user_pfp/default.png")}
                    className={styles.pfp}
                    alt="profile"
                />
                <p className={styles.info}>
                    發文者：{post.author_name} | 發文時間：{new Date(post.post_date).toLocaleString()}
                </p>
                {!post.post_user_custom_tags || post.post_user_custom_tags.length === 0 ? (
                    <p>目前尚無留言。</p>
                ) : (
                    post.post_user_custom_tags.slice().reverse().map((tag) => (
                        <p className={styles.tag}>{tag.tag_name}</p>
                    ))
                )}

                <h2 className={styles.title}>
                    <span className={styles.postTitleText}>{post.title}</span>
                </h2>
            </div>

            <pre className={styles.description}>{post.description}</pre>
        </>
    );
}

export default PostContent;
