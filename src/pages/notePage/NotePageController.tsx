import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';

import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
import useStateCallback from '../../utils/useStateCallback';
import NotePage, { NotePageProps } from './NotePage';

const NotePageController: React.FC = () => {
  /**
   * TODO
   * NOTE: noteId should not change once fetched.
   * Different notes should have different URL anyway, and force a rerender.
   */
  // const [noteId, setNoteId] = React.useState<string | null>(null);

  const [blocks, setBlocks] = useStateCallback<NoteBlockStateProps[]>([]);

  // TODO: NOTE_ID is to be removed and handled by backend query
  const NOTE_ID = ''; // Insert note id here

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

  const { loading, error, data } = useQuery(GET_NOTE_QUERY, {
    variables: {
      _id: NOTE_ID
    }
  });

  /**
   * This effect handles the rerendering of the page once data is fetched asynchronously.
   */
  React.useEffect(() => {
    if (!loading) {
      if (!error) {
        setBlocks(data.getNote.blocks);
      } else {
        // TODO: Handle request error (e.g. display message to user)
      }
    }
    // `error` and `data` only changes when loading changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, setBlocks]);

  /**
   * ==========================
   * Handle updates in database
   * ==========================
   */
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

  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION);

  const updateBlocksInDatabase = (blocks: NoteBlockStateProps[]) => {
    updateNote({
      variables: {
        _id: NOTE_ID, // TODO: Remove this hardcode
        blocks: blocks.map(b => {
          return { id: b.id, html: b.html, tag: b.tag };
        })
      }
    });
  };

  /**
   * Updates `blocks` state in React and also the backend.
   */
  // TODO: Handle Apollo InMemoryCache
  const setBlocksAndUpdateDatabase = (
    blocks: NoteBlockStateProps[],
    callback?: (newState?: NoteBlockStateProps[]) => void
  ) => {
    setBlocks(blocks, callback);
    updateBlocksInDatabase(blocks);
  };

  const notePageProps: NotePageProps = {
    blocks: blocks,
    setBlocksAndUpdateDatabase: setBlocksAndUpdateDatabase
  };

  return <NotePage {...notePageProps} />;
};

export default NotePageController;
