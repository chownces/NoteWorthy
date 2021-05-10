import React from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { setEol, toggleBold } from '../../utils/helpers';

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
  setIsEditMode(bool: boolean, callback?: (newState?: boolean) => void): void;
};

type OwnProps = {
  innerRef: (element?: HTMLElement | null | undefined) => any;
  provided: DraggableProvided;
  isEditMode: boolean;
};

const NoteBlock: React.FC<NoteBlockProps> = props => {
  const noteBlockRef = React.useRef<HTMLElement>(null);

  /**
   * TODO: Relook at what this is for under keydownHandlers backspace
   *
   * React.useRef is used here with the following effect to keep a mutable object reference
   * to the updated html prop. This is to allow access to the latest html prop within
   * the callback handlers below.
   *
   * (this is a hacky way of overcoming the stale closure problem with React hooks)
   */
  const html = React.useRef<string>('');
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

    // TODO: Apollo updates the store, which results in whole page rerender and caret jumping to the end...
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
        const previousBlock = noteBlockRef.current?.parentElement?.previousElementSibling
          ?.children[1] as HTMLElement;
        if (previousBlock) {
          setEol(previousBlock);
        }
        break;

      // Navigates to next block, if it exists
      case 'ArrowDown':
        e.preventDefault();
        const nextBlock = noteBlockRef.current?.parentElement?.nextElementSibling
          ?.children[1] as HTMLElement;
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
    <div
      className="noteblock"
      ref={props.innerRef}
      {...props.provided.dragHandleProps} // react-beautiful-dnd props
      {...props.provided.draggableProps} // react-beautiful-dnd props
    >
      <div className="noteblock-handle"></div>
      <ContentEditable
        className="noteblock-text"
        innerRef={noteBlockRef}
        html={props.html}
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
    </div>
  );
};

export default NoteBlock;
