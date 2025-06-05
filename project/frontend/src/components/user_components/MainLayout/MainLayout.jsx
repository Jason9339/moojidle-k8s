import React, { useState } from 'react';
import styles from "./MainLayout.module.css";
import EditMainLayout from "../EditMainLayout/EditMainLayout";

function MainLayout({ pfp_path, name, email, contact_ways: initialContacts }) {
    // 確保頭像路徑包含完整的 URL
    const getAvatarUrl = (path) => {
        if (!path || path === '/user_pfp/default.png') {
            return '/user_pfp/default.png';
        }
        if (path.startsWith('http')) {
            return path;
        }
        return `http://localhost:3000${path}`;
    };

    const [imgSrc, setImgSrc] = useState(getAvatarUrl(pfp_path));
    const [isEditing, setIsEditing] = useState(false);
    const [contactWays, setContactWays] = useState(initialContacts || []);const handleSave = (updateData) => {
        if (updateData.contactWays) {
            setContactWays(updateData.contactWays);
        }
        if (updateData.hasNewAvatar && updateData.newAvatar) {
            // 確保圖片路徑以 http://localhost:3000 開頭
            const avatarUrl = updateData.newAvatar.startsWith('http') 
                ? updateData.newAvatar 
                : `http://localhost:3000${updateData.newAvatar}`;
            setImgSrc(avatarUrl);
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