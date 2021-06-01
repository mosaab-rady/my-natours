import React, { useContext, useState } from 'react';
import { myContext } from '../Context';
import '../css/signup.css';
import { showAlert } from '../js/alert';
import { request } from '../js/axios';

function SignUp() {
  document.title = `Natours | Sign Up `;
  const [userImage, setUserImage] = useState('default.jpg');
  const { dispatch } = useContext(myContext);

  // const [response, setResponse] = useState();
  let err;

  // make the photo appear when the user choose it
  const handlePhoto = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // send post request to signup the new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', e.target.name.value);
    form.append('email', e.target.email.value);
    form.append('password', e.target.password.value);
    form.append('passwordConfirm', e.target.passwordConfirm.value);
    form.append('photo', e.target.photo.files[0]);

    const response = await request('POST', `/api/v1/users/signUp`, form);
    if (response) {
      // if the request success show alert and change the state in the context
      if (response.data.status === 'success') {
        dispatch({ type: 'LOGGED_IN', payload: response.data.data.user });
        showAlert(response.data.status, 'signed up successfully', 1.5);
        setTimeout(() => (window.location.href = '/'), 1500);
      }
      if (response.data.status !== 'success') {
        err = response.data.message;
        showAlert(response.data.status, err, 5);
        // err = response.data.data;
      }
    }
  };

  return (
    <>
      <div className='signup-container'>
        <h1 className='signup-container__header'>create new account</h1>
        <form
          className='signup__form'
          onSubmit={handleSubmit}
          encType='multipart/form-data'
        >
          <div className='form__group'>
            <label htmlFor='name'>name</label>
            <input type='text' required name='name' id='name' minLength='4' />
          </div>
          <div className='form__group'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              placeholder='you@example.com'
              required
              name='email'
              id='email'
            />
          </div>
          <div className='form__group'>
            <label htmlFor='password'>password</label>
            <input
              type='password'
              placeholder='••••••••'
              required
              minLength='8'
              name='password'
              id='password'
            />
          </div>
          <div className='form__group'>
            <label htmlFor='passwordConfirm'>confirm password</label>
            <input
              type='password'
              placeholder='••••••••'
              minLength='8'
              required
              name='passwordConfirm'
              id='passwordConfirm'
            />
          </div>
          <div className='form__group-img'>
            <img src={userImage} alt='' className='signup__photo' />
            <label htmlFor='photo' className='photo-btn'>
              choose new photo
            </label>
            <input
              type='file'
              accept='image/*'
              id='photo'
              name='photo'
              onChange={handlePhoto}
            />
          </div>
          <button className='signup-btn'>sign up</button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
