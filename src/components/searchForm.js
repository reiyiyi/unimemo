import React from 'react';
import { useState } from 'react'
import GetCookieData from '../api_access/getCookieData';
import SearchChartRequest from '../api_access/searchChart';
import SearchTuneRequest from '../api_access/searchTune';
import SearchStatusRequest from '../api_access/searchStatus';
import SearchMemoRequest from '../api_access/searchMemo';
import SearchMirrorRequest from '../api_access/searchMirror';


const SearchChartForm = (props) => {
    const cookie_data = GetCookieData();
    const session = ("session" in cookie_data) ? cookie_data.session : "";

    const searchStyle = props.searchStyle;
    const [difficulty, setDifficulty] = useState("");
    const [level, setLevel] = useState("");
    const [genre, setGenre] = useState("");
    const [searchWord, setSearchWord] = useState("");
    const [searchWordError, setSearchWordError] = useState("");
    const [status, setStatus] = useState("");
    const [memoLength, setMemoLength] = useState("");
    const [mirror, setMirror] = useState("");

    const doChangeDifficulty = (event) => {
        setDifficulty(event.target.value);
    }

    const doChangeLevel = (event) => {
        setLevel(event.target.value);
    }

    const doChangeGenre = (event) => {
        setGenre(event.target.value);
    }

    const doChangeSearchWord = (event) => {
        setSearchWord(event.target.value);
    }

    const handleBlurSearchWord = (event) => {
        const searchWordValue = event.target.value;
        if (searchWordValue.length > 128) {
            setSearchWordError("文字数が多すぎます！");
        }
        else {
            setSearchWordError("");
        }
    }

    const doChangeStatus = (event) => {
        setStatus(event.target.value);
    }

    const doChangeMemoLength = (event) => {
        setMemoLength(event.target.value);
    }

    const doChangeMirror = (event) => {
        setMirror(event.target.value);
    }

    const doSubmitChartInfo = async (event) => {
        event.preventDefault();

        props.setIsSearching(true);
        const responseData = await SearchChartRequest(difficulty, level, genre, session);
        if ("error_status" in responseData) {
            props.setError(responseData.error_status);
        }
        else {
            props.setSearchResult(responseData.search_result);
            props.setIsSearched(true);
        }
        props.setIsSearching(false);
    }

    const doSubmitTune = async (event) => {
        event.preventDefault();

        props.setIsSearching(true);
        const responseData = await SearchTuneRequest(difficulty, searchWord, session);
        if ("error_status" in responseData) {
            props.setError(responseData.error_status);
        }
        else {
            props.setSearchResult(responseData.search_result);
            props.setIsSearched(true);
        }
        props.setIsSearching(false);
    }

    const doSubmitStatus = async (event) => {
        event.preventDefault();

        props.setIsSearching(true);
        const responseData = await SearchStatusRequest(difficulty, status, session);
        if ("error_status" in responseData) {
            props.setError(responseData.error_status);
        }
        else {
            props.setSearchResult(responseData.search_result);
            props.setIsSearched(true);
        }
        props.setIsSearching(false);
    }

    const doSubmitMemo = async (event) => {
        event.preventDefault();

        props.setIsSearching(true);
        const responseData = await SearchMemoRequest(difficulty, memoLength, session);
        if ("error_status" in responseData) {
            props.setError(responseData.error_status);
        }
        else {
            props.setSearchResult(responseData.search_result);
            props.setIsSearched(true);
        }
        props.setIsSearching(false);
    }

    const doSubmitMirror = async (event) => {
        event.preventDefault();

        props.setIsSearching(true);
        const responseData = await SearchMirrorRequest(difficulty, mirror, session);
        if ("error_status" in responseData) {
            props.setError(responseData.error_status);
        }
        else {
            props.setSearchResult(responseData.search_result);
            props.setIsSearched(true);
        }
        props.setIsSearching(false);
    }

    const difficultyChoices = [
        { value: "BASIC", option: "BASIC" },
        { value: "ADVANCED", option: "ADVANCED" },
        { value: "EXPERT", option: "EXPERT" },
        { value: "MASTER", option: "MASTER" },
        { value: "ULTIMA", option: "ULTIMA" }
    ];

    const levelChoices = [
        { value: "1", option: "1" },
        { value: "2", option: "2" },
        { value: "3", option: "3" },
        { value: "4", option: "4" },
        { value: "5", option: "5" },
        { value: "6", option: "6" },
        { value: "7", option: "7" },
        { value: "7+", option: "7+" },
        { value: "8", option: "8" },
        { value: "8+", option: "8+" },
        { value: "9", option: "9" },
        { value: "9+", option: "9+" },
        { value: "10", option: "10" },
        { value: "10+", option: "10+" },
        { value: "11", option: "11" },
        { value: "11+", option: "11+" },
        { value: "12", option: "12" },
        { value: "12+", option: "12+" },
        { value: "13", option: "13" },
        { value: "13+", option: "13+" },
        { value: "14", option: "14" },
        { value: "14+", option: "14+" },
        { value: "15", option: "15" }
    ];

    const genreChoices = [
        { value: "POPS&ANIME", option: "POPS&ANIME" },
        { value: "niconico", option: "niconico" },
        { value: "東方Project", option: "東方Project" },
        { value: "VARIETY", option: "VARIETY" },
        { value: "イロドリミドリ", option: "イロドリミドリ" },
        { value: "ゲキマイ", option: "ゲキマイ" },
        { value: "ORIGINAL", option: "ORIGINAL" }
    ];

    const statusChoices = [
        { value: "strength", option: "武器譜面" },
        { value: "weakness", option: "警戒譜面" },
        // { value: "none", option: "無し" }
    ];

    const memoChoices = [
        { value: "written", option: "設定済" },
        // { value: "unwritten", option: "未設定" }
    ];

    const mirrorChoices = [
        { value: "on", option: "ON" },
        // { value: "off", option: "OFF" }
    ];

    switch (searchStyle) {
        case "chart_info":
            return (
                <div className="search-form">
                    <form onSubmit={doSubmitChartInfo}>
                        <div className="row form-group justify-content-center">
                            <div className="form-content col-md-3 col-8">
                                <label className="form-label">難易度</label>
                                <select name="difficulty" className="form-select" onChange={doChangeDifficulty}>
                                    <option value="">選択してください</option>
                                    {difficultyChoices.map((difficulty, i) => <option value={difficulty.value} key={i}>{difficulty.option}</option>)}
                                </select>
                            </div>
                            <div className="form-content col-md-3 col-8">
                                <label className="form-label">レベル</label>
                                <select name="level" className="form-select" onChange={doChangeLevel}>
                                    <option value="">選択してください</option>
                                    {levelChoices.map((level, i) => <option value={level.value} key={i}>{level.option}</option>)}
                                </select>
                            </div>
                            <div className="form-content col-md-3 col-8">
                                <label className="form-label">ジャンル</label>
                                <select name="genre" className="form-select" onChange={doChangeGenre}>
                                    <option value="">選択してください</option>
                                    {genreChoices.map((genre, i) => <option value={genre.value} key={i}>{genre.option}</option>)}
                                </select>
                            </div>
                        </div>
                        <input type="submit" className="btn form-btn btn-success" disabled={!difficulty}
                            value="検索" />
                    </form>
                </div>
            );
        case "tune":
            return (
                <div className="search-form">
                    <form onSubmit={doSubmitTune}>
                        <div className="row form-group justify-content-center">
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">難易度</label>
                                <select name="difficulty" className="form-select" onChange={doChangeDifficulty}>
                                    <option value="">選択してください</option>
                                    {difficultyChoices.map((difficulty, i) => <option value={difficulty.value} key={i}>{difficulty.option}</option>)}
                                </select>
                            </div>
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">検索ワード</label>
                                <input type="text" className="form-control"
                                    onChange={doChangeSearchWord} onBlur={handleBlurSearchWord} />
                                {searchWordError && <p className="validation-error">{searchWordError}</p>}
                            </div>
                        </div>
                        <input type="submit" className="btn form-btn btn-success" disabled={!difficulty || searchWordError}
                            value="検索" />
                    </form>
                </div>
            );
        case "status":
            return (
                <div className="search-form">
                    <form onSubmit={doSubmitStatus}>
                        <div className="row form-group justify-content-center">
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">難易度</label>
                                <select name="difficulty" className="form-select" onChange={doChangeDifficulty}>
                                    <option value="">選択してください</option>
                                    {difficultyChoices.map((difficulty, i) => <option value={difficulty.value} key={i}>{difficulty.option}</option>)}
                                </select>
                            </div>
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">全国属性</label>
                                <select name="status" className="form-select" onChange={doChangeStatus}>
                                    <option value="">選択してください</option>
                                    {statusChoices.map((status, i) => <option value={status.value} key={i}>{status.option}</option>)}
                                </select>
                            </div>
                        </div>
                        <input type="submit" className="btn form-btn btn-success" disabled={!(difficulty&&status)}
                            value="検索" />
                    </form>
                </div>
            );
        case "memo":
            return (
                <div className="search-form">
                    <form onSubmit={doSubmitMemo}>
                        <div className="row form-group justify-content-center">
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">難易度</label>
                                <select name="difficulty" className="form-select" onChange={doChangeDifficulty}>
                                    <option value="">選択してください</option>
                                    {difficultyChoices.map((difficulty, i) => <option value={difficulty.value} key={i}>{difficulty.option}</option>)}
                                </select>
                            </div>
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">メモ</label>
                                <select name="memo" className="form-select" onChange={doChangeMemoLength}>
                                    <option value="">選択してください</option>
                                    {memoChoices.map((memo, i) => <option value={memo.value} key={i}>{memo.option}</option>)}
                                </select>
                            </div>
                        </div>
                        <input type="submit" className="btn form-btn btn-success" disabled={!(difficulty&&memoLength)}
                            value="検索" />
                    </form>
                </div>
            );
        case "mirror":
            return (
                <div className="search-form">
                    <form onSubmit={doSubmitMirror}>
                        <div className="row form-group justify-content-center">
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">難易度</label>
                                <select name="difficulty" className="form-select" onChange={doChangeDifficulty}>
                                    <option value="">選択してください</option>
                                    {difficultyChoices.map((difficulty, i) => <option value={difficulty.value} key={i}>{difficulty.option}</option>)}
                                </select>
                            </div>
                            <div className="form-content col-md-5 col-8">
                                <label className="form-label">ミラー</label>
                                <select name="mirror" className="form-select" onChange={doChangeMirror}>
                                    <option value="">選択してください</option>
                                    {mirrorChoices.map((mirror, i) => <option value={mirror.value} key={i}>{mirror.option}</option>)}
                                </select>
                            </div>
                        </div>
                        <input type="submit" className="btn form-btn btn-success" disabled={!(difficulty&&mirror)}
                            value="検索" />
                    </form>
                </div>
            );
        default:
            return (
                <div></div>
            );
    }
};

export default SearchChartForm;