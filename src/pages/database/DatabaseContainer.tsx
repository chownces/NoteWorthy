import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import Database, { DatabaseProps } from './Database';

// TODO: Clean up the various type exports...
// `blocks` is excluded here as we do not need it when displaying Database for now.
export type Id = string;
export type Title = string;
export type CurrentView = string;

export type Note = {
  userId: string;
  databaseId: string;
  id: string;
  title: string;
  blocks: [
    {
      id: string;
      html: string;
      tag: string;
    }
  ];
  creationDate: string;
  latestUpdate: string;
};

// TODO: Recheck query return params
export const GET_DATABASE_QUERY = gql`
  query getDatabase($id: ID!) {
    getDatabase(databaseId: $id) {
      id
      title
      currentView
      notes {
        id
        userId
        databaseId
        title
        blocks {
          id
          html
          tag
        }
        creationDate
        latestUpdate
      }
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

export const DELETE_NOTE_MUTATION = gql`
  mutation deleteNote($noteId: ID!) {
    deleteNote(noteId: $noteId) {
      id
    }
  }
`;

export const UPDATE_NOTE_TITLE_MUTATION = gql`
  mutation updateNoteTitle($noteId: ID!, $title: String!) {
    updateNoteTitle(noteId: $noteId, title: $title) {
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
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        }
      });

      cache.writeQuery({
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        },
        data: { getDatabase: [...data.getDatabase.notes, createNote] }
      });
    },
    variables: {
      id: DATABASE_ID
    }
  });

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION, {
    update: (cache, { data: { deleteNote } }) => {
      const data: any = cache.readQuery({
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        }
      });

      cache.writeQuery({
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        },
        data: {
          getDatabase: [...data.getDatabase.notes].filter(x => x.noteId !== deleteNote.id)
        }
      });
    }
  });

  const deleteNoteHandler = (noteId: string) => {
    deleteNote({
      variables: {
        noteId: noteId
      }
    });
  };

  const [updateNoteTitle] = useMutation(UPDATE_NOTE_TITLE_MUTATION);

  const updateNoteTitleHandler = (noteId: string, title: string) => {
    updateNoteTitle({
      variables: {
        noteId: noteId,
        title: title
      }
    });
  };

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_DATABASE_QUERY, {
    variables: { id: DATABASE_ID }
  });

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const DatabaseProps: DatabaseProps = {
    id: data.getDatabase.id,
    title: data.getDatabase.title,
    currentView: data.getDatabase.currentView,
    notes: data.getDatabase.notes,
    createNoteHandler: createNote,
    deleteNoteHandler: deleteNoteHandler,
    updateNoteTitleHandler: updateNoteTitleHandler
  };

  return <Database {...DatabaseProps} />;
};

export default DatabaseContainer;
