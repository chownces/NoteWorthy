import { MockedProvider } from '@apollo/client/testing';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AllNotesController, {
  CREATE_NOTE_MUTATION,
  GET_ALL_NOTES_QUERY
} from '../AllNotesController';

test('Gets all notes successfully and renders them correctly', async () => {
  // TODO: Relook this once authentication and filters are added
  const mocks = [
    {
      request: {
        query: GET_ALL_NOTES_QUERY
        // variables: {
        //   name: 'Buck',
        // },
      },
      result: {
        data: {
          allNotes: [
            {
              id: '6098ba47fdaba558e1955a00',
              title: 'test note 1',
              date: '21/05/21'
              // blocks: [
              //   {
              //     id: "koi4onszhkbdbzj9hm",
              //     html: "block1",
              //     tag: "p"
              //   },
              //   {
              //     id: "koi4fkuoqkqkg978gun",
              //     html: "block2",
              //     tag: "p"
              //   },
              //   {
              //     id: "koi8fn3o3od7ajdlw6v",
              //     html: "block3",
              //     tag: "p"
              //   },
              //   {
              //     id: "koic9efk29q64v8vowg",
              //     html: "",
              //     tag: "p"
              //   }
              // ]
            },
            {
              id: '6098bbdc04c0fa63070bfe5e',
              title: 'untitled',
              date: '31/12/21'
              // blocks: [
              //   {
              //     id: "koi4o9e370nwp2offt",
              //     html: " ",
              //     tag: "p"
              //   }
              // ]
            }
          ]
        }
      }
    }
  ];

  const { container: tree } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <AllNotesController />
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
        query: GET_ALL_NOTES_QUERY
        // variables: {
        //   name: 'Buck',
        // },
      },
      result: {
        data: {
          allNotes: [
            {
              id: '6098ba47fdaba558e1955a00',
              title: 'test note 1',
              date: '21/05/21'
              // blocks: [
              //   {
              //     id: "koi4onszhkbdbzj9hm",
              //     html: "block1",
              //     tag: "p"
              //   },
              //   {
              //     id: "koi4fkuoqkqkg978gun",
              //     html: "block2",
              //     tag: "p"
              //   },
              //   {
              //     id: "koi8fn3o3od7ajdlw6v",
              //     html: "block3",
              //     tag: "p"
              //   },
              //   {
              //     id: "koic9efk29q64v8vowg",
              //     html: "",
              //     tag: "p"
              //   }
              // ]
            },
            {
              id: '6098bbdc04c0fa63070bfe5e',
              title: 'untitled',
              date: '31/12/21'
              // blocks: [
              //   {
              //     id: "koi4o9e370nwp2offt",
              //     html: " ",
              //     tag: "p"
              //   }
              // ]
            }
          ]
        }
      }
    }
  ];

  const { container: tree } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <AllNotesController />
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
        query: GET_ALL_NOTES_QUERY
        // variables: {
        //   name: 'Buck',
        // },
      },
      error: new Error('An error occurred')
    }
  ];

  const { container: tree } = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <AllNotesController />
      </MemoryRouter>
    </MockedProvider>
  );

  await act(() => new Promise(resolve => setTimeout(resolve, 0)));

  expect(tree).toMatchSnapshot();
});

// TODO: Add tests for update note mutation
