import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import BoardDatabase, { Database, DatabaseProps } from './BoardDatabase';
import TableDatabase from './TableDatabase';

// TODO: Clean up the various type exports...
// `blocks` is excluded here as we do not need it when displaying Database for now.

export type Category = {
  id: string;
  name: string;
  notes: string[];
  databaseId: string;
};

export type Note = {
  userId: string;
  databaseId: string;
  id: string;
  categoryId: string;
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
      categories {
        id
        notes
        name
        databaseId
      }
      notes {
        id
        userId
        databaseId
        categoryId
        title
        blocks {
          id
          html
          tag
        }
      }
    }
  }
`;

// TODO: Add a new block button in NotePage
// TODO: Recheck query return params
export const CREATE_NOTE_MUTATION = gql`
  mutation createNote($id: ID!, $categoryId: ID!, $title: String!, $index: Int!) {
    createNote(databaseId: $id, categoryId: $categoryId, title: $title, index: $index) {
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
      userId
      databaseId
      id
      title
      creationDate
      id
    }
  }
`;

export const CREATE_DATABASE_CATEGORY_MUTATION = gql`
  mutation createDatabaseCategory($databaseId: ID!, $categoryName: String!, $index: Int!) {
    createDatabaseCategory(databaseId: $databaseId, categoryName: $categoryName, index: $index) {
      id
      categories
    }
  }
`;

export const DELETE_DATABASE_CATEGORY_MUTATION = gql`
  mutation deleteDatabaseCategory($databaseId: ID!, $categoryId: ID!) {
    deleteDatabaseCategory(databaseId: $databaseId, categoryId: $categoryId) {
      id
      categories
    }
  }
`;

export const UPDATE_DATABASE_VIEW_MUTATION = gql`
  mutation updateDatabaseView($databaseId: ID!, $view: String!) {
    updateDatabaseView(databaseId: $databaseId, view: $view) {
      id
      currentView
    }
  }
`;

export const UPDATE_NOTE_CATEGORY_MUTATION = gql`
  mutation updateNoteCategory($noteId: ID!, $categoryId: ID!, $index: Int!) {
    updateNoteCategory(noteId: $noteId, categoryId: $categoryId, index: $index) {
      id
      notes
      categories
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
  // TODO: Handle repositioning of Propsteks' in AllNotePropspage

  const { databaseId: DATABASE_ID } = useParams<{ databaseId: string }>();

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
    }
  });

  const createNoteHandler = (categoryId: string, title: string, index: number) => {
    createNote({
      variables: {
        id: DATABASE_ID,
        categoryId: categoryId,
        title: title,
        index: index
      }
    });
  };

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

  const [deleteDatabaseCategory] = useMutation(DELETE_DATABASE_CATEGORY_MUTATION, {
    update: (cache, { data: { deleteDatabaseCategory } }) => {
      cache.writeQuery({
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        },
        data: {
          getDatabase: deleteDatabaseCategory
        }
      });
    }
  });

  const deleteDatabaseCategoryHandler = (databaseId: string, categoryId: string) => {
    deleteDatabaseCategory({
      variables: {
        databaseId: databaseId,
        categoryId: categoryId
      }
    });
  };

  const [createDatabaseCategory] = useMutation(CREATE_DATABASE_CATEGORY_MUTATION, {
    update: (cache, { data: { createDatabaseCategory } }) => {
      cache.writeQuery({
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        },
        data: {
          getDatabase: createDatabaseCategory
        }
      });
    }
  });

  const createDatabaseCategoryHandler = (
    databaseId: string,
    categoryName: string,
    index: number
  ) => {
    createDatabaseCategory({
      variables: {
        databaseId: databaseId,
        categoryName: categoryName,
        index: index
      }
    });
  };

  const [updateDatabaseView] = useMutation(UPDATE_DATABASE_VIEW_MUTATION, {
    update: (cache, { data: { updateDatabaseView } }) => {
      cache.writeQuery({
        query: GET_DATABASE_QUERY,
        variables: {
          id: DATABASE_ID
        },
        data: {
          getDatabase: updateDatabaseView.currentView
        }
      });
    }
  });

  const updateDatabaseViewHandler = (databaseId: string, view: string) => {
    updateDatabaseView({
      variables: {
        databaseId: databaseId,
        view: view
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

  const [updateNoteCategory] = useMutation(UPDATE_NOTE_CATEGORY_MUTATION);

  const updateNoteCategoryHandler = (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: Database
  ) => {
    updateNoteCategory({
      variables: {
        noteId: noteId,
        categoryId: categoryId,
        index: index
      },
      optimisticResponse: {
        updateNoteCategory: {
          updatedDatabase
        }
      },
      update: (cache, { data: { updateNoteCategory } }) => {
        cache.writeQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: DATABASE_ID
          },
          data: {
            getDatabase: updatedDatabase
          }
        });
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
    nonCategorisedId: data.getDatabase.categories[0].id,
    title: data.getDatabase.title,
    currentView: data.getDatabase.currentView,
    categories: data.getDatabase.categories,
    notes: data.getDatabase.notes,
    createNoteHandler: createNoteHandler,
    deleteNoteHandler: deleteNoteHandler,
    createDatabaseCategoryHandler: createDatabaseCategoryHandler,
    deleteDatabaseCategoryHandler: deleteDatabaseCategoryHandler,
    updateDatabaseViewHandler: updateDatabaseViewHandler,
    updateNoteCategoryHandler: updateNoteCategoryHandler,
    updateNoteTitleHandler: updateNoteTitleHandler
  };

  return data.getDatabase.currentView === 'board' ? (
    <BoardDatabase {...DatabaseProps} />
  ) : (
    <TableDatabase {...DatabaseProps} />
  );
};

export default DatabaseContainer;
