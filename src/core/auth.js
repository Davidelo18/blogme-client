import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

if (localStorage.getItem('loginToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('loginToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('loginToken');
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (data) => { },
  logout: () => { }
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(data) {
    localStorage.setItem('loginToken', data.token);
    localStorage.setItem('nightTheme', data.options.nightTheme);
    dispatch({
      type: 'LOGIN',
      payload: data
    });
  }

  function logout() {
    localStorage.removeItem('loginToken');
    dispatch({
      type: 'LOGOUT'
    });
    window.location.reload(true);
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider }