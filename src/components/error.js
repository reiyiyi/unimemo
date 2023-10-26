import React from 'react';
import { useParams, Link } from 'react-router-dom';

const Error = (props) => {
    const { status_code } = useParams();

    // エラーが発生した場合はセッション値を削除
    document.cookie = "session=;max-age=0";
    props.setIsAuth(false);

    switch (status_code) {
        case "400":
            return (
                <div>
                    <p>接続時間が切れました。お手数ですが、再度ログインお願いいたします。</p>
                    <Link className="btn form-btn btn-success" to={"/login"}>ログインページへ</Link>
                </div>
            );
        case "500":
            return (
                <div>
                    <p>現在サーバーエラーが発生しているため、誠に申し訳ありませんが、時間をおいてから再度お試しください。</p>
                    <Link className="btn form-btn btn-success" to={"/"}>TOPページへ</Link>
                </div>
            );
        default:
            return (
                <div>
                    <p>現在エラーが発生しているため、誠に申し訳ありませんが、時間をおいてから再度お試しください。</p>
                    <Link className="btn form-btn btn-success" to={"/"}>TOPページへ</Link>
                </div>
            );
    }
};

export default Error;