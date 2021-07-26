import { gql, useQuery } from '@apollo/client';
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

// TODO: This whole component is to be refactored and placed in DatabaseContainer.tsx
// Merging first for submission
const AllDatabasesController: React.FC = () => {
  // TODO: Add error handling
  const history = useHistory();

  // const [updateLastVisited] = useMutation(UPDATE_LAST_VISITED_MUTATION);

  // const updateLastVisitedHandler = (lastVisited: string) => {
  //   updateLastVisited({
  //     variables: {
  //       lastVisited: lastVisited
  //     }
  //   })
  // }

  // const [createDatabase] = useMutation(CREATE_DATABASE_MUTATION);

  // const createDatabaseHandler = () => {
  //   createDatabase({

  //         variables: {
  //       title: 'untitled',
  //       index: 0
  //     }
  //   })
  // }

  // const {
  //   loading: queryAllDatabasesLoading,
  //   error: queryAllDatabasesError,
  //   data: allDatabasesData,
  //   refetch: refetchAllDatabases
  // } = useQuery(GET_ALL_USER_DATABASES_QUERY);

  const {
    loading: queryUserLoading,
    error: queryUserError,
    data: userData,
    refetch: refetchUser
  } = useQuery(CURRENT_USER_QUERY);

  React.useEffect(() => {
    if (!queryUserError && !queryUserLoading) {
      refetchUser();
    }
  }, [queryUserError, queryUserLoading, refetchUser]);

  // !userData.currentUser to prevent crash upon fresh login (reload page before login)
  if (queryUserLoading || !userData.currentUser) {
    return <Loader />;
  }

  if (queryUserError) {
    return <div>Error! + {queryUserError.message} </div>;
  }

  console.log(userData);

  history.push(`/database/${userData.currentUser.lastVisited}`);

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

export const CURRENT_USER_QUERY = gql`
  {
    currentUser {
      firstname
      lastname
      email
      lastVisited
    }
  }
`;

export const UPDATE_LAST_VISITED_MUTATION = gql`
  mutation updateLastVisited($lastVisited: ID!) {
    updateLastVisited(lastVisited: $lastVisited) {
      lastVisited
    }
  }
`;

export default AllDatabasesController;
