import React, { useContext } from 'react';
import { myContext } from '../Context';
import '../css/login.css';
import { showAlert } from '../js/alert';
import { request } from '../js/axios';

function LogIn() {
  document.title = `Natours | Log In `;
  const { dispatch } = useContext(myContext);
  let err;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await request('POST', `/api/v1/users/logIn`, {
      email: e.target.email.value,
      password: e.target.password.value,
    });
    // setResponse(data);
    if (response) {
      if (response.data.status === 'success') {
        dispatch({ type: 'LOGGED_IN', payload: response.data.data.user });
        showAlert(response.data.status, 'Logged In successfully', 1.5);
        setTimeout(() => (window.location.href = '/'), 1500);
      }
      if (response.data.status !== 'success') {
        err = response.data.message;
        showAlert(response.data.status, err, 5);
      }
    }
  };

  return (
    <>
      <div className='login-container'>
        <h1 className='login-container__header'>log into your account</h1>
        <form className='login-form' onSubmit={handleSubmit}>
          <div className='login-form__group'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              id='email'
              required
              name='email'
              placeholder='you@example.com'
            />
          </div>
          <div className='login-form__group'>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              required
              name='password'
              id='password'
              minLength='8'
              placeholder='••••••••'
            />
          </div>
          <button className='login-btn'>log in</button>
        </form>
      </div>
    </>
  );
}

export default LogIn;
