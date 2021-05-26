import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';

import Loader from '../../components/loader/Loader';
import { Note } from '../database/DatabaseContainer';
import AllDatabases, { AllDatabasesProps } from './AllDatabases';

export type Database = {
  id: string;
  title: string;
  currentView: string;
  notes: Note[];
};

const AllDatabasesController: React.FC = () => {
  // TODO: Add error handling
  const [createDatabase] = useMutation(CREATE_DATABASE_MUTATION, {
    update: (cache, { data: { createDatabase } }) => {
      // TODO: Handle typing
      const data: any = cache.readQuery({
        query: GET_ALL_USER_DATABASES_QUERY
      });

      cache.writeQuery({
        query: GET_ALL_USER_DATABASES_QUERY,
        data: { getAllUserDatabases: [...data.getAllUserDatabases, createDatabase] }
      });
    }
  });

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_ALL_USER_DATABASES_QUERY);

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const allDatabasesProps: AllDatabasesProps = {
    databases: data.getAllUserDatabases,
    createDatabaseHandler: createDatabase
  };

  return (
    <>
      <AllDatabases {...allDatabasesProps} />
    </>
  );
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
  mutation {
    createDatabase {
      id
      title
      currentView
      notes
    }
  }
`;

export default AllDatabasesController;
