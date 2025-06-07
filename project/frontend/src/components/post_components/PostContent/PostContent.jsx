import React, { useState } from "react";
import styles from "./PostContent.module.css";
import { FiMoreVertical } from "react-icons/fi";
import { Link } from "react-router-dom";

// markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function PostContent({
    post,
    currentUserId,
    showMenu,
    setShowMenu,
    handleDeletePost,
    editLinkState,
    description,
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
                            {currentUserId === post.post_by_user_id && (
                                <li className={styles.dropdownItem}>
                                    <Link
                                        to={`/post-edit/${post.post_id}`}
                                        state={editLinkState}
                                        className="block w-full h-full"
                                    >
                                        編輯貼文
                                    </Link>
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
                    <div className={styles.userTags}>

                        {
                            post.post_user_custom_tags?.map((tag) => (
                                <span key={tag.tag_name} className={styles.customTag}>
                                    {tag.tag_name}

                                </span>
                            ))
                        }
                    </div>
                </div>
            </div>

            <h2 className={styles.postTitle}>{post.title}</h2>


            <div className={`markdown-body ${styles.description}`}>

                <ReactMarkdown remarkPlugins={[remarkGfm]} >

                    {description}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default PostContent;
