import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

function Form(props) {
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const [registerUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    const onSubmit = (e) => {
        e.preventDefault();
        registerUser();
    };

    return (
        <div className="form">
            <div className="form__container">
                <form noValidate>
                    <h2 className="form__title">Logowanie</h2>
                    <section className="form__input-section">
                        <p><label><input type="text" className="form__input" id="nick" placeholder="Nazwa użytkownika"/></label></p>
                        <p><label><input type="password" className="form__input" id="passwd" placeholder="Hasło"/></label></p>
                    </section>
                    <section>
                        <p><button className="form__button" type="submit">Zaloguj się</button></p>
                    </section>
                </form>
                <section>
                    <button className="form__button form__button--switch">Nie masz konta? Zarejestruj się!</button>
                </section>
            </div>
            <div className="form__container">
                <form onSubmit={onSubmit} noValidate className={ loading ? "loading" : "" }>
                    <h2 className="form__title">Rejestracja</h2>
                    <section className="form__input-section">
                        <p><label><input type="text" className={errors.username ? "form__input form__input--error" : "form__input"} value={values.username} onChange={onChange} placeholder="Nazwa użytkownika" name="username"/></label></p>
                        <p><label><input type="email" className={errors.email ? "form__input form__input--error" : "form__input"} value={values.email} onChange={onChange} placeholder="E-mail" name="email"/></label></p>
                        <p><label><input type="password" className={errors.password ? "form__input form__input--error" : "form__input"} value={values.password} onChange={onChange} placeholder="Hasło" name="password"/></label></p>
                        <p><label><input type="password" className={errors.confirmPassword ? "form__input form__input--error" : "form__input"} value={values.confirmPassword} onChange={onChange} placeholder="Powtórz hasło" name="confirmPassword"/></label></p>
                    </section>
                    <section>
                        <p>
                            <input type="checkbox" id="regulations" name="regulations"/>
                            <label htmlFor="regulations">Akceptuję regulamin portalu</label>
                        </p>
                    </section>
                    <section>
                        <p><button className="form__button" type="submit">Zarejestruj się</button></p>
                    </section>
                </form>
                <section>
                    <button className="form__button form__button--switch">Masz już konto? Zaloguj się!</button>
                </section>
                {Object.keys(errors).length > 0 && (
                    <section className="form__errors">
                    <ul className="form__error-list">
                        {Object.values(errors).map(val => (
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
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
        registerInput: {
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }
        ) {
        id
        email
        username
        timeCreated
        token
        }
    }
`;


export default Form;