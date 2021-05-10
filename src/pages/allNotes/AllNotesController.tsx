import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';

import { uniqueId } from '../../utils/helpers';
import AllNotes, { AllNotesProps } from './AllNotes';

// TODO: Clean up the various type exports...
// `blocks` is excluded here as we do not need it when displaying AllNotes for now.
export type Note = {
  _id: string;
  title: string;
  date: string;
};

const AllNotesController: React.FC = () => {
  // TODO: Handle repositioning of Note 'blocks' in AllNotes page

  // TODO: Change date to reflect the date and time of the latest changes (requires changes in backend)
  const GET_ALL_NOTES_QUERY = gql`
    {
      allNotes {
        _id
        title
        date
      }
    }
  `;

  // TODO: Generate unique id with MongoDB
  const CREATE_NOTE_MUTATION = gql`
    mutation {
      createNote(input: { title: "untitled", blocks: [{id: "${uniqueId()}", html: " ", tag: "p"}] }) {
        _id
        title
        blocks {
          id
          html
          tag
        }
        date
      }
    }
  `;

  // TODO: Add error handling
  const [createNote] = useMutation(CREATE_NOTE_MUTATION, {
    update: (cache, {data: {createNote}}) => {
      // TODO: Handle typing
      const data: any = cache.readQuery({
        query: GET_ALL_NOTES_QUERY
      });

      cache.writeQuery({
        query: GET_ALL_NOTES_QUERY,
        data: {allNotes: [...data.allNotes, createNote]}
      })
    }
  });

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_ALL_NOTES_QUERY);

  if (queryLoading) {
    // TODO: Write a common Loading component
    return (
      <div>Loading...</div>
    )
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return (
      <div>Error! + {queryError.message}</div>
    )
  }

  const allNotesProps: AllNotesProps = {
    notes: data.allNotes
  };

  return (
    <>
      <button onClick={() => createNote()}>New Note</button>
      <AllNotes {...allNotesProps} />
    </>
  )
};

export default AllNotesController;
