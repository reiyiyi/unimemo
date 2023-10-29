import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GetCookieData from "../api_access/getCookieData";
import GetChartRequest from "../api_access/getChart";
import ChangeInformationtRequest from "../api_access/changeInformation";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InformationChange = () => {
    const cookie_data = GetCookieData();
    const session = ("session" in cookie_data) ? cookie_data.session : "";

    const navigate = useNavigate();

    const { chart_id } = useParams();

    const [status, setStatus] = useState("");
    const [memo, setMemo] = useState("");
    const [memoError, setMemoError] = useState("");
    const [mirror, setMirror] = useState("");
    const [chartData, setChartData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(-1);

    useEffect(() => {
        (async () => {
            const response = await GetChartRequest(chart_id, session);
            if ("error_status" in response) {
                setError(response.error_status);
            }
            else {
                setStatus(response.chart_data.status.S);
                setMemo(response.chart_data.memo.S);
                setMirror(response.chart_data.mirror.S);
                setChartData(response.chart_data);
            }
            setIsLoading(false);
        })()
    }, []);

    const doChangeStatus = (event) => {
        setStatus(event.target.value);
    }

    const doChangeMemo = (event) => {
        setMemo(event.target.value);
    }

    const handleBlurMemo = (event) => {
        const memoValue = event.target.value;
        if (memoValue.length > 2000) {
            setMemoError("2000文字以下にしてください！");
        }
        else {
            setMemoError("");
        }
    }

    const doChangeMirror = (event) => {
        setMirror(event.target.value);
    }

    const doSubmitChartInfo = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        const cookie_data = GetCookieData();
        const session = cookie_data.session;
        const responseData = await ChangeInformationtRequest(chart_id, status, memo, mirror, session);
        setIsLoading(false);

        if ("error_status" in responseData) {
            setError(responseData.error_status);
        }
        else if (responseData.change_status) {
            toast.success("譜面設定を変更しました");
            navigate("/home");
        }
        else {
            toast.error("譜面設定の変更に失敗しました");
        }
    }

    if (isLoading) {
        return (
            <h1>Wait...</h1>
        )
    }

    const statusChoices = [
        { value: "strength", option: "武器譜面" },
        { value: "weakness", option: "警戒譜面" },
        { value: "none", option: "無し" }
    ];

    const mirrorChoices = [
        { value: "on", option: "ON" },
        { value: "off", option: "OFF" }
    ];

    if (error != -1) {
        navigate(`/error/${error}`);
    }

    return (
        <div className="p-3">
            <h4 className="my-3">譜面設定の変更</h4>
            <div className="container">
                <form onSubmit={doSubmitChartInfo}>
                    <div className="row form-group justify-content-center">
                        <div className="form-content col-md-5 col-12">
                            <label htmlFor="status" className="form-label">ステータス:</label>
                            <select name="status" className="form-select" onChange={doChangeStatus} value={status}>
                                {statusChoices.map((status, i) => <option value={status.value} key={i}>{status.option}</option>)}
                            </select>
                        </div>
                        <div className="form-content col-md-5 col-12">
                            <label htmlFor="mirror" className="form-label">ミラー:</label>
                            <select name="mirror" className="form-select" onChange={doChangeMirror} value={mirror}>
                                {mirrorChoices.map((mirror, i) => <option value={mirror.value} key={i}>{mirror.option}</option>)}
                            </select>
                        </div>
                        <div className="form-content col-12">
                            <label htmlFor="memo" className="form-label">メモ:</label>
                            <textarea className="form-control memo-textarea" name="memo" onChange={doChangeMemo} onBlur={handleBlurMemo} value={memo}></textarea>
                        </div>
                    </div>
                    <input type="submit" className="btn form-btn btn-success" disabled={memoError}
                        value="変更" />
                </form>
            </div>
        </div>
    );
};

export default InformationChange;