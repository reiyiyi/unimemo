import React from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
import Top from './components/top';
import Login from './components/login';
import Signup from './components/signup';
import SearchChart from './components/searchChart';
import SearchTune from './components/searchTune';
import SearchChartResult from './components/searchChartResult';
import SearchTuneResult from './components/searchTuneResult';
import Information from './components/information';
import InformationChange from './components/informationChange';
import NameChange from './components/nameChange';
import SearchStatus from './components/searchStatus';
import SearchMirror from './components/searchMirror';
import SearchMemo from './components/searchMemo';
import SearchStatusResult from './components/searchStatusResult';
import SearchMirrorResult from './components/searchMirrorResult';
import SearchMemoResult from './components/searchMemoResult';
import Logout from './components/logout';
import Navbar from './components/navbar';
import Error from './components/error';

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Top />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/logout" element={<Logout />}></Route>
            </Routes>
        </div>
    );
};

export default App;
