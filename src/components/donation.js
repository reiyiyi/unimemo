import React from "react";

const Donation = () => {
    return (
        <div className="p-3">
            <div className="container">
                <h4 className="my-3">寄付のお願いについて</h4>
                <div className="introduction-card">
                    <p>
                        本サービス「うにめも(β版)」をご利用していただき、誠にありがとうございます。
                    </p>
                    <p>
                        その本サービスですが、開発に要した費用が大きくなってしまったため、もしよろしければ少額の寄付をお願いいたします。
                        寄付の形態については有料noteを利用させていただいておりまして、その詳細を下に記載させていただきます。
                    </p>
                    <a href="https://note.com/reiyiyi" target="_blank">https://note.com/reiyiyi</a>
                    <p>
                        上記URL先のアカウントを用いて一律200円の寄付用記事と記載した有料noteをいくつか投稿する予定ですので、
                        それをご購入していただく形での寄付を是非ともお願いいたします。
                    </p>
                    <p>
                    なお、本サービスでは非営利で運営しているため、寄付金の総額が開発費(39,417円)近くの39,000円に達した時点で、
                    寄付用の有料noteを全て無料noteへ変更するという形で寄付の受付を終了する予定です、ご了承ください。
                    現在の寄付金の総額については、「うにめもに関するお話(寄付用記事)」という有料noteの無料公開部分にて公開しております。
                    </p>
                    <p>
                        何卒、よろしくお願いいたします。
                    </p>
                </div>    
            </div>
        </div>
    )
};

export default Donation;