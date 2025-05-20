import React, { useEffect, useState } from "react";
import { GetUserDataById } from "@/services/UserApi.js";
import styles from "./UserProfile.module.css";

import LeftBar from "@/components/LeftBar/LeftBar";
import MainLayout from "@/components/user_components/MainLayout/MainLayout.jsx";
import SecondaryLayout from "@/components/user_components/SecondaryLayout/SecondaryLayout.jsx";

function UserProfile() {
    const [data, setData] = useState(null);
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await GetUserDataById(userId);
                setData(result);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            {!data ? (
                <div
                    className={styles["profile-container"]}
                    style={{ backgroundColor: "#eff2f5", flex: 1 }}
                />
            ) : (
                <div className={styles["profile-container"]}>
                    <div className={styles["profile-heading-row"]}>
                        <h2 className={styles["profile-heading"]}>User Profile</h2>
                    </div>
                    <hr className={styles["profile-divider"]} />
                    <div className={styles["profile-layout"]}>
                        <MainLayout
                            pfp_path={data.path_to_profile_pic}
                            name={data.name}
                            email={data.email}
                            contact_ways={data.contact_ways}
                        />
                        <SecondaryLayout user_tags={data.user_tags} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
