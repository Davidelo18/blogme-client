import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/root.scss';

import { AuthProvider } from './core/auth';
import { AuthRoute, NotLoginAuth } from './core/authRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import SinglePost from './pages/SinglePost';
import SingleUser from './pages/SingleUser';

import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header/>
        <NotLoginAuth exact path="/" component={Home}/>
        <AuthRoute exact path="/login" component={Login}/>
        <NotLoginAuth exact path="/wpis/:postId" component={SinglePost}/>
        <NotLoginAuth exact path="/user/:username" component={SingleUser}/>
      </Router>
    </AuthProvider>
  );
}

export default App;
