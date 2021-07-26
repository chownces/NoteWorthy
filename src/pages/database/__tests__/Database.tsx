import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { CURRENT_USER_QUERY } from '../../allDatabases/AllDatabasesContainer';
import DatabaseContainer, {
  GET_ALL_USER_DATABASES_QUERY,
  // CREATE_NOTE_MUTATION,
  GET_DATABASE_QUERY
} from '../DatabaseContainer';
import { DatabaseViews } from '../DatabaseTypes';

// TODO: Add tests for update note title mutation
// TODO: Add create note test

// Duplicated mocks due to incorrect data fetching...
// Merging first due to submission
const getDatabaseQueryMock = (databaseView: DatabaseViews) => [
  {
    request: {
      query: GET_DATABASE_QUERY
    },
    variables: { id: '60adcd3538a95f0f75f1c087' },
    result: {
      data: {
        getDatabase: {
          id: '60adcd3538a95f0f75f1c087',
          title: 'untitled',
          currentView: databaseView,
          categories: [
            {
              id: '60cc5982c3987e2ac0b44fd9',
              notes: ['60adcd6e38a95f0f75f1c089', '6098bbdc04c0fa63070bfe5e'],
              name: 'Non-categorised',
              databaseId: '60adcd3538a95f0f75f1c087'
            }
          ],
          notes: [
            {
              id: '60adcd6e38a95f0f75f1c089',
              userId: '60adcd0138a95f0f75f1c085',
              databaseId: '60adcd3538a95f0f75f1c087',
              title: 'My first note',
              categoryId: '60cc5982c3987e2ac0b44fd9',
              blocks: [
                {
                  id: 'kpedjle3u7crjgm0wn',
                  html: '',
                  tag: 'p'
                }
              ],
              creationDate: '2021-06-22T13:51:49.005Z',
              latestUpdate: '2021-06-22T13:51:49.005Z'
            },
            {
              id: '6098bbdc04c0fa63070bfe5e',
              userId: '6098bbdc04c0fa63070bfe4e',
              databaseId: '6098ba47fdaba558e1955a23',
              title: 'untitled',
              categoryId: '60cc5982c3987e2ac0b44fd9',
              blocks: [
                {
                  id: 'kpedjmkovw5eohfiu6',
                  html: '',
                  tag: 'p'
                }
              ],
              creationDate: '2021-06-22T13:51:49.005Z',
              latestUpdate: '2021-06-22T13:51:49.005Z'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: GET_DATABASE_QUERY
    },
    variables: { id: '60adcd3538a95f0f75f1c087' },
    result: {
      data: {
        getDatabase: {
          id: '60adcd3538a95f0f75f1c087',
          title: 'untitled',
          currentView: databaseView,
          categories: [
            {
              id: '60cc5982c3987e2ac0b44fd9',
              notes: ['60adcd6e38a95f0f75f1c089', '6098bbdc04c0fa63070bfe5e'],
              name: 'Non-categorised',
              databaseId: '60adcd3538a95f0f75f1c087'
            }
          ],
          notes: [
            {
              id: '60adcd6e38a95f0f75f1c089',
              userId: '60adcd0138a95f0f75f1c085',
              databaseId: '60adcd3538a95f0f75f1c087',
              title: 'My first note',
              categoryId: '60cc5982c3987e2ac0b44fd9',
              blocks: [
                {
                  id: 'kpedjle3u7crjgm0wn',
                  html: '',
                  tag: 'p'
                }
              ],
              creationDate: '2021-06-22T13:51:49.005Z',
              latestUpdate: '2021-06-22T13:51:49.005Z'
            },
            {
              id: '6098bbdc04c0fa63070bfe5e',
              userId: '6098bbdc04c0fa63070bfe4e',
              databaseId: '6098ba47fdaba558e1955a23',
              title: 'untitled',
              categoryId: '60cc5982c3987e2ac0b44fd9',
              blocks: [
                {
                  id: 'kpedjmkovw5eohfiu6',
                  html: '',
                  tag: 'p'
                }
              ],
              creationDate: '2021-06-22T13:51:49.005Z',
              latestUpdate: '2021-06-22T13:51:49.005Z'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        currentUser: {
          firstname: 'Bob',
          lastname: 'Tan',
          email: 'bob@gmail.com',
          lastVisited: '60adcd3538a95f0f75f1c087',
          __typename: 'User'
        }
      }
    }
  },
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        currentUser: {
          firstname: 'Bob',
          lastname: 'Tan',
          email: 'bob@gmail.com',
          lastVisited: '60adcd3538a95f0f75f1c087',
          __typename: 'User'
        }
      }
    }
  },
  {
    request: {
      query: GET_ALL_USER_DATABASES_QUERY
    },
    result: {
      data: {
        getAllUserDatabases: [
          {
            id: '60adcd3538a95f0f75f1c087',
            title: 'untitled',
            currentView: 'board',
            notes: []
          }
        ]
      }
    }
  },
  {
    request: {
      query: GET_ALL_USER_DATABASES_QUERY
    },
    result: {
      data: {
        getAllUserDatabases: [
          {
            id: '60adcd3538a95f0f75f1c087',
            title: 'untitled',
            currentView: 'board',
            notes: []
          }
        ]
      }
    }
  }
];

test('Gets all notes successfully and renders them correctly in table view', async () => {
  const { container: tree } = render(
    <MockedProvider mocks={getDatabaseQueryMock(DatabaseViews.TABLE)} addTypename={false}>
      <MemoryRouter>
        <DatabaseContainer />
      </MemoryRouter>
    </MockedProvider>
  );

  await act(() => new Promise(resolve => setTimeout(resolve, 0)));

  expect(tree).toMatchSnapshot();
});

test('Gets all notes successfully and renders them correctly in board view', async () => {
  const { container: tree } = render(
    <MockedProvider mocks={getDatabaseQueryMock(DatabaseViews.BOARD)} addTypename={false}>
      <MemoryRouter>
        <DatabaseContainer />
      </MemoryRouter>
    </MockedProvider>
  );

  await act(() => new Promise(resolve => setTimeout(resolve, 0)));

  expect(tree).toMatchSnapshot();
});

test('Renders loading state correctly', async () => {
  const { container: tree } = render(
    <MockedProvider mocks={getDatabaseQueryMock(DatabaseViews.TABLE)} addTypename={false}>
      <MemoryRouter>
        <DatabaseContainer />
      </MemoryRouter>
    </MockedProvider>
  );

  expect(tree).toMatchSnapshot();
});

test('Handles network error correctly ', async () => {
  const mocks = [
    {
      request: {
        query: CURRENT_USER_QUERY
      },
      error: new Error('An error occurred')
    }
  ];

  const { container: tree } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <DatabaseContainer />
      </MemoryRouter>
    </MockedProvider>
  );

  await act(() => new Promise(resolve => setTimeout(resolve, 0)));

  expect(tree).toMatchSnapshot();
});
