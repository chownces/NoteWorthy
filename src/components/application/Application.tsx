import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AllDatabasesController from '../../pages/allDatabases/AllDatabasesController';
import DatabaseContainer from '../../pages/database/DatabaseContainer';
import Login from '../../pages/login/Login';
import NotePageController from '../../pages/notePage/NotePageController';
import NotFound from '../../pages/notFound/NotFound';
import Poster from '../../pages/poster/Poster';
import NavigationBar from '../navigationBar/NavigationBar';
import userContext from '../userContext/UserContext';

type ApplicationProps = {};

const Application: React.FC<ApplicationProps> = props => {
  const user = React.useContext(userContext);

  // TODO: Consider disabling some of these paths when a user is logged in
  const nonAuthPaths = [
    <Route path="/login" component={Login} key="login" />,
    <Route path="/contribute" component={NotFound} key="contribute" />,
  ];

  return (
    <>
      <NavigationBar />
      <Container>
        <Switch>
          {nonAuthPaths}
          {user.user.loggedIn ? (
            [
              // TODO: Handle routing once backend is properly up
              /* <Route exact path="/" component={AllNotesController} /> */
              <Route exact path="/" component={AllDatabasesController} key="root" />,
              <Route path="/database/:databaseId" component={DatabaseContainer} key="database" />,
              <Route path="/note/:noteId" component={NotePageController} key="note" />,
              <Route path="/poster" component={Poster} key="poster" />,
              <Route component={NotFound} key="404" />
            ]
          ) : (
            <Route render={redirectToLogin} />
          )}
        </Switch>
      </Container>
    </>
  );
};

const redirectToLogin = () => <Redirect to="/login" />;

export default Application;
