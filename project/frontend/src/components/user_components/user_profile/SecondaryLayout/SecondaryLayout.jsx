import React, { useState } from 'react';
import styles from "./SecondaryLayout.module.css"


function SecondaryLayout({ user_tags }) {
    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.h2}>
                    Your tags:
                </h2>

                <button className={styles["edit-button"]}>
                    <img src="/icons/pencil.png" className={styles["edit-icon"]} alt="Edit" />
                    編輯個人 tags
                </button>

                {user_tags && user_tags.length > 0 ? (
                    <ul>
                        {user_tags.map((tag, index) => (
                            <li className={styles.li} key={index}>{tag.user_tag}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No custom tags yet.</p>
                )}
            </div>
        </>
    );
}

export default SecondaryLayout;
