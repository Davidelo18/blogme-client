import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../core/auth';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useSubscription } from '@apollo/client';
import { CHECK_UNREAD_MESSAGES, NEW_MESSAGE } from '../core/graphql';

function HeaderLogged() {
    const { user, logout } = useContext(AuthContext);

    const { data: { checkUnreadMessages: messages } = {}, refetch } = useQuery(CHECK_UNREAD_MESSAGES);

    const { data: newMessages, error: newMessagesError } = useSubscription(NEW_MESSAGE);

    useEffect(() => {
        if (newMessagesError) console.log(newMessagesError);

        if (newMessages) {
            refetch();
        }
    }, [newMessagesError, newMessages, refetch]);

    return (
        <header className="header">
            <Link to="/"><div className="header__logo">blogMe</div></Link>
            <nav className="header__nav">
                <button className="header__burger" id="burgerBtn"></button>
                <ul className="header__optionsContainer" id="menuList">
                    <li className="header__option header__option--user"><Link to={`/user/${user.username}`}>{user.username}</Link></li>
                    <li className={(messages && messages.length > 0) ? "header__option new" : "header__option"} id="optionsMenu chat-menu">
                        <Link to={`/message`}>{(messages && messages.length > 0) && (<span>({ messages.length })</span>)} Czat</Link>
                    </li>
                    <li className="header__option" id="optionsMenu"><Link to={`/user/${user.username}/konfiguracja`}>Konfiguracja profilu</Link></li>
                    <li className="header__option" role="button" onClick={logout}>Wyloguj się</li>
                </ul>
            </nav>
        </header>
    );
}

export default HeaderLogged;