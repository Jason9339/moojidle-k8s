import React, { useState } from 'react';
import styles from "./OverviewPostCard.module.css"

const OverviewPostCard = ({ userPfp, courseName, boardName, userName, userTags, title, content, postDate }) => {
    console.error(postDate.substring(0, 10), typeof postDate);
    
    return (
        <>
            <div className={styles["content-flex-box"]}>
                <div>
                    {courseName} / {boardName}
                </div>
            </div>
        </>
    )
}


export default OverviewPostCard;
