import React, { useState } from 'react';
import styles from "./OverviewPostCard.module.css"

const OverviewPostCard = ({ userPfp, courseName, boardName, userName, userTags, title, content, postDate }) => {
    const [imgSrc, setImgSrc] = useState(userPfp || "/user_pfp/default.png");

    return (
        <>
            <div className={styles["card"]}>
                <div className={styles["padder-each-block"]}>
                    <p className={styles["course-name"]}>{courseName} / </p> <p className={styles["board-name"]}>{boardName}</p>
                </div>
                <div className={styles["padder-each-block"]}>
                    <p className={styles["user-name"]}>{userName}</p>
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
                <div className={styles["padder-each-block"]}>
                    <p className={styles["title"]}>
                        {title}
                    </p>
                </div>
                <div className={styles["padder-content-block"]}>
                    <p className={styles["content"]}>
                        {content}
                    </p>
                </div>
                <div className={styles["post-date"]}>
                    {postDate.substring(0, 10)}
                </div>
                <img
                    src={imgSrc}
                    onError={() => setImgSrc("/user_pfp/default.png")}
                    className={styles["user-pfp"]}
                    alt="profile"
                />
            </div>
        </>
    )
}


export default OverviewPostCard;
