import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="header__logo">blogMe</div>
            <nav className="header__nav">
                <button className="header__burger" id="burgerBtn"></button>
                <ul className="header__options-container" id="menuList">
                    <li className="header__option">Mój profil</li>
                    <li className="header__option">Opcje</li>
                    <li className="header__option">Wyloguj się</li>
                </ul>
            </nav>
        </header>
    )
}

window.addEventListener('DOMContentLoaded', () => {
    const $burgerBtn = document.getElementById('burgerBtn');
    const $menuList = document.getElementById('menuList');

    $burgerBtn.addEventListener('click', () => {
        $burgerBtn.classList.toggle('menu-opened');
        $menuList.classList.toggle('open');
    });
});

export default Header;