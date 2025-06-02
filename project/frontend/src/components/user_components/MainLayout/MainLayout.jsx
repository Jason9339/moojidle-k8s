import React, { useState } from 'react';
import styles from "./MainLayout.module.css";
import { Link } from "react-router-dom";
function MainLayout({ pfp_path, name, email, contact_ways }) {
    const [imgSrc, setImgSrc] = useState(pfp_path || "/user_pfp/default.png");

    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <h3 className={styles.username}>{name}</h3>
                <Link to="/user/edit-profile" className={styles.editLink}>
                    <button className={styles.editButton}>
                        <img src="/icons/pencil.png" className={styles.editIcon} alt="Edit" />
                        編輯基本個人檔案
                    </button>
                </Link>
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
                        {contact_ways?.length > 0 ? (
                            <ul className={styles.contactList}>
                                {contact_ways.map((contact, index) => (
                                    <li key={index}>
                                        <strong>{contact.approach}:</strong> {contact.details}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span className={styles.value}>No contact information provided.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainLayout;
