import React, { useContext, useState } from 'react';
import '../../css/myaccount.css';
import { request } from '../../js/axios';
import { myContext } from '../../Context';
import { showAlert } from '../../js/alert';

export default function Settings() {
  const { dispatch, currentUser } = useContext(myContext);
  const [userImage, setUserImage] = useState();

  let err;

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

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', e.target.name.value);
    form.append('email', e.target.email.value);
    form.append('photo', e.target.photo.files[0]);

    const response = await request('PATCH', `/api/v1/users/updateMe`, form);
    if (response) {
      // if the request success show alert and change the state in the context
      if (response.data.status === 'success') {
        dispatch({ type: 'LOGGED_IN', payload: response.data.data.user });
        showAlert(response.data.status, 'updated data successfully', 1.5);
        setTimeout(() => document.location.reload(), 1500);
      }
      if (response.data.status !== 'success') {
        err = response.data.message;
        showAlert(response.data.status, err, 5000);
        // err = response.data.data;
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const form = {};
    form.currentPassword = e.target.currentPassword.value;
    form.password = e.target.password.value;
    form.passwordConfirm = e.target.passwordConfirm.value;

    const response = await request(
      'PATCH',
      `/api/v1/users/updatePassword`,
      form
    );
    if (response) {
      // if the request success show alert and change the state in the context
      if (response.data.status === 'success') {
        dispatch({ type: 'LOGGED_IN', payload: response.data.data.user });
        showAlert(response.data.status, 'updated data successfully', 1.5);
        setTimeout(() => document.location.reload(), 1500);
      }
      if (response.data.status !== 'success') {
        err = response.data.message;
        showAlert(response.data.status, err, 5000);
        // err = response.data.data;
      }
    }
  };

  return (
    <div className='me__settings'>
      <div className='me__account'>
        <h2>your account settings</h2>
        <form
          className='me__form-settings'
          onSubmit={handleUpdateSettings}
          encType='multipart/form-data'
        >
          <div className='me__group'>
            <label htmlFor='name'>name</label>
            <input
              type='text'
              required
              name='name'
              id='name'
              minLength='4'
              defaultValue={currentUser.name}
            />
          </div>
          <div className='me__group'>
            <label htmlFor='email'>email</label>
            <input
              type='email'
              required
              name='email'
              id='email'
              defaultValue={currentUser.email}
            />
          </div>
          <div className='me__group-img'>
            <img
              src={
                userImage ? userImage : `/public/img/users/${currentUser.photo}`
              }
              alt={currentUser.name}
              className='signup__photo settings-photo'
            />
            <label htmlFor='photo' className='photo-btn photo-btn__settings'>
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
          <button className='settings-btn'>save settings</button>
        </form>
      </div>
      <div className='me__password'>
        <h2>password change</h2>
        <form className='me__form-password' onSubmit={handleUpdatePassword}>
          <div className='me__group'>
            <label htmlFor='currentPassword'>current password</label>
            <input
              type='password'
              required
              name='currentPassword'
              id='currentPassword'
              minLength='8'
              placeholder='••••••••'
            />
          </div>
          <div className='me__group'>
            <label htmlFor='password'>new password</label>
            <input
              type='password'
              required
              name='password'
              id='password'
              minLength='8'
              placeholder='••••••••'
            />
          </div>{' '}
          <div className='me__group'>
            <label htmlFor='passwordConfirm'>confirm password</label>
            <input
              type='password'
              required
              name='passwordConfirm'
              id='passwordConfirm'
              minLength='8'
              placeholder='••••••••'
            />
          </div>
          <button className='settings-btn'>save password</button>
        </form>
      </div>
    </div>
  );
}
