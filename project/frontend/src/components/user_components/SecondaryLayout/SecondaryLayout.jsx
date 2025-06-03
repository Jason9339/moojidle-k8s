import React, { useState } from 'react';
import styles from "./SecondaryLayout.module.css";
import EditSecondaryLayout from "./EditSecondaryLayout";

function SecondaryLayout({ user_tags: initialTags }) {
    const [isEditing, setIsEditing] = useState(false);
    const [user_tags, setUserTags] = useState(initialTags || []);

    const handleSave = (newTags) => {
        setUserTags(newTags);
        setIsEditing(false);
        // 可在這裡加 API 呼叫
    };

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h3 className={styles.heading}>Your tags</h3>
                {isEditing ? null : <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
                    <img src="/icons/pencil.png" className={styles.editIcon} alt="Edit" />
                    {"編輯個人 TAGS"}
                </button>}

            </div>

            <div className={styles.body}>
                {isEditing ? (
                    <EditSecondaryLayout
                        user_tags={user_tags}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    user_tags && user_tags.length > 0 ? (
                        <ul className={styles.tagList}>
                            {user_tags.map((tag, index) => (
                                <li className={styles.tagItem} key={index}>
                                    {tag.user_tag}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.emptyText}>No custom tags yet.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default SecondaryLayout;