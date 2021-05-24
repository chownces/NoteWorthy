import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import AllDatabasesController from '../../pages/allDatabases/AllDatabasesController';
// import AllNotesController from '../../pages/allNotes/AllNotesController';
import Login from '../../pages/login/Login';
import NotePageController from '../../pages/notePage/NotePageController';
import NotFound from '../../pages/notFound/NotFound';
import Poster from '../../pages/poster/Poster';
import NavigationBar from '../navigationBar/NavigationBar';
import UserContext from '../userContext/UserContext';

type ApplicationProps = {};

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

const Application: React.FC<ApplicationProps> = props => {
  // TODO: To migrate over to JWT and HTTPOnly cookies
  const [user, setUser] = React.useState({
    loggedIn: false,
    email: '',
    firstname: '',
    lastname: ''
  });

  const login = (email: string, firstname: string, lastname: string) =>
    setUser({
      loggedIn: true,
      email: email,
      firstname: firstname,
      lastname: lastname
    });

  const [logoutBackend] = useMutation(LOGOUT_MUTATION);

  const logout = () => {
    logoutBackend();
    setUser({
      loggedIn: false,
      email: '',
      firstname: '',
      lastname: ''
    });
  };

  const providerValue = {
    user: user,
    login: login,
    logout: logout
  };

  const nonAuthPaths = [
    <Route path="/login" component={Login} />,
    <Route path="/contribute" component={NotFound} />
  ];

  return (
    <UserContext.Provider value={providerValue}>
      <NavigationBar />
      <Container>
        <Switch>
          {nonAuthPaths}
          {user.loggedIn ? (
            [
              // TODO: Handle routing once backend is properly up
              /* <Route exact path="/" component={AllNotesController} /> */
              <Route exact path="/" component={AllDatabasesController} />,
              <Route path="/note/:noteId" component={NotePageController} />,
              <Route path="/poster" component={Poster} />,
              <Route component={NotFound} />
            ]
          ) : (
            <Route render={redirectToLogin} />
          )}
        </Switch>
      </Container>
    </UserContext.Provider>
  );
};

const redirectToLogin = () => <Redirect to="/login" />;

export default Application;
