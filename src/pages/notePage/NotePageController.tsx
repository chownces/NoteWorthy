import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
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
    query getNote($id: ID!) {
      getNote(id: $id) {
        id
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
      id: NOTE_ID
    }
  });

  /**
   * ==========================
   * Handle updates in database
   * ==========================
   */
  // TODO: Add different mutations to update blocks/ title separately
  const UPDATE_NOTE_MUTATION = gql`
    mutation updateNote($id: ID!, $title: String, $blocks: [NoteBlockInput]) {
      updateNote(id: $id, input: { title: $title, blocks: $blocks }) {
        id
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

  // TODO: Handle fetching errors
  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION, {
    // NOTE: The manual cache update here is unnecessary, as Apollo does it by default.
    update: (cache, { data: { updateNote } }) => {
      cache.writeQuery({
        query: GET_NOTE_QUERY,
        data: { getNotes: updateNote }
      });
    }
  });

  const updateBlocksInDatabase = (blocks: NoteBlockStateProps[]) => {
    updateNote({
      variables: {
        id: NOTE_ID,
        blocks: blocks.map(b => {
          return { id: b.id, html: b.html, tag: b.tag };
        })
      }
    });
  };

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  const notePageProps: NotePageProps = {
    blocks: data.getNote.blocks,
    updateBlocksInDatabase: updateBlocksInDatabase
  };

  return <NotePage {...notePageProps} />;
};

export default NotePageController;
