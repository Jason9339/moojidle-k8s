import React, { useState } from 'react';
import styles from "./MainLayout.module.css";
import EditMainLayout from "./EditMainLayout";

function MainLayout({ pfp_path, name, email, contact_ways: initialContacts }) {
    const [imgSrc, setImgSrc] = useState(pfp_path || "/user_pfp/default.png");
    const [isEditing, setIsEditing] = useState(false);
    const [contactWays, setContactWays] = useState(initialContacts || []);

    const handleSave = (newContacts) => {
        setContactWays(newContacts);
        setIsEditing(false);
        // 這裡可加 API 呼叫
    };

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h3 className={styles.username}>{name}</h3>
                <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
                    <img src="/icons/pencil.png" className={styles.editIcon} alt="Edit" />
                    {isEditing ? "完成" : "編輯基本個人檔案"}
                </button>
            </div>

            <div className={styles.infoSection}>
                <img
                    src={imgSrc}
                    onError={() => setImgSrc("/user_pfp/default.png")}
                    className={styles.pfp}
                    alt="profile"
                />

                <div className={styles.textSection}>
                    <div className={styles.infoBlock}>
                        <span className={styles.label}>Registered Email:</span>
                        <span className={styles.value}>{email}</span>
                    </div>

                    <div className={styles.infoBlock}>
                        <span className={styles.label}>Other Contact Ways:</span>
                        {isEditing ? (
                            <EditMainLayout
                                contact_ways={contactWays}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            contactWays?.length > 0 ? (
                                <ul className={styles.contactList}>
                                    {contactWays.map((contact, index) => (
                                        <li key={index} className={styles.contactItem}>
                                            <span className={styles.approach}>{contact.approach}</span>
                                            <span className={styles.details}>{contact.details}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className={styles.value}>No contact information provided.</span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;