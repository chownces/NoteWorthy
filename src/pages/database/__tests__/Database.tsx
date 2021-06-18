import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DatabaseContainer, {
  // CREATE_NOTE_MUTATION,
  GET_DATABASE_QUERY
} from '../DatabaseContainer';

// TODO: Add tests for update note title mutation
// TODO: Add create note test

test('Gets all notes successfully and renders them correctly', async () => {
  const mocks = [
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
            currentView: 'table',
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
                ]
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
                ]
              }
            ]
          }
        }
      }
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

test('Renders loading state correctly', async () => {
  // TODO: Relook this once authentication and filters are added
  const mocks = [
    {
      request: {
        query: GET_DATABASE_QUERY
      },
      variables: { id: '6098ba47fdaba558e1955a23' },
      result: {
        data: {
          getDatabase: {
            id: '6098ba47fdaba558e1955a23',
            title: 'untitled',
            currentView: 'table',
            categories: [
              {
                id: '60cc5adac3987e2ac0b44fff',
                notes: ['6098ba47fdaba558e1955a00', '6098bbdc04c0fa63070bfe5e'],
                name: 'Non-categorised',
                databaseId: '6098ba47fdaba558e1955a23'
              }
            ],
            notes: [
              {
                id: '6098ba47fdaba558e1955a00',
                userId: '6098ba47fdaba558e1955a12',
                databaseId: '6098ba47fdaba558e1955a23',
                title: 'test note 1',
                categoryId: '60cc5adac3987e2ac0b44fff',
                blocks: [
                  {
                    id: 'kpedjmkovw5eohfiu6',
                    html: '',
                    tag: 'p'
                  }
                ],
                creationDate: '2021-05-26T08:09:57.274Z',
                latestUpdate: '2021-05-26T08:12:57.274Z'
              },
              {
                id: '6098bbdc04c0fa63070bfe5e',
                userId: '6098bbdc04c0fa63070bfe4e',
                databaseId: '6098ba47fdaba558e1955a23',
                title: 'untitled',
                categoryId: '60cc5adac3987e2ac0b44fff',

                blocks: [
                  {
                    id: 'kpedjn9mc0yez9tep1a',
                    html: '',
                    tag: 'p'
                  }
                ]
              }
            ]
          }
        }
      }
    }
  ];

  const { container: tree } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <DatabaseContainer />
      </MemoryRouter>
    </MockedProvider>
  );

  expect(tree).toMatchSnapshot();
});

test('Handles network error correctly ', async () => {
  // TODO: Relook this once authentication and filters are added
  const mocks = [
    {
      request: {
        query: GET_DATABASE_QUERY
      },
      variables: { id: '60adcd3538a95f0f75f1c087' },
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
