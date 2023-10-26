import GetUrl from "./url";

// Response Data: {logout_status}
const LogoutRequest = async (session) => {
    const requestBody = {
        API: "LogoutAPI",
        session: session
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
                case 400:
                    throw new Error("Bad request error.");
                case 500:
                    throw new Error("Internal server error.");
                default:
                    throw new Error("Something error.");
            }
        }

        responseBody = await response.json();
    } catch (error) {
        console.error("Error in LogoutRequest:", error);
    }

    return responseBody;
};

export default LogoutRequest;