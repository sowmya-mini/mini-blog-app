import { Route, Switch, BrowserRouter } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import NewPost from './components/NewPost'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Switch>
          <Route  path="/login" component={Login} />
          <ProtectedRoute exact path={"/"} component={Home} />
          <ProtectedRoute path="/new-post" component={NewPost} />
          {/* Catch-all Route: Renders NotFound for ANY undefined URL like abc , xyz dont give path="/not-found"*/}
          <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
