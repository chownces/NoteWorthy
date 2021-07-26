import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import {
  CURRENT_USER_QUERY,
  UPDATE_LAST_VISITED_MUTATION
} from '../allDatabases/AllDatabasesContainer';
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
      blocks {
        id
        html
        tag
      }
      categoryId
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

export const CREATE_DATABASE_CATEGORY_FOR_CURRENT_NOTE_MUTATION = gql`
  mutation createDatabaseCategoryForCurrentNote(
    $databaseId: ID!
    $categoryName: String!
    $noteId: ID!
  ) {
    createDatabaseCategoryForCurrentNote(
      databaseId: $databaseId
      categoryName: $categoryName
      noteId: $noteId
    ) {
      id
      categories
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
      categories {
        id
        notes
        name
        databaseId
      }
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

export const UPDATE_DATABASE_NOTES_MUTATION = gql`
  mutation updatedDatabaseNotes($databaseId: ID!, $notes: [ID]!) {
    updateDatabaseNotes(databaseId: $databaseId, notes: $notes) {
      id
      notes
    }
  }
`;

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
  mutation createDatabase($title: String!, $index: Int!) {
    createDatabase(title: $title, index: $index) {
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

export const UPDATE_DATABASES_MUTATION = gql`
  mutation updateDatabases($databases: [ID]!) {
    updateDatabases(databases: $databases) {
      email
    }
  }
