import { gql, useQuery } from '@apollo/client';
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
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_ALL_USER_DATABASES_QUERY);

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const allDatabasesProps: AllDatabasesProps = {
    databases: data.getAllUserDatabases
  };

  return (
    <>
      <div>This is the all databases page</div>
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

export default AllDatabasesController;
