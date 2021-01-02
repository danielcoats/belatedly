import React from 'react-dom';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { BirthdaysTable } from './components/BirthdaysTable';
import { useAadAuth } from './hooks/auth/useAadAuth';

function App() {
  const { isAuthenticated } = useAadAuth();

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>
            <Link to="/">Belatedly</Link>
          </h1>
          <nav className="main-nav">
            <ul>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <a href="#">{isAuthenticated ? 'Sign out' : 'Sign in'}</a>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            <Home isAuthenticated={isAuthenticated} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

interface HomeProps {
  isAuthenticated: boolean;
}

function Home({ isAuthenticated }: HomeProps) {
  return (
    <main>
      {isAuthenticated ? <BirthdaysTable /> : 'Sorry you are not logged in.'}
    </main>
  );
}

function About() {
  return (
    <main>
      <h1>About</h1>
      <p>
        Belatedly is a simple app that helps you remember important dates such
        as birthdays and anniversaries.
      </p>
    </main>
  );
}

export default App;
