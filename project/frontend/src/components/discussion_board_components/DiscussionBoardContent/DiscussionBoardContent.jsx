import React, { useState } from 'react';
import styles from "./DiscussionBoardContent.module.css"

const DiscussionBoardContent = ({ overviewPosts, courseName, boardName }) => {
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


export default DiscussionBoardContent;
