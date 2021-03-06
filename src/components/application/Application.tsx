import React, { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import AllDatabasesContainer from '../../pages/allDatabases/AllDatabasesContainer';
import DatabaseContainer from '../../pages/database/DatabaseContainer';
import Login from '../../pages/login/Login';
import NotePageContainer from '../../pages/notePage/NotePageContainer';
import NotFound from '../../pages/notFound/NotFound';
import Poster from '../../pages/poster/Poster';
import Register from '../../pages/register/Register';
import SharedNoteContainer from '../../pages/sharedNote/SharedNoteContainer';
import NavigationBar from '../navigationBar/NavigationBar';
import userContext, { User } from '../userContext/UserContext';

const Application: React.FC = () => {
  const userCtx = React.useContext(userContext);

  const nonAuthPaths = [
    <Route path="/login" render={ifAuthRedirectToRoot(userCtx.user, <Login />)} key="login" />,
    <Route path="/contribute" component={NotFound} key="contribute" />,
    <Route
      path="/register"
      component={ifAuthRedirectToRoot(userCtx.user, <Register />)}
      key="register"
    />,
    <Route path="/poster" component={Poster} key="poster" />,
    <Route path="/sharednote" component={SharedNoteContainer} key="sharenote" />
  ];

  return (
    <div className="Application">
      <NavigationBar />
      <div className="content">
        <Switch>
          {nonAuthPaths}
          {userCtx.user.loggedIn ? (
            [
              <Route exact path="/" component={AllDatabasesContainer} key="root" />,
              <Route path="/note/:noteId" component={NotePageContainer} key="note" />,
              <Route
                path="/database/:databaseId" // TODO: change to '/database/:databaseId'
                component={DatabaseContainer}
                key="note"
              />,
              <Route component={NotFound} key="404" />
            ]
          ) : (
            <Route render={redirectToLogin} />
          )}
        </Switch>
      </div>
    </div>
  );
};

const ifAuthRedirectToRoot = (user: User, elseRedirectTo: ReactElement) => {
  if (user.loggedIn) {
    return redirectToRoot;
  } else {
    return () => elseRedirectTo;
  }
};

const redirectToLogin = () => <Redirect to="/login" />;
const redirectToRoot = () => <Redirect to="/" />;

export default Application;
