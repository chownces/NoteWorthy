import React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';

import { setEol, toggleBold } from '../../utils/helpers';
import useMergedRef from '../../utils/useMergedRef';
import { NoteBlockStateProps } from './NoteBlock';

type NoteBlockContentEditableProps = {
  html: React.MutableRefObject<string>;
  tag: string;
  placeholder: string;
  disabled: boolean;
  className: string;

  id: string;
  updatePage(updatedBlock: NoteBlockStateProps): void;
  noteBlockRef: React.RefObject<HTMLElement>;
  addBlock(currentBlockId: string, ref: React.RefObject<HTMLElement>): void;
  deleteBlock(currentBlockId: string, ref: React.RefObject<HTMLElement>): void;
  setIsEditMode(bool: boolean, callback?: (newState?: boolean) => void): void;
  setContentEditablePlaceholder(placeholder: string): void;

  latestFocusedBlock?: React.RefObject<HTMLElement>;
  lastBlockRef?: React.RefObject<HTMLElement>;
};

const NoteBlockContentEditable: React.FC<NoteBlockContentEditableProps> = props => {
  const mergedRef = useMergedRef(props.noteBlockRef, props.lastBlockRef, props.latestFocusedBlock);

  const onChangeHandler = (e: ContentEditableEvent) => {
    // Additional checks for e.target.value as HTML tags are not cleared even when block is empty
    const value =
      e.target.value === '<br>' || e.target.value === '<div><br></div>' ? '' : e.target.value;

    props.updatePage({
      id: props.id,
      html: value,
      tag: props.tag
    });

    props.html.current = value;
  };

  const onKeydownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      // Adds a new block below the currently focused block when 'Enter' is pressed without 'Shift'
      case 'Enter':
        if (!e.shiftKey) {
          e.preventDefault();
          props.addBlock(props.id, props.noteBlockRef);
        }
        break;

      // Deletes currently focused block if 'Backspace' is pressed and block is empty
      case 'Backspace':
        if (!props.html.current) {
          e.preventDefault();
          props.deleteBlock(props.id, props.noteBlockRef);
        }
        break;

      // Navigates to previous block, if it exists
      case 'ArrowUp':
        e.preventDefault();
        const previousBlock = props.noteBlockRef.current?.parentElement?.parentElement
          ?.previousElementSibling?.children[0]?.children[1] as HTMLElement;
        if (previousBlock) {
          setEol(previousBlock);
        }
        break;

      // Navigates to next block, if it exists
      case 'ArrowDown':
        e.preventDefault();
        const nextBlock = props.noteBlockRef.current?.parentElement?.parentElement
          ?.nextElementSibling?.children[0]?.children[1] as HTMLElement;
        if (nextBlock) {
          setEol(nextBlock);
        }
        break;

      case 'b':
        if (e.metaKey) {
          e.preventDefault();
          toggleBold(props.noteBlockRef.current as HTMLElement); // TODO: Handle untoggling also!
        }
        break;

      // TODO: Add a better key handler, since this only triggers when a block is in focus
      case 'Escape':
        props.setIsEditMode(false);
        props.noteBlockRef.current?.blur();
        break;

      // TODO: Handle case where user presses arrow up to navigate within a content block itself
    }
  };

  const onFocusHandler = () => {
    if (props.html.current === '') {
      props.setContentEditablePlaceholder('Type something');
    }
  };

  const onBlurHandler = () => {
    props.setContentEditablePlaceholder('');
  };

  const onClickHandler = () => {
    props.setIsEditMode(true, () => {
      props.noteBlockRef.current?.focus();
      // TODO: This eol line is causing issues when using the mouse to position the cursor
      // setEol(noteBlockRef.current);
    });
  };

  return (
    <ContentEditable
      id={props.id}
      className={props.className}
      innerRef={mergedRef}
      html={props.html.current}
      tagName={props.tag}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      placeholder={props.placeholder}
      onChange={onChangeHandler}
      onKeyDown={onKeydownHandler}
      disabled={props.disabled}
      onClick={onClickHandler}
    />
  );
};

export default NoteBlockContentEditable;
