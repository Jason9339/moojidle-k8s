import React, { useEffect, useState } from 'react';
import { GetUserDataById } from '@/services/user_api/UserApi.js';

function UserProfile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const result = await GetUserDataById(2);
      setData(result);
    }

    fetchData();
  }, []);

  return (
    <>
      {<pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  );
}

export default UserProfile;
