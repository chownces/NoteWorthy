import { gql, useQuery } from '@apollo/client';
import React from 'react';

import Loader from '../../components/loader/Loader';
import { Note } from '../allNotes/AllNotesController';
import AllDatabases, { AllDatabasesProps } from './AllDatabases';

export type Database = {
  id: string;
  title: string;
  currentView: string;
  notes: Note[];
};

// TODO: Update this
export const GET_ALL_DATABASES_QUERY = gql`
  {
    allDatabases {
      id
      title
      currentView
      notes {
        id
        title
      }
    }
  }
`;

const AllDatabasesController: React.FC = () => {
  const { loading: queryLoading, error: queryError, data } = useQuery(GET_ALL_DATABASES_QUERY);

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const allDatabasesProps: AllDatabasesProps = {
    databases: data.allDatabases
  };

  return (
    <>
      <div>This is the all databases page</div>
      <AllDatabases {...allDatabasesProps} />
    </>
  );
};

export default AllDatabasesController;
