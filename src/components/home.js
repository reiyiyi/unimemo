import React, { useEffect, useState } from "react";
import SearchForm from "./searchForm";
import { interpolateRgb } from "d3-interpolate";
import LiquidFillGauge from "react-liquid-gauge";
import { useNavigate, Link } from "react-router-dom";
import GetCookieData from "../api_access/getCookieData";
import GetUserIdRequest from "../api_access/getUserId";

const Home = () => {
    const cookie_data = GetCookieData();
    const session = ("session" in cookie_data) ? cookie_data.session : "";

    const navigate = useNavigate();

    const CHART_TAG = "#chart";

    const startColor = "#003300";
    const endColor = "#00ff77";
    const interpolate = interpolateRgb(startColor, endColor);

    const [error, setError] = useState(-1);
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearched, setIsSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await GetUserIdRequest(session);
            if ("error_status" in response) {
                setError(response.error_status);
            }
            setIsLoading(false);
        })()
    }, []);

    if (isLoading) {
        return (
            <h1>Wait...</h1>
        )
    }

    const SearchStyleValue = Object.freeze({
        chart_info: "chart_info",
        tune: "tune",
        status: "status",
        mirror: "mirror",
        memo: "memo"
    });

    const DifficultyValue = Object.freeze({
        BASIC: "BAS",
        ADVANCED: "ADV",
        EXPERT: "EXP",
        MASTER: "MAS",
        ULTIMA: "ULT"
    });

    const StatusValue = Object.freeze({
        strength: "武器",
        weakness: "警戒",
        none: "-"
    });

    const MirrorValue = Object.freeze({
        on: "ON",
        off: "OFF"
    });

    if (error != -1) {
        navigate(`/error/${error}`);
    }

    return (
        <div className="p-3">
            <div className="nav-scroller shadow-sm mb-3">
                <ul className="nav nav-underline nav-fill" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="chart-info-tab" data-bs-toggle="tab" data-bs-target="#chart-info-tab-pane" type="button" role="tab" aria-controls="chart-info-tab-pane" aria-selected="true">
                            レベル&ジャンル
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="tune-tab" data-bs-toggle="tab" data-bs-target="#tune-tab-pane" type="button" role="tab" aria-controls="tune-tab-pane" aria-selected="false">
                            曲名
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="status-tab" data-bs-toggle="tab" data-bs-target="#status-tab-pane" type="button" role="tab" aria-controls="status-tab-pane" aria-selected="false">
                            全国
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="mirror-tab" data-bs-toggle="tab" data-bs-target="#mirror-tab-pane" type="button" role="tab" aria-controls="mirror-tab-pane" aria-selected="false">
                            ミラー
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="memo-tab" data-bs-toggle="tab" data-bs-target="#memo-tab-pane" type="button" role="tab" aria-controls="memo-tab-pane" aria-selected="false">
                            メモ
                        </button>
                    </li>
                </ul>
            </div>
            <p><span className="required-option">*</span>は必須項目です</p>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane show active" id="chart-info-tab-pane" role="tabpanel" aria-labelledby="chart-info-tab" tabIndex="0">
                    <SearchForm
                        searchStyle={SearchStyleValue.chart_info}
                        setSearchResult={setSearchResult}
                        setIsSearching={setIsSearching}
                        setIsSearched={setIsSearched}
                        setError={setError}
                    />
                </div>
                <div className="tab-pane" id="tune-tab-pane" role="tabpanel" aria-labelledby="tune-tab" tabIndex="0">
                    <SearchForm
                        searchStyle={SearchStyleValue.tune}
                        setSearchResult={setSearchResult}
                        setIsSearching={setIsSearching}
                        setIsSearched={setIsSearched}
                        setError={setError}
                    />
                </div>
                <div className="tab-pane" id="status-tab-pane" role="tabpanel" aria-labelledby="status-tab" tabIndex="0">
                    <SearchForm
                        searchStyle={SearchStyleValue.status}
                        setSearchResult={setSearchResult}
                        setIsSearching={setIsSearching}
                        setIsSearched={setIsSearched}
                        setError={setError}
                    />
                </div>
                <div className="tab-pane" id="mirror-tab-pane" role="tabpanel" aria-labelledby="mirror-tab" tabIndex="0">
                    <SearchForm
                        searchStyle={SearchStyleValue.mirror}
                        setSearchResult={setSearchResult}
                        setIsSearching={setIsSearching}
                        setIsSearched={setIsSearched}
                        setError={setError}
                    />
                </div>
                <div className="tab-pane" id="memo-tab-pane" role="tabpanel" aria-labelledby="memo-tab" tabIndex="0">
                    <SearchForm
                        searchStyle={SearchStyleValue.memo}
                        setSearchResult={setSearchResult}
                        setIsSearching={setIsSearching}
                        setIsSearched={setIsSearched}
                        setError={setError}
                    />
                </div>
            </div>

            {
                isSearching ?
                    (
                        <div className="row justify-content-center">
                            <div className="col-md-1">
                                <strong>検索中...</strong>
                            </div>
                            <div className="col-md-1">
                                <div className="spinner-border ml-auto" role="status" aria-hidden="true"></div>
                            </div>
                        </div>
                    ) :
                    (
                        <div>
                            {
                                isSearched &&
                                <div>
                                    <p>ヒット件数: {searchResult.length}件</p>
                                    <table className="table table-hover chart-table table-sm table-sticky-header">
                                        <thead>
                                            <tr>
                                                <th>曲名</th>
                                                <th>難易度</th>
                                                <th>レベル</th>
                                                <th>全国</th>
                                                <th>ミラー</th>
                                                <th>メモ量</th>
                                                <th>メモ</th>
                                                <th>変更</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {searchResult.map((chart, i) => (
                                                <React.Fragment>
                                                    <tr className="chart-row">
                                                        <td>
                                                            <p key={i} className="text-break">{chart.tune_name.S}</p>
                                                        </td>
                                                        <td className={DifficultyValue[chart.difficulty.S]}>
                                                            <p key={i}>{DifficultyValue[chart.difficulty.S]}</p>
                                                        </td>
                                                        <td>
                                                            <p key={i}>{chart.level.S}</p>
                                                        </td>
                                                        <td className={chart.status.S}>
                                                            <p key={i} className="no-wrap">{StatusValue[chart.status.S]}</p>
                                                        </td>
                                                        <td className={`mirror-${chart.mirror.S}`}>
                                                            <p key={i}>{MirrorValue[chart.mirror.S]}</p>
                                                        </td>
                                                        <td>
                                                            {
                                                                chart.memo_length.N > 0 ? (
                                                                    <LiquidFillGauge
                                                                        style={{ margin: "0 auto" }}
                                                                        width={20}
                                                                        height={20}
                                                                        textSize={0}
                                                                        value={Math.min(100, chart.memo_length.N / 2)}
                                                                        waveAmplitude={0}
                                                                        circleStyle={{ fill: interpolate(Math.min(1, chart.memo_length.N / 200)) }}
                                                                        waveStyle={{ fill: interpolate(Math.min(1, chart.memo_length.N / 200)) }}
                                                                    />
                                                                ) : (
                                                                    <p>-</p>
                                                                )
                                                            }

                                                        </td>
                                                        <td>
                                                            <button className="btn cell-btn btn-success" type="button" data-bs-toggle="collapse" data-bs-target={`#chart_${i}`} aria-expanded="false" aria-controls={`chart_${i}`}>
                                                                ▽
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <Link className="btn cell-btn btn-danger no-wrap" to={`/change/information/${(chart.id.S).replace("#", "&").slice(0, -CHART_TAG.length)}`}>変更</Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="memo-card" colSpan="8">
                                                            <div className="collapse" id={`chart_${i}`}>
                                                                <div className="card card-body">
                                                                    <p className="text-break">{chart.memo.S}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </div>
                    )
            }
        </div>
    );
};

export default Home;