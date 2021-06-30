import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
import NotePage, { NotePageProps } from './NotePage';

const NotePageContainer: React.FC = () => {
  // Get note id of the note to render via react-router-dom URL params
  const NOTE_ID = useParams<{ noteId: string }>().noteId;
  const blocks = React.useRef<NoteBlockStateProps[]>([]);

  const { loading: queryLoading, error: queryError, data } = useQuery(GET_NOTE_QUERY, {
    variables: {
      id: NOTE_ID
    }
  });

  // TODO: Handle fetching errors
  const [updateNoteBlocks] = useMutation(UPDATE_NOTE_BLOCKS_MUTATION, {
    ignoreResults: true
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

  const [updateBlockOrder] = useMutation(UPDATE_BLOCK_ORDER_MUTATION, {
    ignoreResults: true
  });

  const updateBlockOrderHandler = (block: NoteBlockStateProps, index: number) => {
    updateBlockOrder({
      variables: {
        noteId: NOTE_ID,
        blockId: block.id,
        index: index
      }
    });
  };
  const [createBlock] = useMutation(CREATE_BLOCK_MUTATION, {
    ignoreResults: true
  });

  const createBlockHandler = (block: NoteBlockStateProps, index: number) => {
    createBlock({
      variables: {
        noteId: NOTE_ID,
        blockId: block.id,
        index: index
      }
      // update: caches => {
      //   caches.writeQuery({
      //     query: GET_NOTE_QUERY,
      //     variables: {
      //       id:NOTE_ID
      //     },
      //     data: {
      //       getNote: createBlock
      //     }
      //   });
      // }
    });
  };

  const [deleteBlock] = useMutation(DELETE_BLOCK_MUTATION, {
    ignoreResults: true
  });

  const deleteBlockHandler = (block: NoteBlockStateProps) => {
    deleteBlock({
      variables: {
        noteId: NOTE_ID,
        blockId: block.id
      }
    });
  };

  const [updateBlock] = useMutation(UPDATE_BLOCK_MUTATION, {
    ignoreResults: true
  });

  const updateBlockHandler = (block: NoteBlockStateProps) => {
    updateBlock({
      variables: {
        noteId: NOTE_ID,
        blockId: block.id,
        input: { id: block.id, html: block.html, tag: block.tag }
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

  // Tracks `blocks` state locally in React as a mutable ref (for react-contenteditable)
  blocks.current = data.getNote.blocks;

  const notePageProps: NotePageProps = {
    blocks: blocks,
    updateBlocksInDatabase: updateBlocksInDatabase,
    createBlockHandler: createBlockHandler,
    deleteBlockHandler: deleteBlockHandler,
    updateBlockHandler: updateBlockHandler,
    updateBlockOrderHandler: updateBlockOrderHandler
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

/**
 * IMPT: We are setting ignoreResults, and not returning the updated notepage fields
 * to prevent Apollo cache from updating automatically. This is crucial to prevent
 * the NotePage component from rerendering, as a rerender triggered outside the
 * react-contenteditable component will cause its cursor to jump.
 *
 * Instead, we handle react-contenteditable state with useRef as recommended by
 * their docs, and batch updates to the backend whenever there are changes.
 */
const UPDATE_NOTE_BLOCKS_MUTATION = gql`
  mutation updateNoteBlocks($id: ID!, $blocks: [NoteBlockInput]) {
    updateNoteBlocks(noteId: $id, input: { blocks: $blocks }) {
      id
    }
  }
`;

const UPDATE_BLOCK_MUTATION = gql`
  mutation updateBlock($noteId: ID!, $blockId: String!, $input: NoteBlockInput!) {
    updateBlock(noteId: $noteId, blockId: $blockId, input: $input) {
      id
    }
  }
`;

const UPDATE_BLOCK_ORDER_MUTATION = gql`
  mutation updateBlockOrder($noteId: ID!, $blockId: String!, $index: Int!) {
    updateBlockOrder(noteId: $noteId, blockId: $blockId, index: $index) {
      id
    }
  }
`;
const CREATE_BLOCK_MUTATION = gql`
  mutation createBlock($noteId: ID!, $blockId: String!, $index: Int!) {
    createBlock(noteId: $noteId, blockId: $blockId, index: $index) {
      id
    }
  }
`;
const DELETE_BLOCK_MUTATION = gql`
  mutation deleteBlock($noteId: ID!, $blockId: String!) {
    deleteBlock(noteId: $noteId, blockId: $blockId) {
      id
    }
  }
`;

export default NotePageContainer;
