import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { ContextMenuTrigger } from 'react-contextmenu';

import { setEol, toggleBold } from '../../utils/helpers';
import useMergedRef from '../../utils/useMergedRef';
import ContextMenuElement, { ContextMenuType } from '../contextMenu/ContextMenuElement';

export type NoteBlockProps = NoteBlockStateProps & NoteBlockHandlerProps & OwnProps;

export type NoteBlockStateProps = {
  id: string;
  html: string;
  tag: string;
  children: NoteBlockHandlerProps[];
};

export type NoteBlockHandlerProps = {
  updatePage(updatedBlock: NoteBlockStateProps): void;
  addBlock(currentBlock: NoteBlockStateProps, ref: React.RefObject<HTMLElement>): void;
  deleteBlock(currentBlock: NoteBlockStateProps, ref: React.RefObject<HTMLElement>): void;
  setIsEditMode(bool: boolean, callback?: (newState?: boolean) => void): void;
};

type OwnProps = {
  innerRef: (element?: HTMLElement | null | undefined) => any;
  lastBlockRef?: React.RefObject<HTMLElement>;
  provided: DraggableProvided;
  isEditMode: boolean;
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

  const onKeydownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      // Adds a new block below the currently focused block when 'Enter' is pressed without 'Shift'
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault();
          props.addBlock(props, noteBlockRef);
        }
        break;

      // Deletes currently focused block if 'Backspace' is pressed and block is empty
      case 'Backspace':
        if (!html.current) {
          e.preventDefault();
          props.deleteBlock(props, noteBlockRef);
        }
        break;

      // Navigates to previous block, if it exists
      case 'ArrowUp':
        e.preventDefault();
        const previousBlock = noteBlockRef.current?.parentElement?.parentElement
          ?.previousElementSibling?.children[0]?.children[1] as HTMLElement;
        if (previousBlock) {
          setEol(previousBlock);
        }
        break;

      // Navigates to next block, if it exists
      case 'ArrowDown':
        e.preventDefault();
        const nextBlock = noteBlockRef.current?.parentElement?.parentElement?.nextElementSibling
          ?.children[0]?.children[1] as HTMLElement;
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

      // TODO: Handle case where user presses arrow up to navigate within a content block itself
    }
  };
  const mergedRef = useMergedRef(noteBlockRef, props.lastBlockRef);

  const contextMenuProps = {
    context: ContextMenuType.BLOCK,
    renaming: false,
    currentName: '',
    id: props.id,
    createHandler: () => props.addBlock(props, noteBlockRef),
    deleteHandler: () => props.deleteBlock(props, noteBlockRef),
    updateNameHandler: () => {}
  };

  // TODO: Improve dragging experience
  // TODO: Improve edit mode toggle
  // TODO: Add toggle handle icon
  return (
    /**
     * NOTE: For any change in NoteBlock HTML structure, remember to update the various navigation handlers:
     * NotePage::addBlockHandler
     * NotePage::deleteBlockHandler
     * NoteBlock::onKeydownHandler (ArrowUp and ArrowDown)
     */
    <ContextMenuTrigger id={props.id} holdToDisplay={1000}>
      <div
        className="noteblock"
        ref={props.innerRef}
        {...props.provided.dragHandleProps} // react-beautiful-dnd props
        {...props.provided.draggableProps} // react-beautiful-dnd props
      >
        <div className="noteblock-handle"></div>
        <ContentEditable
          className="noteblock-text"
          innerRef={mergedRef}
          html={html.current}
          tagName={props.tag}
          onChange={onChangeHandler}
          onKeyDown={onKeydownHandler}
          disabled={!props.isEditMode}
          onClick={() => {
            props.setIsEditMode(true, () => {
              noteBlockRef.current?.focus();
              // TODO: This eol line is causing issues when using the mouse to position the cursor
              // setEol(noteBlockRef.current);
            });
          }}
        />
        <ContextMenuElement {...contextMenuProps} />
      </div>
    </ContextMenuTrigger>
  );
};

export default NoteBlock;
