import './styles/root.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
    </Router>
  );
}

export default App;
