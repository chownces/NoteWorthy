import React from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { Container } from 'semantic-ui-react';

import NoteBlock, {
  NoteBlockHandlerProps,
  NoteBlockStateProps
} from '../../components/noteBlock/NoteBlock';
import { setEol, uniqueId } from '../../utils/helpers';
import useStateCallback from '../../utils/useStateCallback';

export type NotePageProps = {
  blocks: React.MutableRefObject<NoteBlockStateProps[]>;
  title: string;
  updateBlocksInDatabase: (newBlocks: NoteBlockStateProps[]) => void;
  updateNoteTitle: (title: string) => void;
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
  const updatePageHandler = (updatedBlock: NoteBlockStateProps): void => {
    const blocksCopy = [...props.blocks.current];
    const index = blocksCopy.map(b => b.id).indexOf(updatedBlock.id);
    blocksCopy[index] = {
      ...blocksCopy[index],
      html: updatedBlock.html,
      tag: updatedBlock.tag // TODO: Handle tag change for different type of blocks (e.g. h1, img, etc.)
    };

    setBlocksAndSetUnsaved(blocksCopy);
  };

  /**
   * Under normal circumstances, this is bad React code. However, since we are using
   * react-contenteditable which recommends mutable refs to prevent the cursor jumping
   * problem, we need a way to trigger a rerender when necessary (such as when adding
   * or deleting blocks).
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

    setBlocksAndSetUnsaved(blocksCopy);
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
    if (previousBlock) {
      const focusPreviousBlockEolCallback = () => {
        setEol(previousBlock);
      };

      setBlocksAndSetUnsaved(blocksCopy);
      setTriggerRerender(!triggerRerender, focusPreviousBlockEolCallback);
    } else if (nextBlock) {
      const focusNextBlockEolCallback = () => {
        setEol(nextBlock);
      };

      setBlocksAndSetUnsaved(blocksCopy);
      setTriggerRerender(!triggerRerender, focusNextBlockEolCallback);
    } else {
      setBlocksAndSetUnsaved(blocksCopy);
      setIsEditMode(false);
    }
  };

  /**
   * This ref is passed to the last ContextEditable block in order to focus the newly appended block
   * in the placeHolderDivHandler callback.
   */
  const lastBlockRef = React.useRef<HTMLElement>(null);

  /**
   * onClick handler for the placeHolderDiv at the bottom of the notepage.
   *
   * It adds a new block when there are 0 blocks, or when the last block
   * already has text in it. Otherwise, it just focuses on the last block.
   */
  const placeHolderDivHandler = (): void => {
    if (props.blocks.current.length === 0 || props.blocks.current.slice(-1)[0].html !== '') {
      const newBlock: NoteBlockStateProps = {
        id: uniqueId(), // TODO: Consider using the id provided by MongoDB
        html: '',
        tag: 'p' // TODO: Reconsider default block tag
      };
      const blocksCopy = [...props.blocks.current];
      blocksCopy.push(newBlock);

      setIsEditMode(true);
      setTriggerRerender(!triggerRerender, () => lastBlockRef.current?.focus());
      setBlocksAndSetUnsaved(blocksCopy);
    } else {
      setIsEditMode(true);

      setTriggerRerender(!triggerRerender, () => {
        lastBlockRef.current?.focus();
        setEol(lastBlockRef.current);
      });
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

    const newBlocks = reorder(props.blocks.current, result.source.index, result.destination.index);

    setBlocksAndSetUnsaved(newBlocks);
  };

  const noteBlockHandlerProps: NoteBlockHandlerProps = {
    updatePage: updatePageHandler,
    addBlock: addBlockHandler,
    deleteBlock: deleteBlockHandler,
    setIsEditMode: setIsEditMode
  };

  // Handle title updates
  const noteTitleRef = React.useRef(props.title);
  const hasUnsavedChangesTitle = React.useRef(false);
  React.useEffect(() => {
    const interval = window.setInterval(() => {
      if (hasUnsavedChangesTitle.current) {
        props.updateNoteTitle(noteTitleRef.current);
        hasUnsavedChangesTitle.current = false;
      }
    }, 1000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="Notepage-container">
      <div className="Notepage">
        <ContentEditable
          className="notepage-title"
          tagName="h1"
          html={noteTitleRef.current}
          onChange={(e: ContentEditableEvent) => {
            noteTitleRef.current = e.target.value;
            hasUnsavedChangesTitle.current = true;
          }}
        />
        <DragDropContext onDragEnd={onDragEndHandler}>
          <Droppable droppableId="note-blocks">
            {(provided, droppableSnapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {props.blocks.current.map((block, index) => (
                  <Draggable draggableId={block.id} index={index} key={block.id}>
                    {(provided, draggableSnapshot) => (
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
                        draggableSnapshot={draggableSnapshot}
                        droppableSnapshot={droppableSnapshot}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="bottom-placeholder-div" onClick={placeHolderDivHandler}>
          {props.blocks.current.length === 0 && (
            <div className="bottom-placeholder-div-text">Click here to add a new block!</div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default NotePage;
