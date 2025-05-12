import React, { useState } from 'react';
import styles from "./MainLayout.module.css";

function MainLayout({ pfp_path, name, email, contact_ways }) {
    const [imgSrc, setImgSrc] = useState(pfp_path || "/user_pfp/default.png");

    return (
        <>
            <div className={styles["info-flexbox"]}>
                <img
                    src={imgSrc}
                    onError={() => setImgSrc("/user_pfp/default.png")}
                    className={styles.pfp}
                    alt="profile"
                />

                <div className={styles["primary-info-flexbox"]}>
                    <div>
                        <h3 className={styles["user-name"]}>{name}</h3>
                    </div>

                    <div>
                        <h2 className={styles.h2}>Registered Email:</h2>
                        <h3 className={styles["register-email"]}>{email}</h3>
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
                <img src="/icons/pencil.png" className={styles["edit-icon"]} alt="Edit" />
                編輯基本個人檔案
            </button>

            <hr className={styles.hr} />
        </>
    );
}

export default MainLayout;
