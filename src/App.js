import './styles/root.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
    </Router>
  );
}

export default App;
