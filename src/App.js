import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import './App.css';
import './common.css';
import GetCookieData from './api_access/getCookieData';
import Top from './components/top';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import InformationChange from './components/informationChange';
import NameChange from './components/nameChange';
import Logout from './components/logout';
import Navbar from './components/navbar';
import Error from './components/error';
import Donation from './components/donation';
import Inquiry from './components/inquiry';

const App = () => {
    const cookie_data = GetCookieData();
    const [isAuth, setIsAuth] = useState('session' in cookie_data);

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar isAuth={isAuth} />
                <ToastContainer
                    autoClose={5000}
                    position="bottom-right"
                />
                <Routes>
                    <Route path="/" element={<Top />}></Route>
                    <Route path="/signup" element={<Signup />}></Route>
                    <Route path="/login" element={<Login setIsAuth={setIsAuth} />}></Route>
                    <Route path="/home" element={<Home />}></Route>
                    <Route path="/change/information/:chart_id" element={<InformationChange />}></Route>
                    <Route path="/change/name" element={<NameChange />}></Route>
                    <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />}></Route>
                    <Route path="/error/:status_code" element={<Error setIsAuth={setIsAuth} />}></Route>
                    <Route path="/guide/donation" element={<Donation />}></Route>
                    <Route path="/guide/inquiry" element={<Inquiry />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;
