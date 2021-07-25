import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import { GET_ALL_USER_DATABASES_QUERY } from '../allDatabases/AllDatabasesContainer';
import Database, { DatabaseProps } from './Database';
import { Database as DatabaseType } from './DatabaseTypes';
import { Category, Note } from './DatabaseTypes';

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
      name
      notes
      databaseId
    }
  }
`;

export const DELETE_DATABASE_CATEGORY_MUTATION = gql`
  mutation deleteDatabaseCategory($databaseId: ID!, $categoryId: ID!) {
    deleteDatabaseCategory(databaseId: $databaseId, categoryId: $categoryId) {
      id
    }
  }
`;

export const UPDATE_DATABASE_CATEGORIES_MUTATION = gql`
  mutation updateDatabaseCategories($databaseId: ID!, $categories: [ID]!) {
    updateDatabaseCategories(databaseId: $databaseId, categories: $categories) {
      id
    }
  }
`;

export const UPDATE_CATEGORY_NAME_MUTATION = gql`
  mutation updateCategoryName($categoryId: ID!, $name: String!) {
    updateCategoryName(categoryId: $categoryId, name: $name) {
      id
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

export const UPDATE_DATABASE_TITLE_MUTATION = gql`
  mutation updateDatabaseTitle($id: ID!, $title: String!) {
    updateDatabaseTitle(databaseId: $id, title: $title) {
      id
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
      title
      latestUpdate
    }
  }
`;

const DatabaseContainer: React.FC = () => {
  const { databaseId: DATABASE_ID } = useParams<{ databaseId: string }>();

  // TODO: Add error handling
  const [createNote] = useMutation(CREATE_NOTE_MUTATION);

  const createNoteHandler = (categoryId: string, title: string, index: number) => {
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
          databaseId: DATABASE_ID,
          categoryId: categoryId,
          id: 'temp_id',
          title: title,
          blocks: [],
          creationDate: new Date(Date.now()).toDateString(),
          latestUpdate: new Date(Date.now()).toDateString(),
          __typename: 'Note'
        }
      },
      update: (cache, { data: { createNote } }) => {
        // TODO: Handle typing
        const previousData: any = cache.readQuery({
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
            getDatabase: {
              ...previousData.getDatabase,
              // Append newly createdNote to a new notes array, and the corresponding categories array
              categories: previousData.getDatabase.categories.map((cat: any) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      notes: [...cat.notes, createNote.id]
                    }
                  : cat
              ),
              notes: [...previousData.getDatabase.notes, createNote]
            }
          }
        });
      }
    });
  };

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION);

  const deleteNoteHandler = (noteId: string) => {
    deleteNote({
      variables: {
        noteId: noteId
      },

      // Placeholder optimistic return to force cache update
      optimisticResponse: {
        deleteNote: null
      },

      update: (cache, { data: { deleteNote } }) => {
        const data: any = cache.readQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: DATABASE_ID
          }
        });

        const categoryId = data.getDatabase.notes.filter((note: Note) => note.id === noteId)[0]
          .categoryId;

        cache.writeQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: DATABASE_ID
          },
          data: {
            getDatabase: {
              ...data.getDatabase,
              notes: data.getDatabase.notes.filter((note: Note) => note.id !== noteId),
              categories: data.getDatabase.categories.map((cat: Category) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      notes: cat.notes.filter(note => note !== noteId)
                    }
                  : cat
              )
            }
          }
        });
      }
    });
  };

  const [deleteDatabaseCategory] = useMutation(DELETE_DATABASE_CATEGORY_MUTATION);

  const deleteDatabaseCategoryHandler = (databaseId: string, categoryId: string) => {
    deleteDatabaseCategory({
      variables: {
        databaseId: databaseId,
        categoryId: categoryId
      },
      optimisticResponse: {
        deleteDatabaseCategory: {
          id: categoryId
        }
      },
      update: cache => {
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
            getDatabase: {
              ...data.getDatabase,
              categories: data.getDatabase.categories.filter((e: Category) => e.id !== categoryId),
              notes: data.getDatabase.notes.filter(
                (e: Note) =>
                  !data.getDatabase.categories
                    .filter((e: Category) => e.id === categoryId)[0]
                    .notes.includes(e.id)
              )
            }
          }
        });
      }
    });
  };

  const [updateDatabaseCategoriesMutation] = useMutation(UPDATE_DATABASE_CATEGORIES_MUTATION);
  const updateDatabaseCategories = (categories: Category[]) => {
    updateDatabaseCategoriesMutation({
      variables: {
        databaseId: DATABASE_ID,
        categories: categories.map(e => e.id)
      },
      optimisticResponse: {
        updateDatabaseCategories: {
          id: DATABASE_ID
        }
      },
      update: cache => {
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
            getDatabase: {
              ...data.getDatabase,
              categories: categories
            }
          }
        });
      }
    });
  };

  const [updateCategoryNameMutation] = useMutation(UPDATE_CATEGORY_NAME_MUTATION);
  const updateCategoryName = (categoryId: string, name: string) => {
    updateCategoryNameMutation({
      variables: {
        categoryId: categoryId,
        name: name
      },
      optimisticResponse: {
        updateCategoryName: {
          id: categoryId
        }
      },
      update: cache => {
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
            getDatabase: {
              ...data.getDatabase,
              categories: data.getDatabase.categories.map((e: Category) =>
                e.id === categoryId ? { ...e, name: name } : e
              )
            }
          }
        });
      }
    });
  };

  const [createDatabaseCategory] = useMutation(CREATE_DATABASE_CATEGORY_MUTATION);

  // Note that for now, categories are only created at the last index (in AddCategoryPopup.tsx)
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
      },
      optimisticResponse: {
        createDatabaseCategory: {
          id: 'temp_id',
          notes: [],
          name: categoryName,
          databaseId: databaseId
        }
      },
      update: (cache, { data: { createDatabaseCategory } }) => {
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
            getDatabase: {
              ...data.getDatabase,
              categories: [...data.getDatabase.categories, createDatabaseCategory]
            }
          }
        });
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

  const [updateDatabaseTitleMutation] = useMutation(UPDATE_DATABASE_TITLE_MUTATION, {
    ignoreResults: true
  });

  const updateDatabaseTitle = (title: string) => {
    updateDatabaseTitleMutation({
      variables: {
        id: DATABASE_ID,
        title
      },
      optimisticResponse: {
        updateDatabaseTitle: {
          id: DATABASE_ID
        }
      },
      update: cache => {
        const allDatabasesData: any = cache.readQuery({
          query: GET_ALL_USER_DATABASES_QUERY
        });

        if (allDatabasesData) {
          cache.writeQuery({
            query: GET_ALL_USER_DATABASES_QUERY,
            data: {
              getAllUserDatabases: allDatabasesData.getAllUserDatabases.map((e: DatabaseType) =>
                e.id === DATABASE_ID ? { ...e, title: title } : e
              )
            }
          });
        }

        const databaseData: any = cache.readQuery({
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
            getDatabase: {
              ...databaseData.getDatabase,
              title: title
            }
          }
        });
      }
    });
  };

  const updateDatabaseViewHandler = (databaseId: string, view: string) => {
    updateDatabaseView({
      variables: {
        databaseId: databaseId,
        view: view
      },
      optimisticResponse: {
        updateDatabaseView: {
          id: DATABASE_ID,
          view: view
        }
      },
      update: cache => {
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
            getDatabase: {
              ...data.getDatabase,
              currentView: view
            }
          }
        });
      }
    });
  };

  const [updateNoteTitle] = useMutation(UPDATE_NOTE_TITLE_MUTATION);

  const updateNoteTitleHandler = (noteId: string, title: string) => {
    updateNoteTitle({
      variables: {
        noteId: noteId,
        title: title
      },
      optimisticResponse: {
        updateNoteTitle: {
          title: title
        }
      },
      update: cache => {
        const databaseData: any = cache.readQuery({
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
            getDatabase: {
              ...databaseData.getDatabase,
              notes: databaseData.getDatabase.notes.map((e: Note) =>
                e.id === noteId ? { ...e, title: title } : e
              )
            }
          }
        });
      }
    });
  };

  const [updateNoteCategory] = useMutation(UPDATE_NOTE_CATEGORY_MUTATION);

  const updateNoteCategoryHandler = (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: DatabaseType
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

  const { loading: queryLoading, error: queryError, data, refetch } = useQuery(GET_DATABASE_QUERY, {
    variables: { id: DATABASE_ID }
  });

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

  const DatabaseProps: DatabaseProps = {
    id: data.getDatabase.id,
    nonCategorisedId: data.getDatabase.categories.filter(
      (e: Category) => e.name === 'Non-categorised'
    )[0].id,
    title: data.getDatabase.title,
    currentView: data.getDatabase.currentView,
    categories: data.getDatabase.categories,
    notes: data.getDatabase.notes,
    createNoteHandler: createNoteHandler,
    deleteNoteHandler: deleteNoteHandler,
    createDatabaseCategoryHandler: createDatabaseCategoryHandler,
    deleteDatabaseCategoryHandler: deleteDatabaseCategoryHandler,
    updateDatabaseCategoriesOrdering: updateDatabaseCategories,
    updateCategoryName: updateCategoryName,
    updateDatabaseViewHandler: updateDatabaseViewHandler,
    updateDatabaseTitleHandler: updateDatabaseTitle,
    updateNoteCategoryHandler: updateNoteCategoryHandler,
    updateNoteTitleHandler: updateNoteTitleHandler
  };

  return <Database {...DatabaseProps} />;
};

export default DatabaseContainer;
