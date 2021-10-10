import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './styles/root.scss';

import { AuthProvider } from './core/auth';
import { AuthRoute, NotLoginAuth } from './core/authRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
import SingleUser from './pages/SingleUser';
import UserConfiguration from './pages/UserConfiguration';

import Header from './components/Header';

function App() {
  const isNightTheme = localStorage.getItem('nightTheme');
  const mainDivClasses = document.getElementsByTagName('html')[0].classList;

  if (isNightTheme) {
    mainDivClasses.add('theme-dark');
    mainDivClasses.remove('theme-light');
  } else {
    mainDivClasses.add('theme-light');
    mainDivClasses.remove('theme-dark');
  }

  return (
    <AuthProvider>
      <Router>
        <Header/>
        <NotLoginAuth exact path="/" component={Home}/>
        <AuthRoute exact path="/login" component={Login}/>
        <NotLoginAuth exact path="/wpis/:postId" component={SinglePost}/>
        <NotLoginAuth exact path="/user/:username" component={SingleUser}/>
        <NotLoginAuth exact path="/user/:username/konfiguracja" component={UserConfiguration}/>
      </Router>
    </AuthProvider>
  );
}

export default App;
