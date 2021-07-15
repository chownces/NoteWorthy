import React from 'react';
import { Draggable, DraggableProvided } from 'react-beautiful-dnd';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { ContextMenuTrigger } from 'react-contextmenu';

import { getCaretPosition, setEol, toggleBold } from '../../utils/helpers';
import useMergedRef from '../../utils/useMergedRef';
import ContextMenuElement, { ContextMenuType } from '../contextMenu/ContextMenuElement';

export type NoteBlockProps = NoteBlockStateProps &
  NoteBlockHandlerProps &
  NoteBlockNavigationProps &
  OwnProps;

export type NoteBlockStateProps = {
  id: string;
  html: string;
  tag: string;
  children: NoteBlockStateProps[];
};

export type NoteBlockNavigationProps = {
  nextBlockGetter: (ref: React.RefObject<HTMLElement>) => Element | undefined;
  previousBlockGetter: (ref: React.RefObject<HTMLElement>) => Element | undefined;
};

export type NoteBlockHandlerProps = {
  addBlock: (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[],
    html: string
  ) => void;
  deleteBlock: (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[]
  ) => void;
  indentBlock: (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[],
    html: string
  ) => void;
  updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void;
  unindentBlockHandler: (
    currentBlock: NoteBlockStateProps,
    parentRef: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    parentBlock: NoteBlockStateProps,
    parentBlocks: NoteBlockStateProps[],
    currentBlocks: NoteBlockStateProps[],
    html: string,
    parentHtml: string
  ) => void;
  unindentBlock:
    | ((
        currentBlock: NoteBlockStateProps,
        currentBlocks: NoteBlockStateProps[],
        html: string
      ) => void)
    | undefined;
  blocks: NoteBlockStateProps[];
  appendToPreviousBlockHandler: (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[],
    html: string
  ) => void;
  refocusHandler: (
    currentBlock: NoteBlockStateProps,
    ref: React.RefObject<HTMLElement>,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => void,
    currentBlocks: NoteBlockStateProps[],
    html: string
  ) => void;
  setIsEditMode(bool: boolean, callback?: (newState?: boolean) => void): void;
  isAppendedToPreviousBlock: [boolean, () => void];
  setIsAppendedToPreviousBlock: (
    newState: [boolean, () => void],
    callback?: ((newState?: [boolean, () => void] | undefined) => void) | undefined
  ) => void;
  triggerRerender: boolean;
  setTriggerRerender: (
    newState: boolean,
    callback?: ((newState?: boolean | undefined) => void) | undefined
  ) => void;
};

type OwnProps = {
  innerRef: (element?: HTMLElement | null | undefined) => any;
  lastBlockRef?: React.RefObject<HTMLElement>;
  provided: DraggableProvided;
  isEditMode: boolean;
  updatePage: (currentBlock: NoteBlockStateProps) => void;
};

