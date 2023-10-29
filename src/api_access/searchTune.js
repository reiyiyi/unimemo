import GetUrl from "./url";

// Response Data: {DB response}
const SearchTuneRequest = async (difficulty, tune_search_word, session) => {
    const requestBody = {
        API: "SearchTuneAPI",
        difficulty: difficulty,
        tune_search_word: tune_search_word,
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
        console.error("Error in SearchTuneRequest:", error);
    }

    return responseBody;
};

export default SearchTuneRequest;