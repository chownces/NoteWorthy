import React from 'react';

const userContext = React.createContext({
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
