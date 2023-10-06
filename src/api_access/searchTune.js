import GetUrl from './url';
import { useState, useEffect } from 'react'

// Response Data: {DB response}
const SearchTuneRequest = (difficulty, search_word, session) => {
    const requestBody = {
        API: "SearchTuneAPI",
        difficulty: difficulty,
        search_word: search_word,
        session: session
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
                        case 400:
                            throw new Error('Bad request error.');
                        case 500:
                            throw new Error('Internal server error.');
                        default:
                            throw new Error('Something error.');
                    }
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error("Error in SearchTuneRequest:", error);
            }
        })()
    }, [])

    return responseBody
};

export default SearchTuneRequest;