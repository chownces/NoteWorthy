import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

import NoteBlock, {
  NoteBlockHandlerProps,
  NoteBlockNavigationProps,
  NoteBlockStateProps
} from '../../components/noteBlock/NoteBlock';
import { setEol, uniqueId } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';

export type NotePageProps = {
  blocks: React.MutableRefObject<NoteBlockStateProps[]>;
  updateBlocksInDatabase: (newBlocks: NoteBlockStateProps[]) => void;
};

const NotePage: React.FC<NotePageProps> = props => {
  /**
   * Boolean which toggles the edit mode for the entire page.
   * When true, the ContentEditable components (i.e. each note block) will be editable.
   */
  const [isEditMode, setIsEditMode] = useStateCallback<boolean>(false); // TODO: Look into setting a better toggle between modes
  const hasUnsavedChanges = React.useRef<boolean>(false);

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
    const interval = window.setInterval(() => {
      if (hasUnsavedChanges.current) {
        props.updateBlocksInDatabase(props.blocks.current);
        hasUnsavedChanges.current = false;
      }
    }, 1000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setBlocksAndSetUnsaved = (newBlocks: NoteBlockStateProps[]): void => {
    props.blocks.current = newBlocks;
    hasUnsavedChanges.current = true;
  };

  /**
   * Handles text changes in each ContentEditable block by updating the relevant index inside `blocks`.
   */
  // TODO: Handle tag changes in the future.

  const updatePageHandler = (updatedBlocks: NoteBlockStateProps[]): void => {
    setBlocksAndSetUnsaved(updatedBlocks);
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

  const nextBlockGetter = (ref: React.RefObject<HTMLElement>, previousBlock?: HTMLElement) => {
    let currElement = ref.current;

    // for handling indentation, previousblock must be referenced to access indented/next block
    if (previousBlock) {
      currElement = previousBlock;
    }

    const nextChild =
      currElement?.parentElement?.parentElement?.parentElement?.children[1]?.children[0]
        ?.children[0]?.children[0]?.children[1];

    const nextSibling =
      currElement?.parentElement?.parentElement?.parentElement?.nextElementSibling?.children[0]
        ?.children[0]?.children[1];

    let nextRelative = undefined;
    let nextAncestor = currElement?.parentElement?.parentElement?.parentElement;

    while (
      nextRelative === undefined &&
      nextAncestor?.parentElement?.parentElement?.className === 'note-block'
    ) {
      nextAncestor = nextAncestor?.parentElement?.parentElement;
      nextRelative = nextAncestor?.nextElementSibling?.children[0]?.children[0]?.children[1];
    }

    return nextChild || nextSibling || nextRelative;
  };

  const nextSiblingGetter = (ref: React.RefObject<HTMLElement>) => {
    const nextSibling =
      ref.current?.parentElement?.parentElement?.parentElement?.nextElementSibling?.children[0]
        ?.children[0]?.children[1];

    return nextSibling;
  };

  const previousBlockGetter = (ref: React.RefObject<HTMLElement>) => {
    let previousRelative =
      ref.current?.parentElement?.parentElement?.parentElement?.previousElementSibling;
    while (previousRelative?.children[1].children !== undefined) {
      if (previousRelative?.children[1]?.children.length === 0) {
        break;
      }
      const numSibs = previousRelative?.children[1].children.length;
      previousRelative = previousRelative?.children[1].children[numSibs - 1];
    }

    previousRelative = previousRelative?.children[0]?.children[0]?.children[1];

    const previousParent =
      ref.current?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement
        ?.children[0]?.children[0]?.children[1];

    return previousRelative || previousParent;
  };

  const previousSiblingGetter = (ref: React.RefObject<HTMLElement>) => {
    const previousSibling =
      ref.current?.parentElement?.parentElement?.parentElement?.previousElementSibling?.children[0]
        ?.children[0]?.children[1];

    return previousSibling;
  };

  const addBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[]
  ): void => {
    const newBlock: NoteBlockStateProps = {
      id: uniqueId(), // TODO: Consider using the id provided by MongoDB
      html: '',
      tag: 'p', // TODO: Reconsider default block tag
      children: []
    };

    const blocksCopy = [...currentBlocks];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    if (currentBlock.children.length !== 0) {
      const currentBlockCopy = {
        id: currentBlock.id,
        html: currentBlock.html,
        tag: currentBlock.tag,
        children: currentBlock.children
      };
      currentBlockCopy.children.splice(0, 0, newBlock);
      blocksCopy.splice(index, 1, currentBlockCopy);

      const focusNextBlockCallback = () => {
        (nextBlockGetter(ref) as HTMLElement).focus();
      };

      updateBlocksHandler(blocksCopy);
      setTriggerRerender(!triggerRerender, focusNextBlockCallback);
    } else {
      blocksCopy.splice(index + 1, 0, newBlock);

      const focusNextBlockCallback = () => {
        (nextBlockGetter(ref) as HTMLElement).focus();
      };

      updateBlocksHandler(blocksCopy);
      setTriggerRerender(!triggerRerender, focusNextBlockCallback);
    }
  };

  // Indents current block and adds it as a child of the previous block
  const indentBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[],
    html: string
  ): void => {
    const previousBlock = previousBlockGetter(ref);
    const previousSibling = previousSiblingGetter(ref);
    if (!previousSibling) {
      return;
    }

    const currentBlockCopy = {
      id: currentBlock.id,
      html: html,
      tag: currentBlock.tag,
      children: currentBlock.children
    };

    const blocksCopy = [...currentBlocks];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy[index - 1].children = [...blocksCopy[index - 1].children];
    const length = blocksCopy[index - 1].children.length;
    blocksCopy.splice(index, 1);
    blocksCopy[index - 1].children.splice(length, 0, currentBlockCopy);

    updateBlocksHandler(blocksCopy);

    console.log(ref.current);
    console.log(previousBlock);

    const focusNextBlockCallback = () => {
      const indentBlockRef = nextBlockGetter(ref, previousBlock as HTMLElement);
      (indentBlockRef as HTMLElement).focus();
    };
    setTriggerRerender(!triggerRerender, focusNextBlockCallback);
  };

  //unindent block by adding it as a sibling to its parent
  const unindentBlockHandler = (
    currentBlock: NoteBlockStateProps,
    parentRef: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    parentBlock: NoteBlockStateProps,
    parentBlocks: NoteBlockStateProps[],
    currentBlocks: NoteBlockStateProps[],
    html: string,
    parentHtml: string
  ): void => {
    //cannot unindent any further
    if (parentBlock === undefined) {
      return;
    }

    const currentBlockCopy = {
      id: currentBlock.id,
      html: html,
      tag: currentBlock.tag,
      children: [...currentBlock.children]
    };

    const blocksCopy = [...currentBlocks];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);

    //Remove all siblings after currentBlock, add as child of currentBlock
    const newChildren = blocksCopy.splice(index, blocksCopy.length - index);
    newChildren.splice(0, 1);
    currentBlockCopy.children.splice(currentBlockCopy.children.length, 0, ...newChildren);

    const parentBlockCopy = {
      id: parentBlock.id,
      html: parentHtml,
      tag: parentBlock.tag,
      children: [...blocksCopy]
    };

    const parentBlocksCopy = [...parentBlocks];
    const parentIndex = parentBlocksCopy.map(b => b.id).indexOf(parentBlock.id);
    parentBlocksCopy.splice(parentIndex, 1);
    parentBlocksCopy.splice(parentIndex, 0, parentBlockCopy, currentBlockCopy);

    updateBlocksHandler(parentBlocksCopy);

    const focusNextBlockCallback = () => {
      const indentBlockRef = nextSiblingGetter(parentRef);
      (indentBlockRef as HTMLElement).focus();
    };
    setTriggerRerender(!triggerRerender, focusNextBlockCallback);
  };

  /**
   * Handles the deletion of an empty block by removing it from `blocks`.
   */
  const deleteBlockHandler = (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[]
  ): void => {
    const previousBlock = previousBlockGetter(ref) as HTMLElement;

    const nextBlock = nextBlockGetter(ref) as HTMLElement;

    const blocksCopy = [...currentBlocks];
    const index = blocksCopy.map(b => b.id).indexOf(currentBlock.id);
    blocksCopy.splice(index, 1);
    if (previousBlock) {
      const focusPreviousBlockEolCallback = () => {
        setEol(previousBlock);
      };

      updateBlocksHandler(blocksCopy);
      setTriggerRerender(!triggerRerender, focusPreviousBlockEolCallback);
    } else if (nextBlock) {
      const focusNextBlockEolCallback = () => {
        setEol(nextBlock);
      };

      updateBlocksHandler(blocksCopy);
      setTriggerRerender(!triggerRerender, focusNextBlockEolCallback);
    } else {
      updateBlocksHandler(blocksCopy);
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
      tag: 'p', // TODO: Reconsider default block tag
      children: []
    };
    const blocksCopy = [...props.blocks.current];
    blocksCopy.push(newBlock);

    setIsEditMode(true, () => lastBlockRef.current?.focus());
    setBlocksAndSetUnsaved(blocksCopy);
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

    setBlocksAndSetUnsaved(newBlocks);
  };

  const noteBlockHandlerProps: NoteBlockHandlerProps = {
    addBlock: addBlockHandler,
    deleteBlock: deleteBlockHandler,
    indentBlock: indentBlockHandler,
    updateBlocksHandler: updatePageHandler,
    unindentBlockHandler: unindentBlockHandler,
    unindentBlock: undefined,
    blocks: props.blocks.current,
    setIsEditMode: setIsEditMode
  };

  const noteBlockNavigationProps: NoteBlockNavigationProps = {
    nextBlockGetter: nextBlockGetter,
    previousBlockGetter: previousBlockGetter
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
                      {...noteBlockNavigationProps}
                      updatePage={(updatedBlock: NoteBlockStateProps) => {
                        const blocksCopy = [...props.blocks.current];
                        const index = blocksCopy.map(b => b.id).indexOf(updatedBlock.id);
                        blocksCopy.splice(index, 1, updatedBlock);
                        updatePageHandler(blocksCopy);
                      }}
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
