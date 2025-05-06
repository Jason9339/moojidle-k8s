import React, { useEffect, useState } from 'react';
import { GetUserDataById } from '@/services/user_api/UserApi.js';
import styles from "./UserProfile.module.css"

// for components
import MainLayout from '@/components/user_components/user_profile/MainLayout/MainLayout.jsx';
import SecondaryLayout from '@/components/user_components/user_profile/SecondaryLayout/SecondaryLayout.jsx';

function UserProfile() {
    const [data, setData] = useState(null);

    // faka data
    let userId = 1;

    // fetching data from api services
    useEffect(() => {
        async function fetchData() {
            const result = await GetUserDataById(userId);
            setData(result);
        }

        fetchData();
    }, []);

    if (!data) {
        return (
            <>
                <p className={styles.loading}>
                    loding....
                </p>
            </>
        );
    }

    // page content
    return (
        <>
            <div className={styles.content}>
                <header className={styles.category}>
                    Profile
                </header>
                <hr />

                <div className={styles["layout-flexbox"]}>
                    <MainLayout pfp_path={data.path_to_profile_pic}
                                name={data.name} 
                                email={data.email}
                                contact_ways={data.contact_ways} />

                    <SecondaryLayout user_tags={data.user_tags} />
                </div>
            </div>
        </>
    );
}

export default UserProfile;
