import React from 'react-dom';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { BirthdaysTable } from './components/BirthdaysTable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { useCallback, useState } from 'react';
import { loginRequested, logoutRequested } from './features/app/appSlice';
import { ImportPane } from './components/ImportPane';

function App() {
  const loggedIn = useSelector((state: RootState) => state.app.isLoggedIn);
  const dispatch = useDispatch();
  const onLogInClickedCallback = useCallback(
    () => (loggedIn ? dispatch(logoutRequested()) : dispatch(loginRequested())),
    [dispatch, loggedIn],
  );

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
                <button onClick={onLogInClickedCallback}>
                  {loggedIn ? 'Sign out' : 'Sign in'}
                </button>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            <Home loggedIn={loggedIn} />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
        <footer className="app-footer">Some footer text goes here.</footer>
      </div>
    </Router>
  );
}

interface HomeProps {
  loggedIn: boolean;
}

function Home({ loggedIn }: HomeProps) {
  const error = useSelector((state: RootState) => state.app.error);
  const profile = useSelector((state: RootState) => state.app.user);
  const loading = useSelector((state: RootState) => state.app.loading);
  const [importPaneShown, setImportPaneShown] = useState<boolean>(false);

  if (loading) {
    return <p>Loading...</p>;
  }

  let content;
  if (loggedIn) {
    content = (
      <>
        {profile ? <p>Hi, {profile.displayName}.</p> : ''}
        <button
          className="import-from-file"
          onClick={() => setImportPaneShown(true)}
          disabled={importPaneShown}>
          Import from file
        </button>
        {importPaneShown && (
          <ImportPane
            onImportPaneCloseClicked={() => setImportPaneShown(false)}
          />
        )}
        <BirthdaysTable />
      </>
    );
  }

  return (
    <main>
      {error ? <p>{error}</p> : ''}
      {content || <p>Sorry you are not logged in.</p>}
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
