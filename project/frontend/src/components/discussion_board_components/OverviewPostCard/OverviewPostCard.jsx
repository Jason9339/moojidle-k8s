import React, { useState } from 'react';
import ReactMarkdown from "react-markdown"
import styles from "./OverviewPostCard.module.css";
const MAX_LINES = 5;
const MAX_CHARS = 400;

const OverviewPostCard = ({
    userPfp,
    courseName,
    boardName,
    userName,
    userTags,
    title,
    content,
    postDate,
    onClick
}) => {
    const [imgSrc, setImgSrc] = useState(userPfp || "/user_pfp/default.png");

    const lines = content.split('\n');
    const shouldTruncate = lines.length > MAX_LINES || content.length > MAX_CHARS;

    let displayContent = content;
    if (shouldTruncate) {
        if (lines.length > MAX_LINES) {
            displayContent = lines.slice(0, MAX_LINES).join('\n') + '...';
        } else {
            displayContent = content.substring(0, MAX_CHARS) + '...';
        }
    }

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles["padder-each-block"]}>
                <p className={styles["course-name"]}>{courseName} &gt; </p>
                <p className={styles["board-name"]}>{boardName}</p>
            </div>
            <div className={styles["name-tag-pfp-flex-box"]}>
                <img
                    src={imgSrc}
                    onError={() => setImgSrc("/user_pfp/default.png")}
                    className={styles["user-pfp"]}
                    alt="profile"
                />
                <div className={styles["name-tag-flex-box"]}>
                    <p className={styles["user-name"]}>{userName}</p>
                    <div className={styles["tag-container"]}>
                        {userTags && userTags.length > 0 ? (
                            userTags.map((userTag, index) => (
                                <p className={styles["user-tag"]} key={index}>
                                    {userTag.tag_name}
                                </p>
                            ))
                        ) : (
                            <p className={styles["user-tag"]}>No specific tags</p>
                        )}
                    </div>
                </div>
            </div>
            <hr className={styles["seperate-line"]} />
            <div className={styles["padder-each-block"]}>
                <p className={styles["title"]}>{title}</p>
            </div>
            <div className={`markdown-body ${styles["padder-content-block"]}`}>
                <ReactMarkdown>

                    {displayContent}
                </ReactMarkdown>
            </div>
            <div className={styles["post-date"]}>
                {postDate.substring(0, 10)}
            </div>
        </div>
    );
};

export default OverviewPostCard;
