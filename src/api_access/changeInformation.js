import GetUrl from "./url";

// Response Data: {change_status}
const ChangeInformationRequest = async (chart_id, status, memo, mirror, session) => {
    const requestBody = {
        API: "ChangeInformationAPI",
        chart_id: chart_id,
        status: status,
        memo: memo,
        mirror: mirror,
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
        console.error("Error in ChangeInformationRequest:", error);
    }

    return responseBody;
};

export default ChangeInformationRequest;