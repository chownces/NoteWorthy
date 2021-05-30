import React, { ReactElement } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AllDatabasesController from '../../pages/allDatabases/AllDatabasesController';
import DatabaseContainer from '../../pages/database/DatabaseContainer';
import Login from '../../pages/login/Login';
import NotePageController from '../../pages/notePage/NotePageController';
import NotFound from '../../pages/notFound/NotFound';
import Poster from '../../pages/poster/Poster';
import Register from '../../pages/register/Register';
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
    <Route path="/poster" component={Poster} key="poster" />
  ];

  return (
    <div className="Application">
      <NavigationBar />
      <Container className="content">
        <Switch>
          {nonAuthPaths}
          {userCtx.user.loggedIn ? (
            [
              <Route exact path="/" component={AllDatabasesController} key="root" />,
              <Route path="/database/:databaseId" component={DatabaseContainer} key="database" />,
              <Route path="/note/:noteId" component={NotePageController} key="note" />,
              <Route component={NotFound} key="404" />
            ]
          ) : (
            <Route render={redirectToLogin} />
          )}
        </Switch>
      </Container>
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