const NoteBlock: React.FC<NoteBlockProps> = props => {
  const noteBlockRef = React.useRef<HTMLElement>(null);

  /**
   * IMPT: Since we are tracking `blocks` state as a mutable ref instead of useState
   * (to prevent rerender which causes react-contenteditable cursor jumping),
   * props.updatePage does not trigger a rerender, and thus props are not updated.
   *
   * Hence, we also track the state as a mutable ref locally in this component so that
   * the react-contenteditable values passed into our change handlers are accurate.
   */
  const html = React.useRef<string>(props.html);

  // TODO: For future use when tag changes are implemented
  // const tag = React.useRef<string>(props.tag);

  const onFocus = () => {
    if (props.isAppendedToPreviousBlock[0]) {
      if (props.html !== html.current) {
        html.current = props.html;
      }
      props.setIsAppendedToPreviousBlock([false, () => {}], props.isAppendedToPreviousBlock[1]);
    }
  };

  const onChangeHandler = (e: ContentEditableEvent) => {
    // Additional checks for e.target.value as HTML tags are not cleared even when block is empty

    const value =
      e.target.value === '<br>' || e.target.value === '<div><br></div>' ? '' : e.target.value;

    props.updatePage({
      id: props.id,
      html: value,
      tag: props.tag,
      children: props.children
    });

    html.current = value;
  };

  const isAtCursorStart = (elem: HTMLElement) => {
    const caretPosition = getCaretPosition(elem);

    if (caretPosition) {
      const [startOffset, endOffset, index] = caretPosition;

      return startOffset === 0 && endOffset === 0 && (index === -1 || index === 0);
    }
    return false;
  };

  const onKeydownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      // Adds a new block below the currently focused block when 'Enter' is pressed without 'Shift'
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault();
          props.addBlock(
            props,
            noteBlockRef,
            props.updateBlocksHandler,
            props.blocks,
            html.current
          );
        }
        break;

      // Deletes currently focused block if 'Backspace' is pressed and block is empty
      case 'Backspace':
        if (!html.current && props.unindentBlock === undefined) {
          e.preventDefault();
          props.deleteBlock(props, noteBlockRef, props.updateBlocksHandler, props.blocks);
        } else if (
          props.unindentBlock !== undefined &&
          isAtCursorStart(noteBlockRef.current as HTMLElement)
        ) {
          e.preventDefault();
          props.unindentBlock(props, props.blocks, html.current);
        } else if (
          props.unindentBlock === undefined &&
          isAtCursorStart(noteBlockRef.current as HTMLElement)
        ) {
          e.preventDefault();

          props.appendToPreviousBlockHandler(
            props,
            noteBlockRef,
            props.updateBlocksHandler,
            props.blocks,
            html.current
          );
        }

        break;

      // Navigates to previous block, if it exists
      case 'ArrowUp':
        e.preventDefault();
        const previousBlock = props.previousBlockGetter(noteBlockRef) as HTMLElement;
        if (previousBlock) {
          setEol(previousBlock);
        }
        break;

      // Navigates to next block, if it exists
      case 'ArrowDown':
        e.preventDefault();

        const nextBlock = props.nextBlockGetter(noteBlockRef) as HTMLElement;
        if (nextBlock) {
          setEol(nextBlock);
        }
        break;

      case 'b':
        if (e.metaKey) {
          e.preventDefault();

          toggleBold(noteBlockRef.current as HTMLElement); // TODO: Handle untoggling also!
        }
        break;

      // TODO: Add a better key handler, since this only triggers when a block is in focus
      case 'Escape':
        props.setIsEditMode(false);
        noteBlockRef.current?.blur();
        break;

      case 'Tab':
        e.preventDefault();
        props.indentBlock(
          props,
          noteBlockRef,
          props.updateBlocksHandler,
          props.blocks,
          html.current
        );
        break;

      // TODO: Handle case where user presses arrow up to navigate within a content block itself
    }
  };

  const unindentBlock = (
    currentBlock: NoteBlockStateProps,
    currentBlocks: NoteBlockStateProps[],
    currentHtml: string
  ) =>
    props.unindentBlockHandler(
      currentBlock,
      noteBlockRef,
      props.updateBlocksHandler,
      props,
      props.blocks,
      currentBlocks,
      currentHtml,
      html.current
    );

  const mergedRef = useMergedRef(noteBlockRef, props.lastBlockRef);

  const contextMenuProps = {
    context: ContextMenuType.BLOCK,
    renaming: false,
    currentName: '',
    id: props.id,
    createHandler: () =>
      props.addBlock(props, noteBlockRef, props.updateBlocksHandler, props.blocks, html.current),
    deleteHandler: () =>
      props.deleteBlock(props, noteBlockRef, props.updateBlocksHandler, props.blocks),
    updateNameHandler: () => {}
  };

  const noteBlockHandlerProps: NoteBlockHandlerProps = {
    addBlock: props.addBlock,
    deleteBlock: props.deleteBlock,
    indentBlock: props.indentBlock,
    updateBlocksHandler: (updatedBlocks: NoteBlockStateProps[]) => {
      const blockCopy = {
        id: props.id,
        tag: props.tag,
        html: props.html,
        children: updatedBlocks
      };
      props.updatePage(blockCopy);
    },
    unindentBlockHandler: props.unindentBlockHandler,
    unindentBlock: unindentBlock,
    appendToPreviousBlockHandler: props.appendToPreviousBlockHandler,
    refocusHandler: props.refocusHandler,
    blocks: props.children,
    setIsEditMode: props.setIsEditMode,
    isAppendedToPreviousBlock: props.isAppendedToPreviousBlock,
    setIsAppendedToPreviousBlock: props.setIsAppendedToPreviousBlock,
    triggerRerender: props.triggerRerender,
    setTriggerRerender: props.setTriggerRerender
  };

  const noteBlockNavigationProps: NoteBlockNavigationProps = {
    nextBlockGetter: props.nextBlockGetter,
    previousBlockGetter: props.previousBlockGetter
  };
  // TODO: Improve dragging experience
  // TODO: Improve edit mode toggle
  // TODO: Add toggle handle icon

  const contenteditable = (
    <ContentEditable
      className="noteblock-text"
      innerRef={mergedRef}
      html={html.current}
      tagName={props.tag}
      onChange={onChangeHandler}
      onFocus={onFocus}
      onKeyDown={onKeydownHandler}
      disabled={!props.isEditMode}
      onClick={() => {
        props.setIsEditMode(true, () => {
          noteBlockRef.current?.focus();
          // TODO: This eol line is causing issues when using the mouse to position the cursor
          // setEol(noteBlockRef.current);
        });
      }}
      onBlur={() => {}}
    />
  );

  return (
    /**
     * NOTE: For any change in NoteBlock HTML structure, remember to update the various navigation handlers:
     * NotePage::addBlockHandler
     * NotePage::deleteBlockHandler
     * NoteBlock::onKeydownHandler (ArrowUp and ArrowDown)
     */
    <div className="note-block">
      <ContextMenuTrigger id={props.id} holdToDisplay={1000}>
        <div
          className="noteblock"
          ref={props.innerRef}
          {...props.provided.dragHandleProps} // react-beautiful-dnd props
          {...props.provided.draggableProps} // react-beautiful-dnd props
        >
          <div className="noteblock-handle"></div>
          {contenteditable}
        </div>
        <ContextMenuElement {...contextMenuProps} />
      </ContextMenuTrigger>
      <div className="indent">
        {props.children.map((block, index) => (
          <Draggable draggableId={block.id} index={index} key={block.id}>
            {provided => (
              <NoteBlock
                {...block}
                {...noteBlockHandlerProps}
                {...noteBlockNavigationProps}
                updatePage={(updatedBlock: NoteBlockStateProps) => {
                  const blockCopy = {
                    id: props.id,
                    tag: props.tag,
                    html: props.html,
                    children: [...props.children]
                  };

                  const index = blockCopy.children.map(b => b.id).indexOf(updatedBlock.id);
                  blockCopy.children.splice(index, 1, updatedBlock);
                  props.updatePage(blockCopy);
                }}
                key={block.id}
                isEditMode={props.isEditMode}
                innerRef={provided.innerRef}
                lastBlockRef={undefined}
                provided={provided}
              />
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export default NoteBlock;
