import React from 'react';
import {setContext} from "@apollo/client/link/context";
import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache} from "@apollo/client";
import {onError} from "@apollo/client/link/error";
import {isValidToken} from "./jwt";

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        console.log('graphQLErrors: ', graphQLErrors);
    }
    if (networkError) {
        console.log('networkError: ', networkError);
    }
});

const httpLink = createHttpLink({
    uri: process.env.NODE_ENV === 'development' ? "http://localhost:4000/graphql" : "https://api.spacex.land/graphql",
    credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
    const accessToken = window.localStorage.getItem('accessToken');
    return {
        headers: {
            ...headers,
            authorization: isValidToken(accessToken) ? `Bearer ${accessToken}` : ''
        }
    };
});

const client = new ApolloClient({
    link: authLink.concat(ApolloLink.from([errorLink, httpLink])),
    cache: new InMemoryCache()
});

export default client;