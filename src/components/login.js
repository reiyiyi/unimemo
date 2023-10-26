import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginRequest from "../api_access/login";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = (props) => {
    const navigate = useNavigate();

    const LIMIT = 12 * 60 * 60

    const [userId, setUserId] = useState("");
    const [userIdError, setUserIdError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(-1);

    const doChangeUserId = (event) => {
        setUserId(event.target.value);
    }

    const handleBlurUserId = (event) => {
        const userIdValue = event.target.value;
        // 半角英字半角数字アンダーバーのみで構成された文字列のみを許可する正規表現パターン
        const userIdPattern = /^\w*$/g;
        if (userIdValue.length < 4) {
            setUserIdError("4文字以上にしてください");
        }
        else if (userIdValue.length > 16) {
            setUserIdError("16文字以下にしてください");
        }
        else if (!userIdValue.match(userIdPattern)) {
            setUserIdError("半角英字または半角数字、アンダーバーのみを使用してください！");
        }
        else {
            setUserIdError("");
        }
    }

    const doChangePassword = (event) => {
        setPassword(event.target.value);
    }
    
    const handleBlurPassword = (event) => {
        const PasswordValue = event.target.value;
        if (PasswordValue.length < 8) {
            setPasswordError("8文字以上にしてください！");
        }
        else if (PasswordValue.length > 16) {
            setPasswordError("16文字以下にしてください！");
        }
        else {
            setPasswordError("");
        }
    }

    const doSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        const responseData = await LoginRequest(userId, password);
        setIsLoading(false);

        if ("error_status" in responseData) {
            setError(responseData.error_status);
        }
        else if (responseData.login_check_status) {
            document.cookie = `session=${responseData.session};max-age=${LIMIT}`;
            props.setIsAuth(true);
            toast.success("ログインに成功しました！");
            navigate("/home");
        }
        else {
            toast.error("ユーザーIDまたはパスワードが間違っています");
        }
    }

    if (isLoading) {
        return (
            <h1>Wait...</h1>
        )
    }

    if (error != -1) {
        navigate(`/error/${error}`);
    }

    return (
        <div className="p-3">
            <h4 className="my-3">ログイン</h4>
            <div className="container">
                <form onSubmit={doSubmit}>
                    <div className="row form-group justify-content-center">
                        <div className="form-content col-md-5 col-12">
                            <label className="form-label">ユーザーID:</label>
                            <input type="text" className="form-control"
                                onChange={doChangeUserId} onBlur={handleBlurUserId} />
                            {userIdError && <p className="validation-error">{userIdError}</p>}
                        </div>
                        <div className="form-content col-md-5 col-12">
                            <label className="form-label">パスワード:</label>
                            <input type="password" className="form-control"
                                onChange={doChangePassword} onBlur={handleBlurPassword} />
                            {passwordError && <p className="validation-error">{passwordError}</p>}
                        </div>
                    </div>
                    <input type="submit" className="btn form-btn btn-success" disabled={!(userId&&password) || userIdError || passwordError}
                        value="ログイン" />
                </form>
            </div>
        </div>
    )
};

export default Login;