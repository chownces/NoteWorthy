import { gql, useQuery } from '@apollo/client';
import React from 'react';

import { NoteBlockStateProps } from '../../components/noteBlock/NoteBlock';
import useStateCallback from '../../utils/useStateCallback';
import NotePage, { NotePageProps } from './NotePage';

const NotePageController: React.FC = () => {
  const [blocks, setBlocks] = useStateCallback<NoteBlockStateProps[]>([]);

  const NOTE_ID = ''; // Insert note id here
  const NOTE_QUERY = gql`
    {
      getNote(_id: "${NOTE_ID}") {
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

  const { loading, error, data } = useQuery(NOTE_QUERY);

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

  const notePageProps: NotePageProps = {
    blocks: blocks,
    setBlocks: setBlocks
  };

  return <NotePage {...notePageProps} />;
};

export default NotePageController;
