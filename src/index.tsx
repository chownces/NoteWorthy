import './styles/index.scss';

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/application/Application';
import reportWebVitals from './reportWebVitals';

// TODO: See if there is a need to abstract this away into a Constants file.
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const httpLink = createHttpLink({
  uri: backendUrl
});

const link = ApolloLink.from([httpLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
