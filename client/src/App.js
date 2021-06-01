import './App.css';
import React from 'react';
import NavBar from './component/NavBar';
import { Route, Switch } from 'react-router';
import AllTours from './component/AllTours';
import TourDetails from './component/TourDetails';
import LogIn from './component/LogIn';
import SignUp from './component/SignUp';
import Error from './component/Error';
import MyAccount from './component/my-account-page/MyAccount';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Switch>
        <Route exact path='/'>
          <AllTours />
        </Route>
        <Route path='/tour/:slug'>
          <TourDetails />
        </Route>
        <Route path='/login'>
          <LogIn />
        </Route>
        <Route path='/signup'>
          <SignUp />
        </Route>
        <Route path='/myaccount'>
          <MyAccount />
        </Route>
        <Route path='*'>
          <Error />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
