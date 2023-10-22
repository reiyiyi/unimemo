import React from "react";
import { Link } from "react-router-dom";

const Navbar = (props) => {
    return (
        <div>
            {
                props.isAuth ?
                    (
                        <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-success">
                            <div className="container-fluid">
                                <Link className="mb-0 h1 navbar-brand" to="/home">うにめも</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li className="nav-item active">
                                            <Link className="nav-link active" to="/change/name">名前変更</Link>
                                        </li>
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                Links
                                            </a>
                                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <Link className="dropdown-item" to="/guide/donation">寄付のお願いについて</Link>
                                                <Link className="dropdown-item" to="/guide/inquiry">問い合わせについて</Link>
                                                <li><a class="dropdown-item" href="https://github.com/reiyiyi/unimemo" target="_blank">GitHub</a></li>
                                                <li><a class="dropdown-item" href="https://twitter.com/Re_gi_A" target="_blank">@Re_gi_A</a></li>
                                            </ul>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link active" to="/logout">ログアウト</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    ) :
                    (
                        <nav className="navbar sticky-top navbar-expand-lg navbar-dark bg-success">
                            <div className="container-fluid">
                                <Link className="mb-0 h1 navbar-brand" to="/">うにめも</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                Links
                                            </a>
                                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <Link className="dropdown-item" to="/guide/donation">寄付のお願いについて</Link>
                                                <Link className="dropdown-item" to="/guide/inquiry">問い合わせについて</Link>
                                                <li><a class="dropdown-item" href="https://github.com/reiyiyi/unimemo" target="_blank">GitHub</a></li>
                                                <li><a class="dropdown-item" href="https://twitter.com/Re_gi_A" target="_blank">@Re_gi_A</a></li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    )
            }
        </div >
    );
};

export default Navbar;