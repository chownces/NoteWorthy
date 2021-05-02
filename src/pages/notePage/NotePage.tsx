import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import NoteBlock, {
  NoteBlockHandlerProps,
  NoteBlockStateProps
} from '../../components/noteBlock/NoteBlock';
import { setEol, uniqueId } from '../../utils/helpers';

export type NotePageProps = {
  blocks: NoteBlockStateProps[];
  setBlocksAndUpdateDatabase: (
    newBlocks: NoteBlockStateProps[],
    callback?: (newState?: NoteBlockStateProps[]) => void
  ) => void;
};

const NotePage: React.FC<NotePageProps> = props => {
  /**
   * Boolean which toggles the edit mode for the entire page.
   * When true, the ContentEditable components (i.e. each note block) will be editable.
   */
  const [isEditMode, setIsEditMode] = React.useState(false); // TODO: Look into setting a better toggle between modes

  /**
   * Handles text changes in each ContentEditable block by updating the relevant index inside `blocks`.
   */
  // TODO: Handle tag changes in the future.
  const updatePageHandler = (updatedBlock: NoteBlockStateProps): void => {
    const blocksCopy = [...props.blocks];
    const index = blocksCopy.map(b => b.id).indexOf(updatedBlock.id);
    blocksCopy[index] = {
      ...blocksCopy[index],
      html: updatedBlock.html,
      tag: updatedBlock.tag // TODO: Handle tag change for different type of blocks (e.g. h1, img, etc.)
    };

    props.setBlocksAndUpdateDatabase(blocksCopy);
  };

  /**
   * Handles the addition of a new block by adding it at the correct index inside `blocks`.
   */
  const addBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const newBlock: NoteBlockStateProps = {
      id: uniqueId(),
      html: '',
      tag: 'p' // TODO: Reconsider default block tag
    };
    const blocksCopy = [...props.blocks];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy.splice(index + 1, 0, newBlock);

    const focusNextBlockCallback = () => {
      (ref.current?.nextElementSibling as HTMLElement).focus();
    };

    props.setBlocksAndUpdateDatabase(blocksCopy, focusNextBlockCallback);
  };

  /**
   * Handles the deletion of an empty block by removing it from `blocks`.
   */
  const deleteBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const previousBlock = ref.current?.previousElementSibling as HTMLElement;
    if (previousBlock) {
      const blocksCopy = [...props.blocks];
      const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
      blocksCopy.splice(index, 1);

      const focusPreviousBlockEolCallback = () => {
        setEol(previousBlock);
      };

      props.setBlocksAndUpdateDatabase(blocksCopy, focusPreviousBlockEolCallback);
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

    const newBlocks = reorder(props.blocks, result.source.index, result.destination.index);

    props.setBlocksAndUpdateDatabase(newBlocks);
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
            {props.blocks.map((block, index) => (
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
