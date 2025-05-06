import React, { useState } from 'react';
import styles from "./MainLayout.module.css";

// assets
import defaultPFP from "@/../public/user_pfp/default.png";
import editIcon from "@/../public/icons/pencil.png";

function MainLayout({ pfp_path, name, email, contact_ways }) {
    const [imgSrc, setImgSrc] = useState(pfp_path || defaultPFP);

    return (
        <>
            <div className={styles["info-flexbox"]}>
                <img
                    src={imgSrc}
                    onError={() => setImgSrc(defaultPFP)}
                    className={styles.pfp}
                    alt="profile"
                />

                <div className={styles["primary-info-flexbox"]}>
                    <div>
                        <h2 className={styles.h2}>User Name:</h2>
                        <h3 className={styles.h3}>{name}</h3>
                    </div>

                    <div>
                        <h2 className={styles.h2}>Registered Email:</h2>
                        <h3 className={styles.h3}>{email}</h3>
                    </div>

                    <div>
                        <h2 className={styles.h2}>Other Contact Ways:</h2>

                        {contact_ways && contact_ways.length > 0 ? (
                            <ol>
                                {contact_ways.map((contact, index) => (
                                    <li className={styles.li} key={index}>
                                        {contact.approach}: {contact.details}
                                    </li>
                                ))}
                            </ol>
                        ) : (
                            <h3 className={styles.h3}>No contact information provided.</h3>
                        )}
                    </div>
                </div>
            </div>

            <button className={styles["edit-button"]}>
                <img src={editIcon} className={styles["edit-icon"]} alt="Edit" />
                編輯基本個人檔案
            </button>

            <hr className={styles.hr} />
        </>
    );
}

export default MainLayout;
