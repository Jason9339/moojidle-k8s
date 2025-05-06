import React, { useEffect, useState } from 'react';
import { GetUserDataById } from '@/services/user_api/UserApi.js';
import "./UserProfile.css"

// for components
import MainLayout from '@/components/user_components/user_profile/MainLayout/MainLayout.jsx';
import SecondaryLayout from '@/components/user_components/user_profile/SecondaryLayout/SecondaryLayout.jsx';

function UserProfile() {
    const [data, setData] = useState(null);

    // fetching data from api services
    useEffect(() => {
        async function fetchData() {
            const result = await GetUserDataById(2);
            setData(result);
        }

        fetchData();
    }, []);

    if (!data) {
        return (
            <>
                loding....
            </>
        );
    }

    // page content
    return (
        <>
            <div className='content'>
                <header className='category'>
                    Profile
                </header>
                <hr />

                <div className='layout-flexbox'>
                    <MainLayout pfp_path={data.path_to_profile_pic}
                                name={data.name} 
                                email={data.email}
                                contact_ways={data.contact_ways} />

                    <SecondaryLayout  />
                </div>
            </div>
        </>
    );
}

export default UserProfile;
