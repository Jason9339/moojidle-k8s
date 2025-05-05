import React, { useEffect, useState } from 'react';
import { GetUserDataById } from '@/services/user_api/UserApi.js';
import "./UserProfile.css"

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

    if(!data){
        return (
            <></>
        );
    }

    // page content
    return (
        <>
            <div className='content'>
                <header className='category'>
                    Profile
                </header>
                <hr/>
            </div>
        </>
    );
}

export default UserProfile;
