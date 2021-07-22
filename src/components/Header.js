import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="header__logo">blogMe</div>
            <nav className="header__nav">
                <button className="header__burger" id="burgerBtn"></button>
                <ul className="header__options-container" id="menuList">
                    <li className="header__option">Mój profil</li>
                    <li className="header__option" id="optionsMenu">Opcje</li>
                    <li className="header__hidden-menu-container" id="menuFor_optionsMenu">
                        <ul className="header__options-container header__options-container--hidden">
                            <li className="header__option">Tryb nocny</li>
                        </ul>
                    </li>
                    <li className="header__option">Wyloguj się</li>
                </ul>
            </nav>
        </header>
    )
}

window.addEventListener('DOMContentLoaded', () => {
    /* Mechanizm dla burgera menu na mobile */
    const $burgerBtn = document.getElementById('burgerBtn');
    const $menuList = document.getElementById('menuList');

    $burgerBtn.addEventListener('click', () => {
        $burgerBtn.classList.toggle('menu-opened');
        $menuList.classList.toggle('open');
    });

    const $optionsMenu = document.getElementById('optionsMenu');

    $optionsMenu.addEventListener('click', () => {
        const $menuForOptionsMenu = document.getElementById(`menuFor_optionsMenu`);
        const numberOfChildren = $menuForOptionsMenu.querySelector('ul').childElementCount;

        $menuForOptionsMenu.classList.toggle('open');

        if ($menuForOptionsMenu.classList.contains('open')) $menuForOptionsMenu.style.maxHeight = `${numberOfChildren * 39}px`;
        else $menuForOptionsMenu.style.maxHeight = 0;
    });
});

export default Header;