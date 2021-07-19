import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';

import Loader from '../../components/loader/Loader';
import { Note } from '../database/DatabaseTypes';
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

  const [deleteDatabase] = useMutation(DELETE_DATABASE_MUTATION, {
    update: (cache, { data: { deleteDatabase } }) => {
      // TODO: Handle typing
      const data: any = cache.readQuery({
        query: GET_ALL_USER_DATABASES_QUERY
      });

      cache.writeQuery({
        query: GET_ALL_USER_DATABASES_QUERY,
        data: {
          getAllUserDatabases: [...data.getAllUserDatabases].filter(x => x.id !== deleteDatabase.id)
        }
      });
    }
  });

  const deleteDatabaseHandler = (databaseId: string) => {
    deleteDatabase({
      variables: {
        databaseId: databaseId
      }
    });
  };

  const [updateDatabaseTitle] = useMutation(UPDATE_DATABASE_TITLE_MUTATION);

  const updateDatabaseTitleHandler = (databaseId: string, title: string) => {
    updateDatabaseTitle({
      variables: {
        databaseId: databaseId,
        title: title
      }
    });
  };

  const { loading: queryLoading, error: queryError, data, refetch } = useQuery(
    GET_ALL_USER_DATABASES_QUERY,
    {
      // Always fetch from backend instead of checking cache first
      fetchPolicy: 'network-only'
    }
  );

  React.useEffect(() => {
    if (!queryLoading && !queryError) {
      refetch();
    }
  }, [queryLoading, queryError, refetch]);

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const allDatabasesProps: AllDatabasesProps = {
    databases: data.getAllUserDatabases,
    createDatabaseHandler: createDatabase,
    deleteDatabaseHandler: deleteDatabaseHandler,
    updateDatabaseTitleHandler: updateDatabaseTitleHandler
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
      currentView
      notes
    }
  }
`;

export default AllDatabasesController;
