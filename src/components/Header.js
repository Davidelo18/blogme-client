import React, { useContext } from 'react';
import { AuthContext } from '../core/auth';
import HeaderLogged from './HeaderLogged';

function Header() {
    const { user } = useContext(AuthContext);

    const menu = user ? (
        <HeaderLogged />
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