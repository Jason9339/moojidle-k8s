import React from 'react';
import styles from "./SecondaryLayout.module.css";

function SecondaryLayout({ user_tags }) {
    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h3 className={styles.heading}>Your tags</h3>
                <button className={styles.editButton}>
                    <img src="/icons/pencil.png" className={styles.editIcon} alt="Edit" />
                    編輯個人 TAGS
                </button>
            </div>

            <div className={styles.body}>
                {user_tags && user_tags.length > 0 ? (
                    <ul className={styles.tagList}>
                        {user_tags.map((tag, index) => (
                            <li className={styles.tagItem} key={index}>
                                {tag.user_tag}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.emptyText}>No custom tags yet.</p>
                )}
            </div>
        </div>
    );
}

export default SecondaryLayout;
