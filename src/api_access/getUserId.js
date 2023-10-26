import GetUrl from "./url";

// Response Data: {user_id}
const GetUserIdRequest = async (session) => {
    const requestBody = {
        API: "GetUserIdAPI",
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
                case 500:
                    throw new Error("Internal server error.");
                default:
                    throw new Error("Something error.");
            }
        }

        responseBody = await response.json();
    } catch (error) {
        console.error("Error in GetUserIdRequest:", error);
    }

    return responseBody;
};

export default GetUserIdRequest;