import React, { useContext, useEffect, useState } from 'react';
import '../../../css/manageusers.css';
import { request } from '../../../js/axios';
import { showAlert } from '../../../js/alert';
import { myContext } from '../../../Context';

export default function ManageUsers() {
  const { currentUser } = useContext(myContext);
  const [users, setUsers] = useState();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        const getUsers = async () => {
          const response = await request('GET', '/api/v1/users');
          setUsers(response.data.data.users);
        };
        getUsers();
      }
    }
    return () => {
      setUsers('');
    };
  }, [currentUser]);

  const handleUpdateUser = (id) => async (e) => {
    e.preventDefault();
    // console.log(e.target.role.value);
    // console.log(id);
    const response = await request('PATCH', `/api/v1/users/${id}`, {
      role: e.target.role.value,
    });
    if (response) {
      if (response.data.status === 'success') {
        showAlert('success', 'user updated', 1.5);
      }
      if (response.data.status !== 'success') {
        showAlert('fail', response.data.message, 3);
      }
    }
  };

  const deleteUser = async (id) => {
    // console.log(id);
    const response = await request('DELETE', `/api/v1/users/${id}`);
    if ((response.status = 204)) {
      showAlert('success', 'user deleted', 1.5);
      setUsers(users.filter((user) => user._id !== id));
    }
    if (response.status !== 204) {
      showAlert('fail', response.data.message, 3);
    }
  };

  if (users) {
    if (users.length >= 1) {
      return (
        <div className='users-container'>
          {users.map((user, i) => {
            return (
              <div className='users-container___user' key={i}>
                <div className='user-container__user__header'>
                  <img
                    // className='signup__photo'
                    className='user-container__user__header__img'
                    src={`http://localhost:5000/public/img/users/${user.photo}`}
                    alt={user.name.split(' ')[0]}
                  />
                  <h2>{user.name}</h2>
                </div>
                <div className='user-container__user__email'>
                  <label>email</label>
                  <input value={user.email} readOnly></input>
                </div>

                <div className='user-container__user__role'>
                  <label>role</label>
                  <input value={user.role || ''} readOnly></input>
                </div>
                <form
                  className='update-user__form'
                  onSubmit={handleUpdateUser(user._id)}
                >
                  <label>make {user.name.split(' ')[0]}</label>
                  <div className='update-user__form__options'>
                    <div className='update-role__radio-group'>
                      <input type='radio' value='user' name='role' required />
                      <label>normal user</label>
                    </div>
                    <div className='update-role__radio-group'>
                      <input type='radio' value='guide' name='role' />
                      <label>guide</label>
                    </div>
                    <div className='update-role__radio-group'>
                      <input type='radio' value='lead-guide' name='role' />
                      <label>lead-guide</label>
                    </div>
                    <div className='update-role__radio-group'>
                      <input type='radio' value='admin' name='role' />
                      <label>admin</label>
                    </div>
                  </div>
                  <div className='manage-users__btns'>
                    <button className='update-user__btn'>update</button>
                    <button
                      className='delete-user__btn'
                      onClick={() => deleteUser(user._id)}
                    >
                      delete
                    </button>
                  </div>
                </form>
              </div>
            );
          })}
        </div>
      );
    }
    if (users.length < 1) {
      return <h1>you do not have users yet</h1>;
    }
  } else {
    return (
      <div className='my-reviews'>
        <div className='loading'></div>
      </div>
    );
  }
}
