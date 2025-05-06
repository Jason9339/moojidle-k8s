import React, { useState } from 'react';
import "./MainLayout.css"

import default_pfp from "@/../public/user_pfp/default.png"

function MainLayout({ pfp_path, name, email, contact_ways }) {
    const [imgSrc, setImgSrc] = useState(pfp_path || default_pfp);

    return (
        <>
            <div className='info-flexbox'>
                <img src={imgSrc}
                    onError={() => setImgSrc(default_pfp)}
                    className='pfp' />

                <div className='primary-info-flexbox'>
                    <div>
                        <h2>
                            User Name:
                        </h2>

                        <h3>
                            {name}
                        </h3>
                    </div>

                    <div>
                        <h2>
                            Registered Email:
                        </h2>

                        <h3>
                            {email}
                        </h3>
                    </div>

                    <div>
                        <h2>
                            Other Contact Ways:
                        </h2>

                        {contact_ways && contact_ways.length > 0 ? (
                            contact_ways.map((contact, index) => (
                                <h3 key={index}>
                                    {contact.approach}: {contact.details}
                                </h3>
                            ))
                        ) : (
                            <h3>No contact information provided.</h3>
                        )}
                    </div>
                </div>
            </div>

            <button className='edit-button'>
                編輯個人檔案
            </button>

            <hr></hr>
        </>
    );
}

export default MainLayout;
