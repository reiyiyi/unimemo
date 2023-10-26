import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetCookieData from "../api_access/getCookieData";
import GetUserIdRequest from "../api_access/getUserId";
import ChangeNameRequest from "../api_access/changeName";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NameChange = () => {
    const cookie_data = GetCookieData();
    const session = ("session" in cookie_data) ? cookie_data.session : "";
    
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(-1);

    useEffect(() => {
        (async () => {
            const response = await GetUserIdRequest(session);
            if ("error_status" in response) {
                setError(response.error_status);
            }
            setIsLoading(false);
        })()
    }, []);

    const doChangeUserName = (event) => {
        setUserName(event.target.value);
    }

    const handleBlurUserName = (event) => {
        const userNameValue = event.target.value;
        if (userNameValue.length < 1) {
            setUserNameError("1文字以上にしてください！");
        }
        else if (userNameValue.length > 16) {
            setUserNameError("16文字以下にしてください！");
        }
        else {
            setUserNameError("");
        }
    }

    const doSubmitUserName = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        const responseData = await ChangeNameRequest(userName, session);
        setIsLoading(false);

        if ("error_status" in responseData) {
            setError(responseData.error_status);
        }
        else if (responseData.change_status) {
            toast.success("ユーザー名を変更しました");
            navigate("/home");
        }
        else {
            toast.error("ユーザー名の変更に失敗しました");
        }
    }

    if (isLoading) {
        return (
            <h1>Wait...</h1>
        )
    }

    if(error != -1){
        navigate(`/error/${error}`);
    }

    return (
        <div className="p-3">
            <h4 className="my-3">ユーザー名の変更</h4>
            <div className="container">
                <form onSubmit={doSubmitUserName}>
                    <div className="row form-group justify-content-center">
                        <div className="form-content col-12">
                            <label className="form-label">新しいユーザー名:</label>
                            <input type="text" className="form-control"
                                onChange={doChangeUserName} onBlur={handleBlurUserName} />
                        </div>
                    </div>
                    <input type="submit" className="btn form-btn btn-success" disabled={!userName || userNameError}
                        value="変更" />
                </form>
            </div>
        </div>
    )
};

export default NameChange;