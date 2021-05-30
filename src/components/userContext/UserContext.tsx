import React from 'react';

export type User = {
  loggedIn: boolean;
  email: string;
  firstname: string;
  lastname: string;
};

type UserContext = {
  user: User;
  login: (email: string, firstname: string, lastname: string) => void;
  logout: () => void;
};

const userContext = React.createContext<UserContext>({
  user: {
    loggedIn: false,
    email: '',
    firstname: '',
    lastname: ''
  },
  login: (email: string, firstname: string, lastname: string) => {},
  logout: () => {}
});

export default userContext;
