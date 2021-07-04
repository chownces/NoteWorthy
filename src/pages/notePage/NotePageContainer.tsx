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

  if (queryLoading) {
    return <Loader />;
  }
  if (queryError) {
    // TODO: Write a common Error component/ Toast
    return <div>Error! + {queryError.message}</div>;
  }

  // Tracks `blocks` state locally in React as a mutable ref (for react-contenteditable)

  function treeify(list: any[], idAttr: string, parentAttr: string, childrenAttr: string) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';

    const treeList: any[] = [];
    const lookup: any = {};
    list.forEach(function (obj) {
      lookup[obj[idAttr]] = obj;
      obj[childrenAttr] = [];
    });
    list.forEach(function (obj) {
      if (obj[parentAttr] != null) {
        if (lookup[obj[parentAttr]] !== undefined) {
          lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
          //console.log('Missing Parent Data: ' + obj[parentAttr]);
          treeList.push(obj);
        }
      } else {
        treeList.push(obj);
      }
    });
    return treeList;
  }

  const flatBlocks = [...data.getNote.blocks];
  const flatBlocksCopy = flatBlocks.map(block => {
    return { id: block.id, html: block.html, tag: block.tag, children: [...block.children] };
  });

  blocks.current = treeify(flatBlocksCopy, 'id', 'parent', 'children');

  console.log(blocks.current);
  const notePageProps: NotePageProps = {
    blocks: blocks,
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
        children
        parent
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

export default NotePageContainer;
