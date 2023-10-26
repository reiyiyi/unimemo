import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupRequest from "../api_access/signup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [userIdError, setUserIdError] = useState("");
    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState("");
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
            setUserIdError("4文字以上にしてください！");
        }
        else if (userIdValue.length > 16) {
            setUserIdError("16文字以下にしてください！");
        }
        else if (!userIdValue.match(userIdPattern)) {
            setUserIdError("半角英字または半角数字、アンダーバーのみを使用してください！");
        }
        else {
            setUserIdError("");
        }
    }

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
        const responseData = await SignupRequest(userId, userName, password);
        setIsLoading(false);

        if ("error_status" in responseData) {
            setError(responseData.error_status);
        }
        else if (responseData.signup_status) {
            document.cookie = `session=${responseData.session}`;
            toast.success("アカウントの作成に成功しました！");
            navigate("/login");
        }
        else {
            toast.error("そのユーザーIDは既に使われています");
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
            <h4 className="my-3">新規登録</h4>
            <div className="container">
                <form onSubmit={doSubmit}>
                    <div className="row form-group justify-content-center">
                        <div className="form-content col-md-3 col-12">
                            <label className="form-label">ユーザーID:</label>
                            <input type="text" className="form-control"
                                onChange={doChangeUserId} onBlur={handleBlurUserId} />
                            <p className="validation">ユーザーIDは半角英字または半角数字、アンダーバーのみを使用し、4文字以上16文字以下にしてください</p>
                            {userIdError && <p className="validation-error">{userIdError}</p>}
                        </div>
                        <div className="form-content col-md-3 col-12">
                            <label className="form-label">ユーザー名:</label>
                            <input type="text" className="form-control"
                                onChange={doChangeUserName} onBlur={handleBlurUserName} />
                            <p className="validation">ユーザー名は1文字以上16文字以下にしてください</p>
                            {userNameError && <p className="validation-error">{userNameError}</p>}
                        </div>
                        <div className="form-content col-md-3 col-12">
                            <label className="form-label">パスワード:</label>
                            <input type="password" className="form-control"
                                onChange={doChangePassword} onBlur={handleBlurPassword} />
                            <p className="validation">パスワードは8文字以上16文字以下にしてください</p>
                            {passwordError && <p className="validation-error">{passwordError}</p>}
                        </div>
                    </div>
                    <input type="submit" className="btn form-btn btn-success" disabled={!(userId&&userName&&password) || userIdError || userNameError || passwordError}
                        value="新規登録" />
                </form>
            </div>
        </div>
    )
};

export default Signup;