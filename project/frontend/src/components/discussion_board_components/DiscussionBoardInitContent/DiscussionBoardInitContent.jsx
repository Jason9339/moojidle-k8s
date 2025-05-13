import React, { useState } from 'react';
import styles from "./DiscussionBoardInitContent.module.css"

const DiscussionBoardInitContent = () => {
    return (
        <>
            <div className={styles["content"]}>
                <div className={styles["category"]}>
                    Welcom to Discussion Board!!
                </div>

                <div className={styles["instruction"]}>
                    Choose a Board to discuss~
                </div>
            </div>
        </>
    )
}

export default DiscussionBoardInitContent;
