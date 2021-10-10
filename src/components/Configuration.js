import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

function Configuration({ user: { info, options } }) {
    moment.locale('pl');

    const [values, setValues] = useState({
        name: info.name,
        surname: info.surname,
        birthDate: info.birthDate,
        aboutMe: info.aboutMe,
        facebook: info.facebook,
        instagram: info.instagram,
        youtube: info.youtube,
        website: info.website
    });

    const [optionsValues, setOptionsValues] = useState({
        nightTheme: options.nightTheme,
        canReceiveMessages: options.canReceiveMessages
    });

    const [message, setMessage] = useState({});

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setMessage("")
    };

    const [setUserInfo] = useMutation(SET_USER_INFO, {
        variables: values,
        update() {
            setMessage("Informacje o Tobie zostały zmienione")
        }
    });

    const onSubmit = (e) => {
        e.preventDefault();
        setUserInfo();
    };

    const [setUserOptions] = useMutation(SET_USER_OPTIONS, {
        variables: optionsValues,
        update() {
            alert("Informacje o Tobie zostały zmienione")
        }
    });

    const onOptionChange = (e) => {
        let value;
        if (e.target.value === "true") value = true;
        else if (e.target.value === "false") value = false;
        setOptionsValues({ ...optionsValues, [e.target.name]: value });
    };

    const onOptionSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("nightTheme", optionsValues.nightTheme);
        setUserOptions();
    };

    return (
        <section className="configuration">
            <div className="configuration__column">
                <h2 className="configuration__title">Informacje</h2>
                <form onSubmit={onSubmit}>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="name">Imię: </label>
                        <input className="configuration__input configuration__input--text" name="name" value={values.name} onChange={onChange} type="text" id="name" />
                    </div>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="surname">Nazwisko: </label>
                        <input className="configuration__input configuration__input--text" name="surname" value={values.surname} onChange={onChange} type="text" id="surname" />
                    </div>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="aboutMe">O mnie: </label>
                        <textarea className="configuration__input configuration__input--textarea" name="aboutMe" value={values.aboutMe} onChange={onChange} id="aboutMe"></textarea>
                    </div>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="facebook">Facebook: </label>
                        <input className="configuration__input configuration__input--text" name="facebook" value={values.facebook} onChange={onChange} type="text" id="facebook" />
                    </div>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="instagram">Instagram: </label>
                        <input className="configuration__input configuration__input--text" name="instagram" value={values.instagram} onChange={onChange} type="text" id="instagram" />
                    </div>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="youtube">Youtube: </label>
                        <input className="configuration__input configuration__input--text" name="youtube" value={values.youtube} onChange={onChange} type="text" id="youtube" />
                    </div>
                    <div className="configuration__input-section">
                        <label className="configuration__label" htmlFor="website">Website: </label>
                        <input className="configuration__input configuration__input--text" name="website" value={values.website} onChange={onChange} type="text" id="website" />
                    </div>
                    {Object.keys(message).length > 0 && (
                        <div className="configuration__message">{message}</div> )
                    }
                    <div className="configuration__input-section">
                        <button className="configuration__button">Zatwierdź</button>
                    </div>
                </form>
            </div>
            <div className="configuration__column">
                <h2 className="configuration__title">Opcje</h2>
                <form onSubmit={onOptionSubmit}>
                    <div className="configuration__input-section">
                        <div className="configuration__label">Tryb: </div>
                        <select className="configuration__input" name="nightTheme" value={optionsValues.nightTheme} onChange={onOptionChange}>
                            <option value={false}>Dzienny</option>
                            <option value={true}>Nocny</option>
                        </select>
                    </div>
                    <div className="configuration__input-section">
                        <div className="configuration__label">Wiadomości: </div>
                        <select className="configuration__input" name="canReceiveMessages" value={optionsValues.canReceiveMessages} onChange={onOptionChange}>
                            <option value={true}>Odblokowane</option>
                            <option value={false}>Zablokowane</option>
                        </select>
                    </div>
                    <div className="configuration__input-section">
                        <button className="configuration__button">Zatwierdź</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

const SET_USER_INFO = gql`
    mutation setUserInfo(
        $name: String
        $surname: String
        $birthDate: String
        $aboutMe: String
        $facebook: String
        $instagram: String
        $youtube: String
        $website: String){
        setUserInfo(
            name: $name
            surname: $surname
            birthDate: $birthDate
            aboutMe: $aboutMe
            facebook: $facebook
            instagram: $instagram
            youtube: $youtube
            website: $website
        ){
            info {
                name
                surname
                birthDate
                aboutMe
                facebook
                instagram
                youtube
                website
            }
        }
    }
`;

const SET_USER_OPTIONS = gql`
    mutation setUserOptions(
        $nightTheme: Boolean
        $canReceiveMessages: Boolean){
        setUserOptions(
            nightTheme: $nightTheme
            canReceiveMessages: $canReceiveMessages
        ){
            options {
                nightTheme
                canReceiveMessages
            }
        }
    }
`;

export default Configuration;