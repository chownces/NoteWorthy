import { gql } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import { Note } from '../database/DatabaseTypes';

export type Database = {
  id: string;
  title: string;
  currentView: string;
  notes: Note[];
};

const AllDatabasesController: React.FC = () => {
  // TODO: Add error handling

  const history = useHistory();

  history.replace('/database/root');

  return <Loader />;
};

// TODO: Recheck return params
export const GET_ALL_USER_DATABASES_QUERY = gql`
  {
    getAllUserDatabases {
      id
      title
      currentView
      notes
    }
  }
`;

export const CREATE_DATABASE_MUTATION = gql`
  mutation createDatabase($index: Int!) {
    createDatabase(index: $index) {
      id
      title
      currentView
      notes
    }
  }
`;

export const DELETE_DATABASE_MUTATION = gql`
  mutation deleteDatabase($databaseId: ID!) {
    deleteDatabase(databaseId: $databaseId) {
      id
    }
  }
`;

export const UPDATE_DATABASE_TITLE_MUTATION = gql`
  mutation updateDatabaseTitle($databaseId: ID!, $title: String!) {
    updateDatabaseTitle(databaseId: $databaseId, title: $title) {
      id
      title
    }
  }
`;

export default AllDatabasesController;
