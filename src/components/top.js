import React from "react";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Top = () => {
    return (
        <div className="p-3">
            <div className="container">
                <div>
                    <Link className="btn form-btn btn-success" to="/login">ログイン</Link>
                    <Link className="btn form-btn btn-success" to="/signup">新規登録</Link>
                </div>
                <div>
                    <div className="introduction-card">
                        <h5 className="mb-3"><span className="h1">うにめも</span> とは？</h5>
                        <p className="text-break">
                            うにめもは、CHUNITHMという音楽ゲームにおける、あなたの<strong>全国対戦</strong>や<strong>ハイスコア更新</strong>を支援するサービスです。
                        </p>
                    </div>
                    <div className="introduction-card">
                        <h5 className="mb-3">出来ること</h5>
                        <p className="text-break">
                            譜面ごとに以下の内容を設定することが出来ます。(ただしWORLD'S ENDを除く)
                        </p>
                        <ul>
                            <li>
                                普段からミラーをONにしているか否か
                            </li>
                            <li>
                                全国対戦時に、自選にすることが出来る譜面か否か
                            </li>
                            <li>
                                全国対戦時に、相手に投げられたら苦しい譜面か否か
                            </li>
                            <li>
                                譜面の特徴や使っている運指などのような、覚えておきたいこと
                            </li>
                        </ul>
                    </div>
                    <div className="introduction-card">
                        <h5 className="mb-3">嬉しいこと</h5>
                        <p className="text-break">
                            上記のような情報を事前に設定しておくことで、例えば全国対戦時に覚えていない譜面を投げられた際などに、それらの設定した情報を直ちに見ることが出来ます。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Top;