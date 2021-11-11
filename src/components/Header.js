import React, { useContext } from 'react';
import { AuthContext } from '../core/auth';
import { Link } from 'react-router-dom';

function Header() {
    const { user, logout } = useContext(AuthContext);

    const menu = user ? (
        <header className="header">
            <Link to="/"><div className="header__logo">blogMe</div></Link>
            <nav className="header__nav">
                <button className="header__burger" id="burgerBtn"></button>
                <ul className="header__options-container" id="menuList">
                    <li className="header__option header__option--user"><Link to={`/user/${user.username}`}>{user.username}</Link></li>
                    <li className="header__option" id="optionsMenu chat-menu"><Link to={`/message`}>Czat</Link></li>
                    <li className="header__option" id="optionsMenu"><Link to={`/user/${user.username}/konfiguracja`}>Konfiguracja profilu</Link></li>
                    <li className="header__option" role="button" onClick={logout}>Wyloguj się</li>
                </ul>
            </nav>
        </header>
    ) : (
        <header className="header">
            <div className="header__logo">blogMe</div>
        </header>
    )

    return menu;
}

window.addEventListener('DOMContentLoaded', () => {
    /* Mechanizm dla burgera menu na mobile */
    const $burgerBtn = document.getElementById('burgerBtn');
    const $menuList = document.getElementById('menuList');

    if ($burgerBtn && $menuList) {
        $burgerBtn.addEventListener('click', () => {
            $burgerBtn.classList.toggle('menu-opened');
            $menuList.classList.toggle('open');
        });
    }
});

export default Header;