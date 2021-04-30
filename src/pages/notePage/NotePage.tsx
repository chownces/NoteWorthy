import React from 'react';

import { setEol, uniqueId } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';
import NoteBlock, { NoteBlockHandlerProps, NoteBlockStateProps } from '../noteBlock/NoteBlock';

type NotePageProps = {};

const NotePage: React.FC<NotePageProps> = props => {
  /**
   * TODO: Decide on whether to keep the initial block.
   * For now, the user cannot have 0 blocks due to the way the deleteBlockHandler is implemented
   */
  const [blocks, setBlocks] = useStateCallback<NoteBlockStateProps[]>([initialBlock]);

  /**
   * React.useRef is used here with the following effect to keep a mutable object reference
   * to the updated blocks array. This is to allow access to the latest blocks array within
   * the callback handlers below.
   *
   * (this is a hacky way of overcoming the stale closure problem with React hooks)
   */
  const blocksRef = React.useRef<NoteBlockStateProps[]>([initialBlock]);
  React.useEffect(() => {
    blocksRef.current = blocks;
  });

  const updatePageHandler = (updatedBlock: NoteBlockStateProps): void => {
    const blocksCopy = [...blocksRef.current];
    const index = blocksCopy.map(b => b.id).indexOf(updatedBlock.id);
    blocksCopy[index] = {
      ...blocksCopy[index],
      html: updatedBlock.html,
      tag: updatedBlock.tag // TODO: Handle tag change for different type of blocks (e.g. h1, img, etc.)
    };

    setBlocks(blocksCopy);
  };

  const addBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const newBlock: NoteBlockStateProps = {
      id: uniqueId(),
      html: '',
      tag: 'p' // TODO: Reconsider default block tag
    };
    const blocksCopy = [...blocksRef.current];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy.splice(index + 1, 0, newBlock);

    const focusNextBlockCallback = () => {
      (ref.current?.nextElementSibling as HTMLElement).focus();
    };

    setBlocks(blocksCopy, focusNextBlockCallback);
  };

  const deleteBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const previousBlock = ref.current?.previousElementSibling as HTMLElement;
    if (previousBlock) {
      const blocksCopy = [...blocksRef.current];
      const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
      blocksCopy.splice(index, 1);

      const focusPreviousBlockEolCallback = () => {
        setEol(previousBlock);
      };

      setBlocks(blocksCopy, focusPreviousBlockEolCallback);
    }
  };

  const noteBlockHandlerProps: NoteBlockHandlerProps = {
    updatePage: updatePageHandler,
    addBlock: addBlockHandler,
    deleteBlock: deleteBlockHandler
  };

  // TODO: Handle classNames and CSS
  return (
    <div>
      {blocks.map(block => (
        <NoteBlock {...block} {...noteBlockHandlerProps} key={block.id} />
      ))}
    </div>
  );
};

// TODO: Remove default block, and handle page load from database
const initialBlock: NoteBlockStateProps = {
  id: uniqueId(),
  html: 'Hello World!',
  tag: 'p'
};

export default NotePage;
