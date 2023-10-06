import GetUrl from './url';
import { useState, useEffect } from 'react'

// Response Data: {signup_status}
const SignupRequest = (user_id, user_name, password) => {
    const requestBody = {
        API: "SignupAPI",
        user_id: user_id,
        user_name: user_name,
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
                console.error("Error in SignupRequest:", error);
            }
        })()
    }, [])

    return responseBody
};

export default SignupRequest;