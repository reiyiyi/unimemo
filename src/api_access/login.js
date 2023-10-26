import GetUrl from "./url";

// Response Data: {login_check_status, session}
const LoginRequest = async (user_id, password) => {
    const requestBody = {
        API: "LoginAPI",
        user_id: user_id,
        password: password
    };

    var responseBody = [];
    const url = GetUrl();

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            mode: "cors",
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            responseBody = {
                error_status: response.status
            };
            switch (response.status) {
                case 500:
                    throw new Error("Internal server error.");
                default:
                    throw new Error("Something error.");
            }
        }

        responseBody = await response.json();
    } catch (error) {
        console.error("Error in LoginRequest:", error);
    }

    return responseBody;
};

export default LoginRequest;