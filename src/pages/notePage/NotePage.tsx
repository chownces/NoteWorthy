import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import NoteBlock, {
  NoteBlockHandlerProps,
  NoteBlockStateProps
} from '../../components/noteBlock/NoteBlock';
import { setEol, uniqueId } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';

export type NotePageProps = {
  blocks: React.MutableRefObject<NoteBlockStateProps[]>;
  updateBlocksInDatabase: (newBlocks: NoteBlockStateProps[]) => void;
  updateBlockHandler: (block: NoteBlockStateProps) => void;
  deleteBlockHandler: (block: NoteBlockStateProps) => void;
  createBlockHandler: (block: NoteBlockStateProps, index: number) => void;
  updateBlockOrderHandler: (block: NoteBlockStateProps, index: number) => void;
};

enum TypeOfChange {
  Order = 0,
  Create = 1,
  Delete = 2,
  Update = 3,
  None = 4
}

export type unsavedProps = {
  type: TypeOfChange;
  index: number;
  block: NoteBlockStateProps;
};

const NotePage: React.FC<NotePageProps> = props => {
  /**
   * Boolean which toggles the edit mode for the entire page.
   * When true, the ContentEditable components (i.e. each note block) will be editable.
   */
  const [isEditMode, setIsEditMode] = useStateCallback<boolean>(false); // TODO: Look into setting a better toggle between modes
  const hasUnsavedChanges = React.useRef<unsavedProps>({
    type: 4,
    index: -1,
    block: {
      id: '',
      html: '',
      tag: ''
    }
  });

  /**
   * Window interval updates the backend whenever there are changes to the `blocks` state.
   *
   * NOTE: This is not the recommended way to use Apollo, since Apollo has its own cache functionality,
   * and we are completely disregarding it. The alternative is to fire off updates to the backend on
   * EVERY change to the `blocks` state. This is not ideal as there are too many API requests and rerenders
   * as a result, leading to poor performance. Also, react-contenteditable does not play well with rerenders
   * triggered outside it.
   */
  React.useEffect(() => {
    // pause time for create/delete/updateOrder mutation set to 0, to ensure each mutation is executed immediately

    const interval = window.setInterval(() => {
      const setUnsaved = () => {
        hasUnsavedChanges.current = {
          type: 4,
          index: -1,
          block: {
            id: '',
            html: '',
            tag: ''
          }
        };
      };
      switch (hasUnsavedChanges.current.type) {
        case 0:
          props.updateBlockOrderHandler(
            hasUnsavedChanges.current.block,
            hasUnsavedChanges.current.index
          );
          setUnsaved();
          break;
        case 1:
          props.createBlockHandler(
            hasUnsavedChanges.current.block,
            hasUnsavedChanges.current.index
          );
          setUnsaved();
          break;
        case 2:
          props.deleteBlockHandler(hasUnsavedChanges.current.block);
          setUnsaved();
          break;
        case 3:
          props.updateBlockHandler(hasUnsavedChanges.current.block);
          setUnsaved();
          break;
      }
    }, 0);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBlocksAndSetUnsaved = (newBlocks: NoteBlockStateProps[], change: unsavedProps): void => {
    props.blocks.current = newBlocks;
    hasUnsavedChanges.current = change;
  };

  /**
   * Handles text changes in each ContentEditable block by updating the relevant index inside `blocks`.
   */
  // TODO: Handle tag changes in the future.
  const updatePageHandler = (updatedBlock: NoteBlockStateProps): void => {
    const blocksCopy = [...props.blocks.current];
    const index = blocksCopy.map(b => b.id).indexOf(updatedBlock.id);
    blocksCopy[index] = {
      ...blocksCopy[index],
      html: updatedBlock.html,
      tag: updatedBlock.tag // TODO: Handle tag change for different type of blocks (e.g. h1, img, etc.)
    };

    setBlocksAndSetUnsaved(blocksCopy, { type: 3, index: index, block: updatedBlock });
  };

  /**
   * A React useState to trigger a rerender whenever there is a block addition or deletion.
   *
   * This is because we store `blocks` state as a mutable ref instead of useState as react-contenteditable
   * does not play well with rerenders triggered outside of it (as recommended by their docs).
   * We thus need to force a rerender when there are block additions or deletions to add/ remove the
   * block from the DOM.
   */
  const [triggerRerender, setTriggerRerender] = useStateCallback(false);

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
    const blocksCopy = [...props.blocks.current];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy.splice(index + 1, 0, newBlock);

    const focusNextBlockCallback = () => {
      (ref.current?.parentElement?.parentElement?.nextElementSibling?.children[0]
        ?.children[1] as HTMLElement).focus();
    };

    setBlocksAndSetUnsaved(blocksCopy, { type: 1, index: index + 1, block: newBlock });
    setTriggerRerender(!triggerRerender, focusNextBlockCallback);
  };

  /**
   * Handles the deletion of an empty block by removing it from `blocks`.
   */
  const deleteBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>
  ): void => {
    const previousBlock = ref.current?.parentElement?.parentElement?.previousElementSibling
      ?.children[0]?.children[1] as HTMLElement;

    const nextBlock = ref.current?.parentElement?.parentElement?.nextElementSibling?.children[0]
      ?.children[1] as HTMLElement;

    const blocksCopy = [...props.blocks.current];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy.splice(index, 1);

    const change: unsavedProps = {
      type: 2,
      index: index,
      block: currentBlock
    };
    if (previousBlock) {
      const focusPreviousBlockEolCallback = () => {
        setEol(previousBlock);
      };

      setBlocksAndSetUnsaved(blocksCopy, change);
      setTriggerRerender(!triggerRerender, focusPreviousBlockEolCallback);
    } else if (nextBlock) {
      const focusNextBlockEolCallback = () => {
        setEol(nextBlock);
      };

      setBlocksAndSetUnsaved(blocksCopy, change);
      setTriggerRerender(!triggerRerender, focusNextBlockEolCallback);
    } else {
      setBlocksAndSetUnsaved(blocksCopy, change);
      setIsEditMode(false);
    }
  };
  /**
   * This ref is passed to the last ContextEditable block in order to focus the newly appended block
   * in the appendBlockHandler callback.
   */
  const lastBlockRef = React.useRef<HTMLElement>(null);

  const appendBlockHandler = (): void => {
    if (isEditMode) {
      setIsEditMode(false);
      return;
    }
    const newBlock: NoteBlockStateProps = {
      id: uniqueId(), // TODO: Consider using the id provided by MongoDB
      html: '',
      tag: 'p' // TODO: Reconsider default block tag
    };
    const blocksCopy = [...props.blocks.current];
    blocksCopy.push(newBlock);

    setIsEditMode(true, () => lastBlockRef.current?.focus());
    setBlocksAndSetUnsaved(blocksCopy, { type: 1, index: blocksCopy.length - 1, block: newBlock });
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

    const newBlocks = reorder(props.blocks.current, result.source.index, result.destination.index);

    setBlocksAndSetUnsaved(newBlocks, {
      type: 0,
      index: result.destination.index,
      block: newBlocks[result.destination.index]
    });
  };

  const noteBlockHandlerProps: NoteBlockHandlerProps = {
    updatePage: updatePageHandler,
    addBlock: addBlockHandler,
    deleteBlock: deleteBlockHandler,
    setIsEditMode: setIsEditMode
  };

  return (
    <div className="Notepage">
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId="note-blocks">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {props.blocks.current.map((block, index) => (
                <Draggable draggableId={block.id} index={index} key={block.id}>
                  {provided => (
                    <NoteBlock
                      {...block}
                      {...noteBlockHandlerProps}
                      key={block.id}
                      isEditMode={isEditMode}
                      innerRef={provided.innerRef}
                      lastBlockRef={
                        index === props.blocks.current.length - 1 ? lastBlockRef : undefined
                      }
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
      <div className="placeholder" onClick={appendBlockHandler} />
    </div>
  );
};

export default NotePage;
