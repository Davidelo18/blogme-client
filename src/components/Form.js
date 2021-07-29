import React from 'react';

function Form() {
    return (
        <div className="form">
            <div className="form__container">
                <form noValidate>
                    <h2 className="form__title">Logowanie</h2>
                    <section className="form__imput-section">
                        <p><label><input type="name" className="form__imput" id="nick" placeholder="Nazwa użytkownika"/></label></p>
                        <p><label><input type="password" className="form__imput" id="passwd" placeholder="Hasło"/></label></p>
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
                <form noValidate>
                    <h2 className="form__title">Rejestracja</h2>
                    <section className="form__imput-section">
                        <p><label><input type="name" className="form__imput" id="nick" placeholder="Nazwa użytkownika"/></label></p>
                        <p><label><input type="email" className="form__imput" id="passwd" placeholder="E-mail"/></label></p>
                        <p><label><input type="password" className="form__imput" id="passwd" placeholder="Hasło"/></label></p>
                        <p><label><input type="password" className="form__imput" id="confirmPasswd" placeholder="Powtórz hasło"/></label></p>
                    </section>
                    <section>
                        <p>
                            <input type="checkbox" id="regulations" name="regulations"/>
                            <label for="regulations">Akceptuję regulamin portalu</label>
                        </p>
                    </section>
                    <section>
                        <p><button className="form__button" type="submit">Zarejestruj się</button></p>
                    </section>
                </form>
                <section>
                    <button className="form__button form__button--switch">Masz już konto? Zaloguj się!</button>
                </section>
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

/*
const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $passwd: String!
        $confirmPasswd: String!
    ) {
        register(
            registerInput: $username
            email: $email
            password: $passwd
            confirmPassword: $confirmPasswd
        ){
            id email username timeCreated token
        }
    }
`;
*/

export default Form;