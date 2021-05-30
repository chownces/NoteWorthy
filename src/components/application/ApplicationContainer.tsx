import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';

import Loader from '../loader/Loader';
import UserContext, { User } from '../userContext/UserContext';
import Application from './Application';

const ApplicationContainer: React.FC = () => {
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_CURRENT_USER_QUERY);
  const [isFirstLoad, setIsFirstLoad] = React.useState(true);

  // TODO: To migrate over to JWT and HTTPOnly cookies
  const [user, setUser] = React.useState<User>({
    loggedIn: false,
    email: '',
    firstname: '',
    lastname: ''
  });

  // On first load, check whether the user is logged in
  React.useEffect(() => {
    if (queryLoading || queryError || user.loggedIn) {
      return;
    }
    if (data) {
      setIsFirstLoad(false);
    }
    if (data.currentUser) {
      setUser({
        loggedIn: true,
        email: data.currentUser.email,
        firstname: data.currentUser.firstname,
        lastname: data.currentUser.lastname
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryLoading, queryError, data]);

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

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  return (
    <UserContext.Provider value={providerValue}>
      {isFirstLoad ? <Loader /> : <Application />}
    </UserContext.Provider>
  );
};

const GET_CURRENT_USER_QUERY = gql`
  {
    currentUser {
      firstname
      lastname
      email
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

export default ApplicationContainer;
