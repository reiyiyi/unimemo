import React, { useState } from 'react';
import SearchForm from './searchForm';
import { interpolateRgb } from 'd3-interpolate';
import LiquidFillGauge from 'react-liquid-gauge';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(-1);
    const [searchStyle, setSearchStyle] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    const startColor = "#003300";
    const endColor = "#00ff77";
    const interpolate = interpolateRgb(startColor, endColor);

    if (error != -1) {
        navigate(`/error/${error}`);
    }

    return (
        <div className="p-3">
            <div>
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
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane show active" id="chart-info-tab-pane" role="tabpanel" aria-labelledby="chart-info-tab" tabindex="0">
                        <SearchForm
                            searchStyle={SearchStyleValue.chart_info}
                            setSearchResult={setSearchResult}
                            setIsLoading={setIsLoading}
                            setIsSearched={setIsSearched}
                            setError={setError}
                        />
                    </div>
                    <div className="tab-pane" id="tune-tab-pane" role="tabpanel" aria-labelledby="tune-tab" tabindex="0">
                        <SearchForm
                            searchStyle={SearchStyleValue.tune}
                            setSearchResult={setSearchResult}
                            setIsLoading={setIsLoading}
                            setIsSearched={setIsSearched}
                            setError={setError}
                        />
                    </div>
                    <div className="tab-pane" id="status-tab-pane" role="tabpanel" aria-labelledby="status-tab" tabindex="0">
                        <SearchForm
                            searchStyle={SearchStyleValue.status}
                            setSearchResult={setSearchResult}
                            setIsLoading={setIsLoading}
                            setIsSearched={setIsSearched}
                            setError={setError}
                        />
                    </div>
                    <div className="tab-pane" id="mirror-tab-pane" role="tabpanel" aria-labelledby="mirror-tab" tabindex="0">
                        <SearchForm
                            searchStyle={SearchStyleValue.mirror}
                            setSearchResult={setSearchResult}
                            setIsLoading={setIsLoading}
                            setIsSearched={setIsSearched}
                            setError={setError}
                        />
                    </div>
                    <div className="tab-pane" id="memo-tab-pane" role="tabpanel" aria-labelledby="memo-tab" tabindex="0">
                        <SearchForm
                            searchStyle={SearchStyleValue.memo}
                            setSearchResult={setSearchResult}
                            setIsLoading={setIsLoading}
                            setIsSearched={setIsSearched}
                            setError={setError}
                        />
                    </div>
                </div>
            </div>

            {
                isLoading ?
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
                        <table className="table table-hover table-sm table-sticky-header" style={{fontSize:".8rem"}}>
                            {
                                isSearched ? (
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
                                ) :
                                    (
                                        <></>
                                    )
                            }

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
                                                <LiquidFillGauge
                                                    style={{ margin: '0 auto' }}
                                                    width={20}
                                                    height={20}
                                                    textSize={0}
                                                    value={chart.memo_length.N}
                                                    waveAmplitude={0}
                                                    circleStyle={{ fill: interpolate(chart.memo_length.N / 100) }}
                                                    waveStyle={{ fill: interpolate(chart.memo_length.N / 100) }}
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-success" type="button" data-bs-toggle="collapse" data-bs-target={`#chart_${i}`} aria-expanded="false" aria-controls={`chart_${i}`}>
                                                    ▽
                                                </button>
                                            </td>
                                            <td>
                                                <Link className="btn btn-sm btn-danger no-wrap" to={`/change/information/${chart.id.S}`}>変更</Link>
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
                    )
            }
        </div>
    );
};

export default Home;