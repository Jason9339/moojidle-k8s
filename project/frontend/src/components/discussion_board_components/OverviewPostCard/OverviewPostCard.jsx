import React, { useState } from 'react';
import styles from "./OverviewPostCard.module.css"

const OverviewPostCard = ({ userPfp, courseName, boardName, userName, userTags, title, content, postDate }) => {
    // console.error(postDate.substring(0, 10), typeof postDate);

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
                <div className={styles["padder-each-block"]}>
                    <p className={styles["content"]}>
                        {content}
                    </p>
                </div>
            </div>
        </>
    )
}


export default OverviewPostCard;
