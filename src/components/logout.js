import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GetCookieData from "../api_access/getCookieData";
import GetUserIdRequest from "../api_access/getUserId";
import LogoutRequest from "../api_access/logout";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Logout = (props) => {
    const cookie_data = GetCookieData();
    const session = ("session" in cookie_data) ? cookie_data.session : "";
    
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
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

    const doLogout = async (event) => {
        setIsLoading(true);
        if (event.target.value == LogoutValue.yes) {

            const responseData = await LogoutRequest(session);
            setIsLoading(false);

            if ("error_status" in responseData) {
                setError(responseData.error_status);
            }
            else if (responseData.logout_check_status) {
                document.cookie = "session=;max-age=0";
                props.setIsAuth(false);
                toast.success("ログアウトしました");
                navigate("/");
            }
            else {
                toast.error("ログアウトに失敗しました");
            }
        }
        else if (event.target.value == LogoutValue.no) {
            setIsLoading(false);
            navigate("/home");
        }

    }

    if (isLoading) {
        return (
            <h1>Wait...</h1>
        )
    }

    const LogoutValue = Object.freeze({
        yes: "yes",
        no: "no"
    });

    if(error != -1){
        navigate(`/error/${error}`);
    }

    return (
        <div className="p-3">
            <h4 className="my-3">ログアウトしますか？</h4>
            <div className="container">
                <button className="btn form-btn btn-success" value={LogoutValue.yes} onClick={doLogout}>はい</button>
                <button className="btn form-btn btn-danger" value={LogoutValue.no} onClick={doLogout}>いいえ</button>
            </div>
        </div>
    )
};

export default Logout;