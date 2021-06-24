import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import BoardDatabase from './BoardDatabase';
import { Database, DatabaseProps, DatabaseViews } from './DatabaseTypes';
import TableDatabase from './TableDatabase';

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
        creationDate
        latestUpdate
      }
    }
  }
`;

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
  const { databaseId: DATABASE_ID } = useParams<{ databaseId: string }>();

  // TODO: Add error handling
  const [createNote] = useMutation(CREATE_NOTE_MUTATION);

  const createNoteHandler = (
    categoryId: string,
    title: string,
    index: number,
    database: Database
  ) => {
    // const tempNote = {
    //   userId: 'temp_userId',
    //   databaseId: 'temp_databaseId',
    //   id: 'temp_id',
    //   title: title,
    //   creationDate: new Date(Date.now()).toDateString(),
    //   latestUpdate: new Date(Date.now()).toDateString()
    // };

    createNote({
      variables: {
        id: DATABASE_ID,
        categoryId: categoryId,
        title: title,
        index: index
      },
      optimisticResponse: {
        createNote: {
          userId: 'temp_userId',
          databaseId: 'temp_databaseId',
          id: 'temp_id',
          title: title,
          creationDate: new Date(Date.now()).toDateString(),
          latestUpdate: new Date(Date.now()).toDateString(),
          __typename: 'Note'
        }
      },
      // update(cache,
      //   {
      //     data: { createNote }
      //   }
      // ) {
      //   cache.modify({
      //     fields: {
      //       notes(existingNotes = []) {
      //         const newNoteRef = cache.writeFragment({

      //           data: createNote,
      //           fragment: gql`
      //             fragment NewNote on Note {
      //               userId
      //               databaseId
      //               id
      //               title
      //               creationDate
      //               latestUpdate
      //             }
      //           `
      //         });
      //         return existingNotes.concat(newNoteRef);
      //       }
      //     }
      //   })
      // }

      update: (cache, response) => {
        // TODO: Handle typing
        const previousData: any = cache.readQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: database.id
          }
        });

        console.log(previousData);
        console.log(response);

        const newNote = response.data.createNote;
        console.log(newNote);

        const tempCategories = previousData.getDatabase.categories.map((cat: any) => {
          if (cat.id === categoryId) {
            const tempNotes = [...cat.notes];
            tempNotes.splice(index, 0, newNote.id);
            return { ...cat, notes: tempNotes };
          } else {
            return { ...cat, notes: [...cat.notes] };
          }
        });

        const tempNotes = [...previousData.getDatabase.notes];
        tempNotes.push(newNote);

        console.log(tempCategories);

        const newData = {
          getDatabase: {
            currentview: previousData.getDatabase.currentView,
            categories: tempCategories,
            notes: tempNotes,
            title: previousData.getDatabase.title,
            id: previousData.getDatabase.id
          }
        };

        console.log(newData);

        if (newData.getDatabase) {
          cache.writeQuery({
            query: GET_DATABASE_QUERY,
            variables: {
              id: database.id
            },
            data: newData
          });
        }
      }
      // refetchQueries: [
      //   {
      //     query: GET_DATABASE_QUERY,
      //     variables: { id: database.id }
      //   }
      // ],
      // awaitRefetchQueries: true
    });
  };

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION);

  const deleteNoteHandler = (noteId: string, database: Database) => {
    const deletedNote = database.notes.filter(note => note.id === noteId)[0];
    deleteNote({
      variables: {
        noteId: noteId
      },

      optimisticResponse: {
        deleteNote: {
          deletedNote
        }
      },

      update: cache => {
        cache.writeQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: DATABASE_ID
          },
          data: {
            getDatabase: database
          }
        });
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
      update: cache => {
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

  console.log(data);
  if (data) {
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

    return data.getDatabase.currentView === DatabaseViews.BOARD ? (
      <BoardDatabase {...DatabaseProps} />
    ) : DatabaseViews.TABLE ? (
      <TableDatabase {...DatabaseProps} />
    ) : (
      <></>
    );
  } else {
    return <></>;
  }
};

export default DatabaseContainer;
