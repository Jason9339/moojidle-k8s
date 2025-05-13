import React, { useState } from 'react';
import styles from "./OverviewPostCard.module.css"

const OverviewPostCard = ({ userPfp, courseName, boardName, userName, userTags, title, content, postDate }) => {
    // console.error(postDate.substring(0, 10), typeof postDate);

    return (
        <>
            <div className={styles["card"]}>
                <div>
                    <p className={styles["course-name"]}>{courseName} / </p> <p className={styles["board-name"]}>{boardName}</p>
                </div>
            </div>
        </>
    )
}


export default OverviewPostCard;
