import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiAlignRight } from 'react-icons/bi';
import { myContext } from '../Context';
import { request } from '../js/axios';
import { showAlert } from '../js/alert';

const NavBar = () => {
  const { currentUser } = useContext(myContext);
  const [toggle, setToggle] = useState(false);

  const logout = async () => {
    await request('GET', `/api/v1/users/logOut`);
    showAlert('fail', 'logged out', 3);
    setTimeout(() => (window.location.href = '/'), 3000);
  };

  return (
    <>
      <div className='nav_container'>
        <Link
          to='/'
          className='nav_link btn_all_tours'
          onClick={() => setToggle(false)}
        >
          all tours
        </Link>
        <img
          src='../../../public/img/logo-white.png'
          alt='logo'
          id='logo_img'
        />
        <BiAlignRight id='nav_icon' onClick={() => setToggle(!toggle)} />
        {currentUser ? (
          <ul
            className={
              toggle ? 'show_nav_links nav_links' : 'hide_nav_links nav_links'
            }
          >
            <li className='nav_el'>
              <Link
                to='/myaccount'
                className='nav_link me-btn'
                onClick={() => setToggle(!toggle)}
              >
                <img
                  className='nav-el__user-img'
                  src={`/public/img/users/${currentUser.photo}`}
                  alt={`user ${currentUser.name}`}
                />
                <span>{currentUser.name.split(' ')[0]}</span>
              </Link>
            </li>
            <li className='nav_el'>
              <Link
                to='#'
                className='nav_link btn_logout'
                onClick={() => {
                  setToggle(!toggle);
                  logout();
                }}
              >
                log out
              </Link>
            </li>
          </ul>
        ) : (
          <ul
            className={
              toggle ? 'show_nav_links nav_links' : 'hide_nav_links nav_links'
            }
          >
            <li className='nav_el'>
              <Link
                to='/login'
                className='nav_link btn_login'
                onClick={() => setToggle(!toggle)}
              >
                log in
              </Link>
            </li>
            <li className='nav_el'>
              <Link
                to='/signup'
                className='nav_link btn_signup'
                onClick={() => setToggle(!toggle)}
              >
                sign up
              </Link>
            </li>
          </ul>
        )}
      </div>
    </>
  );
};

export default NavBar;
