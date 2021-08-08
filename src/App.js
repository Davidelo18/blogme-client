import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/root.scss';

import { AuthProvider } from './core/auth';
import { AuthRoute, NotLoginAuth } from './core/authRoute';

import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Header/>
      <Router>
        <NotLoginAuth exact path="/" component={Home}/>
        <AuthRoute exact path="/login" component={Login}/>
      </Router>
    </AuthProvider>
  );
}

export default App;
