import {createContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {isValidToken, setSession} from '../utils/jwt';
import {useMutation} from "@apollo/client";
import {LOGIN_MUTATION, LOGOUT_MUTATION, REFRESHJWT_MUTATION, SIGNUP_MUTATION} from "../utils/graphql-mutation";

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state, action) => {
        const {isAuthenticated, user} = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    SIGNUP: (state, action) => {
        const {user} = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
    ...initialState,
    method: 'jwt',
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    signup: () => Promise.resolve(),
    getUser: () => Promise.resolve(),
});

AuthProvider.propTypes = {
    children: PropTypes.node,
};

function AuthProvider({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [logIn] = useMutation(LOGIN_MUTATION);
    const [signUp] = useMutation(SIGNUP_MUTATION);
    const [logOut] = useMutation(LOGOUT_MUTATION);
    const [refreshJWT] = useMutation(REFRESHJWT_MUTATION);

    useEffect(() => {
        const initialize = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');

                if (accessToken && isValidToken(accessToken)) {
                    setSession(accessToken);

                    const response = await refreshJWT();
                    const {user} = response.data.refreshJWT;

                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: true,
                            user,
                        },
                    });
                } else {
                    dispatch({
                        type: 'INITIALIZE',
                        payload: {
                            isAuthenticated: false,
                            user: null,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        };

        initialize();
    }, []);

    const login = async (username, password) => {
        const response = await logIn({
            variables: {
              userInput: {
                username: username,
                password: password
              }
            },
            errorPolicy: 'none'
        });

        const {token, user} = response.data.logIn;

        setSession(token);
        dispatch({
            type: 'LOGIN',
            payload: {
                user,
            },
        });
    };

    const signup = async (username, password, email, phone, firstName, lastName) => {
        const response = await signUp({
            variables: {
                userInput: {
                    username: username,
                    password: password,
                    email: email,
                    phone: phone,
                    firstName: firstName,
                    lastName: lastName
                }
            },
            errorPolicy: 'none'
        })

        const {token, user} = response.data.signUp;

        window.localStorage.setItem('accessToken', token);
        dispatch({
            type: 'SIGNUP',
            payload: {
                user,
            },
        });
    };

    const logout = async () => {
        await logOut();
        setSession(null);
        dispatch({type: 'LOGOUT'});
    };

    const getUser = () => {
        console.log("auth: ", state);
        return 'x';
    }


    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'jwt',
                login,
                logout,
                signup,
                getUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider};
