import React, { useContext } from 'react';
import { AuthContext } from '../core/auth';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/pl';

function User({ user: { username, email, timeCreated, avatar, info, options } }) {
    const { user } = useContext(AuthContext);
    moment.locale('pl');

    return (
        <section className="user">
            <div className="user__header">
                <div className="user__avatar"><img src={avatar} alt={`Avatar użytkownika/czki ${username}`} /></div>
                <div className="user__nick">{username}</div>
            </div>
            <div className="user__body">
                {(options.canReceiveMessages && username !== user.username)  && (<Link className="user__configuration-link" to={`/message/${username}`}>Wyślij prywatną wiadomość</Link>)}
                {username === user.username && (<Link className="user__configuration-link" to={`/user/${username}/konfiguracja`}>Konfiguracja profilu</Link>)}
                <ul className="user__basic">
                    <li><span className="user__label">Email: </span>{email}</li>
                    <li><span className="user__label">Data dołączenia: </span>{moment(timeCreated).format("D MMMM YYYY")}</li>
                </ul>
                <ul className="user__info">
                    {info.aboutMe !== "" && (<li><span className="user__label">O mnie: </span>{info.aboutMe}</li>)}
                    {info.name !== "" && (<li><span className="user__label">Imię: </span>{info.name}</li>)}
                    {info.surname !== "" && (<li><span className="user__label">Nazwisko: </span>{info.surname}</li>)}
                    {info.birthDate !== "" && (<li><span className="user__label">Data urodzenia: </span>{moment(info.birthDate).format("D MMMM YYYY")}</li>)}
                    {info.facebook !== "" && (<li><span className="user__label">Facebook: </span>{info.facebook}</li>)}
                    {info.instagram !== "" && (<li><span className="user__label">Instagram: </span>{info.instagram}</li>)}
                    {info.youtube !== "" && (<li><span className="user__label">Youtube: </span>{info.youtube}</li>)}
                    {info.website !== "" && (<li><span className="user__label">Strona internetowa: </span>{info.website}</li>)}
                </ul>
            </div>
        </section>
    )
}

export default User;