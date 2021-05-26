import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import Database, { DatabaseProps } from './Database';

// TODO: Clean up the various type exports...
// `blocks` is excluded here as we do not need it when displaying Database for now.
export type Note = {
  userId: string;
  databaseId: string;
  id: string;
  title: string;
  creationDate: string;
  latestUpdate: string;
};

// TODO: Recheck query return params
export const GET_ALL_NOTES_IN_DATABASE_QUERY = gql`
  query getAllNotesInDatabase($id: ID!) {
    getAllNotesInDatabase(databaseId: $id) {
      userId
      databaseId
      id
      title
      creationDate
      latestUpdate
    }
  }
`;

// TODO: Add a new block button in NotePage
// TODO: Recheck query return params
export const CREATE_NOTE_MUTATION = gql`
  mutation createNote($id: ID!) {
    createNote(databaseId: $id) {
      userId
      databaseId
      id
      title
      creationDate
      latestUpdate
    }
  }
`;

const DatabaseContainer: React.FC = () => {
  // TODO: Handle repositioning of Note 'blocks' in AllNotes page

  const DATABASE_ID = useParams<{ databaseId: string }>().databaseId;

  // TODO: Add error handling
  const [createNote] = useMutation(CREATE_NOTE_MUTATION, {
    update: (cache, { data: { createNote } }) => {
      // TODO: Handle typing
      const data: any = cache.readQuery({
        query: GET_ALL_NOTES_IN_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        }
      });

      cache.writeQuery({
        query: GET_ALL_NOTES_IN_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        },
        data: { getAllNotesInDatabase: [...data.getAllNotesInDatabase, createNote] }
      });
    },
    variables: {
      id: DATABASE_ID
    }
  });

  const {
    loading: queryLoading,
    error: queryError,
    data
  } = useQuery(GET_ALL_NOTES_IN_DATABASE_QUERY, { variables: { id: DATABASE_ID } });

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const DatabaseProps: DatabaseProps = {
    notes: data.getAllNotesInDatabase,
    createNoteHandler: createNote
  };

  return <Database {...DatabaseProps} />;
};

export default DatabaseContainer;
