import React from 'react';
import Header from '../components/Header';
import Form from '../components/Form';

function Login() {
    return (
        <React.Fragment>
            <Header/>
            <main className="main">
                <Form />
            </main>
        </React.Fragment>
    );
}

export default Login;