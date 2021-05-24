import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import NoteBlock, {
  NoteBlockHandlerProps,
  NoteBlockStateProps
} from '../../components/noteBlock/NoteBlock';
import { setEol, uniqueId } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';

export type NotePageProps = {
  blocks: NoteBlockStateProps[];
  updateBlocksInDatabase: (newBlocks: NoteBlockStateProps[]) => void;
};

const NotePage: React.FC<NotePageProps> = props => {
  /**
   * Boolean which toggles the edit mode for the entire page.
   * When true, the ContentEditable components (i.e. each note block) will be editable.
   */
  const [isEditMode, setIsEditMode] = useStateCallback<boolean>(false); // TODO: Look into setting a better toggle between modes

  /**
   * Track `blocks` state locally in React, and have a window interval which updates the backend
   * whenever there are changes to this state.
   *
   * NOTE: This is not the recommended way to use Apollo, since Apollo has its own cache functionality,
   * and we are completely disregarding it. The alternative is to fire off updates to the backend on
   * EVERY change to the `blocks` state. This is not ideal as there are too many API requests and rerenders
   * as a result, leading to poor performance.
   */
  const [blocks, setBlocks] = useStateCallback(props.blocks);
  const hasUnsavedChanges = React.useRef<boolean>(false);

  /**
   * blocksRef and the following effect helps to overcome the stale closure problem with React hooks,
   * and allows us to access the latest blocks inside the effect that updates the blocks in the database
   * without creating a new window listener each time. It also allows us to access the latest blocks
   * within the NoteBlock handlers below.
   */
  const blocksRef = React.useRef(blocks);
  React.useEffect(() => {
    blocksRef.current = blocks;
  });

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (hasUnsavedChanges.current) {
        props.updateBlocksInDatabase(blocksRef.current);
        hasUnsavedChanges.current = false;
      }
    }, 1000);

    return () => window.clearInterval(interval);
    /**
     * It is okay to ignore this exhaustive deps warning. See the above comment on how the stale closure problem
     * is overcomed with useRef, thus allowing us to use just one window listener, instead of creating multiple ones.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBlocksAndSetUnsaved = (
    newBlocks: NoteBlockStateProps[],
    callback?: (newState?: NoteBlockStateProps[]) => void
  ): void => {
    setBlocks(newBlocks, callback);
    hasUnsavedChanges.current = true;
  };

  /**
   * Handles text changes in each ContentEditable block by updating the relevant index inside `blocks`.
   */
  // TODO: Handle tag changes in the future.
  const updatePageHandler = (updatedBlock: NoteBlockStateProps): void => {
    const blocksCopy = [...blocksRef.current];
    const index = blocksCopy.map(b => b.id).indexOf(updatedBlock.id);
    blocksCopy[index] = {
      ...blocksCopy[index],
      html: updatedBlock.html,
      tag: updatedBlock.tag // TODO: Handle tag change for different type of blocks (e.g. h1, img, etc.)
    };

    setBlocksAndSetUnsaved(blocksCopy);
  };

  /**
   * Handles the addition of a new block by adding it at the correct index inside `blocks`.
   */
  const addBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const newBlock: NoteBlockStateProps = {
      id: uniqueId(), // TODO: Consider using the id provided by MongoDB
      html: '',
      tag: 'p' // TODO: Reconsider default block tag
    };
    const blocksCopy = [...blocksRef.current];
    blocksCopy.forEach(b => console.log(b.id));
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy.splice(index + 1, 0, newBlock);

    const focusNextBlockCallback = () => {
      (ref.current?.parentElement?.parentElement?.nextElementSibling
        ?.children[0]?.children[1] as HTMLElement).focus();
    };

    
    setBlocksAndSetUnsaved(blocksCopy, focusNextBlockCallback);
  };

  /**
   * Handles the deletion of an empty block by removing it from `blocks`.
   */
  const deleteBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const previousBlock = ref.current?.parentElement?.parentElement
    ?.previousElementSibling?.children[0]?.children[1] as HTMLElement;
    

     const nextBlock = ref.current?.parentElement?.parentElement
    ?.nextElementSibling?.children[0]?.children[1] as HTMLElement;
    if (previousBlock) {
      const blocksCopy = [...blocksRef.current];
      const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
      blocksCopy.splice(index, 1);

      const focusPreviousBlockEolCallback = () => {
        setEol(previousBlock);
      };

      setBlocksAndSetUnsaved(blocksCopy, focusPreviousBlockEolCallback);
    } else if (nextBlock) { 
      const blocksCopy = [...blocksRef.current];
      const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
      blocksCopy.splice(index, 1);

      const focusNextBlockEolCallback = () => {
        setEol(nextBlock);
      };
      
      setBlocksAndSetUnsaved(blocksCopy, focusNextBlockEolCallback);
    } else {
      const blocksCopy = [...blocksRef.current];
      const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
      const newBlock: NoteBlockStateProps = {
        id: uniqueId(), // TODO: Consider using the id provided by MongoDB
        html: '',
        tag: 'p' // TODO: Reconsider default block tag
      };
      blocksCopy.splice(index, 0, newBlock);
      const nextBlock = ref.current?.parentElement?.parentElement
        ?.nextElementSibling?.children[0]?.children[1] as HTMLElement;
      const focusNextBlockEolCallback = () => {
        setEol(nextBlock);
      };
      blocksCopy.splice(index + 1, 1);

      setBlocksAndSetUnsaved(blocksCopy, focusNextBlockEolCallback);
    }
  };

  /**
   * Handler passed into react-beautiful-dnd to update `blocks` when a drag event occurs.
   */
  const onDragEndHandler = (result: DropResult) => {
    const reorder = (arr: NoteBlockStateProps[], startIndex: number, endIndex: number) => {
      const copy = [...arr];
      const [removed] = copy.splice(startIndex, 1);
      copy.splice(endIndex, 0, removed);

      return copy;
    };

    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newBlocks = reorder(blocksRef.current, result.source.index, result.destination.index);

    setBlocksAndSetUnsaved(newBlocks);
  };

  const noteBlockHandlerProps: NoteBlockHandlerProps = {
    updatePage: updatePageHandler,
    addBlock: addBlockHandler,
    deleteBlock: deleteBlockHandler,
    setIsEditMode: setIsEditMode
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="note-blocks">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {blocks.map((block, index) => (
              <Draggable draggableId={block.id} index={index} key={block.id}>
                {provided => (
                  <NoteBlock
                    {...block}
                    {...noteBlockHandlerProps}
                    key={block.id}
                    isEditMode={isEditMode}
                    innerRef={provided.innerRef}
                    provided={provided}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default NotePage;
