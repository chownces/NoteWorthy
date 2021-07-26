import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/loader/Loader';
import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
import { GET_DATABASE_QUERY } from '../database/DatabaseContainer';
import { Note } from '../database/DatabaseTypes';
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
      },
      optimisticResponse: {
        updateNoteBlocks: {
          id: NOTE_ID
        }
      },
      update: cache => {
        const noteData: any = cache.readQuery({
          query: GET_NOTE_QUERY,
          variables: {
            id: NOTE_ID
          }
        });
        const databaseData: any = cache.readQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: noteData.getNote.databaseId
          }
        });
        cache.writeQuery({
          query: GET_NOTE_QUERY,
          variables: {
            id: NOTE_ID
          },
          data: {
            getNote: {
              ...noteData.getNote,
              blocks: blocks,
              latestUpdate: Date.now()
            }
          }
        });
        if (databaseData) {
          cache.writeQuery({
            query: GET_DATABASE_QUERY,
            variables: {
              id: noteData.getNote.databaseId
            },
            data: {
              getDatabase: {
                ...databaseData.getDatabase,
                notes: databaseData.getDatabase.notes.map((e: Note) =>
                  e.id === NOTE_ID ? { ...e, blocks: blocks, latestUpdate: Date.now() } : e
                )
              }
            }
          });
        }
      }
    });
  };

  const [updateNoteTitleMutation] = useMutation(UPDATE_NOTE_TITLE_MUTATION, {
    ignoreResults: true
  });

  const updateNoteTitle = (title: String) => {
    updateNoteTitleMutation({
      variables: {
        id: NOTE_ID,
        title: title
      },
      optimisticResponse: {
        updateNoteTitle: {
          id: NOTE_ID
        }
      },
      update: cache => {
        const noteData: any = cache.readQuery({
          query: GET_NOTE_QUERY,
          variables: {
            id: NOTE_ID
          }
        });
        const databaseData: any = cache.readQuery({
          query: GET_DATABASE_QUERY,
          variables: {
            id: noteData.getNote.databaseId
          }
        });
        cache.writeQuery({
          query: GET_NOTE_QUERY,
          variables: {
            id: NOTE_ID
          },
          data: {
            getNote: {
              ...noteData.getNote,
              title: title,
              latestUpdate: Date.now()
            }
          }
        });
        if (databaseData) {
          cache.writeQuery({
            query: GET_DATABASE_QUERY,
            variables: {
              id: noteData.getNote.databaseId
            },
            data: {
              getDatabase: {
                ...databaseData.getDatabase,
                notes: databaseData.getDatabase.notes.map((e: Note) =>
                  e.id === NOTE_ID ? { ...e, title: title, latestUpdate: Date.now() } : e
                )
              }
            }
          });
        }
      }
    });
  };

  const [
    generateSharedLinkMutation,
    {
      loading: generateSharedLinkLoading,
      called: generateSharedLinkCalled,
      data: generateSharedLinkData
    }
  ] = useMutation(GENERATE_SHARED_LINK_MUTATION);

  const generateSharedLink = () => {
    generateSharedLinkMutation({
      variables: {
        noteId: NOTE_ID
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
    title: data.getNote.title,
    latestUpdate: data.getNote.latestUpdate,
    updateBlocksInDatabase: updateBlocksInDatabase,
    updateNoteTitle: updateNoteTitle,
    generateSharedLink: generateSharedLink,
    generateSharedLinkLoading: generateSharedLinkLoading,
    generateSharedLinkCalled: generateSharedLinkCalled,
    generateSharedLinkHash: generateSharedLinkData
      ? generateSharedLinkData.generateSharedLink.hash
      : ''
  };

  return <NotePage {...notePageProps} />;
};

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

const UPDATE_NOTE_TITLE_MUTATION = gql`
  mutation updateNoteTitle($id: ID!, $title: String!) {
    updateNoteTitle(noteId: $id, title: $title) {
      id
    }
  }
`;

const GENERATE_SHARED_LINK_MUTATION = gql`
  mutation generateSharedLink($noteId: ID!) {
    generateSharedLink(noteId: $noteId) {
      hash
    }
  }
`;

export default NotePageContainer;
