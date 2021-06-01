import React, { useEffect, useReducer } from 'react';
import { showAlert } from './js/alert';
import { request } from './js/axios';

export const myContext = React.createContext(null);

const reducer = (state, action) => {
  if (action.type === 'LOGGED_IN') {
    return { ...state, currentUser: action.payload };
  }
  if (action.type === 'LOG_OUT') {
    return { ...state, currentUser: null };
  }
  if (action.type === 'ALL_TOURS') {
    return { ...state, allTours: action.payload };
  }
};

const initialState = {
  currentUser: null,
  allTours: [],
};

export default function Context({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (
      document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('jwt_server=')) &&
      !state.currentUser
    ) {
      const getMe = async () => {
        const response = await request(
          'GET',
          'http://localhost:5000/api/v1/users/me'
        );
        if (response)
          if (response.data.status === 'success')
            dispatch({ type: 'LOGGED_IN', payload: response.data.data.user });
      };
      getMe();
    }

    const method = 'GET';
    const url = '/api/v1/tours';
    const getTours = async () => {
      const response = await request(method, url);
      if (response) {
        if (response.data.status === 'success') {
          dispatch({ type: 'ALL_TOURS', payload: response.data.data.tours });
        }
        if (response.data.status !== 'success') {
          showAlert(response.data.status, response.data.message, 5);
        }
      }
    };
    getTours();
  }, [state.currentUser]);

  return (
    <myContext.Provider value={{ ...state, dispatch }}>
      {children}
    </myContext.Provider>
  );
}
