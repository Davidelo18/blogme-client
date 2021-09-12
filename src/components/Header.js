import React, { useContext } from 'react';
import { mdQuery } from '../core/Variables';
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
                    <li className="header__option" id="optionsMenu">Opcje<i className="fas fa-angle-down"></i></li>
                    <li className="header__hidden-menu-container" id="menuFor_optionsMenu">
                        <ul className="header__options-container header__options-container--hidden">
                            <li className="header__option">Tryb nocny</li>
                        </ul>
                    </li>
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

    const $optionsMenu = document.getElementById('optionsMenu');

    if ($optionsMenu) {
        $optionsMenu.addEventListener('click', () => {
            const $menuForOptionsMenu = document.getElementById(`menuFor_optionsMenu`);
            const numberOfChildren = $menuForOptionsMenu.querySelector('ul').childElementCount;

            $menuForOptionsMenu.classList.toggle('open');

            if (mdQuery.matches) {
                $menuForOptionsMenu.style.maxHeight = null;
                $menuForOptionsMenu.style.left = `-${$optionsMenu.offsetWidth + 20}px`;
            } else {
                $menuForOptionsMenu.style.left = null;
                if ($menuForOptionsMenu.classList.contains('open')) $menuForOptionsMenu.style.maxHeight = `${numberOfChildren * 39}px`;
                else $menuForOptionsMenu.style.maxHeight = 0;
            }

            window.addEventListener('resize', () => {
                $menuForOptionsMenu.classList.remove('open');
                if (!mdQuery.matches) {
                    $menuForOptionsMenu.style.left = null;
                    $menuForOptionsMenu.style.maxHeight = null;
                }
            });
        });
    }
});

export default Header;