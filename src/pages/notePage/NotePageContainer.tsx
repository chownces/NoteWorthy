import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
import NotePage, { NotePageProps } from './NotePage';

const NotePageController: React.FC = () => {
  // Get note id of the note to render via react-router-dom URL params
  const NOTE_ID = useParams<{ noteId: string }>().noteId;

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_NOTE_QUERY, {
    variables: {
      id: NOTE_ID
    }
  });

  // TODO: Handle fetching errors
  const [updateNoteBlocks] = useMutation(UPDATE_NOTE_BLOCKS_MUTATION, {
    // NOTE: The manual cache update here is unnecessary, as Apollo does it by default.
    update: (cache, { data: { updateNoteBlocks } }) => {
      cache.writeQuery({
        query: GET_NOTE_QUERY,
        data: { getNotes: updateNoteBlocks }
      });
    }
  });

  const updateBlocksInDatabase = (blocks: NoteBlockStateProps[]) => {
    updateNoteBlocks({
      variables: {
        id: NOTE_ID,
        // NOTE: This map is required for now since each block has a '__typename' field due to the current MongoDB schema
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

// TODO: updateNoteTitle mutation

// TODO: Recheck return params
const GET_NOTE_QUERY = gql`
  query getNote($id: ID!) {
    getNote(noteId: $id) {
      id
      userId
      databaseId
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
`;

// TODO: Recheck return params
const UPDATE_NOTE_BLOCKS_MUTATION = gql`
  mutation updateNoteBlocks($id: ID!, $blocks: [NoteBlockInput]) {
    updateNoteBlocks(noteId: $id, input: { blocks: $blocks }) {
      id
      userId
      databaseId
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
`;

export default NotePageController;
