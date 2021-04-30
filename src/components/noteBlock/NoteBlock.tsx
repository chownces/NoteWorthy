import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { setEol, toggleBold } from '../../utils/helpers';
import useMergedRef from '../../utils/useMergedRef';

export type NoteBlockProps = NoteBlockStateProps & NoteBlockHandlerProps & OwnProps;

export type NoteBlockStateProps = {
  id: string;
  html: string;
  tag: string;
};

export type NoteBlockHandlerProps = {
  updatePage(updatedBlock: NoteBlockStateProps): void;
  addBlock(currentBlock: NoteBlockStateProps, ref: React.RefObject<HTMLElement>): void;
  deleteBlock(currentBlock: NoteBlockStateProps, ref: React.RefObject<HTMLElement>): void;
  setIsEditMode(bool: boolean): void;
};

type OwnProps = {
  innerRef: (element?: HTMLElement | null | undefined) => any;
  provided: DraggableProvided;
  isEditMode: boolean;
};

const NoteBlock: React.FC<NoteBlockProps> = props => {
  const noteBlockRef = React.useRef<HTMLElement>(null);

  /**
   * React.useRef is used here with the following effect to keep a mutable object reference
   * to the updated html prop. This is to allow access to the latest html prop within
   * the callback handlers below.
   *
   * (this is a hacky way of overcoming the stale closure problem with React hooks)
   */
  const html = React.useRef<string | null>(null);
  React.useEffect(() => {
    html.current = props.html;
  });

  const onChangeHandler = (e: ContentEditableEvent) => {
    // Additional checks for e.target.value as HTML tags are not cleared even when block is empty
    props.updatePage({
      id: props.id,
      html: e.target.value === '<br>' || e.target.value === '<div><br></div>' ? '' : e.target.value,
      tag: props.tag
    });
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
        const previousBlock = noteBlockRef.current?.previousElementSibling as HTMLElement;
        if (previousBlock) {
          setEol(previousBlock);
        }
        break;

      // Navigates to next block, if it exists
      case 'ArrowDown':
        e.preventDefault();
        const nextBlock = noteBlockRef.current?.nextElementSibling as HTMLElement;
        if (nextBlock) {
          setEol(nextBlock);
        }
        break;

      case 'b':
        if (e.metaKey) {
          e.preventDefault();
          toggleBold(noteBlockRef.current as HTMLElement);
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

  // TODO: Improve dragging experience
  // TODO: Improve edit mode toggle
  return (
    <ContentEditable
      className="block"
      innerRef={useMergedRef(noteBlockRef, props.innerRef)}
      html={props.html}
      tagName={props.tag}
      onChange={onChangeHandler}
      onKeyDown={onKeydownHandler}
      disabled={!props.isEditMode}
      {...props.provided.dragHandleProps} // react-beautiful-dnd props
      {...props.provided.draggableProps} // react-beautiful-dnd props
      onClick={() => props.setIsEditMode(true)}
    />
  );
};

export default NoteBlock;
