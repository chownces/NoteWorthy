import { gql, useMutation } from '@apollo/client';
import React from 'react';

import UserContext from '../userContext/UserContext';
import Application from './Application';

const ApplicationContainer: React.FC = () => {
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

  const [logoutBackend, { client }] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      client.clearStore();
    }
  });

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

  return (
    <UserContext.Provider value={providerValue}>
      <Application />
    </UserContext.Provider>
  );
};

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

export default ApplicationContainer;
