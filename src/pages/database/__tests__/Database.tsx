import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import DatabaseContainer, {
  // CREATE_NOTE_MUTATION,
  GET_ALL_NOTES_IN_DATABASE_QUERY
} from '../DatabaseContainer';

// TODO: Add tests for update note title mutation
// TODO: Add create note test

test('Gets all notes successfully and renders them correctly', async () => {
  const mocks = [
    {
      request: {
        query: GET_ALL_NOTES_IN_DATABASE_QUERY,
      },
      variables: { id: "60adcd3538a95f0f75f1c087" },
      result: {
        data: {
          getAllNotesInDatabase: [
            {
              userId: "60adcd0138a95f0f75f1c085",
              databaseId: "60adcd3538a95f0f75f1c087",
              id: "60adcd6e38a95f0f75f1c089",
              title: "My first note",
              creationDate: "2021-05-26T04:21:57.091Z",
              latestUpdate: "2021-05-26T08:09:57.274Z",
            },
            {
              userId: '6098bbdc04c0fa63070bfe4e',
              databaseId: '6098ba47fdaba558e1955a23',
              id: '6098bbdc04c0fa63070bfe5e',
              title: 'untitled',
              creationDate: '2021-05-26T08:09:57.274Z',
              latestUpdate: '2021-05-26T08:09:57.274Z'
            }
          ]
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
        query: GET_ALL_NOTES_IN_DATABASE_QUERY
      },
      variables: { id: "60adcd3538a95f0f75f1c087" },
      result: {
        data: {
          getAllNotesInDatabase: [
            {
              userId: '6098ba47fdaba558e1955a12',
              databaseId: '6098ba47fdaba558e1955a23',
              id: '6098ba47fdaba558e1955a00',
              title: 'test note 1',
              creationDate: '2021-05-26T08:09:57.274Z',
              latestUpdate: '2021-05-26T08:12:57.274Z'
            },
            {
              userId: '6098bbdc04c0fa63070bfe4e',
              databaseId: '6098ba47fdaba558e1955a23',
              id: '6098bbdc04c0fa63070bfe5e',
              title: 'untitled',
              creationDate: '2021-05-26T08:09:57.274Z',
              latestUpdate: '2021-05-26T08:09:57.274Z'
            }
          ]
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
        query: GET_ALL_NOTES_IN_DATABASE_QUERY
      },
      variables: { id: "60adcd3538a95f0f75f1c087" },
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
