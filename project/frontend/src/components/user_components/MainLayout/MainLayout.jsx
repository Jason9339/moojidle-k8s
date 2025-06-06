import React, { useState } from 'react';
import styles from "./MainLayout.module.css";
import EditMainLayout from "../EditMainLayout/EditMainLayout";
import { getAvatarUrl } from '@/utils/avatarUtils.js';

function MainLayout({ pfp_path, name, email, contact_ways: initialContacts }) {
    const [imgSrc, setImgSrc] = useState(getAvatarUrl(pfp_path));
    const [isEditing, setIsEditing] = useState(false);
    const [contactWays, setContactWays] = useState(initialContacts || []);

    const handleSave = (updateData) => {
        if (updateData.contactWays) {
            setContactWays(updateData.contactWays);
        }
        if (updateData.hasNewAvatar && updateData.newAvatar) {
            // 使用 utils 函數處理新頭像 URL
            setImgSrc(getAvatarUrl(updateData.newAvatar));
        }
        setIsEditing(false);
    };

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h3 className={styles.username}>{name}</h3>
                {isEditing ? null : <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
                    <img src="/icons/pencil.png" className={styles.editIcon} alt="Edit" />
                    {"編輯基本個人檔案"}
                </button>}

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
                        <span className={styles.label}>Other Contact Ways:</span>                        {isEditing ? (
                            <EditMainLayout
                                contact_ways={contactWays}
                                currentAvatar={imgSrc}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            contactWays?.length > 0 ? (
                                <ul className={styles.contactList}>
                                    {contactWays.map((contact, index) => (
                                        <li key={index} className={styles.contactItem}>
                                            <span className={styles.approach}>{contact.approach}</span>
                                            {":"}
                                            <span className={styles.details}>{contact.details}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className={styles.value}>尚未提供聯絡資訊</span>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;