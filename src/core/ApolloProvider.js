import React from 'react';
import App from '../App';
import ApolloClient from 'apollo-client';
import { split } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const authLink = setContext(() => {
    const token = localStorage.getItem('loginToken');
    return{
        headers: {
            Authorization: token ? `Token ${token}` : ''
        }
    }
});

let httpLink = createHttpLink({
    uri: "https://blooming-dawn-05239.herokuapp.com/"
});

httpLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
    uri: "ws://blooming-dawn-05239.herokuapp.com/graphql",
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: `Token ${localStorage.getItem('loginToken')}`
        }
    }
});

const splitLink = split(
    ({ query }) => {
        const definistion = getMainDefinition(query);
        return (
            definistion.kind === 'OperationDefinition' &&
            definistion.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={ client }>
        <App/>
    </ApolloProvider>
)