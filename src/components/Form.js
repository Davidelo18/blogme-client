import React, { useState, useContext } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { AuthContext } from '../core/auth';

function Form(props) {
    const context = useContext(AuthContext);
    const [registerErrors, setRegisterErrors] = useState({});
    const [loginErrors, setLoginErrors] = useState({});
    const [values, setValues] = useState({
        username: '',
        newUsername: '',
        email: '',
        password: '',
        newUserPassword: '',
        confirmPassword: ''
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const [registerUser, { registerLoading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { register: userData } }) {
            context.login(userData);
            window.location.pathname = "/";
            window.location.reload(true);
        },
        onError(err) {
            setRegisterErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    const [loginUser, { loginLoading }] = useMutation(LOGIN_USER, {
        update(proxy, { data: { login: userData } }) {
            context.login(userData);
            window.location.pathname = "/";
            window.location.reload(true);
        },
        onError(err) {
            setLoginErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    const onRegisterSubmit = (e) => {
        e.preventDefault();
        registerUser();
    };

    const onLoginSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };

    return (
        <div className="form">
            <div className="form__container">
                <form onSubmit={onLoginSubmit} noValidate className={ loginLoading ? "loading" : "" }>
                    <h2 className="form__title">Logowanie</h2>
                    <section className="form__input-section">
                        <p><label><input type="text" className={loginErrors.username ? "form__input form__input--error" : "form__input"} value={values.username} onChange={onChange} placeholder="Nazwa użytkownika" name="username"/></label></p>
                        <p><label><input type="password" className={loginErrors.password ? "form__input form__input--error" : "form__input"} value={values.password} onChange={onChange} placeholder="Hasło" name="password"/></label></p>
                    </section>
                    <section>
                        <p><button className="form__button" type="submit">Zaloguj się</button></p>
                    </section>
                </form>
                <section>
                    <button className="form__button form__button--switch">Nie masz konta? Zarejestruj się!</button>
                </section>
                {Object.keys(loginErrors).length > 0 && (
                    <section className="form__errors">
                    <ul className="form__error-list">
                        {Object.values(loginErrors).map(val => (
                            <li key={val}>{val}</li>
                        ))}
                    </ul>
                    </section>
                )}
            </div>
            <div className="form__container">
                <form onSubmit={onRegisterSubmit} noValidate className={ registerLoading ? "loading" : "" }>
                    <h2 className="form__title">Rejestracja</h2>
                    <section className="form__input-section">
                        <p><label><input type="text" className={registerErrors.newUsername ? "form__input form__input--error" : "form__input"} value={values.newUsername} onChange={onChange} placeholder="Nazwa użytkownika" name="newUsername"/></label></p>
                        <p><label><input type="email" className={registerErrors.email ? "form__input form__input--error" : "form__input"} value={values.email} onChange={onChange} placeholder="E-mail" name="email"/></label></p>
                        <p><label><input type="password" className={registerErrors.newUserPassword ? "form__input form__input--error" : "form__input"} value={values.newUserPassword} onChange={onChange} placeholder="Hasło" name="newUserPassword"/></label></p>
                        <p><label><input type="password" className={registerErrors.confirmPassword ? "form__input form__input--error" : "form__input"} value={values.confirmPassword} onChange={onChange} placeholder="Powtórz hasło" name="confirmPassword"/></label></p>
                    </section>
                    <section>
                        <p><button className="form__button" type="submit">Zarejestruj się</button></p>
                    </section>
                </form>
                <section>
                    <button className="form__button form__button--switch">Masz już konto? Zaloguj się!</button>
                </section>
                {Object.keys(registerErrors).length > 0 && (
                    <section className="form__errors">
                    <ul className="form__error-list">
                        {Object.values(registerErrors).map(val => (
                            <li key={val}>{val}</li>
                        ))}
                    </ul>
                    </section>
                )}
            </div>
        </div>
    )
}

window.addEventListener('DOMContentLoaded', () => {
    const switchButtons = document.querySelectorAll('.form__button--switch');
    const formContainers = document.querySelectorAll('.form__container');

    switchButtons.forEach(button => {
        button.addEventListener('click', () => {
            formContainers.forEach(container => container.classList.toggle('form__container--register'));
        })
    })
});

const REGISTER_USER = gql`
    mutation register(
        $newUsername: String!
        $email: String!
        $newUserPassword: String!
        $confirmPassword: String!
    ) {
        register(
        registerInput: {
            username: $newUsername
            email: $email
            password: $newUserPassword
            confirmPassword: $confirmPassword
        }
        ) {
            id
            email
            username
            timeCreated
            token
            options {
                nightTheme
            }
        }
    }
`;

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ) {
            id
            email
            username
            timeCreated
            token
            options {
                nightTheme
            }
        }
    }
`;

export default Form;