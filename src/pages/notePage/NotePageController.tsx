import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
// import useStateCallback from '../../utils/useStateCallback';
import NotePage, { NotePageProps } from './NotePage';

const NotePageController: React.FC = () => {
  // Get note id of the note to render via react-router-dom URL params
  const NOTE_ID = useParams<{ noteId: string }>().noteId;

  /**
   * ==================================
   * Handle data fetching from database
   * ==================================
   */
  const GET_NOTE_QUERY = gql`
    query getNote($_id: ID!) {
      getNote(_id: $_id) {
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

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_NOTE_QUERY, {
    variables: {
      _id: NOTE_ID
    }
  });

  /**
   * ==========================
   * Handle updates in database
   * ==========================
   */
  // TODO: Add different mutations to update blocks/ title separately
  const UPDATE_NOTE_MUTATION = gql`
    mutation updateNote($_id: ID!, $title: String, $blocks: [NoteBlockInput]) {
      updateNote(_id: $_id, input: { title: $title, blocks: $blocks }) {
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

  // TODO: Update inMemoryCache. The manual cache update here is unnecessary...
  // const [updateNote, { error: mutationError }] = useMutation(UPDATE_NOTE_MUTATION);
  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION, {
    update: (cache, { data: { updateNote } }) => {
      cache.writeQuery({
        query: GET_NOTE_QUERY,
        data: { getNotes: updateNote }
      })
    }
  });

  const updateBlocksInDatabase = (blocks: NoteBlockStateProps[]) => {
    updateNote({
      variables: {
        _id: NOTE_ID,
        blocks: blocks.map(b => {
          return { id: b.id, html: b.html, tag: b.tag };
        })
      }
    });
  };

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

  const notePageProps: NotePageProps = {
    blocks: data.getNote.blocks,

    // TODO: Update the naming here
    setBlocksAndUpdateDatabase: updateBlocksInDatabase
  };

  return <NotePage {...notePageProps} />;
};

export default NotePageController;
