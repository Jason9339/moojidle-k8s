import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = ({
    message = 'Wrong path',
    initialSeconds = 5,
    returnTo = -1
}) => {
    const navigate = useNavigate();
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    useEffect(() => {

        const interval = setInterval(() => {
            setSecondsLeft(s => s - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            navigate(returnTo, { replace: true });
        }, initialSeconds * 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [navigate, initialSeconds, returnTo]);

    return (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p>
                {message}, redirecting in {secondsLeft} second
                {secondsLeft !== 1 ? 's' : ''}…
            </p>
        </div>
    );
}


export default Redirect;
