import React from 'react'
import { useQuery } from '@apollo/client';
import User from '../components/User';
import { GET_USER_INFO } from '../core/graphql';

function SingleUser(props) {
    const username = props.match.params.username;

    const { data: { getUserInfo } = {} } = useQuery(GET_USER_INFO, {
        variables: {
            username
        }
    });

    let userMarkup;
    if (!getUserInfo) {
        userMarkup = (
            <section className="user">Ładowanie...</section>
        )
    } else {
        userMarkup = (
            <User user={getUserInfo}/>
        )
    }

    return (
        <React.Fragment>
            <main className="main">
                {userMarkup}
            </main>
        </React.Fragment>
    );
}
export default SingleUser;