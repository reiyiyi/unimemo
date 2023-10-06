import GetUrl from './url';
import { useState, useEffect } from 'react'

// Response Data: {login_check_status, session}
const LoginRequest = (user_id, password) => {
    const requestBody = {
        API: "LoginAPI",
        user_id: user_id,
        password: password
    };

    const [responseBody, setData] = useState([])
    const url = GetUrl();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    setData({
                        error_status: response.status
                    });
                    switch (response.status) {
                        case 500:
                            throw new Error('Internal server error.');
                        default:
                            throw new Error('Something error.');
                    }
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error in LoginRequest:", error);
            }
        })()
    }, [])

    return responseBody
};

export default LoginRequest;