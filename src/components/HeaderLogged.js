import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../core/auth';
import { Link } from 'react-router-dom';
import { useSubscription } from '@apollo/client';
import { NEW_MESSAGE } from '../core/graphql';

function HeaderLogged() {
    const { user, logout } = useContext(AuthContext);
    const { data: newMessage } = useSubscription(NEW_MESSAGE);

    useEffect(() => {
        if (newMessage) {
            console.log(newMessage);
        }
    }, [newMessage]);

    return (
        <header className="header">
            <Link to="/"><div className="header__logo">blogMe</div></Link>
            <nav className="header__nav">
                <button className="header__burger" id="burgerBtn"></button>
                <ul className="header__options-container" id="menuList">
                    <li className="header__option header__option--user"><Link to={`/user/${user.username}`}>{user.username}</Link></li>
                    <li className={newMessage ? "header__option new" : "header__option"} id="optionsMenu chat-menu"><Link to={`/message`}>Czat</Link></li>
                    <li className="header__option" id="optionsMenu"><Link to={`/user/${user.username}/konfiguracja`}>Konfiguracja profilu</Link></li>
                    <li className="header__option" role="button" onClick={logout}>Wyloguj się</li>
                </ul>
            </nav>
        </header>
    );
}

export default HeaderLogged;