`;

const DatabaseContainer: React.FC = () => {
  const { databaseId: DATABASE_ID } = useParams<{ databaseId: string }>();

  // TODO: Add error handling

  const [updateLastVisited] = useMutation(UPDATE_LAST_VISITED_MUTATION);

  const updateLastVisitedHandler = (lastVisited: string) => {
    updateLastVisited({
      update: (cache, { data: { updateLastVisited } }) => {
        // TODO: Handle typing
        const data: any = cache.readQuery({
          query: CURRENT_USER_QUERY
        });

        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: {
            currentUser: {
              ...data.currentUser,
              lastVisited: lastVisited
            }
          }
        });
      },
      optimisticResponse: {
        updateLastVisited: {
          lastVisited: lastVisited
        }
      },

      variables: {
        lastVisited: lastVisited
      }
    });
  };

  const [createDatabase] = useMutation(CREATE_DATABASE_MUTATION);

  const createDatabaseHandler = (title: string, index: number) => {
    createDatabase({
      update: (cache, { data: { createDatabase } }) => {
        // TODO: Handle typing
        const data: any = cache.readQuery({
          query: GET_ALL_USER_DATABASES_QUERY
        });

        const databaseCopy = [...data.getAllUserDatabases];
        databaseCopy.splice(index, 0, createDatabase);

        cache.writeQuery({
          query: GET_ALL_USER_DATABASES_QUERY,
          data: { getAllUserDatabases: databaseCopy }
        });
      },
      variables: {
        title: title,
        index: index
      },
      optimisticResponse: {
        createDatabase: {
          id: 'temp_id',
          title: title,
          currentView: 'board',
          notes: [],
          __typename: 'Database'
        }
      }
    });
  };

  const [updateDatabases] = useMutation(UPDATE_DATABASES_MUTATION);

  const updateDatabasesHandler = (databases: DatabaseType[]) => {
    updateDatabases({
      update: cache => {
        cache.writeQuery({
          query: GET_ALL_USER_DATABASES_QUERY,
          data: {
            getAllUserDatabases: [...databases]
          }
        });
      },
      optimisticResponse: {
        updateDatabases: {
          lastname: null,
          email: null,
          firstname: null
        }
      },
      variables: {
        databases: databases.map(database => database.id)
      }
    });
  };

  const [deleteDatabase] = useMutation(DELETE_DATABASE_MUTATION, {});

  const deleteDatabaseHandler = (databaseId: string, databases: DatabaseType[]) => {
    deleteDatabase({
      update: cache => {
        // TODO: Handle typing

        cache.writeQuery({
          query: GET_ALL_USER_DATABASES_QUERY,
          data: {
            getAllUserDatabases: databases
          }
        });
      },

      optimisticResponse: {
        deleteDatabase: {
          id: databaseId
        }
      },

      variables: {
        databaseId: databaseId
      }
    });
  };

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

  const [updateDatabaseNotes] = useMutation(UPDATE_DATABASE_NOTES_MUTATION);
  const updateDatabaseNotesHandler = (notes: Note[]) => {
    updateDatabaseNotes({
      variables: {
        databaseId: DATABASE_ID,
        notes: notes.map(note => note.id)
      },
      optimisticResponse: {
        updateDatabaseNotes: {
          id: DATABASE_ID,
          notes: notes.map(note => note.id)
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
              notes: notes
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

  const [createDatabaseCategoryForCurrentNote] = useMutation(
    CREATE_DATABASE_CATEGORY_FOR_CURRENT_NOTE_MUTATION,
    {
      update: (cache, { data: { createDatabaseCategoryForCurrentNote } }) => {
        cache.writeQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: DATABASE_ID
          },
          data: {
            getDatabase: createDatabaseCategoryForCurrentNote
          }
        });
      }
    }
  );

  const createDatabaseCategoryForCurrentNoteHandler = (
    databaseId: string,
    categoryName: string,
    noteId: string
  ) => {
    createDatabaseCategoryForCurrentNote({
      variables: {
        databaseId: databaseId,
        categoryName: categoryName,
        noteId: noteId
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

  const updateDatabaseTitle = (databaseId: string, title: string) => {
    updateDatabaseTitleMutation({
      variables: {
        id: databaseId,
        title
      },
      optimisticResponse: {
        updateDatabaseTitle: {
          id: databaseId
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
                e.id === databaseId ? { ...e, title: title } : e
              )
            }
          });
        }

        // cache only contains current database, if changing name of other database, ignore this
        if (databaseId === DATABASE_ID) {
          const databaseData: any = cache.readQuery({
            query: GET_DATABASE_QUERY,
            variables: {
              id: databaseId
            }
          });

          cache.writeQuery({
            query: GET_DATABASE_QUERY,
            variables: {
              id: databaseId
            },
            data: {
              getDatabase: {
                ...databaseData.getDatabase,
                title: title
              }
            }
          });
        }
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
          id: updatedDatabase.id,
          notes: updatedDatabase.notes,
          categories: updatedDatabase.categories
        }
      },
      update: (cache, { data: { updateNoteCategory } }) => {
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
              notes: updateNoteCategory.notes
            }
          }
        });
      }
    });
  };

  const { loading: queryUserLoading, error: queryUserError, refetch: refetchUser } = useQuery(
    CURRENT_USER_QUERY
  );

  const {
    loading: queryDatabaseLoading,
    error: queryDatabaseError,
    data: databaseData,
    refetch: refetchDatabase
  } = useQuery(GET_DATABASE_QUERY, {
    variables: { id: DATABASE_ID }
  });

  const {
    loading: queryAllDatabasesLoading,
    error: queryAllDatabasesError,
    data: allDatabasesData,
    refetch: refetchAllDatabases
  } = useQuery(GET_ALL_USER_DATABASES_QUERY);

  React.useEffect(() => {
    if (!queryDatabaseLoading && !queryDatabaseError) {
      refetchDatabase();
    }
    if (!queryAllDatabasesError && !queryAllDatabasesLoading) {
      refetchAllDatabases();
    }
    if (!queryUserError && !queryUserLoading) {
      refetchUser();
    }
  }, [
    queryUserLoading,
    queryUserError,
    queryDatabaseLoading,
    queryDatabaseError,
    queryAllDatabasesLoading,
    queryAllDatabasesError,
    refetchUser,
    refetchDatabase,
    refetchAllDatabases,
    DATABASE_ID
  ]);

  if (queryDatabaseLoading || queryAllDatabasesLoading || queryUserLoading) {
    return <Loader />;
  }
  if (queryDatabaseError || queryAllDatabasesError || queryUserError) {
    // TODO: Write a common Error component/ Toast

    if (queryUserError) return <div>Error! + {queryUserError.message}</div>;

    if (queryDatabaseError) return <div>Error! + {queryDatabaseError.message}</div>;

    if (queryAllDatabasesError) return <div>Error! + {queryAllDatabasesError.message}</div>;
  }

  const updateCategoryNameHandler = (categoryId: string, name: string) => {
    const categories: Category[] = databaseData.getDatabase.categories;

    const currentName = categories.map((category: Category) => category.name)[
      categories.map((category: Category) => category.id).indexOf(categoryId)
    ];
    if (currentName === name) {
      return;
    }
    if (categories.some(x => x.name === name)) {
      alert('Category already exists');
    } else if (name === '') {
      alert('Please input a category name');
    } else {
      updateCategoryName(categoryId, name);
    }
  };

  const addDatabaseCategoryForNote = (databaseId: string, categoryName: string, noteId: string) => {
    const categories: Category[] = databaseData.getDatabase.categories;
    const notes = databaseData.getDatabase.notes;

    const currentCategoryId = notes.map((note: Note) => note.categoryId)[
      notes.map((note: Note) => note.id).indexOf(noteId)
    ];

    const currentName = categories.map((category: Category) => category.name)[
      categories.map((category: Category) => category.id).indexOf(currentCategoryId)
    ];

    if (currentName === categoryName) {
      return;
    }
    if (categories.some(x => x.name === categoryName)) {
      alert('Category already exists');
    } else if (categoryName === '') {
      alert('Please input a category name');
    } else {
      createDatabaseCategoryForCurrentNoteHandler(databaseId, categoryName, noteId);
    }
  };

  const nonCategorisedCat = databaseData.getDatabase.categories.filter(
    (e: Category) => e.name === 'Non-categorised'
  )[0];

  const DatabaseProps: DatabaseProps = {
    id: databaseData.getDatabase.id,
    nonCategorisedId: nonCategorisedCat
      ? nonCategorisedCat.id
      : databaseData.getDatabase.categories[0],
    title: databaseData.getDatabase.title,
    currentView: databaseData.getDatabase.currentView,
    categories: databaseData.getDatabase.categories,
    notes: databaseData.getDatabase.notes,
    databases: allDatabasesData.getAllUserDatabases,
    refetchDatabase: refetchDatabase,
    updateDatabaseNotesHandler: updateDatabaseNotesHandler,
    createDatabaseHandler: createDatabaseHandler,
    deleteDatabaseHandler: deleteDatabaseHandler,
    createNoteHandler: createNoteHandler,
    deleteNoteHandler: deleteNoteHandler,
    createDatabaseCategoryHandler: createDatabaseCategoryHandler,
    createDatabaseCategoryForCurrentNoteHandler: addDatabaseCategoryForNote,
    deleteDatabaseCategoryHandler: deleteDatabaseCategoryHandler,
    updateDatabaseCategoriesOrdering: updateDatabaseCategories,
    updateCategoryName: updateCategoryNameHandler,
    updateDatabaseViewHandler: updateDatabaseViewHandler,
    updateDatabaseTitleHandler: updateDatabaseTitle,
    updateNoteCategoryHandler: updateNoteCategoryHandler,
    updateNoteTitleHandler: updateNoteTitleHandler,
    updateDatabases: updateDatabasesHandler,
    updateLastVisitedHandler: updateLastVisitedHandler
  };

  return <Database {...DatabaseProps} />;
};

export default DatabaseContainer;
